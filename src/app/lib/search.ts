import { ITEMS, ITEM_BY_ID, SECTIONS } from '../data/menu'
import { OFFERS } from '../data/offers'
import type { Item, Offer, Section } from '../data/types'

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

// Haystacks are normalised once, when the module loads, not on every keystroke.
const SECTION_HAY = SECTIONS.map((s) => ({ s, hay: normalize([s.pill.en, s.pill.ar, s.title.en, s.title.ar].join(' ')) }))
const OFFER_HAY = OFFERS.map((o) => ({ o, hay: normalize(o.items.flatMap((id) => [ITEM_BY_ID[id].name.en, ITEM_BY_ID[id].name.ar]).join(' ')) }))
const ITEM_HAY = ITEMS.map((i) => ({ i, hay: normalize([i.name.en, i.name.ar, i.desc.en, i.desc.ar].join(' ')) }))
const all = (hay: string, toks: string[]) => toks.every((t) => hay.includes(t))

export function search(query: string): SearchResults {
  const toks = tokens(query)
  if (toks.length === 0) return { categories: [], offers: [], items: [] }
  return {
    categories: SECTION_HAY.filter((x) => all(x.hay, toks)).map((x) => x.s),
    offers: OFFER_HAY.filter((x) => all(x.hay, toks)).map((x) => x.o),
    items: ITEM_HAY.filter((x) => all(x.hay, toks)).map((x) => x.i),
  }
}
