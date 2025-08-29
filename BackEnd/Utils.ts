import { request } from '@playwright/test';

export async function criarUsuarioAdministrador() {
  const usuario = {
    nome: 'Admin ' + Date.now(),
    email: `admin${Date.now()}@qa.com`,
    password: '123456',
    administrador: 'true'
  };

  const apiRequest = await request.newContext({ baseURL: 'https://serverest.dev' });
  const response = await apiRequest.post('/usuarios', { data: usuario });
  const body = await response.json();

  return {
    ...usuario,
    _id: body._id,
    message: body.message
  };
}

export async function criarUsuario(apiRequest) {
  const usuario = {
    nome: 'User ' + Date.now(),
    email: `user${Date.now()}@qa.com`,
    password: '123456',
    administrador: 'false'
  };
  await apiRequest.post('/usuarios', { data: usuario });
  return usuario;
}