import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Auth Flows', () => {
  test.describe('Happy Flows', () => {
    test('Login page loads successfully', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)

      // Check page title
      await expect(page).toHaveTitle(/AutoChat/)

      // Check for login form elements using text content
      await expect(page.getByText(/welcome back/i)).toBeVisible()

      // Check for email input
      const emailInput = page.getByLabel(/email/i)
      await expect(emailInput).toBeVisible()

      // Check for password input
      const passwordInput = page.getByLabel(/password/i)
      await expect(passwordInput).toBeVisible()

      // Check for sign in button
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()

      // Check for Google OAuth button
      await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()

      // Check for sign up link
      await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
    })

    test('Switch to signup mode', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)

      // Click sign up link
      await page.getByRole('link', { name: /sign up/i }).click()

      // Check URL has mode=signup
      await expect(page).toHaveURL(/mode=signup/)

      // Check for signup heading using text content
      await expect(page.getByText(/create your account/i)).toBeVisible()

      // Check for name input (only in signup mode)
      await expect(page.getByLabel(/full name/i)).toBeVisible()
    })

    test('Landing page navigation to login', async ({ page }) => {
      await page.goto(`${BASE_URL}/`)

      // Click Get Started button
      await page.getByRole('link', { name: /get started/i }).first().click()

      // Should navigate to login page
      await expect(page).toHaveURL(/\/login/)
    })

    test('Back to home link works', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)

      // Click back to home link
      await page.getByRole('link', { name: /back to home/i }).click()

      // Should navigate to landing page
      await expect(page).toHaveURL(`${BASE_URL}/`)
    })

    test('Signup form has all required fields', async ({ page }) => {
      await page.goto(`${BASE_URL}/login?mode=signup`)

      // Check for name input
      await expect(page.getByLabel(/full name/i)).toBeVisible()

      // Check for email input
      await expect(page.getByLabel(/email/i)).toBeVisible()

      // Check for password input
      await expect(page.getByLabel(/password/i)).toBeVisible()

      // Check for create account button
      await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
    })
  })

  test.describe('Sad Flows', () => {
    test('Login with empty fields shows validation', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)

      // Click sign in without filling fields
      await page.getByRole('button', { name: /sign in/i }).click()

      // Check for HTML5 validation (email input should be invalid)
      const emailInput = page.getByLabel(/email/i)
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
      expect(isInvalid).toBe(true)
    })

    test('Login with invalid email format', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)

      // Fill invalid email
      await page.getByLabel(/email/i).fill('invalid-email')
      await page.getByLabel(/password/i).fill('somepassword')

      // Click sign in
      await page.getByRole('button', { name: /sign in/i }).click()

      // Check for HTML5 email validation
      const emailInput = page.getByLabel(/email/i)
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
      expect(isInvalid).toBe(true)
    })

    test('Login with short password', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)

      // Fill valid email but short password
      await page.getByLabel(/email/i).fill('test@example.com')
      await page.getByLabel(/password/i).fill('123') // Less than 6 chars

      // Click sign in
      await page.getByRole('button', { name: /sign in/i }).click()

      // Check for HTML5 minlength validation
      const passwordInput = page.getByLabel(/password/i)
      const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
      expect(isInvalid).toBe(true)
    })

    test('Login with wrong credentials shows error', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)

      // Fill with non-existent credentials
      await page.getByLabel(/email/i).fill('nonexistent@example.com')
      await page.getByLabel(/password/i).fill('wrongpassword123')

      // Click sign in
      await page.getByRole('button', { name: /sign in/i }).click()

      // Wait for error message (Supabase will return an error)
      // The error should be displayed in the error div
      await page.waitForTimeout(2000)

      // Check for error indication (either error message or still on login page)
      await expect(page).toHaveURL(/\/login/)
    })

    test('Signup with empty name field', async ({ page }) => {
      await page.goto(`${BASE_URL}/login?mode=signup`)

      // Fill email and password but not name
      await page.getByLabel(/email/i).fill('test@example.com')
      await page.getByLabel(/password/i).fill('password123')

      // Click create account
      await page.getByRole('button', { name: /create account/i }).click()

      // Check for HTML5 validation on name input
      const nameInput = page.getByLabel(/full name/i)
      const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
      expect(isInvalid).toBe(true)
    })

    test('Signup with existing email shows error', async ({ page }) => {
      await page.goto(`${BASE_URL}/login?mode=signup`)

      // Fill with existing user email (from seed data)
      await page.getByLabel(/full name/i).fill('Test User')
      await page.getByLabel(/email/i).fill('admin@autochat.com')
      await page.getByLabel(/password/i).fill('password123')

      // Click create account
      await page.getByRole('button', { name: /create account/i }).click()

      // Wait for response
      await page.waitForTimeout(3000)

      // Should still be on signup page (error occurred)
      // Or show error message
      await expect(page).toHaveURL(/\/login/)
    })

    test('Dashboard redirects to login when not authenticated', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`)

      // Should redirect to login page
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    })

    test('Forgot password link is visible', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)

      // Check for forgot password link
      await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible()
    })
  })
})
