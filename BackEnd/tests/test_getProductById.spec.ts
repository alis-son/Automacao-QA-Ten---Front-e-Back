import { test, expect } from '@playwright/test';

test('GET /produtos/:id - produto encontrado', async ({ request }) => {
  const idValido = 'BeeJh5lz3k6kSIzA';
  const response = await request.get(`/produtos/${idValido}`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('nome');
  expect(body).toHaveProperty('preco');
  expect(body).toHaveProperty('descricao');
  expect(body).toHaveProperty('quantidade');
  expect(body).toHaveProperty('_id');
  expect(body._id).toBe(idValido);
});

test('GET /produtos/:id - produto não encontrado', async ({ request }) => {
  const idInvalido = 'ZZZZZZZZZZZZZZZZ';
  const response = await request.get(`/produtos/${idInvalido}`);
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Produto não encontrado/i);
});