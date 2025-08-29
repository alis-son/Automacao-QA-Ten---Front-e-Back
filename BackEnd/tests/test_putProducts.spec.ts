import { test, expect } from '@playwright/test';
import { criarUsuarioAdministrador, criarUsuario } from '../Utils';

test('PUT /produtos/:id - alterado com sucesso', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const produto = {
    nome: `ProdutoEdit${Date.now()}`,
    preco: 40,
    descricao: 'House',
    quantidade: 381
  };
  const createRes = await request.post('/produtos', {
    data: produto,
    headers: { Authorization: token }
  });
  const produtoId = (await createRes.json())._id;

  const response = await request.put(`/produtos/${produtoId}`, {
    data: { ...produto, nome: `ProdutoEditado${Date.now()}` },
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toMatch(/Registro alterado com sucesso/i);
});

test('PUT /produtos/:id - cadastro com sucesso (ID inexistente)', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const idInvalido = 'ZZZZZZZZZZZZZZZZ';
  const produto = {
    nome: `ProdutoNovo${Date.now()}`,
    preco: 40,
    descricao: 'House',
    quantidade: 381
  };
  const response = await request.put(`/produtos/${idInvalido}`, {
    data: produto,
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.message).toMatch(/Cadastro realizado com sucesso/i);
  expect(body).toHaveProperty('_id');
});

test('PUT /produtos/:id - já existe produto com esse nome', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const produto1 = {
    nome: `ProdutoDuplicado${Date.now()}`,
    preco: 40,
    descricao: 'House',
    quantidade: 381
  };
  const produto2 = {
    nome: `ProdutoUnico${Date.now()}`,
    preco: 50,
    descricao: 'Office',
    quantidade: 100
  };
  const createRes1 = await request.post('/produtos', {
    data: produto1,
    headers: { Authorization: token }
  });
  const produtoId2 = (await (await request.post('/produtos', {
    data: produto2,
    headers: { Authorization: token }
  })).json())._id;

  const response = await request.put(`/produtos/${produtoId2}`, {
    data: { ...produto2, nome: produto1.nome },
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Já existe produto com esse nome/i);
});

test('PUT /produtos/:id - token ausente, inválido ou expirado', async ({ request }) => {
  const produtoId = 'K6leHdftCeOJjBJj';
  const produto = {
    nome: `ProdutoSemToken${Date.now()}`,
    preco: 40,
    descricao: 'House',
    quantidade: 381
  };
  const response = await request.put(`/produtos/${produtoId}`, {
    data: produto
  });
  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toMatch(/Token de acesso ausente, inválido, expirado ou usuário do token não existe mais/i);
});

test('PUT /produtos/:id - rota exclusiva para administradores', async ({ request }) => {
  const usuario = await criarUsuario(request);

  const loginRes = await request.post('/login', {
    data: { email: usuario.email, password: usuario.password }
  });
  const token = (await loginRes.json()).authorization;

  const produtoId = 'K6leHdftCeOJjBJj';
  const produto = {
    nome: `ProdutoNaoAdmin${Date.now()}`,
    preco: 40,
    descricao: 'House',
    quantidade: 381
  };
  const response = await request.put(`/produtos/${produtoId}`, {
    data: produto,
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(403);
  const body = await response.json();
  expect(body.message).toMatch(/Rota exclusiva para administradores/i);
});