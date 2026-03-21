import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Dashboard Flow', () => {
  test('Dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`)

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })

  test('Tickets page redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/tickets`)

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })
})

test.describe('Landing Page', () => {
  test('Landing page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/`)

    // Check page title
    await expect(page).toHaveTitle(/AutoChat/)

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check for hero text - use more specific selector
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 })
  })

  test('Landing page has Get Started button', async ({ page }) => {
    await page.goto(`${BASE_URL}/`)
    await page.waitForLoadState('networkidle')

    // Check for Get Started link
    const getStartedLinks = page.getByRole('link', { name: /get started/i })
    await expect(getStartedLinks.first()).toBeVisible({ timeout: 10000 })
  })

  test('Landing page shows features', async ({ page }) => {
    await page.goto(`${BASE_URL}/`)
    await page.waitForLoadState('networkidle')

    // Check for feature section - use role heading for more specificity
    await expect(page.getByRole('heading', { name: /AI-Powered Responses/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('heading', { name: /Sentiment Analysis/i })).toBeVisible({ timeout: 10000 })
  })

  test('Landing page shows pricing', async ({ page }) => {
    await page.goto(`${BASE_URL}/`)
    await page.waitForLoadState('networkidle')

    // Scroll down to trigger animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(2000)

    // Check for pricing section - use first() to handle multiple matches
    const starterText = page.locator('text=Starter').first()
    await expect(starterText).toBeVisible({ timeout: 15000 })
  })
})

test.describe('API Health', () => {
  test('API root endpoint returns success', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.message).toBeDefined()
  })

  test('Dashboard metrics API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/dashboard/metrics`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toBeDefined()
    expect(typeof data.data.totalTickets).toBe('number')
  })

  test('Tickets API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/tickets`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('Agents API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/agents`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('Activities API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/activities`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('Notifications API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/notifications`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
  })
})
