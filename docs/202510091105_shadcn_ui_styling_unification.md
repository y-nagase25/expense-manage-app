# shadcn/ui Styling Unification Design

**Date:** 2025-10-09
**Author:** Claude Code
**Status:** Implementation

## 1. Overview

This document outlines the design for unifying UI styling across the expense management application using shadcn/ui components and design tokens. The current codebase has inconsistent styling patterns, mixing custom implementations with shadcn/ui components.

## 2. Current State Analysis

### 2.1 Identified Issues

#### Critical Issues
1. **Missing shadcn/ui Components**
   - Required components not yet installed: `input`, `label`, `select`, `dialog`, `table`, `textarea`, `form`
   - These are essential for form handling and data presentation

2. **Custom Form Components with Hardcoded Styles**
   - Files: `app/components/form/Input.tsx`, `app/components/form/Field.tsx`
   - Issues:
     - Hardcoded Tailwind classes: `border-gray-300`, `focus:ring-indigo-500`, `dark:bg-gray-700`
     - Not using design tokens from theme
     - Inconsistent with shadcn/ui patterns
   - Impact: Used in 18+ instances across `JournalModal.tsx` and `[id]/page.tsx`

3. **JournalModal Component** (`app/(dashboard)/journals/components/JournalModal.tsx`)
   - Custom modal implementation instead of shadcn/ui Dialog
   - Repeated inline styling for every input/select (identical classes repeated 10+ times)
   - Example of repeated class string:
     ```tsx
     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
     ```
   - Uses hardcoded colors: `bg-black/50`, `bg-white`, `dark:bg-gray-800`

4. **Data Table** (`app/(dashboard)/journals/page.tsx`)
   - Raw HTML `<table>` with custom styling
   - Hardcoded colors: `bg-gray-50`, `dark:bg-gray-700`, `text-gray-500`, `divide-gray-200`
   - Missing accessibility features
   - Should use shadcn/ui Table component

5. **Inconsistent Color Usage**
   - Mixing approaches:
     - Hardcoded: `gray-500`, `indigo-600`, `gray-800`
     - Design tokens: `muted-foreground`, `primary`, `background`
   - Well-implemented examples: `Header.tsx`, `Sidebar.tsx`
   - Poorly implemented: Form components, tables, detail pages

#### Minor Issues
1. **Journal Detail Page** (`app/(dashboard)/journals/[id]/page.tsx`)
   - Custom link styling: `text-indigo-600 hover:text-indigo-800`
   - Custom table in `JournalPreview` with basic border classes
   - Using `text-gray-500` instead of `text-muted-foreground`

### 2.2 Well-Implemented Areas

The following components serve as good examples:
- `components/Header.tsx` - Proper use of shadcn/ui components and design tokens
- `components/Sidebar.tsx` - Consistent use of theme colors
- `components/ui/badge.tsx` - Custom variant properly extending shadcn/ui patterns
- Theme configuration in `app/globals.css` - Properly structured with CSS variables

## 3. Design Goals

### 3.1 Primary Objectives
1. **Consistency**: All UI components follow shadcn/ui patterns
2. **Maintainability**: Use design tokens for all colors and spacing
3. **Accessibility**: Leverage shadcn/ui's built-in accessibility features
4. **Theme Support**: Proper dark mode support through design tokens
5. **Developer Experience**: Reduce code duplication and improve readability

### 3.2 Success Criteria
- Zero hardcoded color classes (e.g., `gray-500`, `indigo-600`)
- All form inputs use shadcn/ui components
- All modals use Dialog component
- All tables use Table component
- Consistent spacing and typography using theme tokens

## 4. Design Decisions

### 4.1 Component Strategy

#### Forms
- **Decision**: Replace custom `InputText`, `InputSelect`, `Field` with shadcn/ui primitives
- **Rationale**:
  - Reduces maintenance burden
  - Provides built-in validation support
  - Ensures accessibility
  - Consistent styling across all forms
- **Implementation**:
  - Use `Input` for text/date/number inputs
  - Use `Select` for dropdowns
  - Use `Label` for field labels
  - Use `Form` component for validation context
  - Use `Textarea` for multiline text

