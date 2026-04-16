"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetOne } from "../server/type";
import { GeneratedAvatar } from "@/components/generate-avata";
import { CornerDownRight, VideoIcon} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <GeneratedAvatar variant="botttsNeutral" seed={row.original.name} />
          <span className="font-bold capitalize">{row.original.name}</span>
        </div>
        <div className="px-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRight className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{row.original.instructions}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: "Meeting",
    cell: ({ row}) => (
      <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
        <VideoIcon className="text-blue-700 size-3" />
        5 {row.original.meetingsCount === 1 ? "meeting" : "meetings"}
      </Badge>
    )
  },
  
];
