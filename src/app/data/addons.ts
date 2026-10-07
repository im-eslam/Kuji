import type { AddOn, Preset, Size } from './types'

export const SIZES: Size[] = [
  { id: 'regular', name: { en: 'Regular', ar: 'عادي' }, upcharge: 0 },
  { id: 'large', name: { en: 'Large', ar: 'كبير' }, upcharge: 15 },
]

// Every add-on belongs to exactly one scope (Menu.md, "Addition"):
//   'drinks' = only on beverages, 'bakery' = only on cookies and desserts, 'all' = works on both.
// profiles.ts uses the scope as a hard gate, so a drinks-only add-on can never reach a dessert and vice versa.
// Order here is the display order inside the Add-ons list: milks, shot, syrups, then bakery spreads, then the shared sauces and fruit.
export const ADDONS: AddOn[] = [
  // drinks only
  { id: 'oat-milk', name: { en: 'Oat Milk', ar: 'حليب الشوفان' }, price: 35, scope: 'drinks' },
  { id: 'almond-milk', name: { en: 'Almond Milk', ar: 'حليب اللوز' }, price: 35, scope: 'drinks' },
  { id: 'coconut-milk', name: { en: 'Coconut Milk', ar: 'حليب جوز الهند' }, price: 35, scope: 'drinks' },
  { id: 'extra-coffee-shot', name: { en: 'Extra Coffee Shot', ar: 'شوت قهوة إضافي' }, price: 35, scope: 'drinks' },
  { id: 'vanilla', name: { en: 'Vanilla', ar: 'فانيليا' }, price: 20, scope: 'drinks' },
  { id: 'caramel', name: { en: 'Caramel', ar: 'كراميل' }, price: 20, scope: 'drinks' },
  { id: 'hazelnut', name: { en: 'Hazelnut', ar: 'بندق' }, price: 25, scope: 'drinks' },
  // bakery only
  { id: 'nutella', name: { en: 'Nutella', ar: 'نوتيلا' }, price: 25, scope: 'bakery' },
  { id: 'white-sauce', name: { en: 'White Sauce', ar: 'صوص أبيض' }, price: 30, scope: 'bakery' },
  // both
  { id: 'chocolate-sauce', name: { en: 'Chocolate Sauce', ar: 'صوص شوكولاتة' }, price: 25, scope: 'all' },
  { id: 'salted-caramel-sauce', name: { en: 'Salted Caramel Sauce', ar: 'صوص كراميل مملح' }, price: 25, scope: 'all' },
  { id: 'strawberry', name: { en: 'Strawberry', ar: 'فراولة' }, price: 20, scope: 'all' },
  { id: 'berries', name: { en: 'Berries', ar: 'توت' }, price: 25, scope: 'all' },
  { id: 'blueberry-sauce', name: { en: 'Blueberry Sauce', ar: 'صوص توت أزرق' }, price: 20, scope: 'all' },
]

export const BARISTAS_WAY: Preset = {
  id: 'baristas-way',
  name: { en: "Make it the Barista's Way", ar: 'خلّيها على طريقة الباريستا' },
  addOns: ['oat-milk', 'vanilla'],
}
