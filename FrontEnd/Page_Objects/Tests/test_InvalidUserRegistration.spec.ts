import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CadastroPage } from '../CadastroPage';

function gerarUsuario() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    senha: faker.internet.password({ length: 8 })
  };
}

test('Cadastrar um usuário já existente', async ({ page }) => {
  const cadastroPage = new CadastroPage(page);
  const newUser = gerarUsuario(); 

  await cadastroPage.goto();
  await cadastroPage.cadastrar(newUser.nome, newUser.email, newUser.senha);
  await cadastroPage.assertCadastroSucesso();

  await cadastroPage.goto();
  await cadastroPage.cadastrar(newUser.nome, newUser.email, newUser.senha);
  await cadastroPage.assertCadastroInvalido();
});