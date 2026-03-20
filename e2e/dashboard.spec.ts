import { test, expect } from '@playwright/test';

test.describe('AutoChat Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load dashboard with all components', async ({ page }) => {
    // Check sidebar
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.getByText('AutoChat').first()).toBeVisible();

    // Check metrics grid - use first() to avoid strict mode
    await expect(page.getByText('Total Tickets').first()).toBeVisible();
    await expect(page.getByText('Open Tickets').first()).toBeVisible();
    await expect(page.getByText('Resolved').first()).toBeVisible();

    // Check ticket list
    await expect(page.getByText('Tickets').first()).toBeVisible();
  });

  test('should display ticket list with mock data', async ({ page }) => {
    // Check ticket items are visible
    await expect(page.getByText('Unable to login')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Billing question')).toBeVisible();
  });

  test('should filter tickets by status', async ({ page }) => {
    // Click on "Open" filter tab
    await page.getByRole('tab', { name: /open/i }).click();
    await page.waitForTimeout(300);

    // Verify filter is applied
    await expect(page.getByText(/Showing/)).toBeVisible();
  });

  test('should open ticket detail modal on click', async ({ page }) => {
    // Find and click first ticket
    await page.getByText('Unable to login').first().click();

    // Check modal opens
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });

    // Check modal content
    await expect(page.getByText('Customer Profile')).toBeVisible();
  });

  test('should show AI suggestions panel', async ({ page }) => {
    // Check AI suggestions section exists
    await expect(page.getByText('AI Response Suggestions')).toBeVisible();
  });

  test('should display activity timeline', async ({ page }) => {
    // Check activity section
    await expect(page.getByText('Recent Activity')).toBeVisible();
  });

  test('should navigate sidebar items', async ({ page }) => {
    // Check sidebar navigation items
    await expect(page.getByText('Dashboard').first()).toBeVisible();
    await expect(page.getByText('Tickets').first()).toBeVisible();
    await expect(page.getByText('Customers')).toBeVisible();
  });

  test('should have proper color scheme (teal primary)', async ({ page }) => {
    // Check that teal colors are used (no blue/indigo)
    const tealElements = page.locator('[class*="teal"]');
    const count = await tealElements.count();
    expect(count).toBeGreaterThan(0);
  });
});
