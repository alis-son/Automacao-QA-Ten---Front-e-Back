import { test, expect } from '@playwright/test';

test('GET /usuarios - listar usuários com sucesso', async ({ request }) => {
  const response = await request.get('/usuarios');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  expect(Array.isArray(body.usuarios)).toBeTruthy();
});

test('GET /usuarios - listar usuários e validar campos', async ({ request }) => {
  const response = await request.get('/usuarios');
  expect(response.status()).toBe(200);
  const body = await response.json();

  expect(Array.isArray(body.usuarios)).toBeTruthy();
  expect(body.quantidade).toBe(body.usuarios.length);

  for (const usuario of body.usuarios) {
    expect(usuario).toHaveProperty('nome');
    expect(usuario).toHaveProperty('email');
    expect(usuario).toHaveProperty('password');
    expect(usuario).toHaveProperty('administrador');
    expect(usuario).toHaveProperty('_id');
  }
});

test('GET /usuarios - validar quantidade de usuários', async ({ request }) => {
  const response = await request.get('/usuarios');
  expect(response.status()).toBe(200);
  const body = await response.json();

  expect(Array.isArray(body.usuarios)).toBeTruthy();
  expect(body.quantidade).toBe(body.usuarios.length);
});