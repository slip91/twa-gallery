import { test, expect } from '@playwright/test';

const SCREENSHOTS_DIR = 'tests/screenshots';

test.describe('Design Comparison', () => {
  test('Home page - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-mobile.png`, fullPage: true });
  });

  test('Home page - desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/home-desktop.png`, fullPage: true });
  });

  test('Card detail page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000/card/1');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/card-mobile.png`, fullPage: true });
  });

  test('Card detail page - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/card/1');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/card-desktop.png`, fullPage: true });
  });

  test('Profile page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000/profile');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/profile-mobile.png`, fullPage: true });
  });
});