import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CadastroPage } from '../CadastroPage';
import { LoginPage } from '../LoginPage';

function gerarUsuario() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    senha: faker.internet.password({ length: 8 })
  };
}

test('Cadastrar usuário como administrador e fazer login com sucesso', async ({ page }) => {
  const cadastroPage = new CadastroPage(page);
  const loginPage = new LoginPage(page);
  const newUser = gerarUsuario();

  await cadastroPage.goto();
  await cadastroPage.cadastrar(newUser.nome, newUser.email, newUser.senha, true);
  await cadastroPage.assertCadastroSucesso();

  await loginPage.goto();
  await loginPage.login(newUser.email, newUser.senha);
  await loginPage.assertLoginSuccess();

  await cadastroPage.assertAdminHome(newUser.nome);
});