'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/Header'
import { CategoryFilter } from '@/components/CategoryFilter'
import { NewsGrid } from '@/components/NewsGrid'
import { Article, Category, NewsAPIResponse } from '@/types/news'

const CATEGORY_KEYWORDS: Record<Exclude<Category, 'all'>, string[]> = {
  research: ['research', 'paper', 'study', 'arxiv', 'benchmark', 'dataset', 'scientists', 'breakthrough', 'published'],
  models: ['model', 'llm', 'gpt', 'claude', 'gemini', 'llama', 'mistral', 'grok', 'weights', 'training', 'fine-tun', 'parameters', 'token'],
  products: ['launch', 'release', 'update', 'announce', 'introduc', 'available', 'feature', 'app', 'product', 'tool', 'platform', 'new version'],
  companies: ['fund', 'invest', 'acqui', 'partner', 'valuation', 'raise', 'billion', 'million', 'startup', 'ceo', 'openai', 'google deepmind', 'microsoft', 'meta ai', 'anthropic', 'nvidia', 'xai'],
  'open-source': ['open source', 'open-source', 'github', 'hugging face', 'huggingface', 'open weight', 'apache', 'mit license', 'community model'],
  policy: ['regulation', 'law', 'policy', 'safety', 'ethics', 'ban', 'government', ' eu ', 'congress', 'senate', 'risk', 'copyright', 'deepfake', 'liability'],
}

function categorizeArticle(article: Article): Category {
  const text = `${article.title} ${article.description ?? ''} ${article.content ?? ''}`.toLowerCase()

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Exclude<Category, 'all'>, string[]][]) {
    if (keywords.some(kw => text.includes(kw))) {
      return category
    }
  }
  return 'all'
}

function countByCategory(articles: Article[]): Record<Category, number> {
  const counts: Record<Category, number> = { all: articles.length, research: 0, models: 0, products: 0, companies: 0, 'open-source': 0, policy: 0 }
  articles.forEach(a => {
    if (a.category && a.category !== 'all') counts[a.category]++
  })
  return counts
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchNews = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/news')
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data: NewsAPIResponse = await res.json()
      if (data.error) throw new Error(data.error)

      const categorized = data.articles.map(a => ({ ...a, category: categorizeArticle(a) }))
      setArticles(categorized)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchNews() }, [fetchNews])

  const counts = countByCategory(articles)

  return (
    <div className="min-h-screen bg-background">
      <Header onRefresh={fetchNews} isLoading={isLoading} lastUpdated={lastUpdated} />
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-1.5">Today&apos;s AI Digest</h2>
          <p className="text-muted-foreground text-sm">
            {isLoading ? 'Fetching the latest AI news...' : `${articles.length} articles curated for software engineers`}
          </p>
        </div>
        <div className="mb-6">
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} counts={counts} />
        </div>
        <NewsGrid articles={articles} isLoading={isLoading} error={error} selectedCategory={selectedCategory} />
      </main>
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          Powered by NewsAPI · Built for software engineers staying ahead of AI
        </div>
      </footer>
    </div>
  )
}
