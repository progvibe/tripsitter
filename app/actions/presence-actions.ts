"use server"

import { db } from "@/lib/db"
import { presence } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth/get-current-user"
import { eq, and, gt } from "drizzle-orm"

const ONLINE_THRESHOLD_MINUTES = 2 // Consider user online if seen within 2 minutes

export async function updatePresence(tripId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    // Upsert presence record
    await db
      .insert(presence)
      .values({
        tripId,
        userId: user.id,
        lastSeenAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [presence.tripId, presence.userId],
        set: {
          lastSeenAt: new Date(),
        },
      })

    return { success: true }
  } catch (error) {
    console.error("Failed to update presence:", error)
    return { success: false, error: "Failed to update presence" }
  }
}

export async function getOnlineUsers(tripId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const thresholdTime = new Date(Date.now() - ONLINE_THRESHOLD_MINUTES * 60 * 1000)

    const onlineUsers = await db.query.presence.findMany({
      where: and(eq(presence.tripId, tripId), gt(presence.lastSeenAt, thresholdTime)),
      with: {
        user: true,
      },
    })

    return {
      success: true,
      users: onlineUsers.map((p) => ({
        id: p.user.id,
        name: p.user.name,
        imageUrl: p.user.imageUrl,
        lastSeenAt: p.lastSeenAt,
      })),
    }
  } catch (error) {
    console.error("Failed to get online users:", error)
    return { success: false, error: "Failed to get online users" }
  }
}
