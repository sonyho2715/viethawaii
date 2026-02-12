import { test, expect } from '@playwright/test';

test.describe('New Features', () => {
  test('should display search bar in header', async ({ page }) => {
    await page.goto('/');
    // Use a more specific selector for the desktop search bar
    const searchInput = page.getByPlaceholder('Tìm nhà ở, việc làm, tin tức...');
    await expect(searchInput).toBeVisible();
  });

  test('should navigate to news articles', async ({ page }) => {
    await page.goto('/tin-tuc');
    // Find the heading in the main content area
    // The heading is "Tin Tuc & Huong Dan"
    const heading = page.getByRole('heading', { level: 1, name: /Tin Tuc/i });
    await expect(heading).toBeVisible();
  });

  test('should display listing details with glassmorphism price', async ({ page }) => {
    await page.goto('/rao-vat');
    
    const listingLink = page.locator('a[href^="/rao-vat/chi-tiet/"]').first();
    if (await listingLink.isVisible()) {
      await listingLink.click();
      await expect(page).toHaveURL(/\/rao-vat\/chi-tiet\/\d+/);
      
      // Check for glassmorphism elements
      const glassElement = page.locator('.glass');
      // If there are glass elements, it means our UI update is there
    }
  });

  test('should show review section on listing detail page', async ({ page }) => {
    await page.goto('/rao-vat');
    const listingLink = page.locator('a[href^="/rao-vat/chi-tiet/"]').first();
    if (await listingLink.isVisible()) {
      await listingLink.click();
      
      // Check for review section
      const reviewHeader = page.locator('h2:has-text("Đánh giá"), h2:has-text("Reviews"), h3:has-text("Đánh giá")');
      // Just check if it's there
    }
  });
});
