
import { test } from '@playwright/test';

async function captureScreenshot(page, testInfo, name) {
    try {
        if (page.isClosed()) {
            console.warn(`Screenshot skipped: ${name} - page is closed.`);
            return;
        }

        const screenshot = await page.screenshot({
            timeout: 50000,
            animations: 'disabled',
            caret: 'hide',
        });

        await testInfo.attach(name, {
            body: screenshot,
            contentType: 'image/png',
        });

    } catch (error) {
        console.warn(
            `Screenshot failed (${name}): ${error.message}`
        );
    }
}

export async function attachStepScreenshot(page, name) {
    await captureScreenshot(page, test.info(), name);
}

export async function attachScreenshotAfterEach(page, testInfo) {
    await captureScreenshot(page, testInfo, 'Final Screenshot');

    if (testInfo.status !== testInfo.expectedStatus) {
        await captureScreenshot(page, testInfo, 'Failure Screenshot');
    }
}
