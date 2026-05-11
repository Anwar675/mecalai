import {
    CallControls,
    SpeakerLayout,
    useCall,
    type CustomVideoEvent,
} from "@stream-io/video-react-sdk"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"

interface Props {
    onLeave: () => void
    meetingName: string
}

export const CallActive = ({onLeave, meetingName}: Props) => {
    const call = useCall()
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (!call) return

        const handleCustomEvent = async (event: CustomVideoEvent) => {
            if (
                event.custom?.type !== "vieneu.audio" ||
                typeof event.custom.asset_url !== "string"
            ) {
                return
            }

            try {
                audioRef.current?.pause()

                const audio = new Audio(event.custom.asset_url)
                audioRef.current = audio

                await audio.play()
            } catch (error) {
                console.error("Failed to play Vieneu audio", error)
            }
        }

        return call.on("custom", handleCustomEvent)
    }, [call])

    return (
        <div className="flex flex-col justify-center p-4 h-full text-white">
            <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                    <Image src="/img/logo.png" width={22} height={22} alt="logo" />
                </Link>
                <h4 className="text-base">
                    {meetingName}
                </h4>
            </div>
            <SpeakerLayout />
            <div className="bg-[#101213] rounded-full px-4">
                <CallControls onLeave={onLeave} />
            </div>
        </div>
    )
}
