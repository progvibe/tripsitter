import Link from "next/link"
import { Calendar } from "lucide-react"
import { UserButton } from "@/components/user-button"
import { TopBar } from "@/components/top-bar"

interface DashboardHeaderProps {
  user: {
    name: string | null
    email: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <TopBar
      leftSlot={
        <Link href="/dashboard" className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          <span className="text-xl font-bold">TripSitter</span>
        </Link>
      }
      rightSlot={
        <>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <UserButton />
        </>
      }
    />
  )
}
