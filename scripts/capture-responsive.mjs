import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const origin = process.env.VIBEUP_URL ?? 'http://127.0.0.1:5173'
const outputDirectory = path.resolve('docs/screenshots')
const viewports = [
  { name: 'desktop-1440x900', width: 1440, height: 900, mobile: false },
  { name: 'laptop-1280x720', width: 1280, height: 720, mobile: false },
  { name: 'compact-desktop-1024x768', width: 1024, height: 768, mobile: false },
  { name: 'tablet-768x1024', width: 768, height: 1024, mobile: false },
  { name: 'mobile-390x844', width: 390, height: 844, mobile: true },
  { name: 'mobile-360x800', width: 360, height: 800, mobile: true },
]

await mkdir(outputDirectory, { recursive: true })
const browser = await chromium.launch({ headless: true })
const diagnostics = []
try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1, isMobile: viewport.mobile, hasTouch: viewport.mobile })
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    const response = await page.goto(`${origin}/feed`, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(900)
    await page.screenshot({ path: path.join(outputDirectory, `${viewport.name}.png`), fullPage: false })
    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      title: document.title,
      mainVisible: Boolean(document.querySelector('main.page-content')),
      feedCards: document.querySelectorAll('.post-card').length,
      mobileNavVisible: getComputedStyle(document.querySelector('.mobile-nav')).display !== 'none',
      recommendationsVisible: document.querySelector('.right-column') && getComputedStyle(document.querySelector('.right-column')).display !== 'none',
    }))
    diagnostics.push({ viewport: viewport.name, status: response?.status() ?? null, pageErrors, ...layout })
    await page.close()
  }
  for (const viewport of [
    { name: 'login-brand-desktop-1440x900', width: 1440, height: 900, mobile: false },
    { name: 'login-brand-mobile-390x844', width: 390, height: 844, mobile: true },
  ]) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1, isMobile: viewport.mobile, hasTouch: viewport.mobile })
    const response = await page.goto(`${origin}/login`, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(400)
    const brandAssets = await page.locator('.institutional-reference img, .login-mobile-reference img').evaluateAll((images) => images.filter((image) => image.getBoundingClientRect().width > 0).map((image) => ({ alt: image.alt, loaded: image.complete && image.naturalWidth > 0 })))
    await page.screenshot({ path: path.join(outputDirectory, `${viewport.name}.png`), fullPage: false })
    diagnostics.push({ viewport: viewport.name, status: response?.status() ?? null, brandAssets })
    await page.close()
  }
} finally {
  await browser.close()
}
await writeFile(path.join(outputDirectory, 'diagnostics.json'), `${JSON.stringify(diagnostics, null, 2)}\n`)
console.log(JSON.stringify(diagnostics, null, 2))
if (diagnostics.some((item) => item.status !== 200 || item.horizontalOverflow || (item.pageErrors?.length ?? 0) > 0 || item.brandAssets?.some((asset) => !asset.loaded))) process.exitCode = 1
