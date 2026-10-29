import { test } from '@playwright/test';
import BasePage from './BasePage.js';

class BookedItinerary extends BasePage {
    constructor(page) {
        super(page);

        this.searchOrderId = page.locator('#order_id_text');
        this.goButton = page.locator('#search_hotel_id');
        this.orderId = page.locator('input[id^="order_id_"]:not(#order_id_text)');
        this.hotelName = page.locator('input[id^="hotel_name_"]');
        this.location = page.locator('input[id^="location_"]');
        this.firstName = page.locator('input[id^="first_name_"]');
        this.lastName = page.locator('input[id^="last_name_"]');

        this.selectBooking = page.locator('input[name="check_all"]');
        this.cancelSelectedButton = page.locator('#cancelall');
        this.searchHotelButton = page.locator('#search_hotel');
        this.logoutButton = page.locator('#logout');
    }

    async searchBooking(orderNumber) {
        await test.step('Search Booking by Order ID', async () => {
            await this.searchOrderId.fill(orderNumber);
            await this.goButton.click();
            await this.attachScreenshot('17-Booking Search Result');
        });
    }

    async selectAllBookings() {
        await test.step('Select All Bookings', async () => {
            await this.selectBooking.check();
            await this.attachScreenshot('18-All Bookings Selected');
        });
    }

    async cancelSelectedBookings() {
        await test.step('Cancel Selected Bookings', async () => {
            await this.cancelSelectedButton.click();
            await this.attachScreenshot('19-Cancel Booking Clicked');
        });
    }

    async clickSearchHotel() {
        await test.step('Navigate to Search Hotel', async () => {
            await this.searchHotelButton.click();
            await this.attachScreenshot('20-Search Hotel Page');
        });
    }

    async logout() {
        await test.step('Logout from Hotel Application', async () => {
            await this.logoutButton.click();
            await this.attachScreenshot('21-Logout Successful');
        });
    }
}

export default BookedItinerary;
