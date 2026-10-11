import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import useSWR from 'swr'
import { buildSeedMenu } from '../data/seed'
import {
  MENU_SCHEMA_VERSION,
  type AddOn,
  type Item,
  type MenuCategory,
  type MenuData,
  type Offer,
  type PromoPopupConfig,
} from '../data/types'
import { setCatalog, useCatalog } from '../lib/catalog'

// ---------------------------------------------------------------------------
// GitHub REST configuration. These VITE_ variables are compiled into the bundle.
// ---------------------------------------------------------------------------
const env = import.meta.env
const GITHUB_TOKEN: string | undefined = env.VITE_GITHUB_TOKEN || undefined
const GITHUB_OWNER: string = env.VITE_GITHUB_OWNER || 'im-eslam'
const GITHUB_REPO: string = env.VITE_GITHUB_REPO || 'Kuji'
const GITHUB_BRANCH: string = env.VITE_GITHUB_BRANCH || 'main'
const MENU_PATH = 'public/menu.json'
const CONTENTS_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${MENU_PATH}`

export const CAN_COMMIT = Boolean(GITHUB_TOKEN)

const githubHeaders = (): HeadersInit => ({
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
})

// btoa/atob only handle Latin-1, and the menu is full of Arabic, so go through UTF-8 bytes.
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary)
}

function decodeBase64(base64: string): string {
  const binary = atob(base64.replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function friendlyError(status: number): string {
  if (status === 401 || status === 403) return 'Saving is not allowed right now. Please contact support.'
  if (status === 404) return 'The menu file could not be found.'
  if (status === 409 || status === 422) return 'The menu was changed somewhere else. Reload and try again.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  return 'Something went wrong while talking to the server.'
}

/** Fills anything missing so an older or hand-edited file can never crash the dashboard. */
function normalizeMenu(raw: Partial<MenuData>): MenuData {
  const seed = buildSeedMenu()
  return {
    schemaVersion: MENU_SCHEMA_VERSION,
    updatedAt: raw.updatedAt ?? seed.updatedAt,
    categories: raw.categories ?? seed.categories,
    addOns: raw.addOns ?? seed.addOns,
    products: raw.products ?? seed.products,
    signatures: raw.signatures ?? seed.signatures,
    pairings: raw.pairings ?? seed.pairings,
    popup: { ...seed.popup, ...raw.popup },
  }
}

type Source = 'github' | 'static' | 'seed'

interface Snapshot {
  menu: MenuData
  /** Blob sha of the file we last read or wrote. Required by GitHub to update an existing file. */
  sha: string | null
  source: Source
}

async function loadMenu(): Promise<Snapshot> {
  if (GITHUB_TOKEN) {
    const res = await fetch(`${CONTENTS_URL}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
      headers: githubHeaders(),
      cache: 'no-store',
    })
    if (res.ok) {
      const file = (await res.json()) as { content: string; sha: string }
      return {
        menu: normalizeMenu(JSON.parse(decodeBase64(file.content))),
        sha: file.sha,
        source: 'github',
      }
    }
    if (res.status !== 404) throw new Error(friendlyError(res.status))
    return { menu: buildSeedMenu(), sha: null, source: 'seed' }
  }

  try {
    const res = await fetch(`${import.meta.env.BASE_URL}menu.json`, { cache: 'no-store' })
    if (res.ok) {
      return { menu: normalizeMenu(await res.json()), sha: null, source: 'static' }
    }
  } catch {
    // Not valid JSON (dev server answered with index.html): use the bundled copy.
  }
  return { menu: buildSeedMenu(), sha: null, source: 'seed' }
}

const isMenuDocument = (raw: unknown): raw is Partial<MenuData> =>
  typeof raw === 'object' && raw !== null && Array.isArray((raw as MenuData).categories) && Array.isArray((raw as MenuData).products)

async function fetchMenuFrom(url: string, init: RequestInit): Promise<MenuData | null> {
  try {
    const res = await fetch(url, { cache: 'no-store', ...init })
    if (!res.ok) return null
    const raw: unknown = await res.json()
    return isMenuDocument(raw) ? normalizeMenu(raw) : null
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e
    return null
  }
}

/**
 * The published menu. The live file in the GitHub repo wins, so an admin save shows up on the
 * site immediately instead of waiting for a redeploy. The copy shipped with the site is the fallback.
 */
async function fetchPublishedMenu(signal: AbortSignal): Promise<MenuData | null> {
  const live = await fetchMenuFrom(`${CONTENTS_URL}?ref=${encodeURIComponent(GITHUB_BRANCH)}&t=${Date.now()}`, {
    signal,
    headers: { Accept: 'application/vnd.github.raw+json', 'X-GitHub-Api-Version': '2022-11-28' },
  })
  if (live) return live
  return fetchMenuFrom(`${import.meta.env.BASE_URL}menu.json?t=${Date.now()}`, { signal })
}

