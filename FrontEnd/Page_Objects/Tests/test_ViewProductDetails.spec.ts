import { test } from '@playwright/test';
import { ProductPage } from '../ProductPage';
import { criarELogarAdmin } from '../Utils';

test('Visualizar detalhes do primeiro produto', async ({ page }) => {
  const productPage = new ProductPage(page);

  await criarELogarAdmin(page);
  await productPage.goto();

  const nomeProduto = await productPage.acessarDetalhesPrimeiroProduto();

  await productPage.assertTelaDetalhesProduto(nomeProduto);
});