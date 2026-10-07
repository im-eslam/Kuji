import { useLayoutEffect, useState, type RefObject } from 'react'

// True when the element's text wraps past one line. Measured before paint and re-measured whenever the
// element is resized (viewport change, language switch), so a card can decide how much room its description gets.
export function useMultiline(ref: RefObject<HTMLElement | null>, text: string): boolean {
  const [multi, setMulti] = useState(false)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 24
      setMulti(el.scrollHeight > lh * 1.5)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, text])
  return multi
}
