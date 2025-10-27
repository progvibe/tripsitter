"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { askAi, getAiMessages } from "@/app/actions/ai-actions"

interface AiPanelProps {
  tripId: string
  tripDetails: {
    name: string
    destination: string | null
    startDate: Date | null
    endDate: Date | null
  }
}

interface AiMessage {
  id: string
  content: string
  isUser: boolean
  createdAt: Date
}

const SUGGESTED_PROMPTS = [
  "Suggest activities for this trip",
  "What are must-see attractions?",
  "Recommend local restaurants",
  "Help me plan day 1",
  "What's the best time to visit?",
]

export function AiPanel({ tripId, tripDetails }: AiPanelProps) {
  const [messages, setMessages] = useState<AiMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load AI messages on mount
  useEffect(() => {
    loadMessages()
  }, [tripId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function loadMessages() {
    const result = await getAiMessages(tripId)
    if (result.success && result.messages) {
      setMessages(result.messages)
    }
  }

  async function handleSend(prompt?: string) {
    const messageContent = prompt || input
    if (!messageContent.trim() || loading) return

    setLoading(true)
    setInput("")

    // Add user message immediately
    const userMessage: AiMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      isUser: true,
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    try {
      const result = await askAi(tripId, messageContent)
      if (result.success) {
        await loadMessages()
      }
    } catch (error) {
      console.error("Failed to get AI response:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date))
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">AI Co-Planner</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized suggestions and recommendations for your trip to{" "}
                  {tripDetails.destination || "your destination"}.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <Badge
                      key={prompt}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleSend(prompt)}
                    >
                      {prompt}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.isUser ? "flex-row-reverse" : ""}`}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {message.isUser ? "U" : <Sparkles className="h-4 w-4" />}
                </div>
                <div className={`flex-1 ${message.isUser ? "text-right" : ""}`}>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm font-medium ${message.isUser ? "order-2" : ""}`}>
                      {message.isUser ? "You" : "AI Co-Planner"}
                    </span>
                    <span className={`text-xs text-muted-foreground ${message.isUser ? "order-1" : ""}`}>
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                  <div
                    className={`mt-1 inline-block rounded-lg px-3 py-2 text-sm ${
                      message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">AI Co-Planner</div>
                <div className="mt-1 inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for suggestions..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
