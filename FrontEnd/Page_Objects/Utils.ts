import { faker } from '@faker-js/faker';
import { CadastroPage } from './CadastroPage';
import { LoginPage } from './LoginPage';
import { Page } from '@playwright/test';

export async function criarELogarAdmin(page: Page) {
  const cadastroPage = new CadastroPage(page);
  const loginPage = new LoginPage(page);
  const adminUser = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    senha: faker.internet.password({ length: 8 })
  };

  await cadastroPage.goto();
  await cadastroPage.cadastrar(adminUser.nome, adminUser.email, adminUser.senha, true);
  await cadastroPage.assertCadastroSucesso();

  await loginPage.goto();
  await loginPage.login(adminUser.email, adminUser.senha);
  await loginPage.assertLoginSuccess();

  return adminUser;
}

export async function criarELogarUser(page: Page) {
  const cadastroPage = new CadastroPage(page);
  const loginPage = new LoginPage(page);
  const normalUser = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    senha: faker.internet.password({ length: 8 })
  };

  await cadastroPage.goto();
  await cadastroPage.cadastrar(normalUser.nome, normalUser.email, normalUser.senha, false);
  await cadastroPage.assertCadastroSucesso();

  await loginPage.goto();
  await loginPage.login(normalUser.email, normalUser.senha);
  await loginPage.assertLoginSuccess();

  return normalUser;
}