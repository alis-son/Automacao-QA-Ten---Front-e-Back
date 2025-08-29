# Avaliação QA Ten - Instruções para Execução dos Testes

## Estrutura do Projeto

```
Avaliação QA Ten/
├── BackEnd/
│   ├── package.json
│   ├── playwright.config.ts
│   ├── Utils.ts
│   ├── reports/
│   │   └── index.html
│   ├── test-results/
│   │   └── .last-run.json
│   └── tests/
│       ├── ...
├── FrontEnd/
│   ├── Package.json
│   ├── playwright.config.ts
│   ├── Tsconfig.json
│   ├── Page_Objects/
│   │   ├── ...
│   │   └── Tests/
│   │       ├── ...
│   ├── reports/
│   │   ├── index.html
│   │   └── data/
│   │       └── ... (arquivos de mídia gerados pelos testes)
│   └── test-results/
```

## Pré-requisitos

- Node.js (versão 18 ou superior recomendada)
- npm (gerenciador de pacotes do Node.js)

## Instalação de Dependências

### BackEnd

1. Acesse a pasta do projeto BackEnd:
   ```sh
   cd BackEnd
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

### FrontEnd

1. Acesse a pasta do projeto FrontEnd:
   ```sh
   cd ../FrontEnd
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

## Execução dos Testes

### BackEnd

1. Acesse a pasta BackEnd (se ainda não estiver nela):
   ```sh
   cd ../BackEnd
   ```

2. Execute todos os testes:
   ```sh
   npx playwright test
   ```

3. Para gerar e visualizar o relatório HTML dos testes:
   ```sh
   npx playwright show-report
   ```
   O relatório estará disponível em `BackEnd/reports/index.html`.

### FrontEnd

1. Acesse a pasta FrontEnd (se ainda não estiver nela):
   ```sh
   cd ../FrontEnd
   ```

2. Execute todos os testes:
   ```sh
   npx playwright test
   ```

3. Para gerar e visualizar o relatório HTML dos testes:
   ```sh
   npx playwright show-report
   ```
   O relatório estará disponível em `FrontEnd/reports/index.html`.

## Observações
- Os testes utilizam Playwright, então todas as dependências necessárias serão instaladas via `npm install`.
- Caso utilize variáveis de ambiente ou configurações específicas, ajuste conforme necessário nos arquivos de configuração.

---

**Resumo das dependências necessárias:**
- Node.js
- npm
- Playwright (instalado via `npm install` em cada projeto)
- Outras dependências listadas nos respectivos `package.json` de cada projeto

---

**Dica:**  
Se for rodar os testes em ambiente CI/CD, inclua os comandos de instalação e execução nos scripts do pipeline.
