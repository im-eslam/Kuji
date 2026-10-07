import { createContext, useContext } from 'react'

interface SheetValue {
  /** The sheet's in-content title registers itself, so the sheet can tell how far it has scrolled out of view. */
  registerTitle: (el: HTMLElement | null) => void
}

export const SheetCtx = createContext<SheetValue | null>(null)

export function useSheet(): SheetValue {
  const v = useContext(SheetCtx)
  if (!v) throw new Error('useSheet outside BottomSheet')
  return v
}
