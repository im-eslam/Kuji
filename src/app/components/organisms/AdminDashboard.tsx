import { useEffect, useState, type FormEvent } from 'react'
import { Lock, LogOut, Rocket, Undo2 } from 'lucide-react'
import { cx } from '../../lib/cx'
import { MenuProvider, useMenu } from '../../state/MenuContext'
import AddOnsTab from './admin/AddOnsTab'
import CategoriesTab from './admin/CategoriesTab'
import CurationTab from './admin/CurationTab'
import MarketingTab from './admin/MarketingTab'
import ProductsTab from './admin/ProductsTab'
import { Button, Field, Pill, Spinner, TextInput, Toaster } from './admin/ui'

const ADMIN_PASSWORD: string = import.meta.env.VITE_ADMIN_PASSWORD || 'kuji2026'
const SESSION_KEY = 'kuji.admin.session'

async function digest(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(`kuji:${text}`)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('')
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setChecking(true)
    const ok = value === ADMIN_PASSWORD
    if (ok) {
      localStorage.setItem(SESSION_KEY, await digest(ADMIN_PASSWORD))
      onUnlock()
    } else {
      setError(true)
      setChecking(false)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-950 p-6">
      <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-yellow text-navy">
          <Lock className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-zinc-50">Kuji admin</h1>
          <p className="mt-1 text-sm text-zinc-400">Enter the password to manage the menu.</p>
        </div>
        <Field label="Password">
          {(id) => (
            <TextInput
              id={id}
              type="password"
              autoFocus
              autoComplete="current-password"
              value={value}
              aria-invalid={error}
              onChange={(e) => {
                setValue(e.target.value)
                setError(false)
              }}
            />
          )}
        </Field>
        {error && (
          <p role="alert" className="-mt-2 text-sm text-red-400">
            That password is not right. Try again.
          </p>
        )}
        <Button variant="primary" type="submit" loading={checking} disabled={value === ''}>
          Unlock
        </Button>
      </form>
    </main>
  )
}

const TABS = [
  { id: 'categories', label: 'Categories', Panel: CategoriesTab },
  { id: 'addons', label: 'Add-ons', Panel: AddOnsTab },
  { id: 'products', label: 'Products', Panel: ProductsTab },
  { id: 'curation', label: 'Curation', Panel: CurationTab },
  { id: 'marketing', label: 'Marketing', Panel: MarketingTab },
] as const

type TabId = (typeof TABS)[number]['id']

function StatusPill() {
  const { dirty, source, canCommit } = useMenu()
  if (dirty) return <Pill tone="yellow">Unsaved changes</Pill>
  if (!canCommit) return <Pill>View only</Pill>
  if (source === 'github') return <Pill tone="green">Published</Pill>
  return <Pill>Not published yet</Pill>
}

function Shell({ onLock }: { onLock: () => void }) {
  const { status, error, dirty, saving, canCommit, discard, commit, reload } = useMenu()
  const [tab, setTab] = useState<TabId>('categories')
  const Panel = TABS.find((t) => t.id === tab)?.Panel ?? CategoriesTab

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <Toaster />
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-yellow text-sm font-bold text-navy">K</span>
            <h1 className="truncate text-base font-semibold text-zinc-50">Kuji menu admin</h1>
            {status === 'ready' && <StatusPill />}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={discard} disabled={!dirty || saving}>
              <Undo2 className="size-4" aria-hidden="true" />
              Discard
            </Button>
            <Button size="sm" variant="primary" onClick={() => void commit()} disabled={!dirty || !canCommit} loading={saving}>
              {!saving && <Rocket className="size-4" aria-hidden="true" />}
              {saving ? 'Publishing' : 'Publish'}
            </Button>
            <Button size="sm" variant="ghost" onClick={onLock} aria-label="Lock dashboard">
              <LogOut className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <nav aria-label="Sections" className="mx-auto max-w-5xl overflow-x-auto px-4 no-scrollbar sm:px-6">
          <ul className="flex gap-1">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  aria-current={tab === t.id ? 'page' : undefined}
                  onClick={() => setTab(t.id)}
                  className={cx(
                    'relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-yellow',
                    tab === t.id ? 'text-yellow' : 'text-zinc-400 hover:text-zinc-100',
                  )}
                >
                  {t.label}
                  {tab === t.id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-yellow" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {!canCommit && status === 'ready' && (
          <p className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-400">
            Publishing is not set up on this site, so changes can be edited here but not saved.
          </p>
        )}
        {status === 'loading' && (
          <div className="flex items-center justify-center gap-3 py-24 text-sm text-zinc-400" role="status">
            <Spinner className="size-5" />
            Loading your menu
          </div>
        )}
        {status === 'error' && (
          <div role="alert" className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-sm text-zinc-300">{error}</p>
            <Button onClick={() => void reload()}>Try again</Button>
          </div>
        )}
        {status === 'ready' && <Panel />}
      </main>
    </div>
  )
}

function AdminGate() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    void digest(ADMIN_PASSWORD).then((expected) => {
      if (!cancelled) setUnlocked(localStorage.getItem(SESSION_KEY) === expected)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (unlocked === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-950 text-zinc-400" role="status">
        <Spinner className="size-5" />
      </div>
    )
  }
  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />
  return (
    <Shell
      onLock={() => {
        localStorage.removeItem(SESSION_KEY)
        setUnlocked(false)
      }}
    />
  )
}

export default function AdminDashboard() {
  return (
    <MenuProvider>
      <AdminGate />
    </MenuProvider>
  )
}
