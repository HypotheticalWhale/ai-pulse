'use client'

import { RefreshCw, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onRefresh: () => void
  isLoading: boolean
  lastUpdated: Date | null
}

export function Header({ onRefresh, isLoading, lastUpdated }: HeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI Pulse</h1>
            <p className="text-xs text-muted-foreground">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    </header>
  )
}
