import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-current-user"
import { db } from "@/lib/db"
import { trips, activities } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { TripWorkspace } from "@/components/trip/trip-workspace"

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

  return <TripWorkspace trip={trip} user={user} activities={tripActivities} />
}
