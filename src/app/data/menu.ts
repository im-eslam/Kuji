import { OFFERS } from './offers'
import { profileFor } from './profiles'
import type { BadgeKind, Item, ItemId, Section } from './types'

// Arabic text throughout this file is DRAFT copy pending native review.
type Row = [en: string, ar: string, descEn: string, descAr: string, price: number | null]
interface Cat {
  id: string
  kind: 'drink' | 'food'
  pill: [string, string]
  title: [string, string]
  rows: Row[]
}

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const CATS: Cat[] = [
  {
    id: 'iced-coffee', kind: 'drink', pill: ['Iced Coffee', 'قهوة مثلجة'], title: ['Iced Coffee', 'قهوة مثلجة'],
    rows: [
      ['Iced Latte', 'آيس لاتيه', 'Made with rich espresso, milk, and ice.', 'إسبريسو غني مع الحليب والثلج.', 110],
      ['Iced Spanish Latte', 'آيس سبانش لاتيه', 'Rich espresso with cold milk, ice, and sweetened condensed milk.', 'إسبريسو غني مع حليب بارد وثلج وحليب مكثف محلى.', 130],
      ['Iced Salted Caramel Latte', 'آيس سولتد كراميل لاتيه', 'Iced latte combining coffee, smooth milk, and salted caramel sauce.', 'لاتيه مثلج يجمع القهوة والحليب الناعم وصوص الكراميل المملح.', 130],
      ['Iced Mocha', 'آيس موكا', 'Coffee, luxurious chocolate, and cold creamy milk.', 'قهوة وشوكولاتة فاخرة وحليب بارد كريمي.', 130],
      ['Iced White Mocha', 'آيس وايت موكا', 'Coffee and cold fresh milk with a creamy white mocha flavor.', 'قهوة وحليب طازج بارد بنكهة الموكا البيضاء الكريمية.', 130],
      ['Iced Coconut Latte', 'آيس كوكونت لاتيه', 'Rich coffee with fresh milk and natural coconut flavor.', 'قهوة غنية مع حليب طازج ونكهة جوز الهند الطبيعية.', 125],
      ['Cinnamon Latte', 'سينامون لاتيه', 'Creamy milk and espresso with aromatic cinnamon.', 'حليب كريمي وإسبريسو مع القرفة العطرية.', 110],
      ['UP Iced Latte', 'يو بي آيس لاتيه', 'Premium espresso, iced milk, and creamy foam.', 'إسبريسو فاخر وحليب مثلج ورغوة كريمية.', 150],
      ['Sea Salt Latte', 'سي سولت لاتيه', 'Iced latte with a touch of sea salt balancing the coffee flavor.', 'لاتيه مثلج بلمسة ملح البحر توازن نكهة القهوة.', 140],
    ],
  },
  {
    id: 'iced-matcha', kind: 'drink', pill: ['Iced Matcha', 'ماتشا مثلجة'], title: ['Iced Matcha', 'ماتشا مثلجة'],
    rows: [
      ['Iced Matcha Latte', 'آيس ماتشا لاتيه', 'Classic matcha latte with a rich matcha tea flavor.', 'ماتشا لاتيه كلاسيكي بنكهة شاي الماتشا الغنية.', 125],
      ['Iced Spanish Matcha Latte', 'آيس سبانش ماتشا لاتيه', 'Matcha latte with milk and sweetened condensed milk.', 'ماتشا لاتيه بالحليب والحليب المكثف المحلى.', 140],
      ['Iced Coconut Matcha Latte', 'آيس كوكونت ماتشا لاتيه', 'Matcha latte with coconut for a tropical taste.', 'ماتشا لاتيه بجوز الهند لطعم استوائي.', 140],
      ['Iced Mango Matcha Latte', 'آيس مانجو ماتشا لاتيه', 'Iced matcha latte with milk and mango.', 'ماتشا لاتيه مثلج بالحليب والمانجو.', 130],
      ['Iced Strawberry Matcha Latte', 'آيس ستروبيري ماتشا لاتيه', 'Iced matcha latte with strawberry and milk.', 'ماتشا لاتيه مثلج بالفراولة والحليب.', 130],
      ['Salted Pecan Cloud Matcha', 'سولتد بيكان كلاود ماتشا', 'Matcha topped with a creamy salted pecan cloud.', 'ماتشا تعلوها سحابة بيكان مملحة كريمية.', 140],
      ['Iced Strawberry Cloud Matcha', 'آيس ستروبيري كلاود ماتشا', 'Iced matcha with strawberry flavor.', 'ماتشا مثلجة بنكهة الفراولة.', 140],
      ['Ube Matcha', 'أوبي ماتشا', 'Ube with a light sweet taste and rich antioxidants.', 'أوبي بطعم حلو خفيف وغني بمضادات الأكسدة.', 150],
      ['Matcha Apple Pie', 'ماتشا آبل باي', 'Japanese matcha with sweet apple flavor, served cold with ice.', 'ماتشا يابانية بنكهة التفاح الحلوة، تُقدم باردة مع الثلج.', 150],
      ['Matcha Salted Vanilla', 'ماتشا سولتد فانيلا', 'Iced matcha with salted vanilla flavor.', 'ماتشا مثلجة بنكهة الفانيلا المملحة.', 140],
    ],
  },
  {
    id: 'hot-coffee', kind: 'drink', pill: ['Hot Coffee', 'قهوة ساخنة'], title: ['Hot Coffee', 'قهوة ساخنة'],
    rows: [
      ['Cortado', 'كورتادو', 'Espresso with milk.', 'إسبريسو مع الحليب.', 90],
      ['Latte', 'لاتيه', 'Smooth coffee with warm milk for a balanced taste.', 'قهوة ناعمة مع حليب دافئ لطعم متوازن.', 110],
      ['Cappuccino', 'كابتشينو', 'Rich coffee blended with milk and light foam.', 'قهوة غنية ممزوجة بالحليب ورغوة خفيفة.', 110],
      ['Flat White', 'فلات وايت', 'Espresso with a velvety milk layer and smooth texture.', 'إسبريسو بطبقة حليب مخملية وقوام ناعم.', 110],
      ['Americano', 'أمريكانو', 'Espresso diluted with hot water.', 'إسبريسو مخفف بالماء الساخن.', 85],
      ['Spanish Latte', 'سبانش لاتيه', 'Sweetened latte with a distinctive Spanish flavor.', 'لاتيه محلى بنكهة إسبانية مميزة.', 130],
      ['Salted Caramel Latte', 'سولتد كراميل لاتيه', 'Latte with espresso, steamed milk, salted caramel syrup, and sea salt.', 'لاتيه بالإسبريسو والحليب المبخر وشراب الكراميل المملح وملح البحر.', 130],
      ['Hot Mocha', 'هوت موكا', 'Hot coffee with chocolate.', 'قهوة ساخنة مع الشوكولاتة.', 125],
      ['French Coffee', 'قهوة فرنساوي', 'Strong, dark roast coffee and milk.', 'قهوة داكنة قوية مع الحليب.', 75],
      ['Chai Latte', 'شاي لاتيه', 'Warm latte with cinnamon flavor, creamy milk, espresso, and fresh cinnamon.', 'لاتيه دافئ بنكهة القرفة والحليب الكريمي والإسبريسو والقرفة الطازجة.', 110],
    ],
  },
  {
    id: 'blended-coffee', kind: 'drink', pill: ['Blended Coffee', 'قهوة بليندد'], title: ['Blended Coffee', 'قهوة بليندد'],
    rows: [
      ['Blended Classic Coffee', 'بليندد كلاسيك كوفي', 'Espresso, creamy milk, caramel drizzle, and aromatic cocoa.', 'إسبريسو وحليب كريمي وقطرات كراميل وكاكاو عطري.', 110],
      ['Blended Coconut Coffee', 'بليندد كوكونت كوفي', 'Coffee blended with coconut milk and ice.', 'قهوة مخفوقة مع حليب جوز الهند والثلج.', 130],
      ['Dark Blended Mocha', 'دارك بليندد موكا', 'Iced coffee blended with dark chocolate.', 'قهوة مثلجة مخفوقة مع الشوكولاتة الداكنة.', 130],
      ['Blended White Mocha', 'بليندد وايت موكا', 'Espresso, milk, and white chocolate.', 'إسبريسو وحليب وشوكولاتة بيضاء.', 130],
      ['Spanish Blended Latte', 'سبانش بليندد لاتيه', 'Espresso, milk, condensed milk, and ice.', 'إسبريسو وحليب وحليب مكثف وثلج.', 130],
      ['Salted Caramel Blend', 'سولتد كراميل بليند', 'Espresso, steamed milk, and salted caramel syrup.', 'إسبريسو وحليب مبخر وشراب الكراميل المملح.', 130],
    ],
  },
  {
    id: 'crunch-shake', kind: 'drink', pill: ['Crunch Shake', 'كرنش شيك'], title: ['Crunch Shake', 'كرنش شيك'],
    rows: [
      ['Strawberry Crunch Shake', 'ستروبيري كرنش شيك', 'Fresh strawberry milkshake.', 'ميلك شيك فراولة طازجة.', 125],
      ['Crunch Shake Salted Caramel', 'كرنش شيك سولتد كراميل', 'Rich salted caramel milkshake.', 'ميلك شيك كراميل مملح غني.', 125],
      ['Chocolate Crunch Shake', 'شوكولاتة كرنش شيك', 'Classic chocolate milkshake.', 'ميلك شيك شوكولاتة كلاسيكي.', 125],
      ['Crunch Shake Kinder', 'كرنش شيك كيندر', 'Kinder Bueno chocolate, milk, and whipped cream.', 'شوكولاتة كيندر بوينو وحليب وكريمة مخفوقة.', 130],
    ],
  },
  {
    id: 'mojitos', kind: 'drink', pill: ['Mojitos', 'موهيتو'], title: ['Mojitos', 'موهيتو'],
    rows: [
      ['Classic Mojito', 'موهيتو كلاسيك', 'Refreshing mojito with mint and lemon.', 'موهيتو منعش بالنعناع والليمون.', 95],
      ['Classic Red Bull Mojito', 'موهيتو ريد بول كلاسيك', 'Classic Red Bull mojito for energy and freshness.', 'موهيتو ريد بول كلاسيك للطاقة والانتعاش.', 120],
      ['Blueberry Red Bull Mojito', 'موهيتو ريد بول بلوبيري', 'Red Bull infused with blueberry flavor.', 'ريد بول بنكهة التوت الأزرق.', 120],
      ['Classic Raspberry Mojito', 'موهيتو راسبيري كلاسيك', 'Mojito with fresh raspberries, mint, and lime.', 'موهيتو بتوت العليق الطازج والنعناع والليمون الأخضر.', 95],
      ['Classic Passion Fruit Mojito', 'موهيتو باشن فروت كلاسيك', 'Tropical mojito with passion fruit.', 'موهيتو استوائي بالباشن فروت.', 95],
      ['Iced Hibiscus Mix', 'آيس كركديه ميكس', 'Refreshing ruby-red drink with a bright, tart flavor.', 'مشروب منعش أحمر ياقوتي بنكهة لاذعة مشرقة.', 90],
    ],
  },
  {
    id: 'smoothies', kind: 'drink', pill: ['Smoothies', 'سموذي'], title: ['Smoothies', 'سموذي'],
    rows: [
      ['Blueberry Coconut Smoothie', 'سموذي بلوبيري وجوز الهند', 'Smoothie blended with blueberries and coconut.', 'سموذي مخفوق بالتوت الأزرق وجوز الهند.', 120],
      ['Mango Kiwi Smoothie', 'سموذي مانجو وكيوي', 'Blended smoothie made with mango and kiwi.', 'سموذي مخفوق بالمانجو والكيوي.', 130],
      ['Mango Strawberry Smoothie', 'سموذي مانجو وفراولة', 'Smoothie blended with mango and fresh strawberries.', 'سموذي مخفوق بالمانجو والفراولة الطازجة.', 130],
      ['Peach and Passion Smoothie', 'سموذي خوخ وباشن فروت', 'Smoothie blended with peaches and passion fruit.', 'سموذي مخفوق بالخوخ والباشن فروت.', 125],
    ],
  },
  {
    id: 'hot-matcha', kind: 'drink', pill: ['Hot Matcha', 'ماتشا ساخنة'], title: ['Hot Matcha', 'ماتشا ساخنة'],
    rows: [
      ['Classic Matcha Latte', 'ماتشا لاتيه كلاسيك', 'Classic matcha latte with rich matcha tea flavor.', 'ماتشا لاتيه كلاسيكي بنكهة شاي الماتشا الغنية.', 125],
      ['Coconut Matcha Latte', 'كوكونت ماتشا لاتيه', 'Coconut matcha latte with a tropical taste.', 'ماتشا لاتيه بجوز الهند لطعم استوائي.', 140],
    ],
  },
  {
    id: 'hot-chocolate', kind: 'drink', pill: ['Hot Chocolate', 'شوكولاتة ساخنة'], title: ['Hot Chocolate', 'شوكولاتة ساخنة'],
    rows: [
      ['Classic Hot Chocolate', 'هوت شوكليت كلاسيك', 'A warm cup of hot chocolate.', 'كوب دافئ من الشوكولاتة الساخنة.', 120],
      ['Creamy Cloud Foam', 'كريمي كلاود فوم', 'Light creamy foam with a soft and velvety texture.', 'رغوة كريمية خفيفة بقوام ناعم كالمخمل.', 130],
      ['Coconut Cloud Foam', 'كوكونت كلاود فوم', 'Light coconut foam with a smooth creamy touch.', 'رغوة جوز الهند الخفيفة بلمسة كريمية ناعمة.', 140],
      ['Creamy Hazelnut', 'كريمي هيزلنت', 'Latte made with espresso, steamed milk, and creamy hazelnut flavor.', 'لاتيه بالإسبريسو والحليب المبخر ونكهة البندق الكريمية.', 140],
    ],
  },
  {
    id: 'pour-over', kind: 'drink', pill: ['Pour Over', 'بور أوفر'], title: ['Pour Over Coffee', 'قهوة بور أوفر'],
    rows: [['V60', 'V60', 'Brewed filtered coffee with a pure, balanced flavor.', 'قهوة مفلترة بنكهة نقية ومتوازنة.', null]],
  },
  {
    id: 'cookies', kind: 'food', pill: ['Cookies', 'كوكيز'], title: ['Cookies', 'كوكيز'],
    rows: [
      ['Classic Cookies', 'كوكيز كلاسيك', 'Classic cookies dipped in delicious chocolate chip pieces.', 'كوكيز كلاسيك بقطع الشوكولاتة اللذيذة.', 70],
      ['Red Velvet Cookies', 'كوكيز ريد فيلفت', 'Cookies loaded with white chocolate chips and filled with white chocolate cream.', 'كوكيز بقطع الشوكولاتة البيضاء ومحشوة بكريمة الشوكولاتة البيضاء.', 70],
      ['Kinder Cookies', 'كوكيز كيندر', 'Cookies filled with Kinder cream, topped with crunchy Kinder pieces.', 'كوكيز محشوة بكريمة كيندر ومغطاة بقطع كيندر المقرمشة.', 75],
      ['Oreo Cookies', 'كوكيز أوريو', 'Cookies filled with Oreo cream and topped with crunchy Oreo cookie pieces.', 'كوكيز محشوة بكريمة أوريو ومغطاة بقطع أوريو المقرمشة.', 70],
      ['Double Chocolate Cookies', 'كوكيز دبل شوكولاتة', 'Extra chocolate cookies with milk chocolate chunks and white chocolate chips.', 'كوكيز بشوكولاتة إضافية وقطع شوكولاتة بالحليب وشوكولاتة بيضاء.', 70],
      ['Lotus Cookies', 'كوكيز لوتس', 'Cookies filled with Lotus cream, topped with crunchy Lotus biscuit pieces.', 'كوكيز محشوة بكريمة لوتس ومغطاة بقطع بسكويت لوتس المقرمشة.', 70],
      ['Salted Caramel Cookies', 'كوكيز سولتد كراميل', 'Cookies with a balanced sweet and salty taste, with added pecan pieces.', 'كوكيز بتوازن الحلو والمالح مع قطع البيكان.', 75],
    ],
  },
  {
    id: 'desserts', kind: 'food', pill: ['Desserts', 'حلويات'],
    title: ['Sweeten Your Coffee Break With Delicious Desserts', 'حلّي استراحة قهوتك بألذ الحلويات'],
    rows: [
      ['Tiramisu Cake', 'تيراميسو كيك', 'Italian dessert with coffee-soaked ladyfingers, mascarpone, and cocoa.', 'حلوى إيطالية بأصابع الليدي المنقوعة في القهوة والماسكربوني والكاكاو.', 120],
      ['Brownies', 'براونيز', 'Rich dark chocolate brownies with a moist, soft texture.', 'براونيز شوكولاتة داكنة غنية بقوام طري ورطب.', 160],
      ['San Sebastian Cheesecake', 'سان سيباستيان تشيز كيك', 'Creamy crustless cheesecake with a caramelized top.', 'تشيز كيك كريمي بدون قاعدة بوجه مكرمل.', 140],
      ['Kinder Tart Cookies', 'كيندر تارت كوكيز', 'Delicious tart cookies available in various flavors.', 'تارت كوكيز لذيذة متوفرة بنكهات متنوعة.', 130],
      ['Nutella Tart Cookies', 'نوتيلا تارت كوكيز', 'Crispy outside, soft inside, with rich chocolate and hazelnut flavor.', 'مقرمشة من الخارج وطرية من الداخل بطعم الشوكولاتة والبندق الغني.', 115],
    ],
  },
]

