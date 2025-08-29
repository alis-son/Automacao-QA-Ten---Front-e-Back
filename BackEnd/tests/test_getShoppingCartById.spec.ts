import { test, expect } from '@playwright/test';
import { criarUsuarioAdministrador } from '../Utils';

test('GET /carrinhos/:id - carrinho encontrado', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const produtosRes = await request.get('/produtos');
  const produtos = (await produtosRes.json()).produtos;
  const carrinhoRes = await request.post('/carrinhos', {
    data: {
      produtos: [
        { idProduto: produtos[0]._id, quantidade: 1 }
      ]
    },
    headers: { Authorization: token }
  });
  expect(carrinhoRes.status()).toBe(201);
  const carrinhoId = (await carrinhoRes.json())._id;

  const response = await request.get(`/carrinhos/${carrinhoId}`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('produtos');
  expect(Array.isArray(body.produtos)).toBeTruthy();
  expect(body).toHaveProperty('precoTotal');
  expect(body).toHaveProperty('quantidadeTotal');
  expect(body).toHaveProperty('idUsuario');
  expect(body).toHaveProperty('_id');
  expect(body._id).toBe(carrinhoId);

  for (const produto of body.produtos) {
    expect(produto).toHaveProperty('idProduto');
    expect(produto).toHaveProperty('quantidade');
    expect(produto).toHaveProperty('precoUnitario');
  }
});

test('GET /carrinhos/:id - carrinho não encontrado', async ({ request }) => {
  const idInvalido = 'ZZZZZZZZZZZZZZZZ';
  const response = await request.get(`/carrinhos/${idInvalido}`);
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Carrinho não encontrado/i);
});