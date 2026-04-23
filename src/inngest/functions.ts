import JSONL from "jsonl-parse-stringify";
import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/server/type";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

const summarize = createAgent({
  name: "summarize",
  system: `
  Bạn là một chuyên gia tóm tắt. Bạn viết nội dung dễ đọc, ngắn gọn và đơn giản. Bạn được cung cấp bản ghi chép một cuộc họp và bạn cần tóm tắt nó.

Hãy sử dụng cấu trúc Markdown sau cho mọi kết quả đầu ra:

### Tổng quan
Cung cấp bản tóm tắt chi tiết, hấp dẫn về nội dung của phiên họp. Tập trung vào các tính năng chính, quy trình làm việc của người dùng và bất kỳ điểm chính nào cần ghi nhớ. Viết theo phong cách tường thuật, sử dụng câu đầy đủ. Làm nổi bật các khía cạnh độc đáo hoặc mạnh mẽ của sản phẩm, nền tảng hoặc cuộc thảo luận.

### Ghi chú
Chia nhỏ nội dung chính thành các phần theo chủ đề với phạm vi mốc thời gian. Mỗi phần nên tóm tắt các điểm chính, hành động hoặc bản demo dưới dạng gạch đầu dòng.

Ví dụ:

#### Tên phần
- Điểm chính hoặc bản demo được trình bày ở đây
- Một thông tin chi tiết hoặc tương tác quan trọng khác
- Công cụ hoặc giải thích tiếp theo được cung cấp

#### Phần tiếp theo
- Tính năng X tự động thực hiện Y
- Đề cập đến sự tích hợp với Z

    `.trim(),
  model: openai({ model: "gpt-4.1-mini", apiKey: process.env.OPENAI_API_KEY }),
});

export const meetingProcessing = inngest.createFunction(
  { id: "meetings/processing", triggers: { event: "meetings/processing" } },
  async ({ event, step }) => {
    const response = await step.run("fetch transcript", async () => {
      return await fetch(event.data.transcriptUrl).then((res) => res.text());
    });
    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });
    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];
      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
          })),
        );
      const AgentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          })),
        );

      const speakers = [...userSpeakers, ...AgentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id,
        );
        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });
    const { output } = await summarize.run(
      "Sumarize the following transcript:" +
        JSON.stringify(transcriptWithSpeakers),
    );

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId));
    });
  },
);
