import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { DashboardComment } from "./dashboard-comment";
import { GeneratedAvatar } from "@/components/generate-avata";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardSeach = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const trpc = useTRPC();
  const meetings = useQuery(
    trpc.meetings.getMany.queryOptions({
      search,
      pageSize: 100,
    }),
  );
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      search,
      pageSize: 100,
    }),
  );
  return (
    <DashboardComment open={open} setOpen={setOpen}>
      <CommandInput
        placeholder="Search..."
        value={search}
        onValueChange={(value) => setSearch(value)}
      />
      <CommandList className="py-4">
        <CommandGroup heading="Meetings">
          <CommandEmpty>
            <span>No Meetings found</span>
          </CommandEmpty>
          {meetings.data?.items.map((meeting) => (
            <CommandItem
              className="py-2"
              key={meeting.id}
              onSelect={() => {
                router.push(`/dashboard/meetings/${meeting.id}`);
                setOpen(false);
              }}
            >
              {meeting.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Agents">
          <CommandEmpty>
            <span>No Agents found</span>
          </CommandEmpty>
          {agents.data?.items.map((agent) => (
            <CommandItem
              className="py-2"
              key={agent.id}
              onSelect={() => {
                router.push(`/dashboard/agents/${agent.id}`);
                setOpen(false);
              }}
            >
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={agent.name}
                className="size-6"
              />
              {agent.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </DashboardComment>
  );
};
