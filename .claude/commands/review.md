# Code Review Command

Perform a thorough code review of recent changes or specified files.

## Review Checklist

### 1. Code Quality

**TypeScript:**
- [ ] No `any` types without justification
- [ ] All functions have proper return types
- [ ] Interfaces/types properly defined
- [ ] Generics used appropriately
- [ ] No type assertions (`as`) unless necessary

**Code Structure:**
- [ ] Functions are small and focused (< 50 lines ideally)
- [ ] Proper separation of concerns
- [ ] No code duplication
- [ ] Clear and descriptive names
- [ ] Consistent code style

**React Components:**
- [ ] Proper use of client vs server components
- [ ] No unnecessary re-renders
- [ ] Props properly typed
- [ ] Loading and error states handled
- [ ] Accessibility considered

### 2. Security

- [ ] No hardcoded secrets or credentials
- [ ] Input validation with Zod
- [ ] SQL injection prevented (Prisma parameterized queries)
- [ ] XSS prevented (proper escaping)
- [ ] Authentication checks in place
- [ ] Authorization properly implemented
- [ ] CSRF protection where needed
- [ ] Sensitive data not logged

### 3. Performance

- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Proper indexing on database columns
- [ ] Images optimized (Next.js Image component)
- [ ] Lazy loading where appropriate
- [ ] No memory leaks
- [ ] Efficient algorithms used

### 4. Error Handling

- [ ] Try-catch blocks where needed
- [ ] Errors logged appropriately
- [ ] User-friendly error messages
- [ ] Proper HTTP status codes
- [ ] Fallback UI for errors
- [ ] No silent failures

### 5. Testing Considerations

- [ ] Code is testable
- [ ] Edge cases considered
- [ ] Error paths tested
- [ ] Happy path works
- [ ] Validation works correctly

### 6. Best Practices

**Database (Prisma):**
- [ ] Transactions used for multi-step operations
- [ ] Proper error handling for unique constraints
- [ ] Cascading deletes configured properly
- [ ] Indexes on foreign keys

**API Routes:**
- [ ] Consistent response format
- [ ] Proper status codes
- [ ] Input validation
- [ ] Authentication/authorization
- [ ] Error handling

**Next.js:**
- [ ] Proper use of Server/Client components
- [ ] Metadata properly configured
- [ ] Loading states with Suspense
- [ ] Error boundaries where needed

### 7. Code Smells to Identify

❌ **Anti-patterns:**
- Long functions (> 50 lines)
- Deeply nested conditionals
- Magic numbers/strings
- Commented-out code
- TODO comments without issues
- Copy-pasted code
- God objects/functions

### 8. Suggestions for Improvement

Provide:
1. **Critical Issues**: Must fix before merging
2. **Important**: Should fix soon
3. **Nice-to-have**: Consider for future refactoring
4. **Positive Feedback**: What's done well

## Review Process

1. **Understand Context**
   - What problem is being solved?
   - What files were changed?
   - What's the scope of changes?

2. **Read Through Code**
   - Review file by file
   - Check logic flow
   - Verify edge cases handled

3. **Check Standards**
   - Follows project conventions?
   - Matches existing patterns?
   - TypeScript strict mode compliance?

4. **Test Mentally**
   - Walk through user flows
   - Consider error scenarios
   - Think about edge cases

5. **Provide Feedback**
   - Be specific with line numbers
   - Explain why something should change
   - Suggest alternatives
   - Acknowledge good practices

## Output Format

```markdown
# Code Review Summary

## Files Reviewed
- file1.ts
- file2.tsx

## Critical Issues 🔴
1. [file.ts:42] SQL injection vulnerability in raw query
2. [component.tsx:15] Missing authentication check

## Important Issues 🟡
1. [api/route.ts:23] Should use Zod validation
2. [page.tsx:67] Missing error handling

## Nice-to-have 🟢
1. [utils.ts:12] Could extract to separate function
2. [component.tsx:34] Consider memoization

## What's Done Well ✅
1. Proper TypeScript typing throughout
2. Good error messages for users
3. Clean component structure

## Overall Assessment
[Summary of code quality and recommendations]
```
