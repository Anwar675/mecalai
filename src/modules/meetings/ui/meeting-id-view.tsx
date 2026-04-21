"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-cofirm";
import { useState } from "react";
import { UpdateMeetingDialog } from "./update-meeting";
import { MeetingIdViewHeader } from "./meeting-id-view-header";
import { UpcomingState } from "@/modules/meetings/ui/upcoming-state";
import { ActiveState } from "./active-state";
import { CancelState } from "./cancel-state";
import { ProcessingState } from "./processing-state";

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

  const isActive = data.status === "active";
  const isUpcoming = data.status === "upcoming";
  const isCompleted = data.status === "completed";
  const isProcessing = data.status === "processing";
  const isCacelled = data.status === "cancelled";
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
        {isCacelled && <CancelState />}
        {isCompleted && <div>Completed</div>}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isProcessing && <ProcessingState />}
        {isUpcoming && (
          <UpcomingState
            meetingId={meetingId}
            onCancelMeeting={() => {}}
            isCancelling={false}
          />
        )}
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
