import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const origin = process.env.VIBEUP_URL ?? 'http://127.0.0.1:5173'
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await context.newPage()
const pageErrors = []
page.on('pageerror', (error) => pageErrors.push(error.message))

try {
  const feed = await page.goto(`${origin}/feed`, { waitUntil: 'domcontentloaded' })
  assert.equal(feed?.status(), 200, 'Feed deve responder HTTP 200')
  assert.match(await page.locator('h1').innerText(), /Ana/, 'Feed deve mostrar o perfil demonstrativo estudante')

  await page.getByRole('link', { name: 'Explorar talentos' }).click()
  await page.getByRole('button', { name: 'Filtros' }).click()
  await page.getByLabel('Unidade Senac').selectOption({ index: 1 })
  await page.getByRole('checkbox', { name: 'Em projetos colaborativos' }).check()
  await page.getByRole('button', { name: /Aplicar filtros/ }).click()
  assert.equal(await page.locator('#explore-panel').getAttribute('role'), 'tabpanel', 'Busca deve atualizar o painel de resultados')

  await page.getByRole('button', { name: 'Visão estudante' }).click()
  assert.equal(await page.getByRole('button', { name: 'Visão empresa' }).count(), 1, 'Seletor deve alternar para empresa')
  await page.getByRole('link', { name: 'Oportunidades' }).click()
  await page.waitForURL('**/empresas/oportunidades')
  await page.getByRole('heading', { name: 'Oportunidades e talentos' }).waitFor()
  assert.match(await page.locator('h1').innerText(), /Oportunidades/, 'Empresa deve acessar oportunidades')
  await page.getByRole('button', { name: 'Pipeline' }).click()
  assert.ok(await page.locator('.pipeline-board').count(), 'Pipeline deve ser exibido')

  await page.goto(`${origin}/comunidades`)
  await page.getByRole('button', { name: /Criar comunidade/ }).click()
  assert.equal(await page.getByRole('dialog').count(), 1, 'Formulário deve abrir num diálogo')
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('dialog').count(), 0, 'Escape deve fechar o diálogo')
  assert.deepEqual(pageErrors, [], 'Não deve haver erros de JavaScript')
  console.log('Smoke test aprovado: feed, filtros, alternância empresa, pipeline e fechamento de diálogo.')
} finally {
  await context.close()
  await browser.close()
}
