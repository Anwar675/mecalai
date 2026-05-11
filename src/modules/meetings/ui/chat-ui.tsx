import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
  Channel as StreamChannel,
  Event as StreamChatEvent,
} from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  MessageList,
  MessageComposer,
  Thread,
  Window,
} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";

interface ChatUIProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string | undefined;
}

export const ChatUI = ({
  meetingId,
  userId,
  userName,
  userImage,
}: ChatUIProps) => {
  const trpc = useTRPC();

  const { mutateAsync: generateChatToken } = useMutation(
    trpc.meetings.generateChatToken.mutationOptions(),
  );

  const [channel, setChannel] = useState<StreamChannel>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tokenProvider = useCallback(
    () => generateChatToken({ meetingId }),
    [generateChatToken, meetingId],
  );
  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    tokenOrProvider: tokenProvider,
    userData: {
      id: userId,
      name: userName,
      image: userImage,
    },
  });

  useEffect(() => {
    if (!client) return;

    const init = async () => {
      const ch = client.channel("messaging", meetingId);

      await ch.watch();

      setChannel(ch);
    };

    init();
  }, [client, meetingId, userId]);
  useEffect(() => {
    if (!channel) return;

    const handleMessage = async (event: StreamChatEvent) => {
      const message = event.message;
      if (!message || message.user?.id === userId) return;

      const attachment = message.attachments?.find(
        (attachment) => attachment.type === "audio" && attachment.asset_url,
      );

      if (attachment?.asset_url) {
        try {
          if (audioRef.current) {
            audioRef.current.pause();
          }

          const audio = new Audio(attachment.asset_url);

          audioRef.current = audio;

          await audio.play();
        } catch (err) {
          console.error("Audio play failed", err);
        }
      }
    };

    channel.on("message.new", handleMessage);

    return () => {
      channel.off("message.new", handleMessage);
      audioRef.current?.pause();
    };
  }, [channel, userId]);
  if (!client) {
    return (
      <LoadingState
        title="Loading Chat"
        description="This may take a few seconds"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <div className="flex-1 overflow-y-auto min-h-100 max-h-130 border-b">
              <MessageList />
            </div>
            <MessageComposer />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
