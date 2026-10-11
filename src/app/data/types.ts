export type Lang = 'en' | 'ar'
export type L10n = { en: string; ar: string }
export type SizeId = string
export type AddOnId = string
export type ItemId = string
export type BadgeKind = 'new' | 'top'
export type AddOnScope = 'drinks' | 'bakery' | 'all'

export interface Size { id: SizeId; name: L10n; upcharge: number }
export interface AddOn { id: AddOnId; name: L10n; price: number; scope: AddOnScope }
export interface Profile { sizes: SizeId[]; addOns: AddOnId[]; baristaWay: boolean }
export interface Preset { id: string; name: L10n; addOns: AddOnId[] }

export interface Item {
  id: ItemId
  name: L10n
  desc: L10n
  price: number | null
  kind: 'drink' | 'food'
  badge?: BadgeKind
  profile: Profile
  categoryId: string
}

export interface Offer { id: string; items: [ItemId, ItemId]; offerPrice?: number }

export interface Section {
  id: string
  kind: 'signatures' | 'pairings' | 'category'
  pill: L10n
  title: L10n
  sub?: L10n
  itemIds: ItemId[]
}

export interface OrderPart { itemId: ItemId; sizeId?: SizeId; addOnIds: AddOnId[] }
export interface OrderLine {
  key: string
  kind: 'item' | 'bundle'
  refId: string
  qty: number
  parts: OrderPart[]
}

// ---------------------------------------------------------------------------
// Admin / master menu schema (public/menu.json)
// Everything the owner can edit lives in one MenuData document, committed to GitHub as a single file.
// ---------------------------------------------------------------------------

export const MENU_SCHEMA_VERSION = 1

/** 'delta' = added on top of the base price. 'standalone' = the full price for that size. */
export type SizePriceMode = 'delta' | 'standalone'

export interface SizeTier {
  id: SizeId
  name: L10n
  mode: SizePriceMode
  value: number
}

export interface BaristaWayConfig {
  enabled: boolean
  /** The add-ons pre-selected when the guest taps "Make it the Barista's Way". */
  addOns: AddOnId[]
}

export interface MenuCategory {
  id: string
  kind: 'drink' | 'food'
  /** Short label in the header pill scroller. Array order in MenuData.categories drives the pill order. */
  pill: L10n
  title: L10n
  sub: L10n
  /** Asset path or full URL of the category photo. */
  image: string
  isPopular: boolean
}

export interface MenuProduct {
  id: ItemId
  categoryId: string
  name: L10n
  /** Two short lines at most. */
  desc: L10n
  /** null = "Price on Selection" (e.g. pour-over, priced after the guest picks a bean). */
  price: number | null
  sizes: SizeTier[]
  baristaWay: BaristaWayConfig
  /** "Often Ordered With" cross-sell suggestions. */
  oftenOrderedWith: ItemId[]
  /** Add-ons that would normally apply through scope but are switched off for this product. */
  excludedAddOns: AddOnId[]
  inStock: boolean
  badge?: BadgeKind
}

export interface MenuPairing {
  id: string
  items: [ItemId, ItemId]
  /** null = no bundle price: the guest simply pays the sum of both items and no savings chip shows. */
  bundlePrice: number | null
}

export interface PromoPopupConfig {
  enabled: boolean
  image: string
  title: L10n
  body: L10n
  ctaLabel: L10n
  ctaUrl: string
  delaySeconds: number
}

export interface MenuData {
  schemaVersion: number
  updatedAt: string
  categories: MenuCategory[]
  addOns: AddOn[]
  products: MenuProduct[]
  /** Ordered ids of the products featured in the Signatures carousel. */
  signatures: ItemId[]
  pairings: MenuPairing[]
  popup: PromoPopupConfig
}