#### Modals
- **Decision**: Replace custom modal with shadcn/ui `Dialog`
- **Rationale**:
  - Handles focus management automatically
  - Proper accessibility (ARIA attributes, keyboard navigation)
  - Consistent animations and styling
  - Portal-based rendering
- **Implementation**:
  - Migrate `JournalModal` to use `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter`

#### Tables
- **Decision**: Replace HTML tables with shadcn/ui `Table` component
- **Rationale**:
  - Consistent styling with rest of application
  - Built-in responsive handling
  - Proper semantic HTML
  - Accessibility features
- **Implementation**:
  - Use `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`

### 4.2 Design Token Usage

All components must use design tokens from the theme:

| Use Case | Design Token | ❌ Avoid |
|----------|--------------|---------|
| Background | `bg-background` | `bg-white`, `bg-gray-100` |
| Foreground text | `text-foreground` | `text-gray-900`, `text-black` |
| Muted text | `text-muted-foreground` | `text-gray-500`, `text-gray-600` |
| Primary action | `bg-primary`, `text-primary` | `bg-indigo-600`, `text-indigo-600` |
| Borders | `border-border` | `border-gray-200`, `border-gray-300` |
| Input background | `bg-background` | `bg-white`, `dark:bg-gray-700` |
| Card background | `bg-card` | `bg-white`, `dark:bg-gray-800` |
| Muted background | `bg-muted` | `bg-gray-50`, `bg-gray-100` |
| Accent | `bg-accent` | `bg-gray-100` |
| Destructive | `bg-destructive` | `bg-red-500` |

### 4.3 Custom Component Guidelines

When creating custom components:
1. Extend shadcn/ui base components using composition
2. Use `cva` (class-variance-authority) for variants
3. Use `cn()` utility for className merging
4. Always use design tokens, never hardcoded colors
5. Follow the pattern established in `components/ui/badge.tsx`

Example pattern:
```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes using design-tokens",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
```

## 5. Implementation Plan

### Phase 1: Install Missing Components
**Estimated Time:** 5 minutes

```bash
npx shadcn@latest add input label select dialog table textarea form
```

**Verification:**
- Components appear in `components/ui/`
- No build errors

### Phase 2: Replace Custom Form Components
**Estimated Time:** 30 minutes

**Tasks:**
1. Create wrapper components for common patterns if needed
2. Update `JournalModal.tsx` to use new components
3. Update `app/(dashboard)/journals/[id]/page.tsx` to use new components
4. Delete old custom components: `app/components/form/Input.tsx`, `app/components/form/Field.tsx`

**Files Modified:**
- `app/(dashboard)/journals/components/JournalModal.tsx`
- `app/(dashboard)/journals/[id]/page.tsx`
- Delete: `app/components/form/Input.tsx`
- Delete: `app/components/form/Field.tsx`

### Phase 3: Refactor JournalModal
**Estimated Time:** 45 minutes

**Tasks:**
1. Replace custom modal div structure with `Dialog` component
2. Use `DialogHeader`, `DialogTitle`, `DialogContent`, `DialogFooter`
3. Replace all inline inputs with shadcn/ui `Input` and `Select`
4. Add proper `Label` components
5. Consider adding `Form` component for validation
6. Replace all hardcoded colors with design tokens

**Before:**
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center">
  <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
  <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
```

**After:**
```tsx
<Dialog open={isModalOpen} onOpenChange={closeModal}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>仕訳を登録</DialogTitle>
    </DialogHeader>
