"use client"

import { MapPin, Clock, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ActivityCardProps {
  activity: {
    id: string
    title: string
    description: string | null
    location: string | null
    startTime: Date | null
    endTime: Date | null
  }
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const formatTime = (date: Date | null) => {
    if (!date) return null
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date))
  }

  return (
    <Card className="transition-colors hover:bg-accent">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold">{activity.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Move to Day</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {activity.description && <p className="text-muted-foreground">{activity.description}</p>}
        {activity.location && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{activity.location}</span>
          </div>
        )}
        {activity.startTime && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {formatTime(activity.startTime)}
              {activity.endTime && ` - ${formatTime(activity.endTime)}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
