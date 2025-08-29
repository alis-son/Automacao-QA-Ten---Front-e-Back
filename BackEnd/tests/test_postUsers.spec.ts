import { test, expect } from '@playwright/test';

test('POST /usuarios - criar usuário com sucesso', async ({ request }) => {
  const response = await request.post('/usuarios', {
    data: {
      nome: 'Novo Usuário',
      email: `novo${Date.now()}@qa.com`,
      password: '123456',
      administrador: 'true'
    }
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body).toHaveProperty('_id');
  expect(body._id).not.toBe('');
  expect(body.message).toMatch(/Cadastro realizado com sucesso/i);
});

test('POST /usuarios - criar usuário com email já existente', async ({ request }) => {
  const response = await request.post('/usuarios', {
    data: {
      nome: 'Usuário Existente',
      email: 'fulano@qa.com', 
      password: '123456',
      administrador: 'true'
    }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Este email já está sendo usado/i);
});

//Resposta não mapeada
/*
test('POST /usuarios - criar usuário com dados vazios', async ({ request }) => {
  const response = await request.post('/usuarios', {
    data: {
      nome: '',
      email: '',
      password: '',
      administrador: 'true'
    }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Todos os campos são obrigatórios/i);
});
*/