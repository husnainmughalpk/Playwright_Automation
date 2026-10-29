import { test, expect, setupTestHooks } from '../Fixtures/TestSetup.js';
import SearchHotel from '../Pages/SearchHotel.js';
import SelectHotel from '../Pages/SelectHotel.js';
import searchHotelData from '../testdata/SearchHotel.json';
import selectHotelData from '../testdata/SelectHotel.json';

setupTestHooks();

test.describe('Positive Select Hotel Scenarios', () => {
  selectHotelData.positiveSelectHotelData.forEach((data) => {
    test(`Select Hotel - ${data.testName}`, async ({ page }) => {
      const searchData = searchHotelData.searchHotelData[0];
      const search = new SearchHotel(page);
      const select = new SelectHotel(page);

      await search.navigate(searchData.url);
      await search.searchHotel(
          searchData.location, '', searchData.rooms, searchData.checkInDate,
          searchData.checkOutDate, searchData.adults, '', searchData.children,
        );
      await select.selectHotel(data.radioButton);

      await test.step('Verify booking page', async () => {
        await expect(page).toHaveURL(new URL(data.expected.url, searchData.url).href);
        await select.attachScreenshot('Select Hotel - Booking page verified');
      });
    });
  });
});

test.describe('Negative Select Hotel Scenarios', () => {
  selectHotelData.negativeSelectHotelData.forEach((data) => {
    test(`Select Hotel - ${data.testName}`, async ({ page }) => {
    const searchData = searchHotelData.searchHotelData[0];
    const search = new SearchHotel(page);
    const select = new SelectHotel(page);

    await search.navigate(searchData.url);
    await search.searchHotel(
        searchData.location, '', searchData.rooms, searchData.checkInDate,
        searchData.checkOutDate, searchData.adults, '', searchData.children,
      );
    await select.selectHotel(data.radioButton);

    await test.step('Verify selection error', async () => {
      await expect(page).toHaveURL(new URL(data.expected.url, searchData.url).href);
      await expect(select.selectionError(data.expected.message)).toBeVisible();
      await select.attachScreenshot('Select Hotel - Error verified');
    });
    });
  });
});
