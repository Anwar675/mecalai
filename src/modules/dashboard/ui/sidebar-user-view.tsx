"use client";

import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  DollarSignIcon,
  LogOut,
  Settings,
  Triangle,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generate-avata";
import { Button } from "@/components/ui/button";
import { ButtonAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export const SidebarUserFooter = () => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  if (isPending || !data?.user) {
    return null;
  }

  return (
    <div className="py-3 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full flex items-center justify-start px-3 gap-3 bg-custom-gradient py-4 rounded-lg hover:bg-muted transition">
            {data.user.image ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={data.user.image} />
                <AvatarFallback>{data.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <GeneratedAvatar
                seed={data.user.email || data.user.name || "U"}
                variant="botttsNeutral"
                className="h-8 w-8 rounded-full"
              />
            )}

            <div className="flex flex-col text-left">
              <span className="text-[16px] font-bold text-[#24343a]">
                {data.user.name}
              </span>
              <span className="text-xs text-white">{data.user.email}</span>
            </div>
            <ChevronDown color="white" className="w-4 h-4 ml-auto" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="py-2">
            <User className=" mr-2" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem className="py-2">
            <Settings className=" mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2">
            <Button className="border-none" onClick={() => authClient.customer.portal()}>
              <DollarSignIcon className=" mr-2" />
              Billing{" "}
            </Button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/sign-in");
                  },
                },
              })
            }
            className="text-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <ButtonAuth />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