```

### Phase 4: Refactor Data Table
**Estimated Time:** 30 minutes

**Tasks:**
1. Replace HTML `<table>` with shadcn/ui `Table` component
2. Update all table-related styling to use design tokens
3. Improve responsive behavior
4. Add proper accessibility attributes

**Files Modified:**
- `app/(dashboard)/journals/page.tsx`

### Phase 5: Update Remaining Pages
**Estimated Time:** 20 minutes

**Tasks:**
1. Update `app/(dashboard)/journals/[id]/page.tsx`:
   - Replace custom link styling with design tokens
   - Update `JournalPreview` table to use `Table` component
   - Replace `text-gray-500` with `text-muted-foreground`
2. Verify all pages for any remaining hardcoded colors

**Files Modified:**
- `app/(dashboard)/journals/[id]/page.tsx`

### Phase 6: Testing & Verification
**Estimated Time:** 15 minutes

**Tasks:**
1. Run linter: `pnpm lint`
2. Build check: `pnpm build`
3. Visual testing in browser:
   - Journal list page
   - Journal modal (create)
   - Journal detail page (edit)
   - Dark mode toggle verification
4. Accessibility check:
   - Keyboard navigation
   - Screen reader compatibility
   - Focus management

## 6. Migration Guide

### 6.1 For Input Fields

**Before:**
```tsx
<input
  type="text"
  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
/>
```

**After:**
```tsx
<div className="space-y-2">
  <Label htmlFor="field-id">Label</Label>
  <Input id="field-id" type="text" />
</div>
```

### 6.2 For Select Fields

**Before:**
```tsx
<select
  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
>
  <option value="1">Option 1</option>
</select>
```

**After:**
```tsx
<div className="space-y-2">
  <Label htmlFor="field-id">Label</Label>
  <Select defaultValue="1">
    <SelectTrigger id="field-id">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="1">Option 1</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### 6.3 For Custom Field Containers

**Before:**
```tsx
<div className="border rounded-md p-3 dark:border-gray-700">
  <div className="text-sm text-gray-500 mb-1">Label</div>
  <div className="text-gray-900 dark:text-gray-100">Content</div>
</div>
```

**After:**
```tsx
<div className="space-y-2">
  <Label className="text-sm text-muted-foreground">Label</Label>
  <div className="text-foreground">Content</div>
</div>
```

## 7. Design Token Reference

### Color Tokens
Defined in `app/globals.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  /* ... more tokens */
}
```

### Usage in Tailwind

| CSS Variable | Tailwind Class | Purpose |
|--------------|----------------|---------|
| `--background` | `bg-background` | Main background |
| `--foreground` | `text-foreground` | Main text color |
| `--muted` | `bg-muted` | Muted backgrounds |
| `--muted-foreground` | `text-muted-foreground` | Secondary text |
| `--primary` | `bg-primary` | Primary buttons/actions |
| `--border` | `border-border` | Border color |
| `--input` | `border-input` | Input borders |

## 8. Risks & Mitigation

### Risk 1: Server Actions Compatibility
- **Risk:** Form submissions using Server Actions may need adjustment
- **Mitigation:** shadcn/ui Form components support progressive enhancement; test thoroughly

### Risk 2: Dark Mode Regression
- **Risk:** Design token migration might break dark mode
- **Mitigation:** Test all pages in dark mode after each phase

### Risk 3: Breaking Changes
- **Risk:** Removing custom components might affect other pages
- **Mitigation:** Use find-all-references before deletion; comprehensive testing

### Risk 4: Select Component Server Action Compatibility
- **Risk:** shadcn/ui Select uses Radix UI which is more complex than native select
- **Mitigation:** May need to keep native select for server forms; use Input instead where possible

## 9. Future Improvements

### Post-Implementation
1. **Form Validation**: Implement react-hook-form with zod for client-side validation
2. **Loading States**: Add skeleton components for better UX
3. **Error States**: Standardize error display across forms
4. **Toast Improvements**: Ensure consistent toast styling with new components
5. **Responsive Tables**: Consider adding mobile-friendly table views

### Documentation
1. Update component library documentation
2. Create Storybook for UI components (optional)
3. Add JSDoc comments to custom components

## 10. Conclusion

This design unifies the UI styling across the expense management application by:
- Eliminating hardcoded Tailwind classes
- Adopting shadcn/ui components consistently
- Using design tokens for all styling
- Improving accessibility and maintainability

The phased approach ensures minimal disruption while achieving complete consistency. Total estimated implementation time: ~2.5 hours.
