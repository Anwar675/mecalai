import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MAX_AGENT_FREE, MAX_FREE_MEETING } from "@/lib/constanst"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { RocketIcon } from "lucide-react"
import Link from "next/link"

export const DashBoardTrial = () => {
    const trpc = useTRPC()
    const {data} = useQuery(trpc.premium.getFreeUsage.queryOptions())
    if(!data) return null
    return (
        <div className="border p-3  rounded-lg w-full bg-custom-gradient flex flex-col gap-y-2">
            <div className="flex gap-4 text-[#102837]">
                <RocketIcon className="size-4 " />
                <p className="text-sm font-bold">Free Trial</p>
            </div>
            <div className="flex text-white flex-col gap-y-2">
                <p className="text-xs">
                    {data.agentCount}/{MAX_AGENT_FREE} Agents
                </p>
                <Progress value={(data.agentCount / MAX_AGENT_FREE) * 100} />
            </div>
            <div className="flex text-white flex-col gap-y-2">
                <p className="text-xs">
                    {data.meetingsCount}/{MAX_FREE_MEETING} Meetings
                </p>
                <Progress value={(data.meetingsCount / MAX_FREE_MEETING) * 100}  />
            </div>
            <Button asChild className="h-10 font-bold text-white border-gray-700 hover:bg-[#102837]">
                <Link href="/upgrade">
                    Upgrade
                </Link>
            </Button>
        </div>
    )
}