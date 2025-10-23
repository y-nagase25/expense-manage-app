# Expense Management App

An expense management application built with Next.js 15 that uses Supabase for authentication and Prisma with PostgreSQL for data management. The app provides journal entry management for tracking income and expenses with double-entry bookkeeping.

## Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Database**: PostgreSQL (via Supabase) with Prisma ORM
- **Authentication**: Supabase Auth with Google OAuth
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Linting/Formatting**: Biome (10-100x faster than ESLint)
- **UI Libraries**: Radix UI primitives, lucide-react icons, sonner for toasts
- **Form Validation**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 22.x
- pnpm 9.15.4
- PostgreSQL database (via Supabase)

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL="your-supabase-pooled-connection-string"
DIRECT_URL="your-supabase-direct-connection-string"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Or run migrations (recommended for production)
pnpm db:migrate
```

### Development

```bash
# Start development server with Turbopack
pnpm dev

# Start with debug mode (shows SQL queries)
pnpm dev:debug

# Open Prisma Studio to view/edit database
pnpm db:studio
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm dev:debug` - Start dev server with SQL query logging
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm build:check` - Build and test production locally

### Linting & Formatting (Biome)
- `pnpm lint` - Check for linting and formatting issues
- `pnpm lint:fix` - Auto-fix linting and formatting issues
- `pnpm format` - Format all files

### Database (Prisma)
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema changes to database (no migration)
- `pnpm db:migrate` - Create and apply new migration
- `pnpm db:deploy` - Deploy migrations (production)
- `pnpm db:status` - Check migration status
- `pnpm db:studio` - Open Prisma Studio GUI
- `pnpm db:seed:accounts` - Run account seed script

## Project Structure

```
app/
  (auth)/                    # Authentication pages (login, OAuth callback)
  (dashboard)/               # Authenticated pages (journals, profile)
  layout.tsx                 # Root layout
  page.tsx                   # Home page

components/
  ui/                        # shadcn/ui components
  icons/                     # Icon components
  Header.tsx, Sidebar.tsx    # Layout components

lib/
  actions.ts                 # Server Actions for CRUD operations
  db.ts                      # Prisma client singleton
  types.ts                   # Type definitions and label mappings
  utils.ts                   # Utility functions

utils/
  supabase/                  # Supabase client utilities

hooks/
  useJournal.tsx             # Journal modal state management
  useToast.tsx               # Toast notification hook

prisma/
  schema.prisma              # Database schema
  migrations/                # Migration files
  seed/                      # Seed scripts
```

## Features

- Double-entry bookkeeping journal entries
- Income and expense tracking
- Multiple account types (Sales, Communication, Supplies, Rent, etc.)
- Tax category management (10%, 8%, Non-taxable, Tax-exempt)
- Google OAuth authentication via Supabase
- Responsive design with dark mode support
- Real-time updates with server actions

## Design Tokens

This project uses design tokens for consistent theming. Always use semantic color classes like `bg-background`, `text-foreground`, `bg-primary` instead of hardcoded colors like `bg-white` or `text-gray-900`. See `app/globals.css` for all available tokens.

## Contributing

- Never push directly to `main` or `develop` branches
- Create feature branches for all work
- Run `pnpm lint:fix` before committing
- All UI components should use shadcn/ui when available
- Follow the architecture patterns in CLAUDE.md

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

Private project
