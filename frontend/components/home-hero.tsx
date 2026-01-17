"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function HomeHero() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-6 lg:py-24">
        <h1 className="text-balance text-4xl font-bold tracking-tight lg:text-5xl">Track prices for the best tech</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Compare refurbished prices across multiple marketplaces. Find the best deals on iPhones, iPads, and more.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for a device..."
              className="h-12 rounded-full border-border bg-background pl-12 pr-4 text-base shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
