import { test, expect, setupTestHooks } from '../Fixtures/TestSetup.js';
import Logout from '../Pages/Logout.js';
import loginData from '../testdata/LoginData.json';
import confirmationData from '../testdata/BookingConfirmation.json';

setupTestHooks();

test('Logout - authenticated user returns to logout page', async ({ page }) => {
  const logout = new Logout(page);

  await logout.navigate(loginData.positiveLoginData[0].expected.url);
  await logout.logout();

  await test.step('Verify logout URL', async () => {
    await expect(page).toHaveURL(confirmationData.expectedUrls.logout);
    await logout.attachScreenshot('Logout - URL verified');
  });
});
