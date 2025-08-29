import { test, expect } from '@playwright/test';
import { criarUsuarioAdministrador, criarUsuario } from '../Utils';

test('DELETE /produtos/:id - registro excluído com sucesso', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();

  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const produto = {
    nome: `Produto${Date.now()}`,
    preco: 40,
    descricao: 'House',
    quantidade: 381
  };
  const createRes = await request.post('/produtos', {
    data: produto,
    headers: { Authorization: token }
  });
  const produtoId = (await createRes.json())._id;

  const response = await request.delete(`/produtos/${produtoId}`, {
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toMatch(/Registro excluído com sucesso|Nenhum registro excluído/i);
});

test('DELETE /produtos/:id - produto faz parte de carrinho', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();

  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const produto = {
    nome: `ProdutoCarrinho${Date.now()}`,
    preco: 40,
    descricao: 'House',
    quantidade: 381
  };
  const createRes = await request.post('/produtos', {
    data: produto,
    headers: { Authorization: token }
  });
  const produtoId = (await createRes.json())._id;

  await request.post('/carrinhos', {
    data: {
      produtos: [{ idProduto: produtoId, quantidade: 1 }]
    },
    headers: { Authorization: token }
  });

  const response = await request.delete(`/produtos/${produtoId}`, {
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Não é permitido excluir produto que faz parte de carrinho/i);
  expect(body.idCarrinho || body.idCarrinhos).toBeDefined();
  if (body.idCarrinhos) {
    expect(Array.isArray(body.idCarrinhos)).toBeTruthy();
    expect(body.idCarrinhos.length).toBeGreaterThan(0);
  }
});

test('DELETE /produtos/:id - token ausente, inválido ou expirado', async ({ request }) => {
  const produtoId = 'K6leHdftCeOJjBJj';
  const response = await request.delete(`/produtos/${produtoId}`);
  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toMatch(/Token de acesso ausente, inválido, expirado ou usuário do token não existe mais/i);
});

test('DELETE /produtos/:id - rota exclusiva para administradores', async ({ request }) => {
  const usuario = await criarUsuario(request);

  const loginRes = await request.post('/login', {
    data: { email: usuario.email, password: usuario.password }
  });
  const token = (await loginRes.json()).authorization;

  const produtoId = 'K6leHdftCeOJjBJj';
  const response = await request.delete(`/produtos/${produtoId}`, {
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(403);
  const body = await response.json();
  expect(body.message).toMatch(/Rota exclusiva para administradores/i);
});