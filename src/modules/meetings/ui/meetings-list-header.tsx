"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

import { useState } from "react";
import { NewMeetingDialog } from "./new-meeting";
import { MeetingSearchFilter } from "./meeting-search-filter";

export const MeetingsListHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NewMeetingDialog open={open} onOpenChange={setOpen} />
      <div className="flex md:px-6 px-4 py-4 items-center justify-between">
        <h2 className="text-2xl font-bold">My Meetings</h2>
        <Button
          variant="custom"
          className="py-2 px-4 rounded-md"
          onClick={() => setOpen(true)}
        >
          <PlusIcon />
          New Meeting
        </Button>
      </div>
      <div className="flex items-center gap-x-2 py-4">
        <MeetingSearchFilter />
      </div>
    </>
  );
};
