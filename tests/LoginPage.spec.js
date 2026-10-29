import { test, expect, setupTestHooks } from '../Fixtures/TestSetup.js';
import loginData from '../testdata/LoginData.json';
import LoginPage from '../Pages/LoginPage.js';

setupTestHooks();
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Positive Login Scenarios', () => {
loginData.positiveLoginData.forEach((data) => {
  test(`Positive Login - ${data.testName}`, async ({ page }) => {
    const login = new LoginPage(page);

    await login.gotoLoginPage(data.url);
    await login.login(data.username, data.password);

    await test.step('Verify successful login URL', async () => {
      await expect(page).toHaveURL(data.expected.url);
      await login.attachScreenshot('Login - Success URL verified');
    });

    await test.step('Verify welcome message', async () => {
      await expect(login.expectedMsg.first()).toHaveText(data.expectedMsg);
      await login.attachScreenshot('Login - Welcome message verified');
    });
  });
});
});

test.describe('Negative Login Scenarios', () => {
loginData.negativeLoginData.forEach((data) => {
  test(`Negative Login - ${data.testName}`, async ({ page }) => {
    const login = new LoginPage(page);

    await login.gotoLoginPage(data.url);
    await login.login(data.username, data.password);

    await test.step('Verify login error message', async () => {
      await expect(login.loginError(data.expected.message)).toBeVisible();
      await login.attachScreenshot('Login - Error message verified');
    });
  });
});
});
