_Going to revisit this document when actually building the final version of this and defining the real strings that is going to be used for arabic and english, and when desiging the data models and building the db, after we finish all that this document is going to be shrinked and refactored into a reference for the approach we used and the tone and the brand slogans and all that But for now while we are builidng the MVP and sence we are vibe coding it this is ok and well get the AI to use the needed tone and strings_

| **Owns**          | Everything the customer reads and the data behind it: voice, copy rules, interface strings, the data model, the menu |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Does not own**  | Looks (Doc B), components (Doc C), layout (Doc A), logic (Doc D)                                                     |
| **Depends on**    | B, C, A (names of elements that carry strings)                                                                       |
| **Referenced by** | D (reads option profiles, presets and prices)                                                                        |

**Status of the content.** All strings, prices, offers, add-ons and badges in this document are **test content, close to the real thing**. The code file `src/data.ts` is the live copy of the menu. If it and this document disagree, update whichever is wrong the same day. The tables below are a snapshot, not the place to edit prices (F-44).

---

## 1. Voice

Warm, short, a little poetic, never salesy. Product copy describes taste in one sentence. Interface copy is plain and calm. The brand speaks to a generation that wants its coffee to match its moodboard.

| Do                        | Don't                             |
| ------------------------- | --------------------------------- |
| Make it the Barista's Way | Upgrade to premium customization! |
| Your order is empty.      | Oops! Nothing here yet            |
| Price on Selection        | (leaving the price blank)         |
| Add to Order · EGP 185    | Buy now                           |
**Brand lines** (use exactly)

|Line|Where|
|---|---|
|Romanticize your coffee.|Under The Signatures title|
|Brewed for souls that feel too much.|Reserved for splash, empty states and marketing (placement: F-43)|
|A cup that understands.|Packaging only|
|Our Goods are Daily Fresh Baked.|Bakery packaging only|

Brand lines are fixed in English. Each needs an approved Arabic version before launch (F-01), and the English lines stay as they are.

## 2. Copy rules

1. **Currency:** English: `EGP 130`; offsets `+EGP 20`. Arabic: the equivalent Arabic format and numeral style (Western or Arabic-Indic digits) is decided with the real Arabic strings (F-02). Always whole numbers, no decimals.
2. **Item names:** Title Case, spelled as on the printed menu (San Sebastian Cheesecake, Nutella Tart Cookies). See F-45.
3. **Descriptions:** one sentence, ends with a period, about 80 characters at most so it fits two lines.
4. **Buttons:** start with a verb: Add to Order, Update Order, View Order, Keep order, Clear order, Browse the menu, Show all.
5. **Case:** Title Case for section names and primary buttons; sentence case for descriptions, helper text and secondary buttons.
6. **No emoji** anywhere in the interface.
7. **Taglines:** regular weight with the last word bold.
8. **Language:** English and Arabic are both supported. Every customer-facing string and every menu text field exists in both languages. Arabic copy is written for Arabic readers in the same voice, not translated word for word. Rules 2 and 5 (Title Case, sentence case) apply to English only. Rules 3, 4, 6 and 7 apply to both languages. Arabic specifics: F-01 to F-06.

## 3. Interface strings

