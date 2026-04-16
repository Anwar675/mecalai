import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface NewAgentPageProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NewAgentDialog = ({ open, onOpenChange }: NewAgentPageProps) => {
    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange} title="Create Agent" description="Create a new agent"> 
           <AgentForm onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
        </ResponsiveDialog>
    )
}