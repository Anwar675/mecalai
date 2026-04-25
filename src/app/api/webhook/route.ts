import { db } from "@/db";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { agents, meetings } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { streamVideo } from "@/lib/stream-video";
import {
  MessageNewEvent,
  CallEndedEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
} from "@stream-io/node-sdk";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { streamChat } from "@/lib/stream-chat";
import { GeneratedAvatarUrl } from "@/lib/avatar";

const openAiClient = new OpenAI({ apiKey: process.env.OPEN_API_KEY! });

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or API Key" },
      { status: 400 },
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing")),
        ),
      );

    if (!existingMeeting) {
      return NextResponse.json(
        { error: "Meeting not found or already active/completed" },
        { status: 404 },
      );
    }

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, existingMeeting.id));
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));
    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    const call = streamVideo.video.call("default", meetingId);
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
    });

    await realtimeClient.updateSession({
      model: "gpt-4.1",
      modalities: ["text"],
      instructions: existingAgent.instructions,
      turn_detection: {
        type: "server_vad",
      },
    });
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json({ error: "Join Meeting" }, { status: 404 });
    }
    await db
      .update(meetings)
      .set({
        status: "processing",
        endedAt: new Date(),
      })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    const [updateMeeting] = await db
      .update(meetings)
      .set({
        transcriptUrl: event.call_transcription.url,
      })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updateMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await inngest.send({
      name: "meetings/processing",
      data: {
        meetingId: updateMeeting.id,
        transcriptUrl: updateMeeting.transcriptUrl,
      },
    });
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];
    await db
      .update(meetings)
      .set({
        recordingUrl: event.call_recording.url,
      })
      .where(eq(meetings.id, meetingId));
  } else if (eventType === "message.new") {
    const event = payload as MessageNewEvent;

    const userId = event.user?.id;
    const channelId = event.channel_id;
    const messageText = event.message?.text;

    if (!userId || !channelId || !messageText) {
      return NextResponse.json(
        { error: "Missing message data" },
        { status: 400 },
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    if (userId !== existingAgent.id) {
      const instructions = `
      Bạn là trợ lý AI giúp người dùng xem lại cuộc họp vừa kết thúc.
      Dưới đây là bản tóm tắt cuộc họp, được tạo từ bản ghi chép:
      
      ${existingMeeting.summary}
      
     Sau đây là hướng dẫn ban đầu của bạn từ trợ lý cuộc họp trực tuyến. Vui lòng tiếp tục tuân thủ các hướng dẫn về hành vi này khi hỗ trợ người dùng:
      
      ${existingAgent.instructions}
      
      Người dùng có thể đặt câu hỏi về cuộc họp, yêu cầu làm rõ hoặc yêu cầu các hành động tiếp theo.
      Luôn dựa trên bản tóm tắt cuộc họp ở trên để trả lời.
      Bạn cũng có quyền truy cập vào lịch sử cuộc trò chuyện gần đây giữa bạn và người dùng. Hãy sử dụng ngữ cảnh của các tin nhắn trước đó để cung cấp các câu trả lời phù hợp, mạch lạc và hữu ích. Nếu câu hỏi của người dùng đề cập đến điều gì đó đã được thảo luận trước đó, hãy đảm bảo xem xét điều đó và duy trì sự liên tục trong cuộc trò chuyện.
      Nếu bản tóm tắt không chứa đủ thông tin để trả lời câu hỏi, hãy lịch sự cho người dùng biết .
      Hãy trả lời ngắn gọn không nói quá dài dòng trả lời như 2 người bạn thân, hữu ích và tập trung vào việc cung cấp thông tin chính xác từ cuộc họp và cuộc trò chuyện đang diễn ra.
      `;
      const channel = streamChat.channel("messaging", channelId);
      await channel.watch();
      const previousMessages = channel.state.messages
        .slice(-5)
        .filter((msg) => msg.text && msg.text.trim() !== "")
        .map<ChatCompletionMessageParam>((message) => ({
          role: message.user?.id === existingAgent.id ? "assistant" : "user",
          content: message.text || "",
        }));

      const GPTResponse = await openAiClient.chat.completions.create({
        messages: [
          { role: "system", content: instructions },
          ...previousMessages,
          { role: "user", content: messageText },
        ],
        model: "gpt-4o",
      });
      const GPTResponseText = GPTResponse.choices[0].message.content;
      if (!GPTResponseText) {
        return NextResponse.json({ error: "No response from Chat GPT" });
      }
      const avatarUrl = GeneratedAvatarUrl({
        seed: existingAgent.name,
        variant: "botttsNeutral",
      });

      streamChat.upsertUser({
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarUrl,
      });

      channel.sendMessage({
        text: GPTResponseText,
        user: {
          id: existingAgent.id,
          name: existingAgent.name,
          image: avatarUrl,
        },
      });
    }
  }

  return NextResponse.json({ status: "ok" });
}