|Where|String|
|---|---|
|Signatures section|The Signatures · Romanticize your coffee.|
|Pairings section|Perfect Pairings · Pair a drink with a treat. Some pairs are on offer.|
|Show-all button|Show all {category} ({count})|
|Savings chip (card)|Save EGP {n}|
|Savings chip (sheet)|Offer · Save EGP {n}|
|Barista's Way|Make it the Barista's Way · Oat Milk + Vanilla · +EGP 55|
|Size options|Regular · Large +EGP 15 (one segment per size in data)|
|Quantity label|Quantity|
|Add-ons heading|Add-ons|
|Often Ordered heading|Often Ordered With|
|Often Ordered card|{name} · EGP {base price}|
|Quick-add confirmation|{n} added|
|Sheet footer (add)|Add to Order · EGP {total} (or Add to Order when on selection)|
|Sheet footer (edit)|Update Order · EGP {total} (or Update Order when on selection)|
|Unpriced item|Price on Selection|
|Order bar|View Order · {subtotal}|
|Order sheet|Your Order · {n} items · Subtotal · Clear order|
|Order line button (accessible name)|Edit {title}|
|Order line, bundle|Includes · then one block per product: {product name} · Size · Add-ons|
|Order detail labels|Includes · Size · Add-ons|
|Clear confirmation, question|Clear your whole order?|
|Clear confirmation, helper|This removes {n} items.|
|Clear confirmation, buttons|Keep order · Clear order|
|Unpriced note|Excludes items priced on selection.|
|Empty order|Your order is empty. · Browse the menu|
|Category sheet title|Categories|
|Search placeholder|Search the menu|
|Search prompt|Search drinks, desserts, offers and categories.|
|Search no match|Nothing matches "{query}".|
|Search groups|Categories · Offers · Items|
|Offer option block heading|{product name}|
|Badges|Top Rated · New|
|Language control|EN \| ع (both always shown; the active language is bold)|

## 4. Data model

```
Item      { id, name {en, ar}, desc {en, ar}, price (number or none), kind (drink | food),
            badge? (new | top), profile }
Profile   { sizes (Size list of any length, or none), addOns (AddOn id list of any length, or none),
            baristaWay (true | false) }
Preset    { id, name, addOns (AddOn id list), price shown = sum of its add-ons }
Size      { id, name {en, ar}, upcharge }
Offer     { id, items [Item, Item], offerPrice? }
AddOn     { id, name {en, ar}, price }
OrderLine { key, kind (item | bundle), title, qty, unit (number or none), was?,
            parts [ { item, size?, addons[] } ], includes? }
```

