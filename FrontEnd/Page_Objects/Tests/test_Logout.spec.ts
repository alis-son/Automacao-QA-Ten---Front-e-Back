import { test, expect } from '@playwright/test';
import { LoginPage } from '../LoginPage';
import { criarELogarUser } from '../Utils';

test('Realizar logout', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await criarELogarUser(page);
  await loginPage.logout();

  await expect(page).toHaveURL(/\/login/);
  await expect(loginPage.submitButton).toBeVisible();
});