"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityCard } from "./activity-card"

interface DayColumnProps {
  day: number
  tripStartDate: Date | null
  activities: Array<{
    id: string
    title: string
    description: string | null
    location: string | null
    startTime: Date | null
    endTime: Date | null
    order: number
  }>
  onAddActivity: () => void
  isUnscheduled?: boolean
}

export function DayColumn({ day, tripStartDate, activities, onAddActivity, isUnscheduled }: DayColumnProps) {
  const getDayLabel = () => {
    if (isUnscheduled) return "Unscheduled"
    if (!tripStartDate) return `Day ${day}`

    const date = new Date(tripStartDate)
    date.setDate(date.getDate() + day - 1)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{isUnscheduled ? getDayLabel() : `Day ${day}`}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onAddActivity}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {!isUnscheduled && <p className="text-sm text-muted-foreground">{getDayLabel()}</p>}
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {activities.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No activities yet</p>
          </div>
        ) : (
          activities.map((activity) => <ActivityCard key={activity.id} activity={activity} />)
        )}
      </CardContent>
    </Card>
  )
}
