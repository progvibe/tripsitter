import Link from "next/link"
import { Calendar } from "lucide-react"
import { UserButton } from "@/components/user-button"

interface DashboardHeaderProps {
  user: {
    name: string | null
    email: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          <span className="text-xl font-bold">TripSitter</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <UserButton />
        </div>
      </div>
    </header>
  )
}
