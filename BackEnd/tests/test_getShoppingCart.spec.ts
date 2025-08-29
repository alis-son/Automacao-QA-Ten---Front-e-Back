import { test, expect } from '@playwright/test';

test('GET /carrinhos - listar carrinhos com sucesso e validar campos', async ({ request }) => {
  const response = await request.get('/carrinhos');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body.carrinhos)).toBeTruthy();
  expect(body.quantidade).toBe(body.carrinhos.length);

  for (const carrinho of body.carrinhos) {
    expect(carrinho).toHaveProperty('produtos');
    expect(Array.isArray(carrinho.produtos)).toBeTruthy();
    expect(carrinho).toHaveProperty('precoTotal');
    expect(carrinho).toHaveProperty('quantidadeTotal');
    expect(carrinho).toHaveProperty('idUsuario');
    expect(carrinho).toHaveProperty('_id');

    for (const produto of carrinho.produtos) {
      expect(produto).toHaveProperty('idProduto');
      expect(produto).toHaveProperty('quantidade');
      expect(produto).toHaveProperty('precoUnitario');
    }
  }
});