import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Calendar, MessageSquare, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span className="text-xl font-bold">TripPlanner</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Plan trips together with your team
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Collaborate in real-time, organize your itinerary, and get AI-powered suggestions. Everything you need to
            plan the perfect trip.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Start Planning Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Real-time Collaboration</h3>
            <p className="text-muted-foreground">See who's online and work together on your itinerary in real-time.</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Smart Itinerary</h3>
            <p className="text-muted-foreground">Organize activities by day with drag-and-drop simplicity.</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Team Chat</h3>
            <p className="text-muted-foreground">Discuss plans and share ideas without leaving the app.</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">AI Co-Planner</h3>
            <p className="text-muted-foreground">Get intelligent suggestions and recommendations powered by AI.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl">Ready to start planning?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Join thousands of travelers who plan better trips together.
          </p>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">TripPlanner</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 TripPlanner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
