# Fix Build Command

Fix all build errors and ensure the project builds successfully.

## Steps to Execute

1. **Run Build**
   ```bash
   npm run build
   ```
   - Capture all errors and warnings
   - Categorize errors (TypeScript, ESLint, Next.js, etc.)

2. **Fix TypeScript Errors First**
   - Start with type errors (highest priority)
   - Fix issues in order of severity
   - Do NOT use `@ts-ignore` or `@ts-expect-error` without:
     - Asking permission first
     - Adding a detailed comment explaining why
   - Do NOT use `any` type without justification
   - Properly type all function parameters and return values

3. **Fix ESLint Errors**
   ```bash
   npm run lint
   ```
   - Address linting issues
   - Follow ESLint rules configured in the project
   - Fix unused variables and imports

4. **Fix Next.js Specific Issues**
   - Server/Client component boundaries
   - Async component issues
   - Metadata export problems
   - Dynamic route issues

5. **Common Fixes**
   - **Missing Prisma Client**: Run `npm run db:generate`
   - **Missing dependencies**: Check package.json and run `npm install`
   - **Type imports**: Use `import type { Type } from '...'` for type-only imports
   - **Async components**: Ensure Server Components are properly async
   - **Client components**: Add `'use client'` directive when needed

6. **Verify Success**
   ```bash
   # Build must succeed
   npm run build

   # Linting must pass
   npm run lint

   # TypeScript must compile
   npx tsc --noEmit
   ```

7. **Test Locally**
   ```bash
   npm run dev
   ```
   - Visit key pages to ensure they load
   - Check for console errors
   - Verify core functionality works

## Standards

- **Zero TypeScript errors**: Build must compile cleanly
- **Zero ESLint errors**: All linting rules must pass
- **No shortcuts**: Don't suppress errors, fix them properly
- **Maintain functionality**: Don't break existing features while fixing errors

## Debugging Tips

- **Module not found**: Check import paths and file extensions
- **Type errors**: Look at the actual vs expected types
- **Prisma errors**: Regenerate client with `npm run db:generate`
- **Environment variables**: Check .env.local exists and has required vars

## Report

After fixing, provide:
1. Summary of errors found
2. Summary of fixes applied
3. Any remaining warnings (if acceptable)
4. Confirmation that `npm run build` succeeds
