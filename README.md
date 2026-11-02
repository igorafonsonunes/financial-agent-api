# Financial Agent API

Fundação do backend do Financial Agent, construída com NestJS, TypeScript, Prisma e PostgreSQL.

Esta entrega contém apenas infraestrutura, persistência e health check. Nenhum módulo financeiro foi incluído. O único modelo é técnico e não contém dados financeiros.

## Requisitos

- Node.js 22 LTS
- Docker e Docker Compose

## Execução com Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

A API ficará disponível em `http://localhost:3001`.

- Health check: `GET http://localhost:3001/api/health`
- Swagger: `http://localhost:3001/api/docs`
- PostgreSQL: `localhost:5432`

As credenciais padrão do Compose existem apenas para desenvolvimento e podem ser sobrescritas por variáveis de ambiente. Não versione `.env`.

## Execução local

Inicie um PostgreSQL compatível e configure:

```bash
cp .env.example .env
npm ci
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

## Verificações

```bash
npm run prisma:validate
npm run typecheck
npm run lint
npm test
npm run build
```

O endpoint de health executa `SELECT 1` no PostgreSQL. Se a conexão falhar, retorna HTTP 503 com o estado da API e do banco.

Para executar frontend, API e PostgreSQL juntos, use o Compose canônico em `../docker-compose.yml`. Ele publica o frontend em `localhost:3000`, a API em `localhost:3001` e o PostgreSQL em `localhost:5432`.

## Dados legados

O arquivo SQLite legado `prisma/dev.db` continha contas, categorias, importações e transações. Ele não faz parte desta fundação PostgreSQL e não foi migrado automaticamente. Qualquer migração deverá ser uma entrega futura, explícita e validada.
