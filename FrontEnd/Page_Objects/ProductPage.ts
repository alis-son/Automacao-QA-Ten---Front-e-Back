import { Page, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly searchInput;
  readonly searchButton;
  readonly productCard;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder="Pesquisar Produtos"]');
    this.searchButton = page.locator('button:has-text("Pesquisar")');
    this.productCard = (productName: string) => page.locator(`text=${productName}`);
  }

  async goto() {
    await this.page.goto('/home');
  }

  async pesquisarProduto(nome: string) {
    await this.searchInput.fill(nome);
    await this.searchButton.click();
  }

  async adicionarPrimeiroProdutoNaLista() {
    const firstCardTitle = this.page.locator('.card-title').first();
    await expect(firstCardTitle).toBeVisible();
    const nomeProduto = await firstCardTitle.innerText();

    const card = firstCardTitle.locator('..');
    const addButton = card.locator('button:has-text("Adicionar a lista")');
    await expect(addButton).toBeVisible();
    await addButton.click();

    return nomeProduto;
  }

  async adicionarProdutoNaListaPorNome(nomeProduto: string) {
    const cardTitle = this.page.locator('.card-title', { hasText: nomeProduto });
    await expect(cardTitle).toBeVisible();
    const card = cardTitle.locator('..');
    const addButton = card.locator('button:has-text("Adicionar a lista")');
    await expect(addButton).toBeVisible();
    await addButton.click();
  }

  async limparListaDeCompras() {
    const limparListaButton = this.page.locator('button:has-text("Limpar Lista")');
    await expect(limparListaButton).toBeVisible();
    await limparListaButton.click();
  }

  async acessarDetalhesPrimeiroProduto() {
    const firstCardTitle = this.page.locator('.card-title').first();
    await expect(firstCardTitle).toBeVisible();
    const nomeProduto = await firstCardTitle.innerText();

    const card = firstCardTitle.locator('..');
    const detalhesButton = card.locator('a[data-testid="product-detail-link"]:has-text("Detalhes")');
    await expect(detalhesButton).toBeVisible();
    await detalhesButton.click();

    return nomeProduto;
}

  async assertTelaDetalhesProduto(nomeProduto: string) {
    await expect(this.page).toHaveURL(/\/detalhesProduto\//);
    await expect(this.page.locator('h1')).toHaveText('Detalhes do produto');
    await expect(this.page.locator(`text=${nomeProduto}`)).toBeVisible();
    await expect(this.page.locator('button:has-text("Adicionar a lista")')).toBeVisible();
    await expect(this.page.locator('text=Descrição:')).toBeVisible();
    await expect(this.page.locator('text=Voltar')).toBeVisible();
  }

  async assertProdutoVisivel(nome: string) {
    await expect(this.productCard(nome)).toBeVisible();
  }
}