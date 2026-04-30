import { useTRPC } from "@/trpc/client";
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CallUI } from "./call-ui";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: Props) => {
  const trpc = useTRPC();
  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions(),
  );
  const tokenProvider = useCallback(() => generateToken(), [generateToken]);

  const [client, setClient] = useState<StreamVideoClient>();
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
    if (!apiKey) return;

    const _client = new StreamVideoClient({
      apiKey,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider,
    });
    setClient(_client);
    return () => {
      void _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userName, userImage, tokenProvider]);

  const [call, setCall] = useState<Call>();
  useEffect(() => {
    if (!client) return;
    const _call = client.call("default", meetingId);
    void Promise.allSettled([_call.camera.disable(), _call.microphone.disable()]);
    setCall(_call);

    return () => {
      setCall(undefined);
      if (_call.state.callingState !== CallingState.LEFT) void _call.leave();
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <Loader2Icon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
};
