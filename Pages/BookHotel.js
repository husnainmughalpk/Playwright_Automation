import { test } from '@playwright/test';
import BasePage from './BasePage.js';

class BookHotel extends BasePage {
    constructor(page) {
        super(page);

        this.firstName = page.locator('#first_name');
        this.lastName = page.locator('#last_name');
        this.address = page.locator('#address');
        this.cardNumber = page.locator('#cc_num');
        this.cardType = page.locator('#cc_type');
        this.expiryMonth = page.locator('#cc_exp_month');
        this.expiryYear = page.locator('#cc_exp_year');
        this.cvv = page.locator('#cc_cvv');
        this.bookNowButton = page.locator('#book_now');
    }

    async bookHotel(
        firstName,
        lastName,
        address,
        cardNumber,
        cardType,
        expiryMonth,
        expiryYear,
        cvv
    ) {
        await test.step('Enter booking details', async () => {
            await this.firstName.fill(firstName);
            await this.lastName.fill(lastName);
            await this.address.fill(address);
            await this.cardNumber.fill(cardNumber);
            await this.cardType.selectOption({ label: cardType });
            await this.expiryMonth.selectOption({ label: expiryMonth });
            await this.expiryYear.selectOption(expiryYear);
            await this.cvv.fill(cvv);
            await this.attachScreenshot('Booking details entered');
        });
        await test.step('Submit booking', async () => {
            await this.bookNowButton.click();
            await this.attachScreenshot('Booking submitted');
        });
    }

    validationError(selector) {
        return this.page.locator(selector);
    }
}

export default BookHotel;
