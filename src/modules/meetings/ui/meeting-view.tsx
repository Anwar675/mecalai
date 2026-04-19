"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/modules/agents/ui/data-table";
import { columns } from "./columns";
import { EmptyState } from "@/components/empty-state";
import { useMeetingsFilters } from "../hooks/use-meetings-filter";
import { DataPagination } from "@/modules/agents/ui/data-pagination";
import { useRouter } from "next/navigation";

export const MeetingsView = () => {
  const [filters, setFilter] = useMeetingsFilters();
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    }),
  );
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        onRowClick={(row) => router.push(`/dashboard/meetings/${row.id}`)}
        columns={columns}
        data={data.items}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilter({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="No meetings found"
          description="Create your first meeting and assign an agent to run the session."
        />
      )}
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a moment..."
    />
  );
};

export const MeetingsViewError = () => {
  return <ErrorState title="Error" description="Failed to load Meetings." />;
};
