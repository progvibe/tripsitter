"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { activities } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth/get-current-user"

export async function addActivity(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const tripId = formData.get("tripId") as string
  const title = formData.get("title") as string
  const location = formData.get("location") as string | null
  const description = formData.get("description") as string | null
  const day = formData.get("day") as string | null
  const startTime = formData.get("startTime") as string | null
  const endTime = formData.get("endTime") as string | null

  // Convert time strings to timestamps if provided
  const startTimeDate = startTime ? new Date(`1970-01-01T${startTime}:00`) : null
  const endTimeDate = endTime ? new Date(`1970-01-01T${endTime}:00`) : null

  await db.insert(activities).values({
    tripId,
    title,
    location: location || null,
    description: description || null,
    day: day ? Number.parseInt(day) : null,
    startTime: startTimeDate,
    endTime: endTimeDate,
    createdById: user.id,
    order: 0, // TODO: Calculate proper order
  })

  revalidatePath(`/trip/${tripId}`)

  return { success: true }
}
