import { test } from '@playwright/test';
import { ProductPage } from '../ProductPage';
import { ListaDeComprasPage } from '../ListaDeComprasPage';
import { criarELogarAdmin } from '../Utils';

test('Adicionar primeiro produto à lista de compras e exibir', async ({ page }) => {
  const productPage = new ProductPage(page);
  const listaDeComprasPage = new ListaDeComprasPage(page);

  await criarELogarAdmin(page);
  await productPage.goto();

  const nomeProduto = await productPage.adicionarPrimeiroProdutoNaLista();

  await listaDeComprasPage.goto();
  await listaDeComprasPage.assertPaginaListaDeCompras();

  await listaDeComprasPage.assertItemNaLista(nomeProduto);
});