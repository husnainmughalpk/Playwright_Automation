
// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';

const apiEnvPath = path.join(__dirname, 'tests', 'api_Tests', '.env');

if (existsSync(apiEnvPath)) {
    process.loadEnvFile(apiEnvPath);
}

export default defineConfig({
    timeout: 120000,

    expect: {
        timeout: 15000,
    },

    testDir: './tests',

    fullyParallel: false,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    // One worker temporarily to diagnose Adactin session conflicts.
    workers: 1,

    reporter: [
        ['list'],
        ['html', {
            outputFolder: 'playwright-report',
            open: 'never',
        }],
        // ['allure-playwright', {
        //     resultsDir: 'allure-results',
        // }],
    ],

    use: {
        actionTimeout: 60000,
        navigationTimeout: 60000,
        trace: 'on-first-retry',
    },

    projects: [
        // API Tests
        {
            name: 'api',
            testMatch: '**/api_Tests/**/*.spec.js',
            timeout: 30000,
            use: {
                baseURL: 'https://api-testing-postman.vercel.app',
                extraHTTPHeaders: {
                    Accept: 'application/json',
                },
            },
        },

        // Authentication Setup
        {
            name: 'setup',
            testMatch: '**/auth.setup.js',
            use: {
                ...devices['Desktop Chrome'],
            },
        },

        // Smoke Tests
        {
            name: 'smoke',
            testMatch: '**/SmokeTest.spec.js',
            use: {
                ...devices['Desktop Chrome'],
            },
        },

        // Chromium
        {
            name: 'chromium',
            testIgnore: [
                '**/auth.setup.js',
                '**/api_Tests/**',
                '**/SmokeTest.spec.js',
            ],
            dependencies: ['setup'],
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/user.json',
            },
        },

        // Firefox
        {
            name: 'firefox',
            testIgnore: [
                '**/auth.setup.js',
                '**/api_Tests/**',
                '**/SmokeTest.spec.js',
            ],
            dependencies: ['setup'],
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'playwright/.auth/user.json',
            },
        },

        // WebKit
        {
            name: 'webkit',
            testIgnore: [
                '**/auth.setup.js',
                '**/api_Tests/**',
                '**/SmokeTest.spec.js',
            ],
            dependencies: ['setup'],
            use: {
                ...devices['Desktop Safari'],
                storageState: 'playwright/.auth/user.json',
                ignoreHTTPSErrors: true,
            },
        },
    ],
});
