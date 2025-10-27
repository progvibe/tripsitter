"use client"

import Link from "next/link"
import { useState } from "react"
import { Calendar, MapPin, Users, Share2, Settings, ChevronLeft, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShareTripDialog } from "./share-trip-dialog"
import { OnlineUsers } from "./online-users"
import { TripSettingsDialog } from "./trip-settings-dialog"
import { ThemeSwitcher } from "@/components/theme-switcher"

interface TripHeaderProps {
  trip: {
    id: string
    name: string
    destination: string | null
    description: string | null
    startDate: Date | null
    endDate: Date | null
    createdById: string
    inviteCode: string
    members: Array<{
      user: {
        name: string | null
        imageUrl: string | null
      }
    }>
  }
  user: {
    id: string
    name: string | null
    imageUrl: string | null
  }
  onOpenMobileSidebar?: () => void
}

export function TripHeader({ trip, user, onOpenMobileSidebar }: TripHeaderProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const isOwner = trip.createdById === user.id

  const formatDateRange = () => {
    if (!trip.startDate || !trip.endDate) return null
    const start = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(trip.startDate))
    const end = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
      new Date(trip.endDate),
    )
    return `${start} - ${end}`
  }

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeSwitcher />
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{trip.name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {trip.destination && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{trip.destination}</span>
                  </div>
                )}
                {formatDateRange() && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDateRange()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {onOpenMobileSidebar && (
              <Button
                variant="outline"
                size="icon"
                onClick={onOpenMobileSidebar}
                className="lg:hidden"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Open chat</span>
              </Button>
            )}
            <OnlineUsers tripId={trip.id} currentUserId={user.id} />

            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{trip.members.length}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShareOpen(true)} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>Trip Settings</DropdownMenuItem>
                <DropdownMenuItem>Manage Members</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Leave Trip</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ShareTripDialog open={shareOpen} onOpenChange={setShareOpen} inviteCode={trip.inviteCode} />
      <TripSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} trip={trip} canEdit={isOwner} />
    </>
  )
}
