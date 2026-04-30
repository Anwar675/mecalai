import { CallingState, StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";
import { useTRPC } from "@/trpc/client";

interface Props {
  meetingName: string;
}

export const CallUI = ({ meetingName }: Props) => {
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const trpc = useTRPC();
  const call = useCall();

  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

  const handleJoin = async () => {
    if (!call || joining) return;

    try {
      setJoining(true);
      await call.join();
      setShow("call");
    } catch (error) {
      console.error("Failed to join call", error);
      setShow("lobby");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!call || leaving) return;

    try {
      setLeaving(true);
      if (call.state.callingState !== CallingState.LEFT) await call.leave();
      setShow("ended");
    } catch (error) {
      console.error("Failed to leave call", error);
      setShow("ended");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && (
        <CallLobby onJoin={handleJoin} isJoining={joining} />
      )}
      {show === "call" && (
        <CallActive onLeave={handleLeave} meetingName={meetingName} />
      )}
      {show === "ended" && call && <CallEnded meetingId={call.id} />}
    </StreamTheme>
  );
};
