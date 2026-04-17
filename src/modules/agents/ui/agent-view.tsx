"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../hooks/use-agent-filter";
import { DataPagination } from "./data-pagination";
import { useRouter } from "next/navigation";

export const AgentsView = () => {
  const [filters,setFilter] = useAgentsFilters()
  const router = useRouter()
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
    ...filters,
    
  }));
  console.log(data.items)
  return (
    <div className="flex-1 pb-4 px-4  md:px-8 flex flex-col gap-y-4">
      <DataTable onRowClick={(row) => router.push(`/dashboard/agents/${row.id}`)} columns={columns} data={data.items} />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilter({page})}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="No agents found"
          description="Create your first agent to get started. Each agent will follow your instructions and can interact with participants during the call "
        />
      )}
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a moment..."
    />
  );
};

export const AgentsViewError = () => {
  return <ErrorState title="Error" description="Failed to load agents." />;
};
