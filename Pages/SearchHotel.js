import { test } from '@playwright/test';
import BasePage from './BasePage.js';

class SearchHotel extends BasePage {
  constructor(page) {
    super(page);

    this.location = page.locator('#location');
    this.hotels = page.locator('#hotels');
    this.roomType = page.locator('#room_type');
    this.roomNos = page.locator('#room_nos');
    this.checkInDate = page.locator('#datepick_in');
    this.checkOutDate = page.locator('#datepick_out');
    this.adultRoom = page.locator('#adult_room');
    this.childRoom = page.locator('#child_room');
    this.submitButton = page.locator('#Submit');
    this.hotelResults = page.locator('input[type="radio"]');
  }

  async searchHotel(location, hotel, roomNos, checkInDate, checkOutDate, adultRoom, roomType, children) {
    await test.step('Enter hotel search details', async () => {
      await this.location.selectOption(location);
      await this.hotels.selectOption(hotel);
      await this.roomType.selectOption(roomType);
      await this.roomNos.selectOption(roomNos);
      await this.checkInDate.fill(checkInDate);
      await this.checkOutDate.fill(checkOutDate);
      await this.adultRoom.selectOption(adultRoom);
      await this.childRoom.selectOption(children);
      await this.attachScreenshot('Search details entered');
    });
    await test.step('Submit hotel search', async () => {
      await this.submitButton.click();
      await this.attachScreenshot('Hotel search submitted');
    });
  }

  validationError(selector) {
    return this.page.locator(selector);
  }

  errorMessage(message) {
    return this.page.getByText(message, { exact: false }).first();
  }
}

export default SearchHotel;
