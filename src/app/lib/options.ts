import { ADDONS, BARISTAS_WAY, SIZES } from '../data/addons'
import type { AddOn, AddOnId, Profile, Size } from '../data/types'

const ADDON_ORDER = new Map(ADDONS.map((a, i) => [a.id, i]))
export const ADDON_BY_ID = new Map(ADDONS.map((a) => [a.id, a]))
export const SIZE_BY_ID = new Map(SIZES.map((s) => [s.id, s]))

export const sortAddOns = (ids: AddOnId[]): AddOnId[] =>
  [...ids].sort((a, b) => (ADDON_ORDER.get(a) ?? 0) - (ADDON_ORDER.get(b) ?? 0))

export const profileSizes = (p: Profile): Size[] =>
  p.sizes.map((id) => SIZE_BY_ID.get(id)).filter((s): s is Size => !!s)

export const profileAddOns = (p: Profile): AddOn[] =>
  p.addOns.map((id) => ADDON_BY_ID.get(id)).filter((a): a is AddOn => !!a)

export const showSizeBlock = (p: Profile): boolean => p.sizes.length >= 2
export const showAddOnBlock = (p: Profile): boolean => p.addOns.length > 0
export const showBaristaBlock = (p: Profile): boolean =>
  p.baristaWay && BARISTAS_WAY.addOns.every((id) => p.addOns.includes(id))
export const profileHasOptions = (p: Profile): boolean =>
  showSizeBlock(p) || showAddOnBlock(p) || showBaristaBlock(p)

export const defaultSizeId = (p: Profile): string | undefined => p.sizes[0]

export const toggleAddOn = (selected: AddOnId[], id: AddOnId): AddOnId[] =>
  selected.includes(id) ? selected.filter((x) => x !== id) : sortAddOns([...selected, id])

export const isBaristaOn = (selected: AddOnId[]): boolean =>
  BARISTAS_WAY.addOns.every((id) => selected.includes(id))

export function toggleBarista(selected: AddOnId[]): AddOnId[] {
  if (isBaristaOn(selected)) return selected.filter((id) => !BARISTAS_WAY.addOns.includes(id))
  return sortAddOns([...new Set([...selected, ...BARISTAS_WAY.addOns])])
}

export const baristaPrice = (): number =>
  BARISTAS_WAY.addOns.reduce((sum, id) => sum + (ADDON_BY_ID.get(id)?.price ?? 0), 0)
