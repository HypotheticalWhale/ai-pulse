'use client'

import { useState } from 'react'
import { ExternalLink, Clock, Newspaper } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Article, Category } from '@/types/news'

const CATEGORY_COLORS: Record<Category, string> = {
  all: 'bg-slate-500',
  research: 'bg-purple-500',
  models: 'bg-blue-500',
  products: 'bg-green-500',
  companies: 'bg-orange-500',
  'open-source': 'bg-emerald-500',
  policy: 'bg-red-500',
}

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'General',
  research: 'Research',
  models: 'Models',
  products: 'Products',
  companies: 'Companies',
  'open-source': 'Open Source',
  policy: 'Policy',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

export function NewsCard({ article }: { article: Article }) {
  const [imgError, setImgError] = useState(false)
  const category = article.category ?? 'all'

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-default">
      <div className="relative h-44 bg-muted overflow-hidden flex-shrink-0">
        {article.urlToImage && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-10 h-10 text-muted-foreground/25" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-medium text-white px-2 py-0.5 rounded-full ${CATEGORY_COLORS[category]}`}>
          {CATEGORY_LABELS[category]}
        </span>
      </div>

      <CardHeader className="pb-2 pt-4">
        <p className="font-semibold text-sm leading-snug line-clamp-3 group-hover:text-primary/90 transition-colors">
          {article.title}
        </p>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {article.description && (
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {article.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
          <span className="font-medium truncate">{article.source.name}</span>
          <span className="flex-shrink-0">·</span>
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className="flex-shrink-0">{timeAgo(article.publishedAt)}</span>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0 font-medium"
        >
          Read <ExternalLink className="w-3 h-3" />
        </a>
      </CardFooter>
    </Card>
  )
}
