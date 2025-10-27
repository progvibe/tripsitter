import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { User } from "@clerk/nextjs/server"

export async function syncUser(clerkUser: User) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  })

  if (!existingUser) {
    // Create new user in our database
    await db.insert(users).values({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
      imageUrl: clerkUser.imageUrl || null,
    })
  } else {
    // Update existing user
    await db
      .update(users)
      .set({
        email: clerkUser.emailAddresses[0]?.emailAddress || existingUser.email,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || existingUser.name,
        imageUrl: clerkUser.imageUrl || existingUser.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id))
  }
}
