import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-current-user"
import { db } from "@/lib/db"
import { trips, tripMembers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TripCard } from "@/components/dashboard/trip-card"
import { CreateTripDialog } from "@/components/dashboard/create-trip-dialog"
import { JoinTripDialog } from "@/components/dashboard/join-trip-dialog"
import { Button } from "@/components/ui/button"
import { Plus, LinkIcon } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Get user's trips
  const userTrips = await db
    .select({
      trip: trips,
      role: tripMembers.role,
    })
    .from(tripMembers)
    .innerJoin(trips, eq(tripMembers.tripId, trips.id))
    .where(eq(tripMembers.userId, user.id))
    .orderBy(trips.createdAt)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Header with actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Trips</h1>
            <p className="mt-1 text-muted-foreground">Plan and collaborate on your adventures</p>
          </div>
          <div className="flex gap-2">
            <JoinTripDialog>
              <Button variant="outline" className="gap-2 bg-transparent">
                <LinkIcon className="h-4 w-4" />
                Join Trip
              </Button>
            </JoinTripDialog>
            <CreateTripDialog>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Trip
              </Button>
            </CreateTripDialog>
          </div>
        </div>

        {/* Trips Grid */}
        {userTrips.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Plus className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">No trips yet</h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Create your first trip or join an existing one using an invite code.
            </p>
            <div className="mt-6 flex gap-2">
              <JoinTripDialog>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <LinkIcon className="h-4 w-4" />
                  Join Trip
                </Button>
              </JoinTripDialog>
              <CreateTripDialog>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Trip
                </Button>
              </CreateTripDialog>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {userTrips.map(({ trip, role }) => (
              <TripCard key={trip.id} trip={trip} role={role} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
