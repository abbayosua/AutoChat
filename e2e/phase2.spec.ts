import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Phase 2 - Customers Page', () => {
  test('Customers page redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/customers`)
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })
})

test.describe('Phase 2 - Settings Page', () => {
  test('Settings page redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`)
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })
})

test.describe('Phase 2 - Customers API', () => {
  test('Customers API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/customers`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('Customers API supports search', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/customers?search=test`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })
})

test.describe('Phase 2 - Settings API', () => {
  test('Settings API returns data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/settings`)
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
  })

  test('Settings API can update setting', async ({ page }) => {
    const response = await page.request.patch(`${BASE_URL}/api/settings`, {
      headers: { 'Content-Type': 'application/json' },
      data: { key: 'test_setting', value: 'test_value' }
    })
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.key).toBe('test_setting')
    expect(data.data.value).toBe('test_value')
  })
})

test.describe('Phase 2 - Notes API', () => {
  test('Notes API returns notes for a ticket', async ({ page }) => {
    // First get a ticket ID
    const ticketsResponse = await page.request.get(`${BASE_URL}/api/tickets`)
    const ticketsData = await ticketsResponse.json()
    
    if (ticketsData.data && ticketsData.data.length > 0) {
      const ticketId = ticketsData.data[0].id
      
      const response = await page.request.get(`${BASE_URL}/api/tickets/${ticketId}/notes`)
      expect(response.status()).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    } else {
      // Skip test if no tickets
      test.skip()
    }
  })
})
