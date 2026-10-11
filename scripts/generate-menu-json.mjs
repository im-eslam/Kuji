// Writes public/menu.json from the data bundled with the public menu.
// Run once with: node scripts/generate-menu-json.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
})

try {
  const { buildSeedMenu } = await server.ssrLoadModule('/src/app/data/seed.ts')
  const menu = buildSeedMenu()
  await mkdir('public', { recursive: true })
  await writeFile('public/menu.json', JSON.stringify(menu, null, 2) + '\n')
  console.log(`Wrote public/menu.json (${menu.categories.length} categories, ${menu.products.length} products)`)
} finally {
  await server.close()
}
