import { ADDONS } from './addons'
import type { AddOn, AddOnId, Item, Profile } from './types'

const SIZE_LIST = ['regular', 'large']
const MILKS: AddOnId[] = ['oat-milk', 'almond-milk', 'coconut-milk']

interface CategoryRule {
  sizes: boolean
  baristaWay: boolean
  /** Add-ons that make sense for the whole category. Still filtered by scope and by the item itself. */
  addOns: AddOnId[]
}

// Step 1: what each category can sensibly take.
const CATEGORY_RULES: Record<string, CategoryRule> = {
  'iced-coffee': { sizes: true, baristaWay: true, addOns: [...MILKS, 'extra-coffee-shot', 'vanilla', 'caramel', 'hazelnut', 'chocolate-sauce', 'salted-caramel-sauce'] },
  'hot-coffee': { sizes: true, baristaWay: true, addOns: [...MILKS, 'extra-coffee-shot', 'vanilla', 'caramel', 'hazelnut', 'chocolate-sauce', 'salted-caramel-sauce'] },
  'blended-coffee': { sizes: true, baristaWay: true, addOns: [...MILKS, 'extra-coffee-shot', 'vanilla', 'caramel', 'hazelnut', 'chocolate-sauce', 'salted-caramel-sauce'] },
  'iced-matcha': { sizes: true, baristaWay: true, addOns: [...MILKS, 'vanilla', 'strawberry', 'blueberry-sauce'] },
  'hot-matcha': { sizes: true, baristaWay: true, addOns: [...MILKS, 'vanilla', 'strawberry', 'blueberry-sauce'] },
  'hot-chocolate': { sizes: true, baristaWay: true, addOns: [...MILKS, 'vanilla', 'caramel', 'hazelnut', 'chocolate-sauce', 'salted-caramel-sauce'] },
  'crunch-shake': { sizes: true, baristaWay: false, addOns: ['vanilla', 'caramel', 'hazelnut', 'chocolate-sauce', 'salted-caramel-sauce', 'strawberry', 'blueberry-sauce'] },
  smoothies: { sizes: true, baristaWay: false, addOns: ['coconut-milk', 'strawberry', 'berries', 'blueberry-sauce'] },
  mojitos: { sizes: true, baristaWay: false, addOns: ['strawberry', 'berries', 'blueberry-sauce'] },
  'pour-over': { sizes: false, baristaWay: false, addOns: [] },
  cookies: { sizes: false, baristaWay: false, addOns: ['nutella', 'white-sauce', 'chocolate-sauce', 'salted-caramel-sauce'] },
  desserts: { sizes: false, baristaWay: false, addOns: ['nutella', 'white-sauce', 'chocolate-sauce', 'salted-caramel-sauce', 'strawberry', 'berries', 'blueberry-sauce'] },
}

// Step 2: never offer what the product already is. Matched against the English product name.
const ALREADY_IN_NAME: Record<AddOnId, RegExp> = {
  vanilla: /vanilla/i,
  caramel: /caramel/i,
  'salted-caramel-sauce': /caramel/i,
  hazelnut: /hazelnut/i,
  'coconut-milk': /coconut/i,
  'chocolate-sauce': /mocha/i,
  strawberry: /strawberr/i,
  berries: /berr/i,
  'blueberry-sauce': /blueberr/i,
  nutella: /nutella/i,
  'white-sauce': /white/i,
}

// Step 3: the few products where common sense overrides the category.
const ITEM_EXCLUDES: Record<string, AddOnId[]> = {
  Americano: MILKS, // black coffee, no milk to swap
  'Iced Hibiscus Mix': ['strawberry'],
  'Tiramisu Cake': ['nutella', 'white-sauce', 'strawberry', 'blueberry-sauce'],
  'San Sebastian Cheesecake': ['nutella', 'white-sauce', 'chocolate-sauce'],
  'Kinder Tart Cookies': ['strawberry', 'berries', 'blueberry-sauce'],
  'Nutella Tart Cookies': ['strawberry', 'berries', 'blueberry-sauce'],
}

// Hard gate: drinks take 'drinks' + 'all', food takes 'bakery' + 'all'. Nothing else, ever.
export const scopeAllows = (a: AddOn, kind: Item['kind']): boolean =>
  a.scope === 'all' || (kind === 'drink' ? a.scope === 'drinks' : a.scope === 'bakery')

// Profiles are stored data, built once per product. The UI never infers them from item kind.
export function profileFor(categoryId: string, name: string, kind: Item['kind']): Profile {
  const rule = CATEGORY_RULES[categoryId]
  const excluded = ITEM_EXCLUDES[name] ?? []
  const addOns = ADDONS.filter(
    (a) =>
      rule.addOns.includes(a.id) &&
      scopeAllows(a, kind) &&
      !excluded.includes(a.id) &&
      !ALREADY_IN_NAME[a.id]?.test(name),
  ).map((a) => a.id)
  return { sizes: rule.sizes ? SIZE_LIST : [], addOns, baristaWay: rule.baristaWay }
}
