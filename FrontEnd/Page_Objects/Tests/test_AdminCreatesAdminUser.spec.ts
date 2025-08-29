import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginPage } from '../LoginPage';
import { AdminUsersPage } from '../AdminUsers';
import { criarELogarAdmin } from '../Utils';

function gerarUsuario() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    senha: faker.internet.password({ length: 8 })
  };
}

test('Admin cadastra outro usuário admin', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const adminUsersPage = new AdminUsersPage(page);

  await loginPage.goto();
  await criarELogarAdmin(page);

  await adminUsersPage.gotoCadastro();

  const newUser = gerarUsuario();
  await adminUsersPage.cadastrarUsuario(newUser.nome, newUser.email, newUser.senha, true);

  await expect(page).toHaveURL(/\/listarusuarios/);

  await adminUsersPage.assertCampoAdministrador(newUser.email, 'true');
});