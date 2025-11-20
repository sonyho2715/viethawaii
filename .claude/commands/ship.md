# Ship Command

Prepare the project for production deployment with thorough checks.

## Pre-Deployment Checklist

### 1. Code Quality Checks

```bash
# TypeScript compilation
npx tsc --noEmit

# Linting
npm run lint

# Build locally
npm run build
```

All must pass with zero errors.

### 2. Security Review

- [ ] No hardcoded secrets or API keys in code
- [ ] All sensitive data in environment variables
- [ ] `.env.local` and `.env` in `.gitignore`
- [ ] No commented-out credentials
- [ ] Authentication properly implemented
- [ ] Authorization checks in place for protected routes
- [ ] Input validation with Zod on all user inputs
- [ ] SQL injection prevention (using Prisma parameterized queries)
- [ ] XSS prevention (React auto-escaping, proper sanitization)

### 3. Environment Variables

- [ ] All required env vars documented in README
- [ ] Sample `.env.example` file created (without actual secrets)
- [ ] Vercel environment variables configured
- [ ] Railway environment variables set (if applicable)
- [ ] Production DATABASE_URL configured
- [ ] All secrets rotated if previously exposed

### 4. Database

```bash
# Check migrations are up to date
npm run db:migrate

# Verify schema matches production
```

- [ ] All migrations created and tested
- [ ] No pending schema changes
- [ ] Seed data script works (if applicable)
- [ ] Database backups configured

### 5. Testing

- [ ] Manual testing of critical user flows
- [ ] Authentication flow works
- [ ] CRUD operations function correctly
- [ ] Error handling displays user-friendly messages
- [ ] Loading states implemented
- [ ] Mobile responsiveness checked

### 6. Performance

- [ ] Images optimized (using Next.js Image component)
- [ ] No console.logs in production code
- [ ] Proper caching headers set
- [ ] Database queries optimized (no N+1 queries)
- [ ] Build size reasonable

### 7. Documentation

- [ ] README.md updated with:
  - Project description
  - Setup instructions
  - Environment variables needed
  - Deployment instructions
- [ ] API routes documented (if public API)
- [ ] Any special configurations noted

### 8. Git Hygiene

```bash
# Check status
git status

# Review recent commits
git log --oneline -10
```

- [ ] All changes committed
- [ ] Commit messages are clear and descriptive
- [ ] No large files committed
- [ ] No node_modules or build artifacts in repo

### 9. Deployment

```bash
# Option 1: Automatic (push to main)
git checkout main
git merge feature-branch
git push origin main

# Option 2: Manual Vercel deploy
vercel --prod

# Option 3: Preview first
git push origin feature-branch
# Check Vercel preview deployment
```

- [ ] Choose deployment method
- [ ] Push to repository
- [ ] Monitor Vercel build logs
- [ ] Check deployment succeeds

### 10. Post-Deployment Verification

- [ ] Visit production URL
- [ ] Test authentication
- [ ] Test critical features
- [ ] Check browser console for errors
- [ ] Verify database operations work
- [ ] Test on mobile device
- [ ] Check analytics/monitoring (if configured)

## Deployment Rollback Plan

If issues arise:

```bash
# Revert to previous deployment in Vercel dashboard
# Or revert git commit
git revert HEAD
git push origin main
```

## Communication

After successful deployment:
- [ ] Notify stakeholders (if applicable)
- [ ] Update project status
- [ ] Document any post-deployment tasks

## Report

Provide summary:
1. All checks completed
2. Any warnings or notes
3. Deployment URL
4. Post-deployment test results
5. Any follow-up tasks needed
