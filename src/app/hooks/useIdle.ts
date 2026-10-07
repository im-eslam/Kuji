import { useEffect, useState } from 'react'

/**
 * False on first render, true once the browser is idle (or after `fallbackMs` where requestIdleCallback is missing).
 * Used to mount things the person cannot see yet after the first paint instead of before it.
 */
export function useIdle(fallbackMs = 200): boolean {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void }
    if (w.requestIdleCallback) {
      const h = w.requestIdleCallback(() => setIdle(true), { timeout: 1500 })
      return () => w.cancelIdleCallback?.(h)
    }
    const h = window.setTimeout(() => setIdle(true), fallbackMs)
    return () => window.clearTimeout(h)
  }, [fallbackMs])
  return idle
}
