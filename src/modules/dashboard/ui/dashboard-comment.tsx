"use client"

import { CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react"

import {
  Command,
  CommandDialog,
 
} from "@/components/ui/command"
import { ReactNode } from "react";



interface Props {
  open: boolean
  setOpen: (open: boolean) => void;
  children: ReactNode;
  
}
export function DashboardComment({ open, setOpen, children }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command >
         {children}
        </Command>
      </CommandDialog>
    </div>
  )
}
