import { BanIcon, VideoIcon } from "lucide-react";
import { EmptyState } from "../../../components/empty-state";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

interface Props {
  meetingId: string;
  onCancelMeeting: () => void;
  isCancelling: boolean;
}

export const UpcomingState = ({
  meetingId,
  onCancelMeeting,
  isCancelling,
}: Props) => {
  return (
    <div className="bg-[#D8E3EB] border-4 border-white rounded-lg px-4 py-5  flex flex-col gap-y-8 justify-center items-center">
      <EmptyState
        image="/upcoming.svg"
        title="Not started yet"
        description="Once you start this meeting, a summary will appear here"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button
          className=" bg-white hover:bg-gray-200 gap-2 px-4"
          onClick={onCancelMeeting}
          disabled={isCancelling}
        >
          <BanIcon />
          Cancel meeting
        </Button>
        <Button variant="custom" disabled={isCancelling}>
          <Link
            href={`/call/${meetingId}`}
            className="flex  font-bold gap-2 items-center py-2"
          >
            <VideoIcon />
            <p>Starting meeting</p>
          </Link>
        </Button>
      </div>
    </div>
  );
};
