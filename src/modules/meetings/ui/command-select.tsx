"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { DashboardComment } from "@/modules/dashboard/ui/dashboard-comment";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value?: string;
  placeholder?: string;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        type="button"
        className={cn(
          "h-9 justify-between rounded-md font-normal text-sm px-2",
          !selectedOption && "text-muted-foreground",
          className,
        )}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronsUpDownIcon />
      </Button>
      <DashboardComment open={open} setOpen={setOpen}>
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList className="py-4" >
          <CommandEmpty>
            <span>No options found</span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              className="py-2"
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </DashboardComment>
    </>
  );
};
