import { useCallback, useMemo, useState } from 'react'
import type { AddOnId, Profile, SizeId } from '../data/types'
import {
  defaultSizeId, isBaristaOn, profileAddOns, profileSizes, showAddOnBlock, showBaristaBlock,
  showSizeBlock, toggleAddOn, toggleBarista,
} from '../lib/options'

export interface OptionsInitial { sizeId?: SizeId; addOnIds?: AddOnId[] }

// One option state per product. Item sheet uses one; the offer sheet uses one per product.
export function useOptions(profile: Profile, initial?: OptionsInitial) {
  const [sizeId, setSizeId] = useState<SizeId | undefined>(initial?.sizeId ?? defaultSizeId(profile))
  const [addOnIds, setAddOnIds] = useState<AddOnId[]>(initial?.addOnIds ?? [])

  const toggle = useCallback((id: AddOnId) => setAddOnIds((s) => toggleAddOn(s, id)), [])
  const toggleBaristaWay = useCallback(() => setAddOnIds((s) => toggleBarista(s)), [])

  return useMemo(
    () => ({
      sizeId,
      setSizeId,
      addOnIds,
      toggleAddOn: toggle,
      toggleBarista: toggleBaristaWay,
      baristaOn: isBaristaOn(addOnIds),
      sizes: profileSizes(profile),
      addOns: profileAddOns(profile),
      showSize: showSizeBlock(profile),
      showAddOns: showAddOnBlock(profile),
      showBarista: showBaristaBlock(profile),
    }),
    [sizeId, addOnIds, toggle, toggleBaristaWay, profile],
  )
}

export type OptionsState = ReturnType<typeof useOptions>
