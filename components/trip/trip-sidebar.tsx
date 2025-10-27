"use client"

import * as React from "react"
import { MessageSquare, Sparkles } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type PanelRenderer = () => React.ReactNode

interface TripSidebarProps {
  chatPanel: PanelRenderer
  aiPanel: PanelRenderer
  defaultTab?: "chat" | "ai"
}

interface TripSidebarMobileProps extends TripSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TripSidebarTabsProps extends TripSidebarProps {
  className?: string
}

export function TripSidebar({ chatPanel, aiPanel, defaultTab = "chat" }: TripSidebarProps) {
  return (
    <aside className="hidden flex-shrink-0 border-l border-border bg-card lg:flex lg:w-96">
      <TripSidebarTabs chatPanel={chatPanel} aiPanel={aiPanel} defaultTab={defaultTab} />
    </aside>
  )
}

export function TripSidebarMobile({ chatPanel, aiPanel, open, onOpenChange, defaultTab }: TripSidebarMobileProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full w-full flex-col overflow-hidden p-0 sm:max-w-sm">
        {open ? (
          <>
            <SheetHeader className="sr-only p-0">
              <SheetTitle>Trip collaboration tools</SheetTitle>
            </SheetHeader>
            <TripSidebarTabs chatPanel={chatPanel} aiPanel={aiPanel} defaultTab={defaultTab} className="flex-1" />
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export function TripSidebarTabs({ chatPanel, aiPanel, defaultTab = "chat", className }: TripSidebarTabsProps) {
  const chatContent = React.useMemo(() => chatPanel(), [chatPanel])
  const aiContent = React.useMemo(() => aiPanel(), [aiPanel])

  return (
    <Tabs defaultValue={defaultTab} className={cn("flex h-full flex-1 flex-col", className)}>
      <TabsList className="w-full rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger
          value="chat"
          className="flex-1 gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </TabsTrigger>
        <TabsTrigger
          value="ai"
          className="flex-1 gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          <Sparkles className="h-4 w-4" />
          AI Co-Planner
        </TabsTrigger>
      </TabsList>
      <TabsContent value="chat" className="flex-1 overflow-hidden">
        {chatContent}
      </TabsContent>
      <TabsContent value="ai" className="flex-1 overflow-hidden">
        {aiContent}
      </TabsContent>
    </Tabs>
  )
}
