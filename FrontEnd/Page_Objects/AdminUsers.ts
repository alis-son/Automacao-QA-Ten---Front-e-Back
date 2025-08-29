import { Page, expect } from '@playwright/test';

export class AdminUsersPage {
  readonly page: Page;
  readonly nomeInput;
  readonly emailInput;
  readonly senhaInput;
  readonly adminCheckbox;
  readonly cadastrarButton;

  constructor(page: Page) {
    this.page = page;
    this.nomeInput = page.locator('input[placeholder="Digite seu nome"]');
    this.emailInput = page.locator('input[placeholder="Digite seu email"]');
    this.senhaInput = page.locator('input[placeholder="Digite sua senha"]');
    this.adminCheckbox = page.locator('input[type="checkbox"]');
    this.cadastrarButton = page.locator('button:has-text("Cadastrar")');
  }

  async gotoCadastro() {
    await this.page.click('a:has-text("Cadastrar Usuários")');
    await expect(this.page).toHaveURL(/\/cadastrarusuarios/);
  }

  async cadastrarUsuario(nome: string, email: string, senha: string, admin: boolean = false) {
    await this.nomeInput.fill(nome);
    await this.emailInput.fill(email);
    await this.senhaInput.fill(senha);

    const isChecked = await this.adminCheckbox.isChecked();
    if (admin && !isChecked) {
      await this.adminCheckbox.check();
    } else if (!admin && isChecked) {
      await this.adminCheckbox.uncheck();
    }

    await this.cadastrarButton.click();
  }

  async assertUsuarioNaLista(email: string) {
    const linhaUsuario = this.page.locator('tr', { hasText: email });
    await expect(linhaUsuario).toBeVisible();
    return linhaUsuario;
  }

  async assertCampoAdministrador(email: string, valor: string) {
    const linhaUsuario = await this.assertUsuarioNaLista(email);
    await expect(linhaUsuario.locator('td').nth(3)).toHaveText(valor);
  }

  async removerUsuario(email: string) {
    const linhaUsuario = await this.assertUsuarioNaLista(email);
    const excluirButton = linhaUsuario.locator('button:has-text("Excluir")');
    await expect(excluirButton).toBeVisible();
    await excluirButton.click();
    }
    
}