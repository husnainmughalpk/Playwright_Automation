import { test, expect, setupTestHooks } from '../Fixtures/TestSetup.js';
import SearchHotel from '../Pages/SearchHotel.js';
import SelectHotel from '../Pages/SelectHotel.js';
import BookHotel from '../Pages/BookHotel.js';
import BookingConfirmation from '../Pages/BookingConfirmation.js';
import BookedItinerary from '../Pages/BookedItinerary.js';
import Logout from '../Pages/Logout.js';
import searchHotelData from '../testdata/SearchHotel.json';
import bookHotelData from '../testdata/BookHotel.json';
import confirmationData from '../testdata/BookingConfirmation.json';

setupTestHooks();

test('Booking confirmation navigation - itinerary, search hotel and logout', async ({ page }) => {
  test.setTimeout(180000);
  const searchData = searchHotelData.searchHotelData[0];
  const guest = bookHotelData.bookHotelData[0];
  const search = new SearchHotel(page);
  const select = new SelectHotel(page);
  const book = new BookHotel(page);
  const confirmation = new BookingConfirmation(page);
  const itinerary = new BookedItinerary(page);
  const logout = new Logout(page);

  await search.navigate(searchData.url);
  await search.searchHotel(
      searchData.location, '', searchData.rooms, searchData.checkInDate,
      searchData.checkOutDate, searchData.adults, searchData.roomType,
      searchData.children,
    );
  await select.selectHotel(0);
  await book.bookHotel(
      guest.firstName, guest.lastName, guest.address, guest.cardNumber,
      guest.cardType, guest.expiryMonth, guest.expiryYear, guest.cvv,
    );

  await test.step('Verify booking confirmation URL', async () => {
    await expect(page).toHaveURL(guest.expected.url, { timeout: 30000 });
    await confirmation.attachScreenshot('Confirmation flow - Booking confirmed');
  });

  await confirmation.clickMyItinerary();

  await test.step('Verify Booked Itinerary URL', async () => {
    await expect(page).toHaveURL(confirmationData.expectedUrls.bookedItinerary);
    await confirmation.attachScreenshot('Confirmation flow - Itinerary URL verified');
  });

  await itinerary.clickSearchHotel();

  await test.step('Verify Search Hotel URL', async () => {
    await expect(page).toHaveURL(searchData.url);
    await confirmation.attachScreenshot('Confirmation flow - Search URL verified');
  });

  await logout.logout();

  await test.step('Verify Logout URL', async () => {
    await expect(page).toHaveURL(confirmationData.expectedUrls.logout);
    await confirmation.attachScreenshot('Confirmation flow - Logout URL verified');
  });
});
