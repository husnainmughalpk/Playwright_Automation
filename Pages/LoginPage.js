import { test } from '@playwright/test';
import BasePage from './BasePage.js';

class LoginPage extends BasePage {
 
constructor(page)
{
super(page);
 
this.username = page.locator('#username');
this.password = page.locator('#password');
this.loginButton = page.locator('#login');
this.expectedMsg = page.locator('.welcome_menu');
}
 

async gotoLoginPage(url) {
await this.navigate(url);
}

async login(username, password) {
await test.step('Enter username', async () => {
await this.username.fill(username);
await this.attachScreenshot('02 - After username');
});
await test.step('Enter password', async () => {
await this.password.fill(password);
await this.attachScreenshot('03 - After password');
});
await test.step('04- Click Login', async () => {
await this.loginButton.click();
await this.attachScreenshot('04 - After login click');
});
}

loginError(message) {
  return this.page.getByText(message, { exact: false });
}
}
export default LoginPage;
