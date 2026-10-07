import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'

export const DRAG_CLOSE_PX = 96
/** A quick downward flick closes the sheet even when it did not travel far. */
const FLICK_PX_PER_MS = 0.6
const FLICK_MIN_PX = 24
/** Movement before a touch counts as a drag, so taps and sideways swipes are left alone. */
const SLOP_PX = 8

// Swipe the sheet down to close it:
//  - Touch, anywhere on the sheet: on the top bar and footer at once; on the scrolling content only when it is
//    already at the top, so pulling down at the top dismisses and scrolling up through content still scrolls.
//  - Mouse, on the top bar only (there is no scroll gesture to compete with).
// Release past DRAG_CLOSE_PX, or with a quick flick, closes; otherwise the sheet springs back.
export function useSheetDrag(sheetRef: RefObject<HTMLElement | null>, scrollerRef: RefObject<HTMLElement | null>, onClose: () => void) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose })

  // Touch: native listeners, because a touchmove can only be cancelled (to stop the page scrolling) when it is not passive.
  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return
    let armed = false
    let tracking = false
    let startX = 0, startY = 0, startT = 0, travelled = 0

    const reset = () => { armed = false; tracking = false; travelled = 0; setDragging(false); setOffset(0) }

    const onStart = (e: TouchEvent) => {
      armed = false
      tracking = false
      if (e.touches.length !== 1) return
      const scroller = scrollerRef.current
      const inScroller = !!scroller && scroller.contains(e.target as Node)
      armed = !inScroller || (scroller?.scrollTop ?? 0) <= 0
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      startT = e.timeStamp
    }
    const onMove = (e: TouchEvent) => {
      if (!armed) return
      const dx = e.touches[0].clientX - startX
      const dy = e.touches[0].clientY - startY
      if (!tracking) {
        if (dy < -SLOP_PX || (Math.abs(dx) > SLOP_PX && Math.abs(dx) > Math.abs(dy))) { armed = false; return }
        if (dy < SLOP_PX) return
        tracking = true
        setDragging(true)
      }
      e.preventDefault()
      travelled = Math.max(0, dy - SLOP_PX)
      setOffset(travelled)
    }
    const onEnd = (e: TouchEvent) => {
      if (!tracking) { armed = false; return }
      const dy = travelled
      const speed = dy / Math.max(1, e.timeStamp - startT)
      reset()
      if (dy > DRAG_CLOSE_PX || (dy > FLICK_MIN_PX && speed > FLICK_PX_PER_MS)) onCloseRef.current()
    }

    sheet.addEventListener('touchstart', onStart, { passive: true })
    sheet.addEventListener('touchmove', onMove, { passive: false })
    sheet.addEventListener('touchend', onEnd)
    sheet.addEventListener('touchcancel', reset)
    return () => {
      sheet.removeEventListener('touchstart', onStart)
      sheet.removeEventListener('touchmove', onMove)
      sheet.removeEventListener('touchend', onEnd)
      sheet.removeEventListener('touchcancel', reset)
    }
  }, [sheetRef, scrollerRef])

  // Mouse: pointer events on the top bar. Buttons inside it (close) keep their own click.
  const mouseY = useRef<number | null>(null)
  const onPointerDown = useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || (e.target as HTMLElement).closest('button')) return
    mouseY.current = e.clientY
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])
  const onPointerMove = useCallback((e: PointerEvent<HTMLElement>) => {
    if (mouseY.current === null) return
    setOffset(Math.max(0, e.clientY - mouseY.current))
  }, [])
  const onPointerEnd = useCallback((e: PointerEvent<HTMLElement>) => {
    if (mouseY.current === null) return
    const dy = e.clientY - mouseY.current
    mouseY.current = null
    setDragging(false)
    setOffset(0)
    if (dy > DRAG_CLOSE_PX) onCloseRef.current()
  }, [])

  return { offset, dragging, barHandlers: { onPointerDown, onPointerMove, onPointerUp: onPointerEnd, onPointerCancel: onPointerEnd } }
}
