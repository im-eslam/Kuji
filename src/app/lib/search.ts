import type { Item, Offer, Section } from '../data/types'
import { getCatalog, type Catalog } from './catalog'

const AR_MARKS = /[\u064B-\u065F\u0670\u0640]/g

export function normalize(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(AR_MARKS, '')
    .replace(/[\u0623\u0625\u0622\u0671]/g, '\u0627')
    .replace(/\u0649/g, '\u064A')
    .toLowerCase()
    .trim()
}

const tokens = (q: string): string[] => normalize(q).split(/\s+/).filter(Boolean)

export interface SearchResults { categories: Section[]; offers: Offer[]; items: Item[] }

interface Index {
  sections: { s: Section; hay: string }[]
  offers: { o: Offer; hay: string }[]
  items: { i: Item; hay: string }[]
}

// Haystacks are normalised once per catalog, not on every keystroke.
const indexes = new WeakMap<Catalog, Index>()

function indexFor(catalog: Catalog): Index {
  let index = indexes.get(catalog)
  if (!index) {
    index = {
      sections: catalog.sections
        .filter((s) => s.kind === 'category')
        .map((s) => ({ s, hay: normalize([s.pill.en, s.pill.ar, s.title.en, s.title.ar].join(' ')) })),
      offers: catalog.offers.map((o) => ({
        o,
        hay: normalize(o.items.flatMap((id) => [catalog.itemById[id].name.en, catalog.itemById[id].name.ar]).join(' ')),
      })),
      items: catalog.items
        .filter((i) => i.inStock !== false)
        .map((i) => ({ i, hay: normalize([i.name.en, i.name.ar, i.desc.en, i.desc.ar].join(' ')) })),
    }
    indexes.set(catalog, index)
  }
  return index
}

const all = (hay: string, toks: string[]) => toks.every((t) => hay.includes(t))

export function search(query: string): SearchResults {
  const toks = tokens(query)
  if (toks.length === 0) return { categories: [], offers: [], items: [] }
  const index = indexFor(getCatalog())
  return {
    categories: index.sections.filter((x) => all(x.hay, toks)).map((x) => x.s),
    offers: index.offers.filter((x) => all(x.hay, toks)).map((x) => x.o),
    items: index.items.filter((x) => all(x.hay, toks)).map((x) => x.i),
  }
}
