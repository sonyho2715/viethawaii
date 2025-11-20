# Claude Code Quick Start Guide

Welcome! You've set up a comprehensive system to make Claude Code work like a senior developer. Here's how to use it.

## What Was Set Up

### 1. Directory Structure
```
.claude/
├── commands/           # Slash commands for common workflows
│   ├── new-feature.md
│   ├── fix-build.md
│   ├── fix-types.md
│   ├── ship.md
│   ├── review.md
│   └── debug.md
├── context/           # Technical patterns and standards
│   ├── api-patterns.md
│   ├── auth-patterns.md
│   └── database-patterns.md
├── playbooks/         # Step-by-step workflow guides
│   ├── new-saas-project.md
│   └── feature-workflow.md
└── QUICK_START.md    # This file
```

### 2. Enhanced Files
- **CLAUDE.md** - Comprehensive project instructions with architecture patterns and coding standards
- **.claudeignore** - Filters out noise from codebase exploration

## How to Use Slash Commands

Slash commands are shortcuts for complex workflows.

### Available Commands

```bash
/new-feature      # Guide for creating a new feature
/fix-build        # Fix all build errors systematically
/fix-types        # Fix TypeScript type errors
/ship             # Prepare project for deployment
/review           # Perform code review
/debug            # Debug issues systematically
```

### Usage Example

Instead of:
> "Add a booking feature"

Use:
> `/new-feature`
>
> Then provide details about the booking feature when prompted.

The slash command will expand into a comprehensive checklist and guide Claude through the process.

## How to Use Context Files

Context files contain technical patterns and best practices.

### When Claude Needs a Reminder

If you notice Claude not following your patterns, reference the context files:

> "Implement the booking API following the pattern in .claude/context/api-patterns.md"

Or just mention:
> "Use our standard API pattern"

Claude will automatically reference `.claude/context/api-patterns.md`.

### Context Files Available

- **api-patterns.md** - Standard API route and Server Action patterns
- **auth-patterns.md** - Authentication with iron-session patterns
- **database-patterns.md** - Prisma best practices and patterns

## How to Use Playbooks

Playbooks are step-by-step guides for complex multi-phase tasks.

### Starting a New Project

> "Let's create a new SaaS project for [description]. Follow the new-saas-project playbook."

Claude will walk through:
1. Next.js setup
2. Database configuration
3. Authentication implementation
4. Deployment
5. Documentation

### Adding a Feature

> "Add a booking feature following the feature-workflow playbook."

Claude will systematically:
1. Plan the feature
2. Design the database schema
3. Implement backend
4. Build frontend
5. Test and deploy

## Best Practices

### Starting a Session

Provide context upfront:

```
Working on viethawaii project. It's a Vietnamese restaurant platform.
Goal: Add online ordering feature.
Reference aloha-massage-spa for similar booking patterns.
```

### During Development

**Good prompts:**
- ✅ "Implement user authentication following our auth-patterns"
- ✅ "Add API route for bookings. Use standard error handling."
- ✅ "Fix TypeScript errors. No @ts-ignore without asking."

**Less effective prompts:**
- ❌ "Add auth"
- ❌ "Fix it"
- ❌ "Make it work"

### Giving Feedback

Help Claude learn your preferences:

- ✅ "Good, but use Server Actions instead of API routes for this"
- ✅ "Follow the validation pattern from lib/validations/"
- ✅ "Don't use @ts-ignore. Fix the type properly."

## Common Workflows

### 1. New Feature End-to-End

```bash
# Option 1: Use slash command
/new-feature

# Option 2: Reference playbook directly
"Add user profiles feature following the feature-workflow playbook"
```

### 2. Fix All Build Errors

```bash
/fix-build
```

This will:
1. Run `npm run build`
2. Identify all errors
3. Fix TypeScript errors first
4. Fix ESLint errors
5. Verify build succeeds

### 3. Prepare for Deployment

```bash
/ship
```

This runs through:
- Code quality checks
- Security review
- Environment variables check
- Testing
- Documentation verification
- Deployment steps

### 4. Code Review

```bash
/review
```

Or specify files:
```
/review
Review these files: app/api/bookings/route.ts, app/bookings/page.tsx
```

### 5. Debug an Issue

```bash
/debug
```

Then describe the issue:
```
The booking creation is failing with a Prisma error.
Error: "Invalid prisma.booking.create() invocation"
```

## Architecture Quick Reference

