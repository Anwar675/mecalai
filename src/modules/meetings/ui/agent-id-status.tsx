import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../hooks/use-meetings-filter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommandSelect } from "./command-select";
import { GeneratedAvatar } from "@/components/generate-avata";

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const trpc = useTRPC();
  const [agentSearch, setAgentSearch] = useState("");
  
  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );
  return (
    <CommandSelect
      className="bg-white rounded-sm h-9 "
      placeholder="Agent"
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-3 ">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={agent.name}
              className="size-6"
            />
            <h2 className="text-md font-medium">{agent.name}</h2>
          </div>
        ),
      }))}
      onSelect={(value) => setFilters({agentId: value})}
      onSearch={setAgentSearch}
      value={filters.agentId  ?? ""}
    />
  )
};
