import type { CategoryKey } from './api'

export interface Category {
  key: CategoryKey
  label: string
  color: string
}

export const CATEGORIES: Category[] = [
  { key: 'concert', label: 'Concert', color: '#ae5c4c' },
  { key: 'theatre', label: 'Théâtre', color: '#691619' },
  { key: 'danse', label: 'Danse & spectacle', color: '#c98b6b' },
  { key: 'expo', label: 'Expo', color: '#8c7b62' },
  { key: 'sport', label: 'Sport', color: '#46100f' },
  { key: 'enfants', label: 'Enfants', color: '#d4a373' },
  { key: 'atelier', label: 'Atelier & loisirs', color: '#625a4b' },
  { key: 'autre', label: 'Autre', color: '#a99b8a' },
]

export const CATEGORY_BY_KEY = Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<
  CategoryKey,
  Category
>
