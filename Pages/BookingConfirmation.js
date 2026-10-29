import { test } from '@playwright/test';
import BasePage from './BasePage.js';

class BookingConfirmation extends BasePage {
    constructor(page) {
        super(page);

        this.orderNumber = page.locator('#order_no');
        this.hotelName = page.locator('#hotel_name');
        this.location = page.locator('#location');
        this.roomType = page.locator('#room_type');
        this.firstName = page.locator('#first_name');
        this.lastName = page.locator('#last_name');
        this.address = page.locator('#address');

        this.searchHotelButton = page.locator('#search_hotel');
        this.myItineraryButton = page.locator('#my_itinerary');
        this.logoutButton = page.locator('#logout');
    }

    async getOrderNumber() {
        return await test.step('Get Booking Order Number', async () => {
            const orderNumber = await this.orderNumber.inputValue();
            await this.attachScreenshot('13-Booking Order Number');
            return orderNumber;
        });
    }

    async clickSearchHotel() {
        await test.step('Navigate to Search Hotel', async () => {
            await this.searchHotelButton.click();
            await this.attachScreenshot('14-Search Hotel Page');
        });
    }

    async clickMyItinerary() {
        await test.step('Navigate to My Itinerary', async () => {
            await this.myItineraryButton.click();
            await this.attachScreenshot('15-My Itinerary Page');
        });
    }

    async logout() {
        await test.step('Logout from Adactin Hotel', async () => {
            await this.logoutButton.click();
            await this.attachScreenshot('16-Logout Successful');
        });
    }
}

export default BookingConfirmation;