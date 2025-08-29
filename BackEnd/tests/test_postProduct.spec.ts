import { test, expect, request } from '@playwright/test';
import { criarUsuarioAdministrador } from '../Utils';
import { criarUsuario } from '../Utils';

test('POST /produtos - cadastro com sucesso', async () => {
  const admin = await criarUsuarioAdministrador();
  const apiRequest = await request.newContext({ baseURL: 'https://serverest.dev' });
  const loginRes = await apiRequest.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const response = await apiRequest.post('/produtos', {
    data: {
      nome: `Produto${Date.now()}`,
      preco: 40,
      descricao: 'House',
      quantidade: 381
    },
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.message).toMatch(/Cadastro realizado com sucesso/i);
  expect(body).toHaveProperty('_id');
});

test('POST /produtos - já existe produto com esse nome', async () => {
  const admin = await criarUsuarioAdministrador();
  const apiRequest = await request.newContext({ baseURL: 'https://serverest.dev' });
  const loginRes = await apiRequest.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const response = await apiRequest.post('/produtos', {
    data: {
      nome: 'Logitech MX Vertical',
      preco: 40,
      descricao: 'House',
      quantidade: 381
    },
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Já existe produto com esse nome/i);
});

test('POST /produtos - token ausente, inválido ou expirado', async ({ request }) => {
  const response = await request.post('/produtos', {
    data: {
      nome: `Produto${Date.now()}`,
      preco: 40,
      descricao: 'House',
      quantidade: 381
    }
  });
  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toMatch(/Token de acesso ausente, inválido, expirado ou usuário do token não existe mais/i);
});

test('POST /produtos - rota exclusiva para administradores', async () => {
  const apiRequest = await request.newContext({ baseURL: 'https://serverest.dev' });
  const usuario = await criarUsuario(apiRequest);

  const loginRes = await apiRequest.post('/login', {
    data: { email: usuario.email, password: usuario.password }
  });
  const token = (await loginRes.json()).authorization;

  const response = await apiRequest.post('/produtos', {
    data: {
      nome: `Produto${Date.now()}`,
      preco: 40,
      descricao: 'House',
      quantidade: 381
    },
    headers: { Authorization: token }
  });

  expect(response.status()).toBe(403);
  const body = await response.json();
  expect(body.message).toMatch(/Rota exclusiva para administradores/i);
});