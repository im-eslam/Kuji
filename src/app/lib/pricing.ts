import { ITEM_BY_ID } from '../data/menu'
import { OFFERS } from '../data/offers'
import type { Item, Offer, OrderLine, OrderPart } from '../data/types'
import { ADDON_BY_ID, SIZE_BY_ID, defaultSizeId, sortAddOns } from './options'

export const SHEET_QTY_MAX = 20
export const LINE_QTY_MAX = 99
export const OFFER_BY_ID: Record<string, Offer> = Object.fromEntries(OFFERS.map((o) => [o.id, o]))

export const partExtras = (part: OrderPart): number =>
  (part.sizeId ? SIZE_BY_ID.get(part.sizeId)?.upcharge ?? 0 : 0) +
  part.addOnIds.reduce((s, id) => s + (ADDON_BY_ID.get(id)?.price ?? 0), 0)

export const defaultPart = (item: Item): OrderPart => ({ itemId: item.id, sizeId: defaultSizeId(item.profile), addOnIds: [] })

export const itemUnit = (part: OrderPart): number | null => {
  const base = ITEM_BY_ID[part.itemId].price
  return base === null ? null : base + partExtras(part)
}

export const offerRegularBase = (offer: Offer): number =>
  offer.items.reduce((s, id) => s + (ITEM_BY_ID[id].price ?? 0), 0)
export const offerBase = (offer: Offer): number => offer.offerPrice ?? offerRegularBase(offer)
export const offerSavings = (offer: Offer): number =>
  offer.offerPrice === undefined ? 0 : Math.max(0, offerRegularBase(offer) - offer.offerPrice)
export const offerExtras = (parts: OrderPart[]): number => parts.reduce((s, p) => s + partExtras(p), 0)
export const offerUnit = (offer: Offer, parts: OrderPart[]): number => offerBase(offer) + offerExtras(parts)
export const offerRegular = (offer: Offer, parts: OrderPart[]): number => offerRegularBase(offer) + offerExtras(parts)
export const offerIsDiscounted = (offer: Offer): boolean => offerSavings(offer) > 0

export function lineUnit(line: OrderLine): number | null {
  if (line.kind === 'item') return itemUnit(line.parts[0])
  return offerUnit(OFFER_BY_ID[line.refId], line.parts)
}
export const lineWas = (line: OrderLine): number | null => {
  if (line.kind !== 'bundle') return null
  const offer = OFFER_BY_ID[line.refId]
  return offerIsDiscounted(offer) ? offerRegular(offer, line.parts) : null
}
export const lineTotal = (line: OrderLine): number => (lineUnit(line) ?? 0) * line.qty
export const subtotal = (lines: OrderLine[]): number => lines.reduce((s, l) => s + lineTotal(l), 0)
export const hasUnpriced = (lines: OrderLine[]): boolean => lines.some((l) => lineUnit(l) === null)
export const itemCount = (lines: OrderLine[]): number => lines.reduce((s, l) => s + l.qty, 0)

const partKey = (p: OrderPart) => `${p.itemId}~${p.sizeId ?? ''}~${sortAddOns(p.addOnIds).join(',')}`
export const lineKey = (kind: OrderLine['kind'], refId: string, parts: OrderPart[]): string =>
  `${kind}:${refId}:${parts.map(partKey).join('|')}`

export function makeLine(kind: OrderLine['kind'], refId: string, parts: OrderPart[], qty: number): OrderLine {
  const clean = parts.map((p) => ({ ...p, addOnIds: sortAddOns(p.addOnIds) }))
  return { key: lineKey(kind, refId, clean), kind, refId, qty, parts: clean }
}

export const lineTitleParts = (line: OrderLine): string[] => line.parts.map((p) => p.itemId)
