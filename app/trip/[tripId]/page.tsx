import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-current-user"
import { db } from "@/lib/db"
import { trips, activities } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { TripHeader } from "@/components/trip/trip-header"
import { TripSidebar } from "@/components/trip/trip-sidebar"
import { ItineraryView } from "@/components/trip/itinerary-view"
import { ChatPanel } from "@/components/trip/chat-panel"
import { AiPanel } from "@/components/trip/ai-panel"

export default async function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Get trip details
  const trip = await db.query.trips.findFirst({
    where: eq(trips.id, tripId),
    with: {
      createdBy: true,
      members: {
        with: {
          user: true,
        },
      },
    },
  })

  if (!trip) {
    redirect("/dashboard")
  }

  // Check if user is a member
  const membership = trip.members.find((m) => m.userId === user.id)
  if (!membership) {
    redirect("/dashboard")
  }

  // Get activities grouped by day
  const tripActivities = await db.query.activities.findMany({
    where: eq(activities.tripId, tripId),
    with: {
      createdBy: true,
    },
    orderBy: [asc(activities.day), asc(activities.order)],
  })

  return (
    <div className="flex h-screen flex-col bg-background">
      <TripHeader trip={trip} user={user} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ItineraryView trip={trip} activities={tripActivities} />
        </div>

        {/* Right Sidebar - Chat & AI */}
        <TripSidebar>
          <ChatPanel tripId={trip.id} currentUser={user} />
          <AiPanel
            tripId={trip.id}
            tripDetails={{
              name: trip.name,
              destination: trip.destination,
              startDate: trip.startDate,
              endDate: trip.endDate,
            }}
          />
        </TripSidebar>
      </div>
    </div>
  )
}
