import { STRINGS, type StringKey } from '../data/strings'
import type { L10n, Lang } from '../data/types'

export function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text
  return text.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
}

export function translate(lang: Lang, key: StringKey, vars?: Record<string, string | number>): string {
  return interpolate(STRINGS[key][lang], vars)
}

export const pick = (l: L10n, lang: Lang): string => l[lang]

// Whole EGP only. Arabic: "130 ج.م" with Western digits (assumption).
export function formatMoney(lang: Lang, amount: number, opts: { plus?: boolean } = {}): string {
  const n = Math.round(amount)
  const sign = opts.plus ? '+' : ''
  return lang === 'ar' ? `${sign}${n} ج.م` : `${sign}EGP ${n}`
}
