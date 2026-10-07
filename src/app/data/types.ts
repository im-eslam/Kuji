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
