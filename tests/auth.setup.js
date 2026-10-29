import { test as setup, expect, setupTestHooks } from '../Fixtures/TestSetup.js';
import path from 'node:path';

setupTestHooks();
import LoginPage from '../Pages/LoginPage.js';
import loginData from '../testdata/LoginData.json';

process.loadEnvFile(path.join(__dirname, '..', '.env'));

setup('Save login state', async ({ page }) => {
    const login = new LoginPage(page);
    const { STATE_LOGIN_URL, STATE_LOGIN_USERNAME, STATE_LOGIN_PASSWORD } = process.env;

    if (!STATE_LOGIN_URL || !STATE_LOGIN_USERNAME || !STATE_LOGIN_PASSWORD) {
        throw new Error('Set STATE_LOGIN_URL, STATE_LOGIN_USERNAME and STATE_LOGIN_PASSWORD in the root .env file.');
    }

    await login.gotoLoginPage(STATE_LOGIN_URL);
    await login.login(STATE_LOGIN_USERNAME, STATE_LOGIN_PASSWORD);

    await expect(page).toHaveURL(loginData.positiveLoginData[0].expected.url);

    await page.context().storageState({
        path: 'playwright/.auth/user.json',
    });
});
