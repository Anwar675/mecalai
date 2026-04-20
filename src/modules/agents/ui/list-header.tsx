"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent";
import { useState } from "react";
import { useAgentsFilters } from "../hooks/use-agent-filter";
import { AgentSearchFilter } from "./agent-search-filter";


export const AgentListHeader = () => {

  const [open, setOpen] = useState(false);
 
  return (
    <>
      <NewAgentDialog open={open} onOpenChange={setOpen} />
      <div className="flex md:px-6 px-4 py-4 items-center justify-between">
        <h2 className="text-2xl font-bold">My Agents</h2>
        <Button
          variant="custom"
          className="py-2 px-4 rounded-md"
          onClick={() => setOpen(true)}
        >
          <PlusIcon />
          New Agent
        </Button>
      </div>
      <div className="flex md:px-8 px-4 items-center gap-x-2 py-4">
        <AgentSearchFilter />
        
      </div>
    </>
  );
};
