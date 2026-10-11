import { ADDONS, BARISTAS_WAY, SIZES } from './addons'
import { ITEMS, OFTEN_ORDERED, SECTIONS, SIGNATURE_IDS } from './menu'
import { OFFERS } from './offers'
import { POPUP } from './popup'
import {
  MENU_SCHEMA_VERSION,
  type MenuCategory,
  type MenuData,
  type MenuProduct,
  type SizeTier,
} from './types'
import { scopeMatches } from '../lib/menuLogic'

/**
 * Builds the starting menu.json from the data that ships with the public menu.
 * Used to generate public/menu.json and as the in-app fallback while that file does not exist yet.
 */
export function buildSeedMenu(): MenuData {
  const categories: MenuCategory[] = SECTIONS.filter((s) => s.kind === 'category').map((s) => {
    const first = ITEMS.find((i) => i.categoryId === s.id)
    return {
      id: s.id,
      kind: first?.kind ?? 'drink',
      pill: s.pill,
      title: s.title,
      sub: s.sub ?? { en: '', ar: '' },
      image: `src/assets/categories/${s.id}.webp`,
      isPopular: false,
    }
  })

  const kindOf = new Map(categories.map((c) => [c.id, c.kind]))

  const products: MenuProduct[] = ITEMS.map((item) => {
    const sizes: SizeTier[] = SIZES.filter((s) => item.profile.sizes.includes(s.id)).map((s) => ({
      id: s.id,
      name: s.name,
      mode: 'delta',
      value: s.upcharge,
    }))
    const kind = kindOf.get(item.categoryId) ?? item.kind
    const excludedAddOns = ADDONS.filter(
      (a) => scopeMatches(a, kind) && !item.profile.addOns.includes(a.id),
    ).map((a) => a.id)

    return {
      id: item.id,
      categoryId: item.categoryId,
      name: item.name,
      desc: item.desc,
      price: item.price,
      sizes,
      baristaWay: { enabled: item.profile.baristaWay, addOns: [...BARISTAS_WAY.addOns] },
      oftenOrderedWith: [...OFTEN_ORDERED[item.kind]],
      excludedAddOns,
      inStock: true,
      ...(item.badge ? { badge: item.badge } : {}),
    }
  })

  return {
    schemaVersion: MENU_SCHEMA_VERSION,
    updatedAt: new Date(0).toISOString(),
    categories,
    addOns: ADDONS,
    products,
    signatures: [...SIGNATURE_IDS],
    pairings: OFFERS.map((o) => ({
      id: o.id,
      items: o.items,
      bundlePrice: o.offerPrice ?? null,
    })),
    popup: {
      enabled: POPUP.enabled,
      image: 'src/assets/popup/popup.webp',
      title: { en: '', ar: '' },
      body: { en: '', ar: '' },
      ctaLabel: { en: '', ar: '' },
      ctaUrl: '',
      delaySeconds: Math.round(POPUP.delayMs / 1000),
    },
  }
}
