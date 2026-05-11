import { db } from "@/db";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { agents, meetings, user } from "@/db/schema";
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

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const TTS_API_URL = process.env.VIENEU_TTS_URL ?? "http://localhost:8000/tts";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return (
    streamVideo.verifyWebhook(body, signature) ||
    streamChat.verifyWebhook(body, signature)
  );
}

function getAgentAvatarUrl(agentName: string) {
  return GeneratedAvatarUrl({
    seed: agentName,
    variant: "botttsNeutral",
  });
}

async function createTtsAudio(text: string, voiceId?: string | null) {
  if (!voiceId) return null;

  try {
    const response = await fetch(TTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice_id: voiceId,
        speed: 0.95,
      }),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      console.error("TTS server returned an error", await response.text());
      return null;
    }

    if (!contentType?.includes("audio/")) {
      console.error("TTS server did not return audio", await response.text());
      return null;
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    return audioBuffer.byteLength > 0 ? audioBuffer : null;
  } catch (error) {
    console.error("TTS request failed", error);
    return null;
  }
}

async function createTtsAttachment(
  channel: ReturnType<typeof streamChat.channel>,
  text: string,
  agentId: string,
  voiceId?: string | null,
) {
  const audioBuffer = await createTtsAudio(text, voiceId);

  if (!audioBuffer) return null;

  const upload = await channel.sendFile(audioBuffer, "voice.wav", "audio/wav", {
    id: agentId,
  });

  return {
    type: "audio",
    mime_type: "audio/wav",
    asset_url: upload.file,
    title: "voice.wav",
  };
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
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

    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, existingMeeting.userId));

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const call = streamVideo.video.call("default", meetingId);

    const avatarUrl = getAgentAvatarUrl(existingAgent.name);

    await streamChat.upsertUsers([
      {
        id: existingUser.id,
        name: existingUser.name,
        image:
          existingUser.image ??
          GeneratedAvatarUrl({ seed: existingUser.name, variant: "initials" }),
      },
      {
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarUrl,
      },
    ]);

    await call.getOrCreate({
      data: {
        created_by_id: existingAgent.id,
        members: [
          {
            user_id: existingAgent.id,
            role: "call_member",
          },
          { user_id: existingUser.id, role: "call_member" },
        ],
      },
    });

    await streamVideo.upsertUsers([
      {
        id: existingAgent.id,
        name: existingAgent.name,
        role: "user",
        image: avatarUrl,
      },
    ]);

    const audioChannel = streamChat.channel("messaging", meetingId, {
      created_by_id: existingUser.id,
      members: [existingUser.id, existingAgent.id],
    });

    await audioChannel.watch();

    const turnDetection = {
      type: "server_vad" as const,
      create_response: false,
    };
    const liveMessages: ChatCompletionMessageParam[] = [];
    const handledTranscriptIds = new Set<string>();

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
      model: "gpt-4o-realtime-preview",
    });

    await realtimeClient.updateSession({
      modalities: ["text"],
      instructions:
        "Chỉ phiên âm lời người dùng. Không tự tạo câu trả lời và không phát giọng OpenAI.",
      input_audio_transcription: {
        model: "whisper-1",
      },
      turn_detection: turnDetection,
    });

    realtimeClient.on(
      "conversation.updated",
      async ({
        item,
      }: {
        item?: {
          id: string;
          role?: string;
          formatted?: { transcript?: string };
        };
      }) => {
        if (
          !item ||
          item.role !== "user" ||
          handledTranscriptIds.has(item.id)
        ) {
          return;
        }

        const formatted = item.formatted;
        const transcript = formatted?.transcript?.trim();

        if (!transcript) return;

        handledTranscriptIds.add(item.id);

        const completion = await openAiClient.chat.completions.create({
          messages: [
            { role: "system", content: existingAgent.instructions },
            ...liveMessages.slice(-8),
            { role: "user", content: transcript },
          ],
          model: "gpt-4o",
        });

        const responseText = completion.choices[0].message.content?.trim();

        if (!responseText) return;

        liveMessages.push(
          { role: "user", content: transcript },
          { role: "assistant", content: responseText },
        );

        const attachment = await createTtsAttachment(
          audioChannel,
          responseText,
          existingAgent.id,
          existingAgent.voiceId,
        );
        if (!attachment) return;

        await call.sendCallEvent({
          user_id: existingAgent.id,
          custom: {
            type: "vieneu.audio",
            text: responseText,
            asset_url: attachment.asset_url,
            mime_type: attachment.mime_type,
            title: attachment.title,
          },
        });
      },
    );
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, meetingId));

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (event.participant.user.id === existingMeeting.agentId) {
      return NextResponse.json({ status: "ok" });
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
      const avatarUrl = getAgentAvatarUrl(existingAgent.name);

      await streamChat.upsertUser({
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarUrl,
      });

      const attachment = await createTtsAttachment(
        channel,
        GPTResponseText,
        existingAgent.id,
        existingAgent.voiceId,
      );
      const attachments = [];

      if (attachment) attachments.push(attachment);

      await channel.sendMessage({
        text: GPTResponseText,
        attachments,
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
