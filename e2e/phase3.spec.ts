import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Phase 3 - Chat Page', () => {
  test('Chat page redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/chat`)
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })
})

test.describe('Phase 3 - Knowledge Page', () => {
  test('Knowledge page redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/knowledge`)
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })
})

test.describe('Phase 3 - Reports Page', () => {
  test('Reports page redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/reports`)
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })
})

test.describe('Phase 3 - Knowledge API', () => {
  test('Knowledge API returns articles', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/knowledge`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data.length).toBeGreaterThan(0)
  })

  test('Knowledge API supports category filter', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/knowledge?category=Getting%20Started`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
  })

  test('Knowledge API supports search', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/knowledge?search=ticket`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
  })
})

test.describe('Phase 3 - Reports API', () => {
  test('Reports API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/reports`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toBeDefined()
    expect(data.data.summary).toBeDefined()
    expect(data.data.summary.totalTickets).toBeGreaterThanOrEqual(0)
  })

  test('Reports API supports period parameter', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/reports?period=30d`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.period).toBe('30d')
  })

  test('Reports API returns chart data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/reports`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.charts).toBeDefined()
    expect(Array.isArray(data.data.charts.ticketsByDay)).toBe(true)
  })
})

test.describe('Phase 3 - Chat API (Supabase Realtime)', () => {
  test('Chat rooms API returns rooms', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/chat/rooms`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data.length).toBeGreaterThan(0)

    // Check room structure
    const room = data.data[0]
    expect(room.id).toBeDefined()
    expect(room.name).toBeDefined()
    expect(typeof room.participantCount).toBe('number')
  })

  test('Chat messages API returns messages for a room', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/chat/rooms/general/messages`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('Chat messages API can send a message', async ({ page }) => {
    const response = await page.request.post(`${BASE_URL}/api/chat/rooms/general/messages`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        content: 'Test message from Playwright',
        senderName: 'Playwright Test',
      }),
    })
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.content).toBe('Test message from Playwright')
    expect(data.data.sender.name).toBe('Playwright Test')
  })

  test('Chat messages API rejects empty content', async ({ page }) => {
    const response = await page.request.post(`${BASE_URL}/api/chat/rooms/general/messages`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        content: '',
        senderName: 'Playwright Test',
      }),
    })
    expect(response.status()).toBe(400)

    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('required')
  })
})
