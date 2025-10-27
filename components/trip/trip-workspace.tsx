'use client'

import * as React from "react"

import { TripHeader } from "./trip-header"
import { ItineraryView } from "./itinerary-view"
import { TripSidebar, TripSidebarMobile } from "./trip-sidebar"
import { ChatPanel } from "./chat-panel"
import { AiPanel } from "./ai-panel"

interface TripWorkspaceProps {
  trip: React.ComponentProps<typeof TripHeader>["trip"]
  user: React.ComponentProps<typeof TripHeader>["user"]
  activities: React.ComponentProps<typeof ItineraryView>["activities"]
}

export function TripWorkspace({ trip, user, activities }: TripWorkspaceProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)
  const renderChatPanel = React.useCallback(
    () => (
      <ChatPanel
        tripId={trip.id}
        currentUser={{
          id: user.id,
          name: user.name,
          imageUrl: user.imageUrl,
        }}
      />
    ),
    [trip.id, user.id, user.imageUrl, user.name],
  )
  const renderAiPanel = React.useCallback(
    () => (
      <AiPanel
        tripId={trip.id}
        tripDetails={{
          name: trip.name,
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
        }}
      />
    ),
    [trip.destination, trip.endDate, trip.id, trip.name, trip.startDate],
  )

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in event ? event.matches : mediaQuery.matches
      if (matches) {
        setIsMobileSidebarOpen(false)
      }
    }

    if (mediaQuery.matches) {
      setIsMobileSidebarOpen(false)
    }

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <TripHeader trip={trip} user={user} onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <ItineraryView trip={trip} activities={activities} />
        </div>

        <TripSidebar chatPanel={renderChatPanel} aiPanel={renderAiPanel} />
      </div>

      <TripSidebarMobile
        open={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
        chatPanel={renderChatPanel}
        aiPanel={renderAiPanel}
      />
    </div>
  )
}