async function saveMenu(menu: MenuData, sha: string | null, message: string): Promise<string> {
  const res = await fetch(CONTENTS_URL, {
    method: 'PUT',
    headers: { ...githubHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: encodeBase64(JSON.stringify(menu, null, 2) + '\n'),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  })
  if (!res.ok) throw new Error(friendlyError(res.status))
  const result = (await res.json()) as { content: { sha: string } }
  return result.content.sha
}

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------
export type ToastKind = 'success' | 'error' | 'info'
export interface Toast {
  id: number
  kind: ToastKind
  message: string
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface MenuContextValue {
  /** Public menu, always the published copy (or the bundled fallback). */
  categories: MenuCategory[]
  items: Item[]
  addons: AddOn[]
  offers: Offer[]
  popup: PromoPopupConfig
  isLoading: boolean
  isSaving: boolean
  updateMenuData: (recipe: (draft: MenuData) => MenuData) => void
  /** Admin working copy. Null until the admin data has loaded. */
  menu: MenuData | null
  /** Number of individual edits waiting to be committed. */
  pendingChanges: number
  status: 'loading' | 'ready' | 'error'
  error: string | null
  source: Source | null
  canCommit: boolean
  dirty: boolean
  saving: boolean
  /** Replaces the working copy with the result of `recipe`. Nothing is saved until `commit`. */
  update: (recipe: (draft: MenuData) => MenuData) => void
  discard: () => void
  commit: (message?: string) => Promise<boolean>
  reload: () => Promise<void>
  toasts: Toast[]
  notify: (kind: ToastKind, message: string) => void
  dismissToast: (id: number) => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used inside <MenuProvider>')
  return ctx
}

/** Same as useMenu, for screens that only render once the menu has loaded. */
export function useLoadedMenu(): Omit<MenuContextValue, 'menu'> & { menu: MenuData } {
  const ctx = useMenu()
  if (!ctx.menu) throw new Error('Menu is not loaded yet')
  return ctx as Omit<MenuContextValue, 'menu'> & { menu: MenuData }
}

export function MenuProvider({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { data, error, isLoading: adminLoading, mutate } = useSWR<Snapshot>(admin ? 'kuji:menu' : null, loadMenu, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })

  // Public site: fetch the published menu.json once on mount, fall back to the bundled copy if it is unavailable.
  const [publicLoading, setPublicLoading] = useState(!admin)
  useEffect(() => {
    if (admin) return
    const controller = new AbortController()
    fetchPublishedMenu(controller.signal)
      .then((published) => {
        if (published) setCatalog(published)
      })
      .catch((e: unknown) => {
        if (!(e instanceof DOMException && e.name === 'AbortError')) setCatalog(buildSeedMenu())
      })
      .finally(() => {
        if (!controller.signal.aborted) setPublicLoading(false)
      })
    return () => controller.abort()
  }, [admin])
  const catalog = useCatalog()
  const isLoading = admin ? adminLoading : publicLoading

  const [draft, setDraft] = useState<MenuData | null>(null)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextToastId = useRef(1)

  const dismissToast = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextToastId.current++
      setToasts((list) => [...list.slice(-3), { id, kind, message }])
      window.setTimeout(() => dismissToast(id), kind === 'error' ? 6000 : 3500)
    },
    [dismissToast],
  )

  const saved = data?.menu ?? null
  const menu = draft ?? saved
  const dirty = useMemo(
    () => draft !== null && saved !== null && JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved],
  )

  const update = useCallback(
    (recipe: (current: MenuData) => MenuData) => {
      setDraft((current) => {
        const base = current ?? data?.menu
        return base ? recipe(base) : current
      })
    },
    [data?.menu],
  )

  const discard = useCallback(() => {
    setDraft(null)
    notify('info', 'Changes discarded.')
  }, [notify])

  const reload = useCallback(async () => {
    setDraft(null)
    await mutate(undefined, { revalidate: true })
  }, [mutate])

  const commit = useCallback(
    async (message?: string): Promise<boolean> => {
      if (!draft || !data) return false
      if (!CAN_COMMIT) {
        notify('error', 'Publishing is not set up on this site yet.')
        return false
      }
      setSaving(true)
      try {
        const next: MenuData = { ...draft, updatedAt: new Date().toISOString() }
        const sha = await saveMenu(
          next,
          data.sha,
          message ?? `Update menu from admin dashboard (${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC)`,
        )
        await mutate({ menu: next, sha, source: 'github' }, { revalidate: false })
        setDraft(null)
        notify('success', 'Menu published. It can take a minute to appear on the live site.')
        return true
      } catch (e) {
        notify('error', e instanceof Error ? e.message : 'Could not publish your changes.')
        return false
      } finally {
        setSaving(false)
      }
    },
    [draft, data, mutate, notify],
  )

  const value = useMemo<MenuContextValue>(
    () => ({
      categories: catalog.categories,
      items: catalog.items,
      addons: catalog.addOns,
      offers: catalog.offers,
      popup: catalog.menu.popup,
      isLoading,
      isSaving: saving,
      updateMenuData: update,
      pendingChanges: dirty ? 1 : 0,
      menu,
      status: error ? 'error' : isLoading || !menu ? 'loading' : 'ready',
      error: error instanceof Error ? error.message : error ? 'Could not load the menu.' : null,
      source: data?.source ?? null,
      canCommit: CAN_COMMIT,
      dirty,
      saving,
      update,
      discard,
      commit,
      reload,
      toasts,
      notify,
      dismissToast,
    }),
    [catalog, menu, error, isLoading, data?.source, dirty, saving, update, discard, commit, reload, toasts, notify, dismissToast],
  )

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
