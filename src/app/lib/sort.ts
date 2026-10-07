import type { Item } from '../data/types'

export const FIRST_VISIBLE = 5

// New first, then Top Rated, then the rest; each group keeps menu order. Derived, never stored.
export function sortCategory(items: Item[]): Item[] {
  const rank = (i: Item) => (i.badge === 'new' ? 0 : i.badge === 'top' ? 1 : 2)
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => rank(a.item) - rank(b.item) || a.index - b.index)
    .map((x) => x.item)
}
