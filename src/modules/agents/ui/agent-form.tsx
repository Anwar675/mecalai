import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../server/type";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { agentsInsertSchema } from "../server/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GeneratedAvatar } from "@/components/generate-avata";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  // const router = useRouter();
  const queryClient = useQueryClient();
  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        if(initialValues?.id) {
          await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({id : initialValues.id}));
        }
        onSuccess?.();
      },

      onError: (error) => {
        toast.error(error.message)  
      },
    }),
  );
  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name || "",
      instructions: initialValues?.instructions || "",
    },
  });
  const isEdditing = !!initialValues?.id;
  const isPending = createAgent.isPending;
  const onSubmit = (data: z.infer<typeof agentsInsertSchema>) => {
    if (isEdditing) {
      console.log("Editing is not implemented yet");
    } else {
      createAgent.mutate(data);
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <GeneratedAvatar
        seed={form.watch("name")}
        variant="botttsNeutral"
        className="rounded size-10"
      />
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field,fieldState }) => (
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...field} placeholder="e.g. Math tutor"  className={fieldState.invalid ? "border-red-500" : ""}/>
              {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
            </Field>
          )}
        />
        <Controller
          name="instructions"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Instructions</FieldLabel>
              <Textarea
                {...field}
                placeholder="You are a helpful assistant that can answer questions"
                className={fieldState.invalid ? "border-red-500" : ""}
              />
              {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                )}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-between gap-4">
        {onCancel && (
            <Button disabled={isPending} type="button" onClick={() => onCancel()} className="py-2 px-3 border-none rounded-md">
                Cancel 
            </Button>
        )}
        <Button disabled={isPending}  variant="custom" className="py-2 rounded-md" type="submit">
            {isEdditing ? "Save changes" : "Create"}
        </Button>
      </div>
    </form>
  );
};
