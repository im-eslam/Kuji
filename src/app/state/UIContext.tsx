import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

/** How long an overlay plays its exit before it unmounts. Matches the sheet's exit transition (200ms, ~25% under its 260ms entrance). */
export const EXIT_MS = 200

export type Overlay =
  | { type: 'none' }
  | { type: 'item'; itemId: string; editKey?: string; instant?: boolean }
  | { type: 'offer'; offerId: string; editKey?: string; instant?: boolean }
  | { type: 'categories' }
  | { type: 'order'; instant?: boolean }
  | { type: 'search' }

interface UIValue {
  overlay: Overlay
  openItem: (id: string) => void
  openOffer: (id: string) => void
  openCategories: () => void
  openOrder: () => void
  openSearch: () => void
  editLine: (kind: 'item' | 'bundle', refId: string, key: string) => void
  /** Edit sheet -> order sheet, swapped in place with no animation. */
  swapToOrder: (focusKey?: string) => void
  close: () => void
  /** True while the open overlay is playing its exit animation. */
  closing: boolean
  focusLineKey: string | null
  clearFocusLine: () => void
  liveMessage: string
  announce: (msg: string) => void
}

const Ctx = createContext<UIValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>({ type: 'none' })
  const [focusLineKey, setFocusLineKey] = useState<string | null>(null)
  const [liveMessage, setLive] = useState('')
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const timer = useRef(0)

  // Every open/swap cancels a pending exit so a late timer can never close the new overlay.
  const show = useCallback((o: Overlay) => {
    window.clearTimeout(timer.current)
    closingRef.current = false
    setClosing(false)
    setOverlay(o)
  }, [])

  // Plays the exit, then unmounts. A second close request while closing is ignored.
  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    timer.current = window.setTimeout(() => {
      closingRef.current = false
      setClosing(false)
      setOverlay({ type: 'none' })
    }, EXIT_MS)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const announce = useCallback((msg: string) => {
    setLive('')
    window.setTimeout(() => setLive(msg), 30)
  }, [])

  // Stable for the life of the app, so memoised cards that receive them never re-render when an overlay opens or closes.
  const openItem = useCallback((itemId: string) => show({ type: 'item', itemId }), [show])
  const openOffer = useCallback((offerId: string) => show({ type: 'offer', offerId }), [show])
  const openCategories = useCallback(() => show({ type: 'categories' }), [show])
  const openOrder = useCallback(() => show({ type: 'order' }), [show])
  const openSearch = useCallback(() => show({ type: 'search' }), [show])
  const editLine = useCallback<UIValue['editLine']>(
    (kind, refId, key) =>
      show(kind === 'item' ? { type: 'item', itemId: refId, editKey: key, instant: true } : { type: 'offer', offerId: refId, editKey: key, instant: true }),
    [show],
  )
  const swapToOrder = useCallback((focusKey?: string) => {
    setFocusLineKey(focusKey ?? null)
    show({ type: 'order', instant: true })
  }, [show])
  const clearFocusLine = useCallback(() => setFocusLineKey(null), [])

  const value = useMemo<UIValue>(
    () => ({
      overlay, openItem, openOffer, openCategories, openOrder, openSearch, editLine, swapToOrder,
      close, closing, focusLineKey, clearFocusLine, liveMessage, announce,
    }),
    [overlay, openItem, openOffer, openCategories, openOrder, openSearch, editLine, swapToOrder, close, closing, focusLineKey, clearFocusLine, liveMessage, announce],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useUI(): UIValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useUI outside UIProvider')
  return v
}