const TOP = ['Iced Spanish Latte', 'Ube Matcha', 'UP Iced Latte', 'Cappuccino', 'Classic Cookies', 'Brownies', 'Tiramisu Cake']
const NEW = ['Matcha Apple Pie', 'Salted Pecan Cloud Matcha', 'Iced Mango Matcha Latte', 'Strawberry Crunch Shake', 'Mango Kiwi Smoothie', 'Lotus Cookies', 'Nutella Tart Cookies']
const badgeOf = (name: string): BadgeKind | undefined => (NEW.includes(name) ? 'new' : TOP.includes(name) ? 'top' : undefined)

export const ITEMS: Item[] = CATS.flatMap((c) =>
  c.rows.map(([en, ar, dEn, dAr, price]): Item => ({
    id: slug(en),
    name: { en, ar },
    desc: { en: dEn, ar: dAr },
    price,
    kind: c.kind,
    badge: badgeOf(en),
    profile: profileFor(c.id, en, c.kind),
    categoryId: c.id,
  })),
)

export const ITEM_BY_ID: Record<ItemId, Item> = Object.fromEntries(ITEMS.map((i) => [i.id, i]))

export const SIGNATURE_IDS: ItemId[] = ['ube-matcha', 'matcha-apple-pie', 'up-iced-latte', 'salted-pecan-cloud-matcha', 'sea-salt-latte']

export const OFTEN_ORDERED: Record<Item['kind'], ItemId[]> = {
  drink: ['classic-cookies', 'kinder-cookies', 'tiramisu-cake'],
  food: ['iced-latte', 'latte', 'americano'],
}

export const SECTIONS: Section[] = [
  {
    id: 'signatures', kind: 'signatures',
    pill: { en: 'Signatures', ar: 'المميزة' },
    title: { en: 'The Signatures', ar: 'اختياراتنا المميزة' },
    itemIds: SIGNATURE_IDS,
  },
  {
    id: 'pairings', kind: 'pairings',
    pill: { en: 'Pairings', ar: 'ثنائيات' },
    title: { en: 'Perfect Pairings', ar: 'ثنائيات مثالية' },
    sub: { en: 'Pair a drink with a treat. Some pairs are on offer.', ar: 'اجمع مشروبك مع حلوى. بعض الثنائيات عليها عرض.' },
    itemIds: OFFERS.map((o) => o.id),
  },
  ...CATS.map((c): Section => ({
    id: c.id, kind: 'category',
    pill: { en: c.pill[0], ar: c.pill[1] },
    title: { en: c.title[0], ar: c.title[1] },
    itemIds: c.rows.map(([en]) => slug(en)),
  })),
]
