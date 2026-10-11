import { useSyncExternalStore } from 'react'
import { SECTIONS } from '../data/menu'
import { buildSeedMenu } from '../data/seed'
import type {
  AddOn,
  AddOnId,
  Item,
  ItemId,
  MenuCategory,
  MenuData,
  Offer,
  Section,
  Size,
} from '../data/types'
import { registerCategoryImages } from './images'
import { resolveAddOns } from './menuLogic'

/**
 * The public menu, derived from a MenuData document (public/menu.json).
 * Everything the guest-facing UI reads lives here, so one swap updates every screen.
 */
export interface Catalog {
  menu: MenuData
  categories: MenuCategory[]
  /** Every product, including sold-out ones, so order lines can always resolve their item. */
  items: Item[]
  itemById: Record<ItemId, Item>
  sections: Section[]
  offers: Offer[]
  offerById: Record<string, Offer>
  addOns: AddOn[]
  addOnById: Map<AddOnId, AddOn>
  signatureIds: ItemId[]
  oftenOrdered: Record<ItemId, ItemId[]>
}

const STATIC_SIGNATURES = SECTIONS.find((s) => s.kind === 'signatures')!
const STATIC_PAIRINGS = SECTIONS.find((s) => s.kind === 'pairings')!

export function buildCatalog(menu: MenuData): Catalog {
  const kindOf = new Map(menu.categories.map((c) => [c.id, c.kind]))
  const addOnById = new Map(menu.addOns.map((a) => [a.id, a]))

  const items: Item[] = menu.products
    .filter((p) => kindOf.has(p.categoryId))
    .map((p) => {
      const kind = kindOf.get(p.categoryId) ?? 'drink'
      const addOnIds = resolveAddOns(p, kind, menu.addOns).map((a) => a.id)
      const sizeDefs: Size[] = p.sizes.map((s) => ({
        id: s.id,
        name: s.name,
        upcharge: s.mode === 'delta' ? s.value : s.value - (p.price ?? 0),
      }))
      const baristaAddOns = p.baristaWay.enabled
        ? p.baristaWay.addOns.filter((id) => addOnIds.includes(id))
        : []
      return {
        id: p.id,
        name: p.name,
        desc: p.desc,
        price: p.price,
        kind,
        badge: p.badge,
        categoryId: p.categoryId,
        inStock: p.inStock,
        profile: {
          sizes: sizeDefs.map((s) => s.id),
          addOns: addOnIds,
          baristaWay: baristaAddOns.length > 0,
          sizeDefs,
          baristaAddOns,
        },
      }
    })

  const itemById: Record<ItemId, Item> = Object.fromEntries(items.map((i) => [i.id, i]))
  const available = (id: ItemId) => itemById[id]?.inStock !== false && !!itemById[id]

  const offers: Offer[] = menu.pairings
    .filter((p) => p.items.every(available))
    .map((p) => ({
      id: p.id,
      items: p.items,
      ...(p.bundlePrice !== null ? { offerPrice: p.bundlePrice } : {}),
    }))

  const signatureIds = menu.signatures.filter(available)

  const sections: Section[] = [
    ...(signatureIds.length > 0 ? [{ ...STATIC_SIGNATURES, itemIds: signatureIds }] : []),
    ...(offers.length > 0 ? [{ ...STATIC_PAIRINGS, itemIds: offers.map((o) => o.id) }] : []),
    ...menu.categories
      .map(
        (c): Section => ({
          id: c.id,
          kind: 'category',
          pill: c.pill,
          title: c.title,
          sub: c.sub.en || c.sub.ar ? c.sub : undefined,
          itemIds: items.filter((i) => i.categoryId === c.id && i.inStock !== false).map((i) => i.id),
        }),
      )
      .filter((s) => s.itemIds.length > 0),
  ]

  return {
    menu,
    categories: menu.categories,
    items,
    itemById,
    sections,
    offers,
    offerById: Object.fromEntries(offers.map((o) => [o.id, o])),
    addOns: menu.addOns,
    addOnById,
    signatureIds,
    oftenOrdered: Object.fromEntries(
      menu.products.map((p) => [p.id, p.oftenOrderedWith.filter(available)]),
    ),
  }
}

let current: Catalog = buildCatalog(buildSeedMenu())
const listeners = new Set<() => void>()

export const getCatalog = (): Catalog => current

export function setCatalog(menu: MenuData): void {
  registerCategoryImages(menu.categories)
  current = buildCatalog(menu)
  listeners.forEach((l) => l())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Subscribes a component to the live public menu. */
export const useCatalog = (): Catalog => useSyncExternalStore(subscribe, getCatalog, getCatalog)

export const getItem = (id: ItemId): Item | undefined => current.itemById[id]
export const getOffer = (id: string): Offer | undefined => current.offerById[id]
