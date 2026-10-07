import type { Offer } from './types'

// Curated order. Items are referenced by id. No offerPrice = sum of both items, no savings.
export const OFFERS: Offer[] = [
  { id: 'iced-latte-oreo-cookies', items: ['iced-latte', 'oreo-cookies'], offerPrice: 150 },
  { id: 'latte-brownies', items: ['latte', 'brownies'] },
  { id: 'iced-spanish-latte-tiramisu-cake', items: ['iced-spanish-latte', 'tiramisu-cake'], offerPrice: 220 },
  { id: 'cappuccino-kinder-cookies', items: ['cappuccino', 'kinder-cookies'] },
  { id: 'iced-matcha-latte-san-sebastian-cheesecake', items: ['iced-matcha-latte', 'san-sebastian-cheesecake'], offerPrice: 240 },
]
