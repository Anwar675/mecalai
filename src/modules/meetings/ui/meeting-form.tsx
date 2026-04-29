"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { meetingInsertSchema } from "../server/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MeetingGetOne } from "../server/type";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CommandSelect } from "./command-select";

import { GeneratedAvatar } from "@/components/generate-avata";

import { NewAgentDialog } from "@/modules/agents/ui/new-agent";
import { useRouter } from "next/navigation";

interface MeetingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const router = useRouter()
  const queryClient = useQueryClient();
  const { data: agentsData } = useQuery(
    trpc.agents.getMany.queryOptions({
      page: 1,
      pageSize: 100,
    }),
  );
  const [agentSearch, setAgentSearch] = useState("");
  const [open, setOpen] = useState(false);
  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());


        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
        if(error.data?.code === "FORBIDDEN") {
          router.push("/upgrade")
        }
      },
    }),
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const isEditing = !!initialValues?.id;

  const form = useForm<z.infer<typeof meetingInsertSchema>>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (data: z.infer<typeof meetingInsertSchema>) => {
    if (isEditing && initialValues?.id) {
      updateMeeting.mutate({
        id: initialValues.id,
        ...data,
      });
    } else {
      createMeeting.mutate(data);
    }
  };

  return (
    <>
      <NewAgentDialog open={open} onOpenChange={setOpen} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  {...field}
                  placeholder="e.g. Weekly standup"
                  className={cn(fieldState.invalid && "border-red-500")}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="agentId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Agent</FieldLabel>
                <CommandSelect
                  options={(agentsData?.items ?? []).map((agent) => ({
                    id: agent.id,
                    value: agent.id,
                    children: (
                      <div className="flex items-center gap-x-2">
                        <GeneratedAvatar
                          seed={agent.name}
                          variant="botttsNeutral"
                          className="border size-6"
                        />
                        <span>{agent.name}</span>
                      </div>
                    ),
                  }))}
                  onSelect={field.onChange}
                  onSearch={setAgentSearch}
                  value={field.value}
                  placeholder="Select an agent"
                />
                <FieldDescription>
                  Not found what you&apos;re looking for?{" "}
                  <button
                    type="button"
                    className="text-custom cursor-pointer hover:underline"
                    onClick={() => setOpen(true)}
                  >
                    Create new agent
                  </button>
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex justify-between gap-4">
          {onCancel && (
            <Button
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
              className="py-2 px-3 border-none rounded-md"
            >
              Cancel
            </Button>
          )}
          <Button
            disabled={isPending}
            variant="custom"
            className="py-2 rounded-md"
            type="submit"
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </>
  );
};
