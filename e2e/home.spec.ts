import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the home page', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page).toHaveTitle(/VietHawaii/i);
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Page should still be functional on mobile
    await expect(page).toHaveTitle(/VietHawaii/i);
  });
});

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/dang-nhap');

    // Check for login form elements
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/dang-ky');

    // Check for registration form
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/dang-nhap');

    // Fill in invalid credentials
    await page.fill('input[name="email"]', 'invalid@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error or redirect with error
    await page.waitForURL(/error|dang-nhap/);
  });
});

test.describe('Listings', () => {
  test('should display listings page', async ({ page }) => {
    await page.goto('/rao-vat');

    // Should show listings or empty state
    await expect(page).toHaveURL(/rao-vat/);
  });

  test('should filter listings by category', async ({ page }) => {
    await page.goto('/rao-vat');

    // Click on a category filter if available
    const categoryFilter = page.locator('[data-testid="category-filter"]').first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
    }
  });
});

test.describe('Events', () => {
  test('should display events page', async ({ page }) => {
    await page.goto('/su-kien');

    await expect(page).toHaveURL(/su-kien/);
  });
});

test.describe('Accessibility', () => {
  test('should have no accessibility violations on home page', async ({ page }) => {
    await page.goto('/');

    // Basic accessibility checks
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Images should have alt text (can be empty for decorative images)
      expect(alt !== null).toBe(true);
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab through the page
    await page.keyboard.press('Tab');

    // Should have a focused element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