### Folder Structure
```
app/
├── (auth)/              # Auth pages (login, register)
├── (dashboard)/         # Protected dashboard pages
├── [feature]/           # Feature pages
│   ├── page.tsx
│   ├── actions.ts       # Server Actions
│   └── components/
└── api/                 # API routes (when needed)

lib/
├── db.ts               # Prisma singleton
├── auth.ts             # Auth utilities
└── validations/        # Zod schemas

prisma/
├── schema.prisma
└── seed.ts
```

### When to Use What

**Server Components (default):**
- Pages that fetch data
- Static content
- SEO-important pages

**Client Components:**
- Forms with state
- Interactive elements
- Hooks (useState, useEffect)

**Server Actions (preferred):**
- Form submissions
- Mutations
- Internal operations

**API Routes:**
- Public APIs
- Webhooks
- External integrations

## Code Standards Cheat Sheet

### ✅ DO
- Use TypeScript strict mode
- Validate input with Zod
- Handle errors gracefully
- Use Server Components by default
- Keep functions small (< 50 lines)
- Add database indexes
- Test before completing

### ❌ DON'T
- Use `any` type without justification
- Use `@ts-ignore` without asking
- Hardcode secrets
- Use inline styles (use Tailwind)
- Commit .env files
- Skip error handling
- Leave console.logs in production

## Reference Projects

When implementing features, Claude can reference these existing projects:

- **viethawaii** - Restaurant platform, booking system
- **aloha-massage-spa** - Spa booking and management
- **bg-walter-peters** - Trading dashboard
- **lee-meadows-saas** - SaaS patterns
- **pacific-pulse-growth-lab** - Growth platform

Example:
> "Add booking feature similar to viethawaii but for spa services"

## Troubleshooting

### Slash Commands Not Working

Make sure files exist:
```bash
ls .claude/commands/
```

You should see: new-feature.md, fix-build.md, etc.

### Claude Not Following Patterns

Explicitly reference the context:
> "Use the API pattern from .claude/context/api-patterns.md"

Or mention in CLAUDE.md:
> "Always use the patterns from .claude/context/"

### Build Failing After Changes

```bash
/fix-build
```

Or manually:
```bash
npm run db:generate
npm run build
```

## Next Steps

### 1. Try a Slash Command

Start simple:
```bash
/review
```

Ask Claude to review the CLAUDE.md file.

### 2. Create a Test Feature

Try the full workflow:
```bash
/new-feature
```

Create a simple "notes" feature to test the system.

### 3. Customize for Your Needs

Edit these files to match your specific preferences:
- `.claude/context/api-patterns.md` - Adjust API patterns
- `CLAUDE.md` - Add project-specific rules
- `.claude/commands/` - Add custom commands

## Tips for Maximum Efficiency

### 1. Provide Context Early

Start every session with:
- Which project you're working on
- What you're trying to achieve
- Reference projects to follow

### 2. Use Specific Prompts

Instead of:
> "Fix the errors"

Use:
> "/fix-build"

Or:
> "Fix TypeScript errors in app/api/. Follow strict mode. No @ts-ignore."

### 3. Reference Existing Code

> "Add user settings page. Match the style and patterns from app/dashboard/page.tsx"

### 4. Iterate and Improve

When Claude does something well:
> "Good! Add this pattern to .claude/context/ for future reference"

When Claude makes a mistake:
> "This should use Server Actions, not API routes. Update the pattern."

## Advanced: Creating Custom Commands

### 1. Create New Command File

```bash
nano .claude/commands/deploy.md
```

### 2. Write the Command

```markdown
# Deploy Command

Deploy the project to production:

1. Run tests
2. Build locally
3. Push to GitHub
4. Verify Vercel deployment
5. Test production URL
```

### 3. Use It

```
/deploy
```

## Summary

You now have:
- ✅ Slash commands for common workflows
- ✅ Context files with technical patterns
- ✅ Playbooks for complex tasks
- ✅ Enhanced CLAUDE.md with standards
- ✅ .claudeignore to reduce noise

**To use effectively:**
1. Start sessions with context
2. Use slash commands for workflows
3. Reference patterns explicitly
4. Give Claude feedback
5. Iterate and improve

**Remember:** The more you use and refine this system, the better Claude will become at understanding your preferences and delivering senior-level code.

## Questions?

If Claude Code doesn't seem to be following these patterns, try:

1. **Explicit reference:**
   > "Follow the pattern in .claude/context/api-patterns.md"

2. **Use slash command:**
   > "/new-feature"

3. **Remind of standards:**
   > "Check CLAUDE.md for our coding standards"

4. **Start fresh with context:**
   > "Working on [project]. Reference [similar-project]. Goal: [specific goal]"

---

Happy coding! You and Claude are now a senior development team. 🚀
