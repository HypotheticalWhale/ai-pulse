'use client'

import { Category } from '@/types/news'
import { Button } from '@/components/ui/button'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'research', label: 'Research' },
  { value: 'models', label: 'Models' },
  { value: 'products', label: 'Products' },
  { value: 'companies', label: 'Companies' },
  { value: 'open-source', label: 'Open Source' },
  { value: 'policy', label: 'Policy' },
]

interface CategoryFilterProps {
  selected: Category
  onChange: (category: Category) => void
  counts: Record<Category, number>
}

export function CategoryFilter({ selected, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map(({ value, label }) => (
        <Button
          key={value}
          variant={selected === value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(value)}
          className="whitespace-nowrap flex-shrink-0"
        >
          {label}
          {value !== 'all' && counts[value] > 0 && (
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              selected === value
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {counts[value]}
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}
