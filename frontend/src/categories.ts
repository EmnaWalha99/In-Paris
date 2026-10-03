import type { CategoryKey } from './types'

export interface Category {
  key: CategoryKey
  label: string
  color: string
}

export const CATEGORIES: Category[] = [
  { key: 'concert', label: 'Concert', color: '#fca311' },
  { key: 'theatre', label: 'Théâtre', color: '#1b4d89' },
  { key: 'danse', label: 'Danse & spectacle', color: '#e85d04' },
  { key: 'expo', label: 'Expo', color: '#3a86c8' },
  { key: 'sport', label: 'Sport', color: '#14213d' },
  { key: 'enfants', label: 'Enfants', color: '#2a9d8f' },
  { key: 'atelier', label: 'Atelier & loisirs', color: '#64748b' },
  { key: 'autre', label: 'Autre', color: '#a3a3a3' },
]

export const CATEGORY_BY_KEY = Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<
  CategoryKey,
  Category
>
