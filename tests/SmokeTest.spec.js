import { test, expect } from '@playwright/test';
import path from 'node:path';
import LoginPage from '../Pages/LoginPage.js';
import SearchHotel from '../Pages/SearchHotel.js';
import SelectHotel from '../Pages/SelectHotel.js';
import BookHotel from '../Pages/BookHotel.js';
import BookingConfirmation from '../Pages/BookingConfirmation.js';
import BookedItinerary from '../Pages/BookedItinerary.js';
import Logout from '../Pages/Logout.js';
import loginData from '../testdata/LoginData.json';
import searchHotelData from '../testdata/SearchHotel.json';
import selectHotelData from '../testdata/SelectHotel.json';
import bookHotelData from '../testdata/BookHotel.json';
import confirmationData from '../testdata/BookingConfirmation.json';

process.loadEnvFile(path.join(__dirname, '..', '.env'));

test('Smoke - login through logout @smoke', async ({ page }) => {
  test.setTimeout(180000);
  const credentials = loginData.positiveLoginData[0];
  const { STATE_LOGIN_USERNAME, STATE_LOGIN_PASSWORD } = process.env;

  if (!STATE_LOGIN_USERNAME || !STATE_LOGIN_PASSWORD) {
    throw new Error('Set STATE_LOGIN_USERNAME and STATE_LOGIN_PASSWORD in the root .env file.');
  }

  const searchData = searchHotelData.searchHotelData[0];
  const selectData = selectHotelData.positiveSelectHotelData[0];
  const guest = bookHotelData.bookHotelData[0];
  const login = new LoginPage(page);
  const search = new SearchHotel(page);
  const select = new SelectHotel(page);
  const book = new BookHotel(page);
  const confirmation = new BookingConfirmation(page);
  const itinerary = new BookedItinerary(page);
  const logout = new Logout(page);

  await login.gotoLoginPage(credentials.url);
  await login.login(STATE_LOGIN_USERNAME, STATE_LOGIN_PASSWORD);

  await test.step('Verify login', async () => {
    await expect(page).toHaveURL(credentials.expected.url);
    await expect(login.expectedMsg.first()).toHaveText(credentials.expectedMsg);
    await login.attachScreenshot('Smoke - Login verified');
  });

  await search.searchHotel(
      searchData.location, '', searchData.rooms, searchData.checkInDate,
      searchData.checkOutDate, searchData.adults, searchData.roomType,
      searchData.children,
    );

  await test.step('Verify search result URL', async () => {
    await expect(page).toHaveURL(new URL(searchData.expected.url, searchData.url).href);
    await search.attachScreenshot('Smoke - Search URL verified');
  });

  await select.selectHotel(selectData.radioButton);

  await test.step('Verify booking form URL', async () => {
    await expect(page).toHaveURL(new URL(selectData.expected.url, searchData.url).href);
    await select.attachScreenshot('Smoke - Booking form URL verified');
  });

  await book.bookHotel(
      guest.firstName, guest.lastName, guest.address, guest.cardNumber,
      guest.cardType, guest.expiryMonth, guest.expiryYear, guest.cvv,
    );

  await test.step('Verify booking confirmation URL', async () => {
    await expect(page).toHaveURL(guest.expected.url, { timeout: 30000 });
    await confirmation.attachScreenshot('Smoke - Booking confirmed');
  });

  await confirmation.clickMyItinerary();

  await test.step('Verify itinerary URL', async () => {
    await expect(page).toHaveURL(confirmationData.expectedUrls.bookedItinerary);
    await confirmation.attachScreenshot('Smoke - Itinerary URL verified');
  });

  await itinerary.clickSearchHotel();

  await test.step('Verify Search Hotel URL', async () => {
    await expect(page).toHaveURL(searchData.url);
    await confirmation.attachScreenshot('Smoke - Search URL verified');
  });

  await logout.logout();

  await test.step('Verify logout URL', async () => {
    await expect(page).toHaveURL(confirmationData.expectedUrls.logout);
    await confirmation.attachScreenshot('Smoke - Logout URL verified');
  });
});
