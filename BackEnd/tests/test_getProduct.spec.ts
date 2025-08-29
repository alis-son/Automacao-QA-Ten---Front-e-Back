import { test, expect } from '@playwright/test';

test('GET /produtos - listar produtos com sucesso e validar campos', async ({ request }) => {
  const response = await request.get('/produtos');
  expect(response.status()).toBe(200);
  const body = await response.json();

  expect(Array.isArray(body.produtos)).toBeTruthy();

  expect(body.quantidade).toBe(body.produtos.length);

  for (const produto of body.produtos) {
    expect(produto).toHaveProperty('nome');
    expect(produto).toHaveProperty('preco');
    expect(produto).toHaveProperty('descricao');
    expect(produto).toHaveProperty('quantidade');
    expect(produto).toHaveProperty('_id');
  }
});

test('GET /produtos?nome=Logitech MX Vertical - buscar por nome', async ({ request }) => {
  const response = await request.get('/produtos?nome=Logitech MX Vertical');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.produtos[0].nome).toBe('Logitech MX Vertical');
});