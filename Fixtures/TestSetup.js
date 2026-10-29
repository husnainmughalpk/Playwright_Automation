import { test, expect } from '@playwright/test';
import { attachScreenshotAfterEach } from '../Utilities/screenshot.js';

export { test, expect };

export function setupTestHooks() {
  test.afterEach(async ({ page }, testInfo) => {
    await attachScreenshotAfterEach(page, testInfo);
  });
}
