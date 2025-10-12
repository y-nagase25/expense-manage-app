# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An expense management application built with Next.js 15 that uses Supabase for authentication and Prisma with PostgreSQL for data management. The app provides journal entry management for tracking income and expenses with double-entry bookkeeping.

## Design Work Rules

If you are requested to perform design work, please create a file according to the following rules:
- File name: `YYYYMMDDHHmm_{work_content}.md`
- Save location: `docs/`
- Format: Markdown
- Character limit: Maximum 2000 characters
- Content focus: Changes only (no background information)
Example: `docs/202510221105_user_authentication_system_design.md`

## Next.js Application Implementation Rules
- Except for screens that require dynamic updates (e.g., chat), data retrieval should be performed from server components whenever possible.
- Avoid using "use client" unless client-side operation is essential (state management, browser API usage, heavy UI libraries, etc.).
- When retrieving data from server components, separate server processes into loaders and other packages to separate responsibilities.
- Use import "server-only" for processes expected to run server-side to prevent accidental references from the client.
- Server actions ("use server" operations) should be used only for operations with side effects, such as data updates and file uploads. Revalidate actions such as revalidatePath and revalidateTag should also be performed as a single set.
- Client-side data retrieval is an exception, and is permitted only for real-time communication, high-frequency polling, search based on user actions, and offline optimization (e.g., React Query).

## UI/Styling Rules

### shadcn/ui Component Usage
- **ALWAYS** use shadcn/ui components for UI elements. Never create custom implementations when a shadcn/ui component exists.
- Available shadcn/ui components: `button`, `card`, `avatar`, `dropdown-menu`, `separator`, `sheet`, `badge`, `sonner`, `input`, `label`, `select`, `dialog`, `table`, `textarea`, `form`
- For new UI needs, check if a shadcn/ui component exists first: https://ui.shadcn.com/docs/components
- Install missing components with: `npx shadcn@latest add [component-name]`

### Design Token Usage
**CRITICAL**: Never use hardcoded Tailwind color classes. Always use design tokens defined in `app/globals.css`.

#### Required Design Tokens

| Use Case | ✅ Use This | ❌ Never Use |
|----------|-------------|--------------|
| Background | `bg-background` | `bg-white`, `bg-gray-100`, `dark:bg-gray-800` |
| Foreground text | `text-foreground` | `text-gray-900`, `text-black`, `dark:text-white` |
| Muted/secondary text | `text-muted-foreground` | `text-gray-500`, `text-gray-600` |
| Primary action | `bg-primary`, `text-primary` | `bg-indigo-600`, `text-blue-500` |
| Borders | `border-border` | `border-gray-200`, `border-gray-300` |
| Input borders | `border-input` | `border-gray-300` |
| Card background | `bg-card` | `bg-white`, `dark:bg-gray-800` |
| Muted background | `bg-muted` | `bg-gray-50`, `bg-gray-100` |
| Accent | `bg-accent`, `text-accent-foreground` | `bg-gray-100` |
| Destructive | `bg-destructive`, `text-destructive-foreground` | `bg-red-500`, `text-red-600` |
| Success/Income | `bg-success`, `text-success` | `bg-green-500`, `text-emerald-600`, `text-green-600` |
| Ring (focus) | `ring-ring` | `ring-indigo-500`, `ring-blue-500` |

### Component Patterns

#### Forms
```tsx
// ✅ Correct
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>

// ❌ Wrong - Don't create custom input components with hardcoded styles
<input className="border-gray-300 focus:ring-indigo-500 dark:bg-gray-700" />
```

#### Modals/Dialogs
```tsx
// ✅ Correct
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>

// ❌ Wrong - Don't create custom modal divs
<div className="fixed inset-0 bg-black/50">
  <div className="bg-white dark:bg-gray-800 rounded-lg">
```

#### Tables
```tsx
// ✅ Correct
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>

// ❌ Wrong - Don't use raw HTML tables
<table className="bg-gray-50 dark:bg-gray-700">
```

### Custom Component Guidelines
When extending shadcn/ui components:
1. Use composition, not replacement
2. Use `cva` (class-variance-authority) for variants
3. Use `cn()` utility for className merging
4. Always use design tokens, never hardcoded colors
5. Follow the pattern in `components/ui/badge.tsx`

Example:
```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const variants = cva(
  "base-classes",  // Use design tokens here
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        muted: "bg-muted text-muted-foreground",
      },
    },
  }
)
```

### Dark Mode Support
- All components must support dark mode automatically through design tokens
- Never use `dark:` prefix with hardcoded colors (e.g., `dark:bg-gray-800`)
- Design tokens handle dark mode automatically via CSS variables

## GitHub Operation Rules

- When a user asks you to submit a PR, create a feature branch for your current work, commit it, and then submit the PR.
- Pushing directly to develop or main is prohibited.
- Diffs, including Prisma migrations, can break the environment during automatic deployment, so please ask the user for permission before proceeding.
- After making logic changes, run `pnpm lint` (Biome) in the project root before pushing.
- Use `pnpm lint:fix` to automatically fix linting and formatting issues.

## Common Commands

### Development
```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production with Turbopack
pnpm start        # Start production server
```

### Linting & Formatting (Biome)
```bash
pnpm lint         # Check for linting and formatting issues
pnpm lint:fix     # Auto-fix linting and formatting issues
pnpm format       # Format all files
pnpm check        # CI/CD check (same as lint)
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
- **Authentication**: Supabase Auth (currently enabled in middleware)
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Linting/Formatting**: Biome (10-100x faster than ESLint)
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
  layout.tsx                # Root layout with ToastProvider
  page.tsx                  # Home page
  not-found.tsx             # Custom 404 page

components/                 # Global shared components (outside app directory)
  icons/                    # Icon components (GoogleIcon, etc.)
  ui/                       # shadcn/ui components (Button, Card, etc.)
  AppLayout.tsx             # Main app layout wrapper
  Header.tsx                # Global header component
  Sidebar.tsx               # Navigation sidebar
  SidebarContent.tsx        # Sidebar content component
  Footer.tsx                # Global footer component

lib/
  actions.ts                # Server Actions for journal CRUD operations
  db.ts                     # Prisma client singleton
  format.ts                 # Formatting utilities
  types.ts                  # Shared type definitions, label mappings for Prisma enums
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

2. **Type Safety**: Prisma types are re-exported and extended in `lib/types.ts`
   - Label mappings (e.g., `AccountTitleLabel`, `TransactionTypeLabel`, `TaxCategoryLabel`) for i18n display
   - Derived types like `InitialJournalEntry` (omits id, timestamps)
   - Helper types like `AccountType`, `FormType`, `FieldProps` for UI components

3. **Authentication**: Supabase Auth integration is currently enabled
   - `middleware.ts:5` actively calls `updateSession` for session management
   - Auth utilities in `utils/supabase/` provide client/server integration
   - OAuth callback route at `app/(auth)/auth/callback/route.ts`

4. **Modal State**: Journal creation/editing uses a Context pattern
   - `JournalProvider` wraps pages that need modal state
   - `useJournal()` hook provides modal control and form data

5. **Path Aliases**: Uses `@/*` for imports (maps to project root)
   - Example: `@/lib/actions`, `@/lib/types`, `@/components/ui/button`

## Environment Variables

Required in `.env`:
- `DATABASE_URL`: PostgreSQL connection string (pooled)
- `DIRECT_URL`: Direct database connection (for migrations)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- Additional Supabase credentials for authentication

## Notes

- Database uses Supabase's connection pooler with Prisma
- Form submissions use progressive enhancement (Server Actions + useFormState pattern)
