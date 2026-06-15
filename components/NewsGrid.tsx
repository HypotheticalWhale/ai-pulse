import { Article, Category } from '@/types/news'
import { NewsCard } from './NewsCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { AlertCircle, Newspaper } from 'lucide-react'

function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <div className="pt-1 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </Card>
  )
}

interface NewsGridProps {
  articles: Article[]
  isLoading: boolean
  error: string | null
  selectedCategory: Category
}

export function NewsGrid({ articles, isLoading, error, selectedCategory }: NewsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <h3 className="font-semibold text-lg">Failed to load news</h3>
        <p className="text-muted-foreground text-sm max-w-md">{error}</p>
        <p className="text-xs text-muted-foreground max-w-sm">
          Make sure <code className="bg-muted px-1 py-0.5 rounded">NEWS_API_KEY</code> is set in your environment and run via <code className="bg-muted px-1 py-0.5 rounded">vercel dev</code>.
        </p>
      </div>
    )
  }

  const filtered = selectedCategory === 'all'
    ? articles
    : articles.filter(a => a.category === selectedCategory)

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <Newspaper className="w-10 h-10 text-muted-foreground" />
        <h3 className="font-semibold text-lg">No articles in this category</h3>
        <p className="text-muted-foreground text-sm">Try a different filter or refresh for new articles.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((article, i) => (
        <NewsCard key={`${article.url}-${i}`} article={article} />
      ))}
    </div>
  )
}
