"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AgentsIdViewHeader } from "./agent-id-view-header";
import { GeneratedAvatar } from "@/components/generate-avata";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-cofirm";
import { useState } from "react";
import { UpdateAgentDialog } from "./update-agent";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        router.push("/dashboard/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const [updateAgenDialog, setUpdateAgentDialog]= useState(false)
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will be remove ${data.meetingsCount} associalted mettings`,
  );
  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeAgent.mutateAsync({ id: agentId });
  };
  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog open={updateAgenDialog} onOpenChange={setUpdateAgentDialog} intitalValues={data} />
      <div className="flex-1 px-4 py-4 md:px-8 flex flex-col gap-y-4">
        <AgentsIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialog(true) }
          onRemove={handleRemoveAgent}
        />
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
            <div className="flex items-center gap-x-3 ">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-10"
              />
              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&>svg]:size-4"
            >
              <VideoIcon className="text-blue-700" />
              {data.meetingsCount}{" "}
              {data.meetingsCount === 1 ? "meeting" : "meetings"}
            </Badge>
            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-bold">Instructions</p>
              <p>{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export const AgentsIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a moment..."
    />
  );
};

export const AgentsIdViewError = () => {
  return <ErrorState title="Error" description="Failed to load agents." />;
};
