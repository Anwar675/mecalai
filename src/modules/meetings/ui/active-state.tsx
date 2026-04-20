import {  VideoIcon } from "lucide-react";
import { EmptyState } from "../../../components/empty-state";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

interface Props {
  meetingId: string;

}

export const ActiveState = ({
  meetingId,
  
}: Props) => {
  return (
    <div className="bg-[#D8E3EB] border-4 border-white rounded-lg px-4 py-5  flex flex-col gap-y-8 justify-center items-center">
      <EmptyState
        image="/upcoming.svg"
        title="Meeting is active"
        description="Meeting will end once all paticipants have left"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        
        <Button variant="custom" >
          <Link
            href={`/call/${meetingId}`}
            className="flex  font-bold gap-2 items-center py-2"
          >
            <VideoIcon />
            <p>Join meeting</p>
          </Link>
        </Button>
      </div>
    </div>
  );
};
