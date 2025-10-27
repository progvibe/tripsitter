"use client"

import { useState } from "react"
import { DayColumn } from "./day-column"
import { AddActivityDialog } from "./add-activity-dialog"

interface ItineraryViewProps {
  trip: {
    id: string
    name: string
    startDate: Date | null
    endDate: Date | null
  }
  activities: Array<{
    id: string
    title: string
    description: string | null
    location: string | null
    startTime: Date | null
    endTime: Date | null
    day: number | null
    order: number
    createdBy: {
      name: string | null
    }
  }>
}

export function ItineraryView({ trip, activities }: ItineraryViewProps) {
  const [addActivityOpen, setAddActivityOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // Calculate number of days
  const getDayCount = () => {
    if (!trip.startDate || !trip.endDate) return 3 // Default to 3 days
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const dayCount = getDayCount()
  const days = Array.from({ length: dayCount }, (_, i) => i + 1)

  // Group activities by day
  const activitiesByDay = activities.reduce(
    (acc, activity) => {
      const day = activity.day || 0
      if (!acc[day]) acc[day] = []
      acc[day].push(activity)
      return acc
    },
    {} as Record<number, typeof activities>,
  )

  const handleAddActivity = (day: number) => {
    setSelectedDay(day)
    setAddActivityOpen(true)
  }

  return (
    <>
      <div className="flex-1 overflow-auto px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Itinerary</h2>
            <p className="text-sm text-muted-foreground">Plan your daily activities</p>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {days.map((day) => (
            <DayColumn
              key={day}
              day={day}
              tripStartDate={trip.startDate}
              activities={activitiesByDay[day] || []}
              onAddActivity={() => handleAddActivity(day)}
            />
          ))}
        </div>

        {/* Unscheduled Activities */}
        {activitiesByDay[0] && activitiesByDay[0].length > 0 && (
          <div className="mt-6">
            <DayColumn
              day={0}
              tripStartDate={trip.startDate}
              activities={activitiesByDay[0]}
              onAddActivity={() => handleAddActivity(0)}
              isUnscheduled
            />
          </div>
        )}
      </div>

      <AddActivityDialog open={addActivityOpen} onOpenChange={setAddActivityOpen} tripId={trip.id} day={selectedDay} />
    </>
  )
}
