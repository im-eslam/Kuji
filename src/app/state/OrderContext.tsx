import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { OrderLine } from '../data/types'
import { LINE_QTY_MAX, itemCount, subtotal, hasUnpriced } from '../lib/pricing'

type Action =
  | { type: 'add'; line: OrderLine }
  | { type: 'update'; oldKey: string; line: OrderLine }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }

const cap = (n: number) => Math.min(LINE_QTY_MAX, n)

export function orderReducer(lines: OrderLine[], a: Action): OrderLine[] {
  switch (a.type) {
    case 'add': {
      const i = lines.findIndex((l) => l.key === a.line.key)
      if (i < 0) return [...lines, { ...a.line, qty: cap(a.line.qty) }]
      return lines.map((l, j) => (j === i ? { ...l, qty: cap(l.qty + a.line.qty) } : l))
    }
    case 'update': {
      const at = lines.findIndex((l) => l.key === a.oldKey)
      if (at < 0) return lines
      const other = lines.findIndex((l, j) => j !== at && l.key === a.line.key)
      if (other >= 0) {
        // Merge into the existing line, quantities add (capped); the edited line goes away.
        return lines
          .map((l, j) => (j === other ? { ...l, qty: cap(l.qty + a.line.qty) } : l))
          .filter((_, j) => j !== at)
      }
      return lines.map((l, j) => (j === at ? { ...a.line, qty: cap(a.line.qty) } : l))
    }
    case 'setQty':
      return a.qty < 1 ? lines.filter((l) => l.key !== a.key) : lines.map((l) => (l.key === a.key ? { ...l, qty: cap(a.qty) } : l))
    case 'remove':
      return lines.filter((l) => l.key !== a.key)
    case 'clear':
      return []
  }
}

interface OrderValue {
  lines: OrderLine[]
  count: number
  subtotal: number
  hasUnpriced: boolean
  add: (line: OrderLine) => void
  updateLine: (oldKey: string, line: OrderLine) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const Ctx = createContext<OrderValue | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(orderReducer, [])
  const value = useMemo<OrderValue>(
    () => ({
      lines,
      count: itemCount(lines),
      subtotal: subtotal(lines),
      hasUnpriced: hasUnpriced(lines),
      add: (line) => dispatch({ type: 'add', line }),
      updateLine: (oldKey, line) => dispatch({ type: 'update', oldKey, line }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [lines],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useOrder(): OrderValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useOrder outside OrderProvider')
  return v
}
