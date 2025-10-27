"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { trips, tripMembers } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth/get-current-user"
import { and, eq } from "drizzle-orm"

function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 9; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function createTrip(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const destination = formData.get("destination") as string | null
  const description = formData.get("description") as string | null
  const startDate = formData.get("startDate") as string | null
  const endDate = formData.get("endDate") as string | null

  const inviteCode = generateInviteCode()

  const [trip] = await db
    .insert(trips)
    .values({
      name,
      destination: destination || null,
      description: description || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      createdById: user.id,
      inviteCode,
    })
    .returning()

  // Add creator as owner
  await db.insert(tripMembers).values({
    tripId: trip.id,
    userId: user.id,
    role: "owner",
  })

  revalidatePath("/dashboard")

  return { success: true, tripId: trip.id }
}

export async function joinTrip(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const inviteCode = (formData.get("inviteCode") as string).toUpperCase()

  const trip = await db.query.trips.findFirst({
    where: eq(trips.inviteCode, inviteCode),
  })

  if (!trip) {
    return { success: false, error: "Invalid invite code" }
  }

  // Check if already a member
  const existingMember = await db.query.tripMembers.findFirst({
    where: (tripMembers, { and, eq }) => and(eq(tripMembers.tripId, trip.id), eq(tripMembers.userId, user.id)),
  })

  if (existingMember) {
    return { success: true, tripId: trip.id }
  }

  await db.insert(tripMembers).values({
    tripId: trip.id,
    userId: user.id,
    role: "member",
  })

  revalidatePath("/dashboard")

  return { success: true, tripId: trip.id }
}

export async function updateTrip(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const tripId = formData.get("tripId") as string | null

  if (!tripId) {
    return { success: false, error: "Trip ID is required" }
  }

  const membership = await db.query.tripMembers.findFirst({
    where: and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, user.id)),
  })

  if (!membership) {
    return { success: false, error: "Not a trip member" }
  }

  if (membership.role !== "owner") {
    return { success: false, error: "Only trip owners can update settings" }
  }

  const trip = await db.query.trips.findFirst({
    where: eq(trips.id, tripId),
  })

  if (!trip) {
    return { success: false, error: "Trip not found" }
  }

  const name = formData.get("name") as string | null
  const destination = formData.get("destination") as string | null
  const description = formData.get("description") as string | null
  const startDate = formData.get("startDate") as string | null
  const endDate = formData.get("endDate") as string | null

  if (!name) {
    return { success: false, error: "Trip name is required" }
  }

  await db
    .update(trips)
    .set({
      name,
      destination: destination || null,
      description: description || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      updatedAt: new Date(),
    })
    .where(eq(trips.id, tripId))

  revalidatePath(`/trip/${tripId}`)
  revalidatePath("/dashboard")

  return { success: true }
}
