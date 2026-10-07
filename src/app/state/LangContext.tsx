import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { StringKey } from '../data/strings'
import type { L10n, Lang } from '../data/types'
import { formatMoney, translate } from '../lib/i18n'

interface LangValue {
  lang: Lang
  dir: 'ltr' | 'rtl'
  setLang: (l: Lang) => void
  t: (key: StringKey, vars?: Record<string, string | number>) => string
  money: (n: number, opts?: { plus?: boolean }) => string
  pick: (l: L10n) => string
}

const Ctx = createContext<LangValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])
  const t = useCallback<LangValue['t']>((k, v) => translate(lang, k, v), [lang])
  const money = useCallback<LangValue['money']>((n, o) => formatMoney(lang, n, o), [lang])
  const pick = useCallback((l: L10n) => l[lang], [lang])
  const value = useMemo(() => ({ lang, dir, setLang, t, money, pick }) as LangValue, [lang, dir, t, money, pick])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang(): LangValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useLang outside LangProvider')
  return v
}
