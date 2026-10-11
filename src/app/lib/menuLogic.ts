import type {
  AddOn,
  BadgeKind,
  ItemId,
  MenuCategory,
  MenuData,
  MenuPairing,
  MenuProduct,
} from '../data/types'

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Lower number = earlier in the category. "New" leads, then "Top Rated", then everything else. */
export const BADGE_PRIORITY: Record<BadgeKind | 'none', number> = { new: 0, top: 1, none: 2 }

/** Priority-weighted order for a category's products; each tier keeps the owner's own ordering. */
export function sortByBadge(products: MenuProduct[]): MenuProduct[] {
  return products
    .map((product, index) => ({ product, index }))
    .sort(
      (a, b) =>
        BADGE_PRIORITY[a.product.badge ?? 'none'] - BADGE_PRIORITY[b.product.badge ?? 'none'] ||
        a.index - b.index,
    )
    .map((x) => x.product)
}

/** Drinks take 'drinks' + 'all' add-ons, bakery items take 'bakery' + 'all'. */
export const scopeMatches = (addOn: AddOn, kind: MenuCategory['kind']): boolean =>
  addOn.scope === 'all' || (kind === 'drink' ? addOn.scope === 'drinks' : addOn.scope === 'bakery')

/** Add-ons that scope would apply to a product, before its own exclusions. */
export const scopedAddOns = (addOns: AddOn[], kind: MenuCategory['kind']): AddOn[] =>
  addOns.filter((a) => scopeMatches(a, kind))

/** What the guest will actually be offered on this product. */
export const resolveAddOns = (
  product: MenuProduct,
  kind: MenuCategory['kind'],
  addOns: AddOn[],
): AddOn[] => scopedAddOns(addOns, kind).filter((a) => !product.excludedAddOns.includes(a.id))

export const regularPrice = (pairing: MenuPairing, products: MenuProduct[]): number =>
  pairing.items.reduce((sum, id) => sum + (products.find((p) => p.id === id)?.price ?? 0), 0)

/** Percentage shown on the yellow savings chip. 0 when there is no real saving. */
export function discountPercent(pairing: MenuPairing, products: MenuProduct[]): number {
  const regular = regularPrice(pairing, products)
  if (pairing.bundlePrice === null || regular <= 0 || pairing.bundlePrice >= regular) return 0
  return Math.round(((regular - pairing.bundlePrice) / regular) * 100)
}

export const pairingId = (a: ItemId, b: ItemId) => `${a}-${b}`

/** Removes a product everywhere it is referenced so nothing on the public menu points at a missing item. */
export function removeProduct(menu: MenuData, id: ItemId): MenuData {
  return {
    ...menu,
    products: menu.products
      .filter((p) => p.id !== id)
      .map((p) => ({ ...p, oftenOrderedWith: p.oftenOrderedWith.filter((x) => x !== id) })),
    signatures: menu.signatures.filter((x) => x !== id),
    pairings: menu.pairings.filter((p) => !p.items.includes(id)),
  }
}

/** Removes an add-on from the library and from every product that referenced it. */
export function removeAddOn(menu: MenuData, id: string): MenuData {
  return {
    ...menu,
    addOns: menu.addOns.filter((a) => a.id !== id),
    products: menu.products.map((p) => ({
      ...p,
      excludedAddOns: p.excludedAddOns.filter((x) => x !== id),
      baristaWay: { ...p.baristaWay, addOns: p.baristaWay.addOns.filter((x) => x !== id) },
    })),
  }
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list
  const next = list.slice()
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

export const formatPrice = (n: number | null): string => (n === null ? 'On selection' : `${n} EGP`)
