"use client"

import type { ChangeEvent, FormEvent } from "react"
import { useEffect, useState } from "react"
import { updateTrip } from "@/app/actions/trip-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TripSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  canEdit: boolean
  trip: {
    id: string
    name: string
    destination: string | null
    description: string | null
    startDate: string | Date | null
    endDate: string | Date | null
  }
}

interface FormState {
  name: string
  destination: string
  description: string
  startDate: string
  endDate: string
}

function formatDateForInput(value: string | Date | null): string {
  if (!value) {
    return ""
  }

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toISOString().split("T")[0] ?? ""
}

export function TripSettingsDialog({ open, onOpenChange, canEdit, trip }: TripSettingsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<FormState>(() => ({
    name: trip.name,
    destination: trip.destination ?? "",
    description: trip.description ?? "",
    startDate: formatDateForInput(trip.startDate),
    endDate: formatDateForInput(trip.endDate),
  }))

  useEffect(() => {
    if (open) {
      setError(null)
      setFormState({
        name: trip.name,
        destination: trip.destination ?? "",
        description: trip.description ?? "",
        startDate: formatDateForInput(trip.startDate),
        endDate: formatDateForInput(trip.endDate),
      })
    }
  }, [open, trip])

  function handleChange<K extends keyof FormState>(key: K) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({
        ...prev,
        [key]: event.target.value,
      }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canEdit) {
      setError("You need to be the trip owner to update settings.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      formData.set("tripId", trip.id)
      formData.set("name", formState.name.trim())
      formData.set("destination", formState.destination.trim())
      formData.set("description", formState.description.trim())
      formData.set("startDate", formState.startDate)
      formData.set("endDate", formState.endDate)

      const result = await updateTrip(formData)

      if (!result.success) {
        setError(result.error ?? "Failed to update trip settings")
        return
      }

      onOpenChange(false)
    } catch (err) {
      console.error(err)
      setError("Something went wrong while updating the trip")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Trip Settings</DialogTitle>
            <DialogDescription>Update the details for this trip.</DialogDescription>
          </DialogHeader>
          <input type="hidden" name="tripId" value={trip.id} />
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trip-name">Trip Name</Label>
              <Input
                id="trip-name"
                name="name"
                value={formState.name}
                onChange={handleChange("name")}
                placeholder="Summer Vacation 2025"
                required
                disabled={loading || !canEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-destination">Destination</Label>
              <Input
                id="trip-destination"
                name="destination"
                value={formState.destination}
                onChange={handleChange("destination")}
                placeholder="Paris, France"
                disabled={loading || !canEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-description">Description</Label>
              <Textarea
                id="trip-description"
                name="description"
                value={formState.description}
                onChange={handleChange("description")}
                placeholder="What's this trip about?"
                rows={3}
                disabled={loading || !canEdit}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trip-start-date">Start Date</Label>
                <Input
                  id="trip-start-date"
                  name="startDate"
                  type="date"
                  value={formState.startDate}
                  onChange={handleChange("startDate")}
                  disabled={loading || !canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-end-date">End Date</Label>
                <Input
                  id="trip-end-date"
                  name="endDate"
                  type="date"
                  value={formState.endDate}
                  onChange={handleChange("endDate")}
                  disabled={loading || !canEdit}
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!canEdit && !error && (
              <p className="text-sm text-muted-foreground">
                Only the trip owner can update these settings.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !canEdit}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
