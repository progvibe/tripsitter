"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { sendMessage, getMessages } from "@/app/actions/message-actions"
import { useRouter } from "next/navigation"

interface ChatPanelProps {
  tripId: string
  currentUser: {
    id: string
    name: string | null
    imageUrl: string | null
  }
}

interface Message {
  id: string
  content: string
  isAi: boolean
  createdAt: Date
  user: {
    id: string
    name: string | null
    imageUrl: string | null
  } | null
}

export function ChatPanel({ tripId, currentUser }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Load messages on mount and poll for updates
  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [tripId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function loadMessages() {
    const result = await getMessages(tripId)
    if (result.success && result.messages) {
      setMessages(result.messages)
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    setLoading(true)
    const messageContent = input
    setInput("")

    try {
      const result = await sendMessage(tripId, messageContent)
      if (result.success) {
        await loadMessages()
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setInput(messageContent) // Restore input on error
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date))
  }

  const getInitials = (name: string | null) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center py-12 text-center">
              <div>
                <p className="text-sm text-muted-foreground">No messages yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.user?.id === currentUser.id
              const isAi = message.isAi

              return (
                <div key={message.id} className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8">
                    {isAi ? (
                      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage src={message.user?.imageUrl || undefined} />
                        <AvatarFallback>{getInitials(message.user?.name || null)}</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div className={`flex-1 ${isCurrentUser ? "text-right" : ""}`}>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-sm font-medium ${isCurrentUser ? "order-2" : ""}`}>
                        {isAi ? "AI Co-Planner" : isCurrentUser ? "You" : message.user?.name || "Unknown"}
                      </span>
                      <span className={`text-xs text-muted-foreground ${isCurrentUser ? "order-1" : ""}`}>
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                    <div
                      className={`mt-1 inline-block rounded-lg px-3 py-2 text-sm ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : isAi
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
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
