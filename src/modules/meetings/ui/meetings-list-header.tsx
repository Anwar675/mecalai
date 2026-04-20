"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircle } from "lucide-react";

import { useState } from "react";
import { NewMeetingDialog } from "./new-meeting";
import { MeetingSearchFilter } from "./meeting-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-status";
import { useMeetingsFilters } from "../hooks/use-meetings-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/lib/constanst";

export const MeetingsListHeader = () => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useMeetingsFilters();
  const isAnyFilterActive =
    !!filter.search || !!filter.agentId || !!filter.status;
  const onClearFilter = () => {
    setFilter({
      search: "",
      agentId: "",
      status: null,
      page: DEFAULT_PAGE,
    });
  };

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
      <ScrollArea className="w-full overflow-hidden">
        <div className="flex md:px-8 px-4 items-center  gap-x-2 py-4">
          <MeetingSearchFilter />
          <StatusFilter />
          <AgentIdFilter />
          {isAnyFilterActive && (
            <Button onClick={onClearFilter} className="border-none">
              <XCircle className=" text-muted-foreground" />
            </Button>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};
