import { test, expect } from '@playwright/test';
import { criarUsuarioAdministrador } from '../Utils';

test('POST /carrinhos - cadastro com sucesso', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  await request.delete('/carrinhos', { headers: { Authorization: token } });

  const produtosRes = await request.get('/produtos');
  const produtos = (await produtosRes.json()).produtos;
  const produto1 = produtos[0];
  const produto2 = produtos[1];

  const carrinho = {
    produtos: [
      { idProduto: produto1._id, quantidade: 1 },
      { idProduto: produto2._id, quantidade: 1 }
    ]
  };
  const response = await request.post('/carrinhos', {
    data: carrinho,
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.message).toMatch(/Cadastro realizado com sucesso/i);
  expect(body).toHaveProperty('_id');
});

test('POST /carrinhos - erro por produto duplicado', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const carrinho = {
    produtos: [
      { idProduto: 'BeeJh5lz3k6kSIzA', quantidade: 1 },
      { idProduto: 'BeeJh5lz3k6kSIzA', quantidade: 2 }
    ]
  };
  const response = await request.post('/carrinhos', {
    data: carrinho,
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/produto duplicado/i);
});

test('POST /carrinhos - erro por mais de um carrinho', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  await request.post('/carrinhos', {
    data: {
      produtos: [{ idProduto: 'BeeJh5lz3k6kSIzA', quantidade: 1 }]
    },
    headers: { Authorization: token }
  });

  const response = await request.post('/carrinhos', {
    data: {
      produtos: [{ idProduto: 'Yea3451kl6kSIzA', quantidade: 1 }]
    },
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/mais de 1 carrinho/i);
});

test('POST /carrinhos - erro por produto não encontrado', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const carrinho = {
    produtos: [
      { idProduto: 'IDInexistente123', quantidade: 1 }
    ]
  };
  const response = await request.post('/carrinhos', {
    data: carrinho,
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Produto não encontrado/i);
});

test('POST /carrinhos - erro por quantidade insuficiente', async ({ request }) => {
  const admin = await criarUsuarioAdministrador();
  const loginRes = await request.post('/login', {
    data: { email: admin.email, password: admin.password }
  });
  const token = (await loginRes.json()).authorization;

  const carrinho = {
    produtos: [
      { idProduto: 'BeeJh5lz3k6kSIzA', quantidade: 99999 }
    ]
  };
  const response = await request.post('/carrinhos', {
    data: carrinho,
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/quantidade suficiente/i);
});

test('POST /carrinhos - token ausente, inválido ou expirado', async ({ request }) => {
  const carrinho = {
    produtos: [
      { idProduto: 'BeeJh5lz3k6kSIzA', quantidade: 1 }
    ]
  };
  const response = await request.post('/carrinhos', {
    data: carrinho
  });
  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toMatch(/Token de acesso ausente, inválido, expirado ou usuário do token não existe mais/i);
});