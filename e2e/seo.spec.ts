import { test, expect } from '@playwright/test';

test.describe('SEO and Structured Data', () => {
  test('should have JSON-LD structured data on home page', async ({ page }) => {
    await page.goto('/');
    
    const scripts = await page.locator('script[type="application/ld+json"]').count();
    // At least one script should exist
    expect(scripts).toBeGreaterThan(0);
  });

  test('should have correct title and meta tags on home page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/VietHawaii/);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.toLowerCase()).toContain('cộng đồng việt nam tại hawaii');
  });

  test('should have a sitemap.xml', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const content = await response?.text();
    expect(content).toContain('<urlset');
    expect(content).toContain('viethawaii.com');
  });

  test('should have a robots.txt', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const content = await response?.text();
    expect(content?.toLowerCase()).toContain('user-agent: *');
    expect(content?.toLowerCase()).toContain('sitemap:');
  });
});
