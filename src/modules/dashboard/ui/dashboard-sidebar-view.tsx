"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarUserFooter } from "./sidebar-user-view";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    url: "/dashboard/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    url: "/dashboard/agents",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    url: "/dashboard/upgrade",
  },
];

export const DashBoardSidebar = () => {
  const pathname = "/dashboard/meetings";
  return (
    <Sidebar>
      <SidebarHeader>
        <Link className="flex flex-row items-end " href="/dashboard">
          <Image src="/img/logo.png" alt="MECAL.AI" width={70} height={80} />
          <h1 className="text-xl text-custom font-bold">MECAL.AI</h1>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator className="h-[1.5px]! bg-white" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem className="py-1" key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "hover:bg-[#77A0BB]/50 cursor-pointer text-white",
                      pathname === item.url && "bg-[#77A0BB]/50",
                    )}
                    isActive={pathname === item.url}
                  >
                    <Link className="flex items-center gap-6" href={item.url}>
                      <item.icon className="size-6!" />
                      <span className="text-[16px] font-semblod">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-4 py-2">
          <Separator className="h-[1.5px]! bg-white" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem className="py-1" key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "hover:bg-[#77A0BB]/50 cursor-pointer text-white",
                      pathname === item.url && "bg-[#77A0BB]/50",
                    )}
                    isActive={pathname === item.url}
                  >
                    <Link className="flex items-center gap-6" href={item.url}>
                      <item.icon className="size-6!" />
                      <span className="text-[16px] font-semblod">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserFooter />
      </SidebarFooter>
    </Sidebar>
  );
};
