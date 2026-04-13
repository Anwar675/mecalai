"use client"

import { createAvatar } from "@dicebear/core"
import { botttsNeutral, initials } from "@dicebear/collection"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

type GeneratedAvatarProps = {
  seed: string
  variant?: "botttsNeutral" | "initials"
  className?: string
}

export const GeneratedAvatar = ({
  seed,
  variant = "initials",
  className,
}: GeneratedAvatarProps) => {
  
  const avatarUri = useMemo(() => {
    let avatar

    if (variant === "botttsNeutral") {
      avatar = createAvatar(botttsNeutral, {
        seed,
      })
    } else {
      avatar = createAvatar(initials, {
        seed,
        fontWeight: 500,
        fontSize: 42,
      })
    }

    return avatar.toDataUri()
  }, [seed, variant])

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatarUri} alt="Avatar" />
      <AvatarFallback>
        {seed?.[0]?.toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  )
}