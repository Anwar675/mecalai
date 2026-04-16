"use client"
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent";
import { useState } from "react";

export const AgentListHeader = () => {
    const [open, setOpen] = useState(false)
  return (
    <>
        <NewAgentDialog open={open} onOpenChange={setOpen} />
      <div className="flex md:px-6 px-4 py-4 items-center justify-between">
        <h2 className="text-2xl font-bold">My Agents</h2>
        <Button variant="custom" className="py-2 px-4 rounded-md" onClick={() => setOpen(true)}>
          <PlusIcon />
          New Agent
        </Button>
      </div>
    </>
  );
};
