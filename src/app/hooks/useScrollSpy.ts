import { useCallback, useEffect, useRef, useState } from 'react'

/** Fallback only (6.5rem at the default 16px). The header is sized in rem, so the live height is measured. */
const HEADER_FALLBACK = 104
const SPY_OFFSET = 32
export const headerHeight = () => document.querySelector('header')?.getBoundingClientRect().height ?? HEADER_FALLBACK
const RESUME_MS = 150

export const sectionDomId = (id: string) => `section-${id}`

// Scroll-spy over page sections plus the single programmatic scroll entry point.
export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
  document.body.style.overflow = ''
  if (id === 'signatures') return window.scrollTo({ top: 0, behavior })
  const el = document.getElementById(sectionDomId(id))
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - headerHeight() + 8
  window.scrollTo({ top: Math.max(0, y), behavior })
}

export function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0])
  const paused = useRef(false)
  const timer = useRef<number>(0)
  const idsRef = useRef(ids)
  idsRef.current = ids

  const compute = useCallback(() => {
    const list = idsRef.current
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
    if (atBottom && window.scrollY > 0) return setActiveId(list[list.length - 1])
    let current = list[0]
    const offset = headerHeight() + SPY_OFFSET
    for (const id of list) {
      const el = document.getElementById(sectionDomId(id))
      if (!el) continue
      if (el.getBoundingClientRect().top <= offset) current = id
      else break
    }
    setActiveId(current)
  }, [])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (paused.current) {
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => { paused.current = false; compute() }, RESUME_MS)
        return
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      window.clearTimeout(timer.current)
    }
  }, [compute])

  const goTo = useCallback((id: string) => {
    paused.current = true
    setActiveId(id)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => { paused.current = false; compute() }, RESUME_MS)
    scrollToSection(id)
  }, [compute])

  return { activeId, goTo }
}
