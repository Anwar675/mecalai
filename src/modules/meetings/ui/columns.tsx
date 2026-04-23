"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MeetingListItem } from "../server/type";
import { Badge } from "@/components/ui/badge";
import {
  BotIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,

} from "lucide-react";
import { format } from "date-fns";
import { GeneratedAvatar } from "@/components/generate-avata";
import { cn, formatDuration } from "@/lib/utils";



const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  processing: "bg-gray-500/20 text-gray-800 border-gray-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
};

export const columns: ColumnDef<MeetingListItem>[] = [
  {
    accessorKey: "name",
    header: "Meeting",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-2">
        <span className="font-bold capitalize">{row.original.name}</span>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-50 truncate capitalize">
              {row.original.agentName.name}
            </span>
          </div>
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.agentName.name}
            className="size-4"
          />
          <span>
            {row.original.startedAt
              ? format(row.original.startedAt, "MM d")
              : ""}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon =
        statusIconMap[row.original.status as keyof typeof statusIconMap];
      return (
        <Badge
          className={cn(
            "capitalize [&>svg]:size-4 text-muted-foreground",
            statusColorMap[row.original.status as keyof typeof statusColorMap],
          )}
          variant="outline"
        >
          <Icon className={cn(row.original.status === "processing" && "animate-spin")} />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration" ,
    header: "duration",
    cell: ({row}) => (
      <Badge
        variant="outline"
        className="flex capitalize items-center gap-x-2 [&>svg]:size-4"
      >
       <ClockFadingIcon className="text-blue-500" />
       {row.original.duration != null ? formatDuration(row.original.duration) : "No duration"}
      </Badge>
    ),
  },
];
