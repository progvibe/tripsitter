"use server"

import { db } from "@/lib/db"
import { messages } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth/get-current-user"
import { eq, desc } from "drizzle-orm"

export async function sendMessage(tripId: string, content: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  if (!content.trim()) {
    return { success: false, error: "Message cannot be empty" }
  }

  try {
    await db.insert(messages).values({
      tripId,
      userId: user.id,
      content: content.trim(),
      isAi: false,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to send message:", error)
    return { success: false, error: "Failed to send message" }
  }
}

export async function getMessages(tripId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const tripMessages = await db.query.messages.findMany({
      where: eq(messages.tripId, tripId),
      with: {
        user: true,
      },
      orderBy: [desc(messages.createdAt)],
      limit: 100,
    })

    // Reverse to show oldest first
    const sortedMessages = tripMessages.reverse()

    return {
      success: true,
      messages: sortedMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        isAi: msg.isAi,
        createdAt: msg.createdAt,
        user: msg.user
          ? {
              id: msg.user.id,
              name: msg.user.name,
              imageUrl: msg.user.imageUrl,
            }
          : null,
      })),
    }
  } catch (error) {
    console.error("Failed to get messages:", error)
    return { success: false, error: "Failed to load messages" }
  }
}
