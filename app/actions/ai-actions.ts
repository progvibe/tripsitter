"use server"

import { generateText } from "ai"
import { db } from "@/lib/db"
import { messages, trips, activities } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth/get-current-user"
import { eq, and, desc } from "drizzle-orm"

export async function askAi(tripId: string, userMessage: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  if (!userMessage.trim()) {
    return { success: false, error: "Message cannot be empty" }
  }

  try {
    // Get trip details for context
    const trip = await db.query.trips.findFirst({
      where: eq(trips.id, tripId),
    })

    if (!trip) {
      return { success: false, error: "Trip not found" }
    }

    // Get existing activities for context
    const existingActivities = await db.query.activities.findMany({
      where: eq(activities.tripId, tripId),
      orderBy: [activities.day, activities.order],
    })

    // Get recent AI conversation history
    const recentMessages = await db.query.messages.findMany({
      where: and(eq(messages.tripId, tripId), eq(messages.isAi, true)),
      orderBy: [desc(messages.createdAt)],
      limit: 5,
    })

    // Build context for AI
    const context = `
You are an AI travel planning assistant helping plan a trip.

Trip Details:
- Name: ${trip.name}
- Destination: ${trip.destination || "Not specified"}
- Start Date: ${trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "Not specified"}
- End Date: ${trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "Not specified"}

Current Itinerary:
${
  existingActivities.length > 0
    ? existingActivities
        .map((a) => `- Day ${a.day || "Unscheduled"}: ${a.title}${a.location ? ` at ${a.location}` : ""}`)
        .join("\n")
    : "No activities planned yet"
}

User Question: ${userMessage}

Provide helpful, specific suggestions for this trip. Be concise and actionable.
`

    // Save user message
    await db.insert(messages).values({
      tripId,
      userId: user.id,
      content: userMessage,
      isAi: false,
    })

    // Generate AI response
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: context,
      maxTokens: 500,
    })

    // Save AI response
    await db.insert(messages).values({
      tripId,
      userId: null,
      content: text,
      isAi: true,
    })

    return { success: true, response: text }
  } catch (error) {
    console.error("Failed to get AI response:", error)
    return { success: false, error: "Failed to get AI response" }
  }
}

export async function getAiMessages(tripId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const aiMessages = await db.query.messages.findMany({
      where: eq(messages.tripId, tripId),
      orderBy: [desc(messages.createdAt)],
      limit: 50,
    })

    // Reverse to show oldest first
    const sortedMessages = aiMessages.reverse()

    return {
      success: true,
      messages: sortedMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        isUser: !msg.isAi,
        createdAt: msg.createdAt,
      })),
    }
  } catch (error) {
    console.error("Failed to get AI messages:", error)
    return { success: false, error: "Failed to load messages" }
  }
}
