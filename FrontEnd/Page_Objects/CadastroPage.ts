import { Page, expect } from '@playwright/test';

export class CadastroPage {
  readonly page: Page;
  readonly nomeInput;
  readonly emailInput;
  readonly senhaInput;
  readonly adminCheckbox;
  readonly cadastrarButton;
  readonly successMessage;
  readonly errorMessage;
  readonly adminHomeUrl;
  readonly welcomeMessage;

  constructor(page: Page) {
    this.page = page;
    this.nomeInput = page.locator('input[placeholder="Digite seu nome"]');
    this.emailInput = page.locator('input[placeholder="Digite seu email"]');
    this.senhaInput = page.locator('input[placeholder="Digite sua senha"]');
    this.adminCheckbox = page.locator('input[type="checkbox"]');
    this.cadastrarButton = page.locator('button:has-text("Cadastrar")');
    this.successMessage = page.locator('text=Cadastro realizado com sucesso');
    this.errorMessage = page.locator('text=Este email já está sendo usado');
    this.adminHomeUrl = /\/admin\/home/;
    this.welcomeMessage = (nome: string) => page.locator(`text=Bem Vindo ${nome}`);
  }

  async goto() {
    await this.page.goto('/cadastrarusuarios');
  }

  async cadastrar(nome: string, email: string, senha: string, admin: boolean = false) {
    await this.nomeInput.fill(nome);
    await this.emailInput.fill(email);
    await this.senhaInput.fill(senha);
    if (admin) {
      await this.adminCheckbox.check();
    }
    await this.cadastrarButton.click();
  }

  async assertCadastroSucesso() {
    await expect(this.successMessage).toBeVisible();
  }

  async assertCadastroInvalido() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText('Este email já está sendo usado');
  }

  async assertAdminHome(nome: string) {
    await expect(this.page).toHaveURL(this.adminHomeUrl);
    await expect(this.welcomeMessage(nome)).toBeVisible();
  }
}