import { Page, expect } from '@playwright/test';

export class ListaDeComprasPage {
  readonly page: Page;
  readonly tituloLista;
  readonly itemLista;
  readonly listaVaziaMessage;

  constructor(page: Page) {
    this.page = page;
    this.tituloLista = page.locator('h1', { hasText: 'Lista de Compras' });
    this.itemLista = (itemName: string) => page.locator(`text=${itemName}`);
    this.listaVaziaMessage = page.locator('text=Seu carrinho está vazio');
  }

  async goto() {
    await this.page.click('a:has-text("Lista de Compras")');
  }

  async assertPaginaListaDeCompras() {
    await expect(this.page).toHaveURL(/\/minhaListaDeProdutos/);
    await expect(this.tituloLista).toBeVisible();
  }

  async assertItemNaLista(itemName: string) {
    await expect(this.itemLista(itemName)).toBeVisible();
  }

  async assertListaVazia() {
    await expect(this.listaVaziaMessage).toBeVisible();
  }
}