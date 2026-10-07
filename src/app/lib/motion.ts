const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A quick scale up and back with a little spring, played on an element that is already on screen.
// Uses the Web Animations API so it can be replayed on every change without remounting the element
// (which would drop keyboard focus) and without fighting the element's own press transition.
export function bump(el: HTMLElement | null, peak: number, ms = 380): void {
  if (!el || typeof el.animate !== 'function' || reduced()) return
  el.animate(
    [{ transform: 'scale(1)' }, { transform: `scale(${peak})`, offset: 0.4 }, { transform: 'scale(1)' }],
    { duration: ms, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  )
}
