import { test, expect } from '@playwright/test';
import { criarUsuarioAdministrador } from '../Utils';

test('Login API - sucesso', async ({ request }) => {
  const usuario = await criarUsuarioAdministrador();

  const response = await request.post('/login', {
    data: {
      email: usuario.email,
      password: usuario.password
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toBe('Login realizado com sucesso');
  expect(body.authorization).toContain('Bearer ');
});

test('Login API - dados inválidos', async ({ request }) => {
  const response = await request.post('/login', {
    data: {
      email: 'fulano@qa.com',
      password: 'senhaerrada'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toBe('Email e/ou senha inválidos');
});

test('Login API - email não cadastrado', async ({ request }) => {
  const response = await request.post('/login', {
    data: {
      email: 'naoexiste@qa.com',
      password: 'teste'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toBe('Email e/ou senha inválidos');
});