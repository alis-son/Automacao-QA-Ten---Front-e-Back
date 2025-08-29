import { test, expect } from '@playwright/test';

test('GET /usuarios/:id - buscar usuário existente', async ({ request }) => {
  const idValido = '0uxuPY0cbmQhpEz1'; 
  const response = await request.get(`/usuarios/${idValido}`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('nome');
  expect(body).toHaveProperty('email');
  expect(body).toHaveProperty('password');
  expect(body).toHaveProperty('administrador');
  expect(body).toHaveProperty('_id');
  expect(body._id).toBe(idValido);
});

test('GET /usuarios/:id - buscar usuário inexistente', async ({ request }) => {
  const idInvalido = 'ZZZZZZZZZZZZZZZZ';
  const response = await request.get(`/usuarios/${idInvalido}`);
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Usuário não encontrado/i);
});