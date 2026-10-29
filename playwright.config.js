// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';

const apiEnvPath = path.join(__dirname, 'tests', 'api_Tests', '.env');
if (existsSync(apiEnvPath)) process.loadEnvFile(apiEnvPath);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // globalSetup: './reporting/setup.js',
  // globalTeardown: './reporting/teardown.js',
  timeout: 60000,
  testDir: './tests',
  /* Run each file's tests in order; different files can still run in parallel. */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Run up to four workers in parallel. */
  workers: 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  
reporter: [
  ['list'],
  ['html', {
    outputFolder: 'playwright-report',
    open: 'never'
  }],
  // ['allure-playwright', {
  //   resultsDir: 'allure-results'
  // }],
],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect a trace on retry without recording every successful test. */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api',
      testMatch: /api_Tests\/.*\.spec\.js/,
      timeout: 30000,
      use: {
        baseURL: 'https://api-testing-postman.vercel.app',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke',
      testMatch: /SmokeTest\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      testIgnore: [/auth\.setup\.js/, /api_Tests\//, /SmokeTest\.spec\.js/],
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
    },

    {
      name: 'firefox',
      testIgnore: [/auth\.setup\.js/, /api_Tests\//, /SmokeTest\.spec\.js/],
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
    },

    {
      name: 'webkit',
      testIgnore: [/auth\.setup\.js/, /api_Tests\//, /SmokeTest\.spec\.js/],

      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        // This demo site's certificate is rejected by WebKit on Windows.
        ignoreHTTPSErrors: true,
        storageState: 'playwright/.auth/user.json',
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
