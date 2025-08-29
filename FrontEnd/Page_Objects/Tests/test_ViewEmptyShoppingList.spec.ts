import { test } from '@playwright/test';
import { ProductPage } from '../ProductPage';
import { ListaDeComprasPage } from '../ListaDeComprasPage';
import { criarELogarAdmin } from '../Utils';

test('Visualizar lista de compras vazia', async ({ page }) => {
  const listaDeComprasPage = new ListaDeComprasPage(page);
  const productPage = new ProductPage(page);

  await criarELogarAdmin(page);
  await productPage.goto();

  await listaDeComprasPage.goto();
  await listaDeComprasPage.assertPaginaListaDeCompras();
  await listaDeComprasPage.assertListaVazia();
});