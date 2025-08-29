import { test, expect } from '@playwright/test';

test('DELETE /usuarios/:id - excluir usuário com sucesso', async ({ request }) => {
  const createRes = await request.post('/usuarios', {
    data: {
      nome: 'Removível',
      email: `removivel${Date.now()}@qa.com`,
      password: '123456',
      administrador: 'true'
    }
  });
  const userId = (await createRes.json())._id;

  const response = await request.delete(`/usuarios/${userId}`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toMatch(/Registro excluído com sucesso/i);
});

//Resposta não mapeada
/*
test('DELETE /usuarios/:id - excluir usuário inexistente', async ({ request }) => {
  const idInvalido = 'ZZZZZZZZZZZZZZZZ'; // 16 caracteres alfanuméricos
  const response = await request.delete(`/usuarios/${idInvalido}`);
  //expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Usuário não encontrado|Bad Request/i);
});
*/

test('DELETE /usuarios/:id - excluir usuário com carrinho cadastrado', async ({ request }) => {
  const idComCarrinho = '0uxuPY0cbmQhpEz1';
  const response = await request.delete(`/usuarios/${idComCarrinho}`);
  //expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Não é permitido excluir usuário com carrinho cadastrado/i);
  expect(body).toHaveProperty('idCarrinho');
});