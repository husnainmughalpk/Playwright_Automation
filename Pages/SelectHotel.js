import { test } from '@playwright/test';
import BasePage from './BasePage.js';

class SelectHotel extends BasePage {
    constructor(page) {
        super(page);

        this.radioButton = page.locator('input[type="radio"]');
        this.continueButton = page.locator('#continue');
    }

    async selectHotel(index = 0) {
        if (index !== null) {
            await test.step('Select hotel', async () => {
                await this.radioButton.nth(index).check();
                await this.attachScreenshot('Hotel selected');
            });
        }
        await test.step('Continue from hotel selection', async () => {
            await this.continueButton.click();
            await this.attachScreenshot('Continue clicked');
        });
    }

    selectionError(message) {
        return this.page.getByText(message, { exact: false });
    }
}

export default SelectHotel;
