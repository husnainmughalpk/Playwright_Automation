import { test, expect, setupTestHooks } from '../Fixtures/TestSetup.js';

setupTestHooks();
import SearchHotel from '../Pages/SearchHotel';
import searchHotelData from '../testdata/SearchHotel.json';


test.describe('Positive Search Hotel Scenarios', () => {
searchHotelData.searchHotelData.forEach((data) => {
  test(data.testName, async ({ page }) => {
    const search = new SearchHotel(page);

        await search.navigate(data.url);
        await search.searchHotel(data.location,
            data.hotel, data.rooms,
            data.checkInDate, data.checkOutDate,
            data.adults, data.roomType,
            data.children);
    
        await test.step('Verify Search Success', async () => {
            await expect(page).toHaveURL(
            new RegExp(data.expected.url),
            { timeout: 15000 }
            
            );
            if (data.expected.hotelResultVisible) {
              await expect(search.hotelResults.first()).toBeVisible();
            }
            await search.attachScreenshot('07-After Search Success');
        });

  });

});
});

test.describe('Negative Search Hotel Scenarios', () => {
searchHotelData.negativeSearchData.forEach((data) => {
  test(data.testName, async ({ page }) => {
    const valid = searchHotelData.searchHotelData[1];
    const search = new SearchHotel(page);

    await search.navigate(valid.url);
    await search.searchHotel(
        data.location ?? valid.location, '', data.rooms ?? valid.rooms,
        data.checkInDate ?? valid.checkInDate, data.checkOutDate ?? valid.checkOutDate,
        data.adults ?? valid.adults, valid.roomType, valid.children,
      );

    await test.step('Verify search was rejected', async () => {
      await expect(page).toHaveURL(new RegExp(data.expected.url));
      if (data.expected.errorMessage) {
        await expect(search.errorMessage(data.expected.errorMessage)).toBeVisible();
      } else {
        const error = search.validationError(data.expected.errorSelector);
        await expect(error).toBeVisible();
        await expect(error).not.toBeEmpty();
      }
      await search.attachScreenshot('Negative search - Error verified');
    });
  });
});
});
