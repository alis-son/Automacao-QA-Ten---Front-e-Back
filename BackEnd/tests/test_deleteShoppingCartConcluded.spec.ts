import { test, expect } from '@playwright/test';
import { criarUsuarioAdministrador } from '../Utils';

test('DELETE /carrinhos/concluir-compra - registro excluído com sucesso', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const produtosRes = await request.get('/produtos');
  const produtos = (await produtosRes.json()).produtos;
  await request.post('/carrinhos', {
    data: {
      produtos: [
        { idProduto: produtos[0]._id, quantidade: 1 }
      ]
    },
    headers: { Authorization: token }
  });

  const response = await request.delete('/carrinhos/concluir-compra', {
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toMatch(/Registro excluído com sucesso|Não foi encontrado carrinho para esse usuário/i);
});

test('DELETE /carrinhos/concluir-compra - sem carrinho para o usuário', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const response = await request.delete('/carrinhos/concluir-compra', {
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toMatch(/Não foi encontrado carrinho para esse usuário/i);
});

test('DELETE /carrinhos/concluir-compra - token ausente, inválido ou expirado', async ({ request }) => {
  const response = await request.delete('/carrinhos/concluir-compra');
  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toMatch(/Token de acesso ausente, inválido, expirado ou usuário do token não existe mais/i);
});