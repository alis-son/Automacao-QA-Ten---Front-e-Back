import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { AdminUsersPage } from '../AdminUsers';
import { criarELogarAdmin } from '../Utils';

function gerarUsuario() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    senha: faker.internet.password({ length: 8 })
  };
}

test('Admin remove usuário não admin', async ({ page }) => {
  const adminUsersPage = new AdminUsersPage(page);

  await criarELogarAdmin(page);

  await adminUsersPage.gotoCadastro();

  const newUser = gerarUsuario();
  await adminUsersPage.cadastrarUsuario(newUser.nome, newUser.email, newUser.senha, false);

  await expect(page).toHaveURL(/\/listarusuarios/);
  await adminUsersPage.assertCampoAdministrador(newUser.email, 'false');

  await adminUsersPage.removerUsuario(newUser.email);

  await expect(page.locator('tr', { hasText: newUser.email })).toHaveCount(0);
});