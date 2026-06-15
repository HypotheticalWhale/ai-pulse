export type Category = 'all' | 'research' | 'models' | 'products' | 'companies' | 'open-source' | 'policy'

export interface NewsSource {
  id: string | null
  name: string
}

export interface Article {
  source: NewsSource
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
  category?: Category
}

export interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: Article[]
  error?: string
}
