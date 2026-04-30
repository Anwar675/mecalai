"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRight, PanelRightClose, SearchIcon } from "lucide-react";

import { Key, useEffect, useState } from "react";
import { DashboardSeach } from "./dashboard-search";

export const DashbarNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commentOpen, setCommentOpen] = useState(false);
  useEffect(() => {
    const down = (e:KeyboardEvent) => {
        if(e.key === "k" && (e.metaKey || e.ctrlKey)){
            e.preventDefault();
            setCommentOpen((open) => !open)
        }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  },[])

  return (
    <>
      <DashboardSeach open={commentOpen} setOpen={setCommentOpen} />
          
      
      <nav className="flex gap-6 bg-white items-center border-b p-4">
        <Button onClick={toggleSidebar} className="p-2 rounded-md">
          {state === "collapsed" || isMobile ? (
            <PanelRight />
          ) : (
            <PanelRightClose />
          )}
        </Button>
        <Button
          onClick={() => setCommentOpen((open) => !open)}
          className="w-60 justify-start h-9 px-2 rounded-md"
        >
          <SearchIcon />
          Search
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 text-gray-400 text-xs rounded border bg-muted px-1">
            <span>⌘</span>k
          </kbd>
        </Button>
      </nav>
    </>
  );
};
