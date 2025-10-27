"use client"

import type React from "react"
import { MessageSquare, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TripSidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="w-96 border-l border-border bg-card">
      <Tabs defaultValue="chat" className="flex h-full flex-col">
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
          {children[0]}
        </TabsContent>
        <TabsContent value="ai" className="flex-1 overflow-hidden">
          {children[1]}
        </TabsContent>
      </Tabs>
    </aside>
  )
}
