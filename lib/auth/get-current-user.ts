import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { syncUser } from "./sync-user"

export async function getCurrentUser() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return null
  }

  // Sync user with database
  await syncUser(clerkUser)

  // Get user from database
  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  })

  return dbUser
}
