# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An expense management application built with Next.js 15 that uses Supabase for authentication and Prisma with PostgreSQL for data management. The app provides journal entry management for tracking income and expenses with double-entry bookkeeping.

## Common Commands

### Development
```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production with Turbopack
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database (Prisma + PostgreSQL via Supabase)
```bash
pnpm db:generate  # Generate Prisma Client
pnpm db:push      # Push schema changes to database (no migration)
pnpm db:migrate   # Create and apply new migration
pnpm db:deploy    # Deploy migrations (production)
pnpm db:status    # Check migration status
pnpm db:studio    # Open Prisma Studio GUI
pnpm db:seed      # Run database seed script
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Database**: PostgreSQL (via Supabase) with Prisma ORM
- **Authentication**: Supabase Auth (currently disabled in middleware)
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **State Management**: React Context (see `useJournal` hook)
- **UI Libraries**: Radix UI primitives, lucide-react icons, sonner for toasts

### Directory Structure

```
app/
  (auth)/              # Route group for authentication pages (login, etc.)
  journals/            # Journal entry CRUD pages
    [id]/             # Dynamic route for individual journal entries
    components/       # Journal-specific components (JournalModal, ActionIcons, etc.)
  components/         # Shared components (Header, Sidebar, Button, Input, etc.)
  types.ts            # Type definitions and label mappings for Prisma enums

lib/
  actions.ts          # Server Actions for journal CRUD operations
  db.ts               # Prisma client singleton
  format.ts           # Formatting utilities

utils/
  supabase/           # Supabase client utilities (client.ts, server.ts, middleware.ts)

hooks/
  useJournal.tsx      # Context provider for journal modal state
  useToast.tsx        # Toast notification hook

prisma/
  schema.prisma       # Database schema with JournalEntry model and enums
```

### Data Model

The core data model is `JournalEntry` with these key fields:
- `transactionType`: INCOME | EXPENSE
- `debitAccount`, `creditAccount`: AccountTitle enum (various account types)
- `debitAmount`, `debitTax`: Amount and tax category
- `occurrenceDate`, `paymentDate`: Transaction dates
- `client`, `notes`: Text fields

Enums defined in Prisma schema:
- `TransactionType`: INCOME, EXPENSE
- `AccountTitle`: SALES, COMMUNICATION, SUPPLIES, RENT, etc. (14 types)
- `TaxCategory`: TAXABLE_10, TAXABLE_8, NON_TAXABLE, TAX_EXEMPT

### Key Patterns

1. **Server Actions**: All database operations use Next.js Server Actions in `lib/actions.ts`
   - Pattern: `"use server"` directive, FormData handling, revalidatePath for cache invalidation
   - Example: `createJournalEntry`, `updateJournalEntry`, `deleteJournalEntry`

2. **Type Safety**: Prisma types are re-exported and extended in `app/types.ts`
   - Label mappings (e.g., `AccountTitleLabel`) for i18n display
   - Derived types like `InitialJournalEntry` (omits id, timestamps)

3. **Authentication**: Supabase Auth integration exists but is currently disabled
   - `middleware.ts:5-6` has `updateSession` commented out
   - Auth utilities in `utils/supabase/` ready for activation

4. **Modal State**: Journal creation/editing uses a Context pattern
   - `JournalProvider` wraps pages that need modal state
   - `useJournal()` hook provides modal control and form data

5. **Path Aliases**: Uses `@/*` for imports (maps to project root)
   - Example: `@/lib/actions`, `@/app/types`

## Environment Variables

Required in `.env`:
- `DATABASE_URL`: PostgreSQL connection string (pooled)
- `DIRECT_URL`: Direct database connection (for migrations)
- Supabase credentials (for auth, when enabled)

## Notes

- The app uses Turbopack for faster builds/dev (Next.js 15 feature)
- Middleware session handling is currently bypassed (`NextResponse.next()`)
- Database uses Supabase's connection pooler with Prisma
- Form submissions use progressive enhancement (Server Actions + useFormState pattern)
