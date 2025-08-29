import { test } from '@playwright/test';
import { LoginPage } from '../LoginPage';
import { ProductPage } from '../ProductPage';
import { criarELogarAdmin } from '../Utils';

test('Pesquisar produtos exibe resultados corretos', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);

    await criarELogarAdmin(page);
    await productPage.goto();

    const firstProductName = await page.locator('.card-title').first().innerText();

    await productPage.pesquisarProduto(firstProductName);

    await productPage.assertProdutoVisivel(firstProductName);
});