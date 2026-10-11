import type { AddOn, AddOnId, Profile, Size } from '../data/types'
import { getCatalog } from './catalog'

export const getAddOn = (id: AddOnId): AddOn | undefined => getCatalog().addOnById.get(id)

export const sortAddOns = (ids: AddOnId[]): AddOnId[] => {
  const order = new Map(getCatalog().addOns.map((a, i) => [a.id, i]))
  return [...ids].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
}

export const profileSizes = (p: Profile): Size[] => p.sizeDefs ?? []

export const profileAddOns = (p: Profile): AddOn[] =>
  p.addOns.map(getAddOn).filter((a): a is AddOn => !!a)

const baristaIds = (p: Profile): AddOnId[] => p.baristaAddOns ?? []

export const showSizeBlock = (p: Profile): boolean => p.sizes.length >= 2
export const showAddOnBlock = (p: Profile): boolean => p.addOns.length > 0
export const showBaristaBlock = (p: Profile): boolean =>
  p.baristaWay && baristaIds(p).length > 0 && baristaIds(p).every((id) => p.addOns.includes(id))
export const profileHasOptions = (p: Profile): boolean =>
  showSizeBlock(p) || showAddOnBlock(p) || showBaristaBlock(p)

export const defaultSizeId = (p: Profile): string | undefined => p.sizes[0]

export const toggleAddOn = (selected: AddOnId[], id: AddOnId): AddOnId[] =>
  selected.includes(id) ? selected.filter((x) => x !== id) : sortAddOns([...selected, id])

export const isBaristaOn = (selected: AddOnId[], p: Profile): boolean =>
  baristaIds(p).length > 0 && baristaIds(p).every((id) => selected.includes(id))

export function toggleBarista(selected: AddOnId[], p: Profile): AddOnId[] {
  const preset = baristaIds(p)
  if (isBaristaOn(selected, p)) return selected.filter((id) => !preset.includes(id))
  return sortAddOns([...new Set([...selected, ...preset])])
}

export const baristaPrice = (p: Profile): number =>
  baristaIds(p).reduce((sum, id) => sum + (getAddOn(id)?.price ?? 0), 0)

export const baristaNames = (p: Profile) =>
  baristaIds(p).flatMap((id) => {
    const a = getAddOn(id)
    return a ? [a.name] : []
  })
