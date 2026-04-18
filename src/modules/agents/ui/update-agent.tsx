import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../server/type";

interface UpdateAgentPageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intitalValues: AgentGetOne;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  intitalValues,
}: UpdateAgentPageProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Agent"
      description="Edit the agent detail"
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        initialValues={intitalValues}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
