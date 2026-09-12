# Financial Core

Financial Core is a modular NestJS + Prisma + SQLite API for deterministic personal finance management. It separates raw import data, normalized data, classifications, analytics, and presentation concerns while preserving the original source information.

## Architecture

### Core domain
- Money utilities keep values in integer cents and avoid floating-point issues.
- DeduplicationStrategy computes a stable hash from account, date, description, amount and installment metadata.
- CsvParserFactory provides the abstraction for future bank-specific parsers.
- RuleEngine evaluates deterministic categorization rules with priority and match types.
- Analytics calculators isolate balance, expense, income, category, profile, merchant, and health calculations.

### Modules
- Accounts
- Categories
- Profiles
- Merchants
- Transactions
- Imports (prepared as base structure)
- Analytics

## Prisma schema

The database schema is defined in [prisma/schema.prisma](prisma/schema.prisma) and follows the requested conceptual model: Account, Import, RawImportRow, FinancialTransaction, TransactionEntry, Merchant, Category, Profile, TransactionClassification, CategorizationRule, RecurringTransaction and TransactionLink.

## Deduplication strategy

The key is built from:
- accountId
- transactionDate
- original or normalized description
- amountCents
- installmentCurrent and installmentTotal when available

This avoids collapsing different installments like 03/12 and 04/12 while still identifying repeated imports of the same entry.

## Import pipeline

CSV -> CsvParserFactory -> Parser -> RawImportRow -> NormalizedTransaction -> Deduplication -> Normalization -> MerchantResolver -> RuleEngine -> Classification -> FinancialTransaction -> TransactionEntry -> SQLite

## Rule engine

Rules are deterministic and match on exact, contains, starts_with, or ends_with. Rules with higher priority can override generic matches without coupling logic to hardcoded category strings.

## Parcelamento

The data model stores installment metadata on `TransactionEntry` and supports different installments via `installmentCurrent` and `installmentTotal`, while preserving original import descriptions.

## API contracts

The API exposes explicit DTOs and Swagger documentation for CRUD operations and analytics endpoints under `/analytics`.

## Installation

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

## Run locally

```bash
npm run start:dev
```

## Run tests

```bash
npm test
```

## Swagger

Open the API docs at:

http://localhost:3000/api

## Docker

```bash
docker compose up --build
```

## Importing CSV

The project includes a generic parser abstraction and a factory. When a real bank CSV is provided, add a parser implementation and register it in the factory without coupling the domain logic to any single bank schema.
