# Journal Page Migration to Account Master System

## Overview

Migrate journals list page from old `JournalEntry` model to new `Journal + Account` master data architecture.

## Data Model Changes

### Old Model (JournalEntry)
```typescript
{
  transactionType: TransactionType
  occurrenceDate: string
  debitAccount: AccountTitle    // Hardcoded enum
  debitAmount: number
  debitTax: TaxCategory
  creditAccount: AccountTitle   // Hardcoded enum
  client: string
  paymentDate: string
  paymentAccount: string        // Free text
  notes: string
}
```

### New Model (Journal + Account Master)
```typescript
Journal {
  type: TransactionType
  date: DateTime
  accountId: string             // Foreign key to Account
  account: Account              // Relation
  amount: Decimal
  paymentAccount: PaymentAccount // Enum
  taxType: TaxType
  clientName: string
  description: string?
  subAccount: string?
  memo: string?
  fiscalYear: number
  fiscalPeriod: number
  userId: string
}

Account {
  code: string                  // "101", "715", etc.
  name: string                  // "現金", "通信費", etc.
  category: AccountCategory
  subCategory: string
  reportType: ReportType
  defaultTaxType: TaxType
}
```

## Key Changes

1. **Account Selection**: From hardcoded enum → Dynamic Account master lookup
2. **Payment Account**: From free text → PaymentAccount enum (BANKING, CREDIT_CARD, CASH, PRIVATE)
3. **Tax Type**: TaxCategory → TaxType (added TAX_FREE, NONE)
4. **Field Names**: occurrenceDate → date, client → clientName, notes → memo
5. **Fiscal Tracking**: Added fiscalYear, fiscalPeriod auto-calculation
6. **User Scope**: Added userId for multi-tenancy

## Implementation Approach

### Phase 1: Server-Side Foundation
- Create account loader (`lib/loaders/accounts.ts`)
- Update type definitions (`lib/types.ts`)
- Implement Journal CRUD actions with Account relations

### Phase 2: Frontend Migration
- Update list page to display Account.name instead of enum label
- Modify JournalModal to fetch/display Account master data
- Update form state management in useJournal hook

### Phase 3: Simplification (Future)
Consider simplifying dual-entry form (debit/credit) to single-entry form with:
- Single account selection
- Transaction type (INCOME/EXPENSE) determines accounting treatment
- Amount field (positive only)

## Breaking Changes

- All existing JournalEntry data incompatible with new schema
- UI components referencing AccountTitle enum must migrate
- Form validation rules updated for new field structure

## Migration Notes

- Old `lib/actions.ts` contains JournalEntry CRUD (check for dependencies before removal)
- Account master must be seeded before creating Journal entries
- Fiscal year/period calculation: Use Japan fiscal year (April 1 - March 31)
