import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TripCardProps {
  trip: {
    id: string
    name: string
    description: string | null
    destination: string | null
    startDate: Date | null
    endDate: Date | null
  }
  role: string
}

export function TripCard({ trip, role }: TripCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return null
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date))
  }

  return (
    <Link href={`/trip/${trip.id}`}>
      <Card className="transition-colors hover:bg-accent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="line-clamp-1">{trip.name}</CardTitle>
            {role === "owner" && <Badge variant="secondary">Owner</Badge>}
          </div>
          {trip.description && <CardDescription className="line-clamp-2">{trip.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            {trip.destination && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{trip.destination}</span>
              </div>
            )}
            {trip.startDate && trip.endDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
