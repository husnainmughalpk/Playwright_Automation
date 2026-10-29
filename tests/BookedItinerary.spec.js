import { test, expect, setupTestHooks } from '../Fixtures/TestSetup.js';
import SearchHotel from '../Pages/SearchHotel.js';
import SelectHotel from '../Pages/SelectHotel.js';
import BookHotel from '../Pages/BookHotel.js';
import BookingConfirmation from '../Pages/BookingConfirmation.js';
import BookedItinerary from '../Pages/BookedItinerary.js';
import searchHotelData from '../testdata/SearchHotel.json';
import selectHotelData from '../testdata/SelectHotel.json';
import bookHotelData from '../testdata/BookHotel.json';
import confirmationData from '../testdata/BookingConfirmation.json';

setupTestHooks();

test('Booked itinerary - find and verify a new booking', async ({ page }) => {
  test.setTimeout(180000);

  const searchData = searchHotelData.searchHotelData[0];
  const selectData = selectHotelData.positiveSelectHotelData[0];
  const guest = bookHotelData.bookHotelData[0];
  const search = new SearchHotel(page);
  const select = new SelectHotel(page);
  const book = new BookHotel(page);
  const confirmation = new BookingConfirmation(page);
  const itinerary = new BookedItinerary(page);
  let orderNumber;

  await search.navigate(searchData.url);
  await search.searchHotel(
      searchData.location, searchData.hotel, searchData.rooms,
      searchData.checkInDate, searchData.checkOutDate, searchData.adults,
      searchData.roomType, searchData.children,
    );
  await test.step('Verify search results page', async () => {
    await expect(page).toHaveURL(new URL(searchData.expected.url, searchData.url).href);
    await search.attachScreenshot('Itinerary - Search results opened');
  });

  await test.step('Verify a hotel is available', async () => {
    await expect(select.radioButton.first()).toBeVisible({ timeout: 15000 });
    await select.attachScreenshot('Itinerary - Hotel available');
  });
  await select.selectHotel(0);
  await test.step('Verify booking form page', async () => {
    await expect(page).toHaveURL(new URL(selectData.expected.url, searchData.url).href);
    await select.attachScreenshot('Itinerary - Booking form opened');
  });

  await book.bookHotel(
      guest.firstName, guest.lastName, guest.address, guest.cardNumber,
      guest.cardType, guest.expiryMonth, guest.expiryYear, guest.cvv,
    );
  await test.step('Verify booking confirmation page', async () => {
    await expect(page).toHaveURL(guest.expected.url, { timeout: 30000 });
    await book.attachScreenshot('Itinerary - Booking confirmed');
  });

  await test.step('Verify booking order number', async () => {
    await expect(confirmation.orderNumber).toHaveValue(/\S+/, { timeout: 30000 });
    await confirmation.attachScreenshot('Itinerary - Order number verified');
  });
  orderNumber = await confirmation.getOrderNumber();

  await confirmation.clickMyItinerary();
  await test.step('Verify Booked Itinerary page', async () => {
    await expect(page).toHaveURL(confirmationData.expectedUrls.bookedItinerary);
    await itinerary.attachScreenshot('Itinerary - Page opened');
  });

  await itinerary.searchBooking(orderNumber);
  await test.step('Verify searched booking', async () => {
    await expect(itinerary.orderId).toHaveValue(orderNumber);
    await itinerary.attachScreenshot('Itinerary - Booking found');
  });

  await test.step('Verify booked customer details', async () => {
    await expect(itinerary.firstName).toHaveValue(guest.firstName);
    await expect(itinerary.lastName).toHaveValue(guest.lastName);
    await itinerary.attachScreenshot('Itinerary - Customer verified');
  });
});
