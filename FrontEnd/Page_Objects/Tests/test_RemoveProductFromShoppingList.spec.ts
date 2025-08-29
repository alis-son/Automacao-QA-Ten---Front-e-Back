import { test } from '@playwright/test';
import { ProductPage } from '../ProductPage';
import { ListaDeComprasPage } from '../ListaDeComprasPage';
import { criarELogarAdmin } from '../Utils';

test('Remover produto da lista de compras validando lista vazia', async ({ page }) => {
  const productPage = new ProductPage(page);
  const listaDeComprasPage = new ListaDeComprasPage(page);

  await criarELogarAdmin(page);
  await productPage.goto();

  const nomeProduto = await productPage.adicionarPrimeiroProdutoNaLista();

  await listaDeComprasPage.goto();
  await listaDeComprasPage.assertPaginaListaDeCompras();
  await listaDeComprasPage.assertItemNaLista(nomeProduto);

  await productPage.limparListaDeCompras();

  await listaDeComprasPage.assertListaVazia();
});