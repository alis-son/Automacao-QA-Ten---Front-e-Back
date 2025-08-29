import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginPage } from '../LoginPage';

function gerarUsuario() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    senha: faker.internet.password({ length: 8 })
  };
}

test('Logar com usuário inválido', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const newUser = gerarUsuario(); 

  await loginPage.goto();

  await loginPage.login(newUser.email, newUser.senha );
  await loginPage.assertLoginFailed();
});