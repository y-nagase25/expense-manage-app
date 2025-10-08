# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An expense management application built with Next.js 15 that uses Supabase for authentication and Prisma with PostgreSQL for data management. The app provides journal entry management for tracking income and expenses with double-entry bookkeeping.

## Design Work Rules

If you are requested to perform design work, please create a file according to the following rules:
- File name: `YYYYMMDD_{work_content}.md`
- Save location: `docs/`
- Format: Markdown
Example: `docs/20251001_user_authentication_system_design.md`

## Next.js Application Implementation Rules
- Except for screens that require dynamic updates (e.g., chat), data retrieval should be performed from server components whenever possible.
- Avoid using "use client" unless client-side operation is essential (state management, browser API usage, heavy UI libraries, etc.).
- When retrieving data from server components, separate server processes into loaders and other packages to separate responsibilities.
- Use import "server-only" for processes expected to run server-side to prevent accidental references from the client.
- Server actions ("use server" operations) should be used only for operations with side effects, such as data updates and file uploads. Revalidate actions such as revalidatePath and revalidateTag should also be performed as a single set.
- Client-side data retrieval is an exception, and is permitted only for real-time communication, high-frequency polling, search based on user actions, and offline optimization (e.g., React Query).

## GitHub Operation Rules

- When a user asks you to submit a PR, create a feature branch for your current work, commit it, and then submit the PR.
- Pushing directly to develop or main is prohibited.
- Diffs, including Prisma migrations, can break the environment during automatic deployment, so please ask the user for permission before proceeding.
- After making logic changes, run `npm run lint` in the project root before pushing.

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
  (auth)/                    # Route group for authentication pages
    auth/callback/           # OAuth callback handler route
    login/                   # Login page with Google OAuth
      components/            # Login-specific components (LoginErrorHandler)
    layout.tsx              # Auth layout wrapper
  (dashboard)/               # Route group for authenticated pages
    journals/                # Journal entry CRUD pages
      [id]/                  # Dynamic route for individual journal entries
      components/            # Journal-specific components (JournalModal, ActionIcons, etc.)
    profile/                 # User profile page
    layout.tsx              # Dashboard layout with Sidebar
  components/                # Shared app components
    form/                    # Form components (Field, Input)
  layout.tsx                # Root layout with ToastProvider
  page.tsx                  # Home page
  types.ts                  # Type definitions and label mappings for Prisma enums

components/                 # Global shared components (outside app directory)
  icons/                    # Icon components (GoogleIcon, etc.)
  ui/                       # shadcn/ui components (Button, Card, etc.)
  AppLayout.tsx             # Main app layout wrapper
  Header.tsx                # Global header component
  Sidebar.tsx               # Navigation sidebar
  Footer.tsx                # Global footer component

lib/
  actions.ts                # Server Actions for journal CRUD operations
  db.ts                     # Prisma client singleton
  format.ts                 # Formatting utilities
  types.ts                  # Shared type definitions
  utils.ts                  # General utility functions

utils/
  supabase/                 # Supabase client utilities
    client.ts               # Browser client
    server.ts               # Server client
    middleware.ts           # Session update middleware

hooks/
  useJournal.tsx            # Context provider for journal modal state
  useToast.tsx              # Toast notification hook with ToastProvider

prisma/
  schema.prisma             # Database schema with JournalEntry model and enums
  migrations/               # Database migration files
  seed.ts                   # Database seed script

docs/                       # Design and documentation files (YYYYMMDD_*.md)
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

- Database uses Supabase's connection pooler with Prisma
- Form submissions use progressive enhancement (Server Actions + useFormState pattern)
