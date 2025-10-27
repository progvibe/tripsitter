"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { updatePresence, getOnlineUsers } from "@/app/actions/presence-actions"

interface OnlineUsersProps {
  tripId: string
  currentUserId: string
}

interface OnlineUser {
  id: string
  name: string | null
  imageUrl: string | null
  lastSeenAt: Date
}

export function OnlineUsers({ tripId, currentUserId }: OnlineUsersProps) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    // Update presence immediately
    updatePresence(tripId)

    // Update presence every 30 seconds
    const presenceInterval = setInterval(() => {
      updatePresence(tripId)
    }, 30000)

    // Fetch online users every 10 seconds
    const fetchOnlineUsers = async () => {
      const result = await getOnlineUsers(tripId)
      if (result.success && result.users) {
        setOnlineUsers(result.users)
      }
    }

    fetchOnlineUsers()
    const usersInterval = setInterval(fetchOnlineUsers, 10000)

    return () => {
      clearInterval(presenceInterval)
      clearInterval(usersInterval)
    }
  }, [tripId])

  const getInitials = (name: string | null) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (onlineUsers.length === 0) return null

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <div className="flex -space-x-2">
          {onlineUsers.slice(0, 5).map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={user.imageUrl || undefined} />
                    <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.id === currentUserId ? "You" : user.name || "Unknown"}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        {onlineUsers.length > 5 && (
          <span className="ml-2 text-sm text-muted-foreground">+{onlineUsers.length - 5}</span>
        )}
      </div>
    </TooltipProvider>
  )
}
