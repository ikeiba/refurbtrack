"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeroSectionProps {
  onSearch: (query: string) => void
  onTrendingClick: (term: string) => void
}

const trendingTerms = ["iPhone 13", "iPhone 14 Pro", "Battery New", "iPhone 15 Pro"]

export function HeroSection({ onSearch, onTrendingClick }: HeroSectionProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <section className="flex flex-col items-center justify-center px-4 py-20 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight lg:text-5xl">
          Track the Best Prices for Refurbished iPhones
        </h1>
        <p className="mb-10 text-lg text-muted-foreground">
          Compare prices across retailers and get notified when your favorite model hits its lowest price.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for iPhone models, storage, colors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 rounded-full border-border bg-background pl-12 pr-32 text-base shadow-lg focus-visible:ring-emerald-500"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 px-6 hover:bg-emerald-700"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Trending Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Trending:</span>
          {trendingTerms.map((term) => (
            <Badge
              key={term}
              variant="secondary"
              className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900 dark:hover:text-emerald-200"
              onClick={() => onTrendingClick(term)}
            >
              {term}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
