import { test, expect, setupTestHooks } from '../Fixtures/TestSetup.js';

import SearchHotel from '../Pages/SearchHotel';
import SelectHotel from '../Pages/SelectHotel';
import BookHotel from '../Pages/BookHotel';

import searchHotelData from '../testdata/SearchHotel.json';
import selectHotelData from '../testdata/SelectHotel.json';
import bookHotelDataJson from '../testdata/BookHotel.json';

setupTestHooks();

test.describe('Positive Book Hotel Scenarios', () => {

    bookHotelDataJson.bookHotelData.forEach((bookHotelData) => {

        test(`Book Hotel Test - ${bookHotelData.testName}`, async ({ page }) => {
            test.setTimeout(120000);

            const search = new SearchHotel(page);
            const select = new SelectHotel(page);
            const book = new BookHotel(page);

            const searchData = searchHotelData.searchHotelData[0];
            const selectData = selectHotelData.positiveSelectHotelData[0];

            await search.navigate(searchData.url);

            await search.searchHotel(
                searchData.location,
                '',
                searchData.rooms,
                searchData.checkInDate,
                searchData.checkOutDate,
                searchData.adults,
                searchData.roomType,
                searchData.children
            );

            await test.step('Verify Search Success', async () => {
                await expect(page).toHaveURL(new RegExp(searchData.expected.url));
                await search.attachScreenshot('07-After Search Success');
            });

            await select.selectHotel();

            await test.step('Verify Selection Success', async () => {
                await expect(page).toHaveURL(new RegExp(selectData.expected.url));
                await select.attachScreenshot('10-After Selection Success');
            });

            await book.bookHotel(
                bookHotelData.firstName,
                bookHotelData.lastName,
                bookHotelData.address,
                bookHotelData.cardNumber,
                bookHotelData.cardType,
                bookHotelData.expiryMonth,
                bookHotelData.expiryYear,
                bookHotelData.cvv
            );

            await test.step('Verify Booking Success', async () => {
                await expect(page).toHaveURL(bookHotelData.expected.url, { timeout: 30000 });
                await book.attachScreenshot('13-After Booking Success');
            });
        });
    });
});


test.describe('Negative Book Hotel Scenarios', () => {

    bookHotelDataJson.negativeBookData.forEach((data) => {

        test(data.testName, async ({ page }) => {
            test.setTimeout(120000);

            const search = new SearchHotel(page);
            const select = new SelectHotel(page);
            const book = new BookHotel(page);

            const searchData = searchHotelData.searchHotelData[0];
            const selectData = selectHotelData.positiveSelectHotelData[0];
            const guest = bookHotelDataJson.bookHotelData[0];

            await search.navigate(searchData.url);

            await search.searchHotel(
                searchData.location,
                '',
                searchData.rooms,
                searchData.checkInDate,
                searchData.checkOutDate,
                searchData.adults,
                searchData.roomType,
                searchData.children
            );

            await select.selectHotel(0);

            await test.step('Verify Booking Form', async () => {
                await expect(page).toHaveURL(
                    new URL(selectData.expected.url, searchData.url).href
                );
                await book.attachScreenshot('Negative Booking - Form Opened');
            });

            const input = {
                ...guest,
                [data.field]: data.value
            };

            await book.bookHotel(
                input.firstName,
                input.lastName,
                input.address,
                input.cardNumber,
                input.cardType,
                input.expiryMonth,
                input.expiryYear,
                input.cvv
            );

            await test.step('Verify Booking Was Rejected', async () => {
                await expect(page).toHaveURL(new RegExp(data.expected.url));

                const error = book.validationError(data.expected.errorSelector);

                await expect(error).toBeVisible();
                await expect(error).not.toBeEmpty();

                await book.attachScreenshot('Negative Booking - Error Verified');
            });
        });
    });
});