"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-cofirm";
import { useState } from "react";
import { UpdateMeetingDialog } from "./update-meeting";
import { MeetingIdViewHeader } from "./meeting-id-view-header";

interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        router.push("/dashboard/meetings");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const [updateOpen, setUpdateOpen] = useState(false);
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    "This meeting will be permanently deleted.",
  );
  const handleRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeMeeting.mutateAsync({ id: meetingId });
  };
  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        initialValues={data}
      />
      <div className="flex-1 px-4 py-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateOpen(true)}
          onRemove={handleRemove}
        />
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
            <div className="flex items-center gap-x-3">
              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-x-2 capitalize [&>svg]:size-4"
              >
                {data.status}
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-x-2 [&>svg]:size-4"
              >
                <VideoIcon className="text-blue-700" />
                Meeting
              </Badge>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-medium text-muted-foreground">Agent</p>
              <p className="text-base">{data.agentName}</p>
            </div>
            {data.summary ? (
              <div className="flex flex-col gap-y-4">
                <p className="text-lg font-bold">Summary</p>
                <p>{data.summary}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a moment..."
    />
  );
};

export const MeetingIdViewError = () => {
  return <ErrorState title="Error" description="Failed to load meeting." />;
};
