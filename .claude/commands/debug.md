# Debug Command

Systematically debug an issue in the codebase.

## Debugging Process

### 1. Understand the Problem

- [ ] What is the expected behavior?
- [ ] What is the actual behavior?
- [ ] When does it occur? (always, sometimes, specific conditions)
- [ ] What error messages appear? (exact text)
- [ ] What are the steps to reproduce?

### 2. Gather Information

**Check Logs:**
```bash
# Development server console
# Browser console
# Vercel deployment logs
# Railway logs (if database-related)
```

**Check Environment:**
- [ ] Node version correct?
- [ ] Dependencies installed?
- [ ] Environment variables set?
- [ ] Database connection working?
- [ ] Prisma client generated?

**Recent Changes:**
- [ ] What was changed recently?
- [ ] Did it work before?
- [ ] What git commits might be related?

### 3. Isolate the Problem

**Narrow Down:**
1. Which file/component has the issue?
2. Which function/line of code?
3. Is it client-side or server-side?
4. Is it data-related or logic-related?

**Test Hypotheses:**
- Add strategic console.logs
- Check network tab for API calls
- Verify database state
- Test with different inputs

### 4. Common Issues & Solutions

**TypeScript Errors:**
```bash
# Regenerate types
npm run db:generate
npx tsc --noEmit
```

**Database Issues:**
```bash
# Check connection
npm run db:studio

# Reset database (CAUTION: development only!)
npx prisma migrate reset

# Regenerate client
npm run db:generate
```

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

**Runtime Errors:**
- Check browser console for client errors
- Check terminal for server errors
- Verify API responses in Network tab
- Check authentication state

**Environment Variable Issues:**
```bash
# Verify .env.local exists
ls -la .env.local

# Check variables are loaded
# Add temporary console.log (remove after debugging)
```

### 5. Debugging Strategies

**Binary Search:**
- Comment out half the code
- Does error still occur?
- Narrow down to specific section

**Trace Data Flow:**
- Where does data enter?
- How is it transformed?
- Where does it fail?
- Add console.logs at each step

**Check Assumptions:**
- Is data in expected format?
- Are types what you think?
- Are functions being called?
- Are conditions evaluating correctly?

### 6. Fix and Verify

1. **Implement Fix**
   - Make minimal changes
   - Target root cause
   - Don't introduce new issues

2. **Test Fix**
   - Reproduce original issue
   - Verify fix works
   - Test edge cases
   - Check nothing else broke

3. **Clean Up**
   - Remove console.logs
   - Remove commented code
   - Add proper error handling
   - Document if needed

### 7. Prevent Recurrence

- [ ] Add validation to prevent bad data
- [ ] Add error handling for this case
- [ ] Add type checking
- [ ] Consider adding test
- [ ] Document gotchas

## Debugging Tools

**Browser DevTools:**
- Console: errors and logs
- Network: API calls and responses
- Application: localStorage, cookies, session
- React DevTools: component state and props

**Database:**
```bash
npm run db:studio  # Prisma Studio GUI
```

**Git:**
```bash
# When did it break?
git log --oneline
git diff HEAD~5  # Check recent changes
git checkout <commit>  # Test old version
```

## Report Format

```markdown
# Debug Report

## Issue
[Description of the problem]

## Root Cause
[What was causing the issue]

## Solution
[How it was fixed]

## Files Changed
- file1.ts:42 - [description]
- file2.tsx:15 - [description]

## Testing
[How the fix was verified]

## Prevention
[Steps to prevent this in future]
```

## Pro Tips

- **Start simple**: Check the obvious first
- **Read error messages**: They usually tell you exactly what's wrong
- **Use TypeScript**: Many bugs are caught at compile time
- **Check types**: Mismatched types cause many runtime errors
- **Trust the process**: Systematic debugging finds issues faster than random guessing
