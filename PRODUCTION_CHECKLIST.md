# VietHawaii Production Readiness Checklist

## ✅ Completed Items

### P0 - Critical (All Complete)
- [x] Security audit - API routes auth checks (3 issues fixed)
- [x] Replace in-memory rate limiting with Upstash Redis
- [x] Add CSRF protection utilities
- [x] Audit password reset flow (secure: token expiry, one-time use, rate limiting)
- [x] Add Google OAuth provider
- [x] Verify environment variables (created lib/env.ts with validation)
- [x] Set up database migrations workflow (added db:migrate:deploy script)

### P1 - High Priority (All Complete)
- [x] Set up Jest and React Testing Library
- [x] Add Playwright E2E tests
- [x] Write unit tests for lib utilities
- [x] Create custom error pages (404, 500, global error)
- [x] Add error boundaries
- [x] Set up error monitoring with Sentry
- [x] Add loading states and skeleton UI
- [x] Add SEO meta tags (lib/seo.ts)
- [x] Add sitemap.xml generation

### P2 - Medium Priority
- [x] Add database indexes (User, Listing, Article)
- [x] Add structured data JSON-LD (lib/structured-data.ts)
- [x] Complete newsletter integration
- [x] Implement saved items functionality
- [x] Add email notifications (lib/email-notifications.ts)
- [x] Add health check endpoint (/api/health)
- [x] Configure Vercel cron monitoring (already configured in vercel.json)

### P3 - Nice to Have
- [x] Implement analytics dashboard (AnalyticsClient.tsx)
- [x] Add CSV export for admin reports (lib/export.ts, /api/admin/export)
- [x] Add language toggle (LanguageToggle.tsx)
- [x] Add cookie consent banner (CookieConsent.tsx)
- [x] Implement dark mode (ThemeProvider.tsx, ThemeToggle.tsx)

## 📋 Remaining Items (Manual/Audit Tasks)

### P2 - Audits Needed
- [ ] Audit database queries for N+1 problems
  - Review listing pages with includes
  - Check article/event fetching
  - Add proper select clauses
- [ ] Mobile responsiveness audit
  - Test listing creation form on mobile
  - Test admin dashboard on tablet
  - Verify search filters are usable
- [ ] Accessibility audit
  - Run axe-core on main pages
  - Fix color contrast issues
  - Add ARIA labels to interactive elements
- [ ] Form accessibility improvements
  - Ensure all inputs have labels
  - Add error announcements for screen readers
  - Test keyboard navigation

### P3 - Nice to Have
- [ ] Optimize image loading
  - Ensure all images use next/image
  - Add blur placeholders
  - Configure proper sizes
- [ ] Create admin notification system
  - Notify on new registrations
  - Notify on pending listings
  - Notify on content reports
- [ ] Audit i18n strings
  - Identify hardcoded Vietnamese/English
  - Consider next-intl for full i18n
- [ ] Fix console errors
  - Run dev server and check console
  - Fix any React warnings
  - Remove unused imports

## 🔧 Environment Variables Required

### Required for Production
\`\`\`env
DATABASE_URL=postgresql://...
AUTH_SECRET=<32+ character secret>
NEXTAUTH_URL=https://viethawaii.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
BLOB_READ_WRITE_TOKEN=...
RESEND_API_KEY=...
\`\`\`

### Recommended
\`\`\`env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
CRON_SECRET=...
SENTRY_DSN=...
NEXT_PUBLIC_SENTRY_DSN=...
\`\`\`

## 🚀 Deployment Checklist

1. [ ] Verify all environment variables in Vercel dashboard
2. [ ] Run \`npm run build\` locally to check for errors
3. [ ] Run \`npm run lint\` to check for linting issues
4. [ ] Run \`npm run test\` to run unit tests
5. [ ] Test Google OAuth callback URL matches production
6. [ ] Verify Cloudinary configuration
7. [ ] Test Resend email sending
8. [ ] Set up Upstash Redis (free tier available)
9. [ ] Configure Sentry project
10. [ ] Test cron job with CRON_SECRET

## 📊 Post-Launch Monitoring

1. Set up Vercel Analytics
2. Monitor Sentry for errors
3. Check health endpoint regularly
4. Review cron job logs
5. Monitor rate limiting effectiveness

---

Generated: ${new Date().toISOString()}
