import { test } from '@playwright/test';
import BasePage from './BasePage.js';

class Logout extends BasePage {
  async logout() {
    await test.step('Logout', async () => {
      const logoutLink = this.page.getByRole('link', { name: 'Logout', exact: true });
      await logoutLink.click();
      await this.attachScreenshot('Logged out');
    });
  }
}

export default Logout;