1. `id` is the lowercase, hyphenated item name and is also the photo file name. Keep ids stable once photos exist. 1a. **Languages.** Every customer-facing text field (item name and description, section pill and title, add-on name, size name) holds an English and an Arabic value. `id` stays English and stable, and is still the photo file name. Interface strings (§3) also exist in both languages.
2. **Option profile.** Every item has a profile, stored in the database and edited in the dashboard. The profile sets which sizes, which add-ons and whether Barista's Way the item offers. It is never inferred from `kind`. Any item, drink or dessert, can have any combination, including none. The dashboard may pre-fill a new drink with the full set and a new food item with none as a convenience, but the saved profile is what the app reads. Rules for how profiles behave: Doc D §3.
3. **Sizes** are a list on each item's profile, and each size has its own name and upcharge. The first size is the default and has upcharge 0. The dashboard can give an item any number of sizes (one, two, three or more), and sizes and upcharges can differ between items. Adding, removing or repricing sizes is a data change only (F-10, F-11).
4. **OrderLine parts.** A single item has one part. A bundle has two, each with its own size and add-ons.
5. A `Section` groups items under an id, a pill label and a title.
6. Everything on the page (pills, sections, signatures, offers, add-ons, the Barista's Way preset, size lists, profiles) is driven by this data, managed through the dashboard. Adding or changing a menu item or its options is a data change only. `src/data.ts` is the MVP seed copy of this data.
7. Menu order is the order in data. Badge sorting is derived at display time (Doc D §6) and never stored.
8. Photos: `public/images/{id}.jpg | .webp | .png`, tried in that order.

## 5. Menu structure

Page order after Signatures and Pairings. This is menu order; each category displays badged items first (Doc D §6). Full item names, descriptions and exact prices live in `src/data.ts`.

| #    | Section (pill)                                                      | Items   | Price range (EGP)  | Kind  |
| ---- | ------------------------------------------------------------------- | ------- | ------------------ | ----- |
| 5.1  | Iced Coffee                                                         | 9       | 110 to 150         | Drink |
| 5.2  | Iced Matcha                                                         | 10      | 125 to 150         | Drink |
| 5.3  | Hot Coffee                                                          | 10      | 75 to 130          | Drink |
| 5.4  | Blended Coffee                                                      | 6       | 110 to 130         | Drink |
| 5.5  | Crunch Shake                                                        | 4       | 125 to 130         | Drink |
| 5.6  | Mojitos                                                             | 6       | 90 to 120          | Drink |
| 5.7  | Smoothies                                                           | 4       | 120 to 130         | Drink |
| 5.8  | Hot Matcha                                                          | 2       | 125 to 140         | Drink |
| 5.9  | Hot Chocolate                                                       | 4       | 120 to 140         | Drink |
| 5.10 | Pour Over (title: Pour Over Coffee)                                 | 1 (V60) | Price on Selection | Drink |
| 5.11 | Cookies                                                             | 7       | 70 to 75           | Food  |
| 5.12 | Desserts (title: Sweeten Your Coffee Break With Delicious Desserts) | 5       | 115 to 160         | Food  |
Notes: Hot Coffee ends with Flat White and Americano. Items in Desserts: Tiramisu Cake, Brownies, San Sebastian Cheesecake, Kinder Tart Cookies, Nutella Tart Cookies.

## 6. Smart section content

**The Signatures** (5, in order): Ube Matcha, Matcha Apple Pie, UP Iced Latte, Salted Pecan Cloud Matcha, Sea Salt Latte. **Perfect Pairings** (5, in order)

|Pair|Regular|Offer price|Saving|
|---|---|---|---|
|Iced Latte + Oreo Cookies|180|150|30|
|Latte + Brownies|270|none|none|
|Iced Spanish Latte + Tiramisu Cake|250|220|30|
|Cappuccino + Kinder Cookies|185|none|none|
|Iced Matcha Latte + San Sebastian Cheesecake|265|240|25|

1. A pair without an offer price is shown at the sum of its two items and has no savings chip.
2. Each product in a pair is customized on its own (Doc D §3.3). Open points: F-22, F-23.

## 7. Modifiers

|Add-on|Price (EGP)|
|---|---|
|Oat Milk|+35|
|Vanilla|+20|
|Extra Coffee Shot|+35|
|Caramel|+20|
|Hazelnut|+25|

1. **Add-on set.** The five above are test data. The full list of add-ons lives in the database (the source menu has 14). The dashboard decides which add-ons each item offers, for drinks and desserts alike (F-14, F-15). Add-ons do not have to be shared between categories: a dessert can have its own add-on set.
2. **Barista's Way preset:** Oat Milk + Vanilla, +EGP 55 in total (F-17). The preset is defined in the dashboard as a list of add-ons. Its price is the sum of those add-ons, and it is offered on an item only if the item's profile enables it and the item offers every add-on in the preset.
3. **Size list:** Regular; Large +EGP 15 is today's test data and a placeholder until real size prices exist. Real sizes are defined per item in the dashboard, with any number of entries (F-10, F-11).
4. **Often Ordered With** (suggestions, base price, no options): for a drink, Classic Cookies, Kinder Cookies and Tiramisu Cake; for food, Iced Latte, Latte and Americano.

## 8. Badges

Current assignments are test data and must be replaced with real sales and release data (F-40). Badges drive the sort order inside each category, so accuracy matters.

|Badge|Items|
|---|---|
|Top Rated|Iced Spanish Latte, Ube Matcha, UP Iced Latte, Cappuccino, Classic Cookies, Brownies, Tiramisu Cake|
|New|Matcha Apple Pie, Salted Pecan Cloud Matcha, Iced Mango Matcha Latte, Strawberry Crunch Shake, Mango Kiwi Smoothie, Lotus Cookies, Nutella Tart Cookies|

1. One badge per item at most.
2. Sort order inside a category: New, then Top Rated, then the rest (Doc D §6).