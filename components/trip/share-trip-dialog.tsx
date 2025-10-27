"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ShareTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inviteCode: string
}

export function ShareTripDialog({ open, onOpenChange, inviteCode }: ShareTripDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Trip</DialogTitle>
          <DialogDescription>Share this invite code with others to let them join your trip.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <div className="flex gap-2">
              <Input id="inviteCode" value={inviteCode} readOnly className="font-mono text-lg" />
              <Button onClick={handleCopy} variant="outline" size="icon">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Anyone with this code can join your trip from the dashboard.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
