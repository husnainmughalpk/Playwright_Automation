import { test, expect } from '@playwright/test';
import { attachScreenshotAfterEach } from '../Utilities/screenshot.js';
import path from 'node:path';
import LoginPage from '../Pages/LoginPage.js';
import loginData from '../testdata/LoginData.json';

export { test, expect };

process.loadEnvFile(path.join(__dirname, '..', '.env'));

export const authenticatedTest = test.extend({
  page: async ({ page }, use) => {
    const { STATE_LOGIN_URL, STATE_LOGIN_USERNAME, STATE_LOGIN_PASSWORD } = process.env;

    if (!STATE_LOGIN_URL || !STATE_LOGIN_USERNAME || !STATE_LOGIN_PASSWORD) {
      throw new Error('Set STATE_LOGIN_URL, STATE_LOGIN_USERNAME and STATE_LOGIN_PASSWORD in the root .env file.');
    }

    const login = new LoginPage(page);
    await login.gotoLoginPage(STATE_LOGIN_URL);
    await login.login(STATE_LOGIN_USERNAME, STATE_LOGIN_PASSWORD);
    await expect(page).toHaveURL(loginData.positiveLoginData[0].expected.url);

    await use(page);
  },
});

export function setupTestHooks(testType = test) {
  testType.afterEach(async ({ page }, testInfo) => {
    await attachScreenshotAfterEach(page, testInfo);
  });
}
