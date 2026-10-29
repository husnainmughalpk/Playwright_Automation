import { attachStepScreenshot } from '../Utilities/screenshot.js';
import { test } from '@playwright/test';

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(url) {
    await test.step('Open page', async () => {
      await this.page.goto(url, { waitUntil: 'load' });
      await this.attachScreenshot('Page opened');
    });
  }

  async submitAndWait(control) {
    // Register before clicking: forms may reload the same URL.
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'load', timeout: 60000 }),
      control.click({ noWaitAfter: true }),
    ]);
  }

  async attachScreenshot(name) {
    await attachStepScreenshot(this.page, name);
  }
}

export default BasePage;
