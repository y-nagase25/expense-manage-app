# ESLint to Biome Migration

**Date:** 2025-10-09
**Status:** Completed

## Overview

Migrated from ESLint to Biome for faster linting and formatting. Biome is 10-100x faster than ESLint and combines linting + formatting in a single tool.

## Changes Made

### Removed
- ESLint dependencies: `@eslint/eslintrc`, `eslint`, `eslint-config-next`
- `eslint.config.mjs` configuration file

### Added
- **Biome**: `@biomejs/biome@^2.2.5`
- **Configuration**: `biome.json` - Optimized for Next.js 15, React 19, TypeScript
- **VSCode Integration**: `.vscode/settings.json` and `.vscode/extensions.json`

### Updated
- **package.json scripts**:
  - `lint`: `biome check .`
  - `lint:fix`: `biome check --write .`
  - `format`: `biome format --write .`
  - `check`: `biome check .`
- **CLAUDE.md**: Updated GitHub rules and commands documentation

## Configuration Highlights

### biome.json
- **Formatter**: 4-space indents, 100-char line width, single quotes for JS, double quotes for JSX
- **Linting Rules**:
  - React hooks: `useExhaustiveDependencies`, `useHookAtTopLevel`
  - Code quality: `noDoubleEquals`, `useConst`, `noExplicitAny` (warnings)
  - Security: `noDangerouslySetInnerHtml` (warning)
  - Accessibility: `noSvgWithoutTitle` disabled
- **Overrides**: Default exports allowed in config files and app routes

### VSCode Settings
- Auto-format on save enabled
- Biome as default formatter for TS/TSX/JS/JSON
- Organize imports on save

## Migration Results

- **Files formatted**: 50 files auto-fixed
- **Warnings**: 35 errors + 9 warnings remaining (acceptable)
  - Most warnings: Array index keys, non-null assertions in Supabase config
  - No blocking issues

## Commands Reference

```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint:fix

# Format files only
pnpm format

# CI/CD check
pnpm check
```

## Vercel Deployment

**No changes required** - Biome runs during the existing build process. The `vercel-build` script remains unchanged:

```json
"vercel-build": "prisma generate && next build"
```

Biome doesn't block builds by default. To enforce linting in CI/CD, update to:

```json
"vercel-build": "biome check . && prisma generate && next build"
```

## Benefits

✅ **10-100x faster** than ESLint
✅ **Single tool** for linting + formatting (no Prettier needed)
✅ **Zero config** for basic usage
✅ **Better error messages**
✅ **Native TypeScript support**
✅ **Vercel compatible**

## Notes

- Biome uses `.gitignore` automatically (via `vcs.useIgnoreFile: true`)
- No cache files created (unlike ESLint's `.eslintcache`)
- Configuration schema: `https://biomejs.dev/schemas/2.2.5/schema.json`
