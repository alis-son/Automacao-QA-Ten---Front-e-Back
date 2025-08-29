import { test, expect } from '@playwright/test';

test('PUT /usuarios/:id - editar usuário com sucesso', async ({ request }) => {
  const createRes = await request.post('/usuarios', {
    data: {
      nome: 'Editável',
      email: `editavel${Date.now()}@qa.com`,
      password: '123456',
      administrador: 'true'
    }
  });
  const userId = (await createRes.json())._id;

  const response = await request.put(`/usuarios/${userId}`, {
    data: {
      nome: 'Editado',
      email: `editado${Date.now()}@qa.com`,
      password: '654321',
      administrador: 'false'
    }
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toMatch(/Registro alterado com sucesso/i);
});

test('PUT /usuarios/:id - editar usuário inexistente (cria novo)', async ({ request }) => {
  const idInvalido = 'ZZZZZZZZZZZZZZZZ';
  const response = await request.put(`/usuarios/${idInvalido}`, {
    data: {
      nome: 'Novo',
      email: `novo${Date.now()}@qa.com`,
      password: '123456',
      administrador: 'false'
    }
  });
  expect([201, 200]).toContain(response.status());
  const body = await response.json();
  if (response.status() === 201) {
    expect(body.message).toMatch(/Cadastro realizado com sucesso/i);
    expect(body).toHaveProperty('_id');
  } else {
    expect(body.message).toMatch(/Registro alterado com sucesso/i);
  }
});

test('PUT /usuarios/:id - editar usuário com email já cadastrado', async ({ request }) => {
  const idValido = '0uxuPY0cbmQhpEz1';
  const response = await request.put(`/usuarios/${idValido}`, {
    data: {
      nome: 'Teste',
      email: 'teste@qa.com',
      password: '123456',
      administrador: 'false'
    }
  });
  //expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toMatch(/Este email já está sendo usado/i);
});