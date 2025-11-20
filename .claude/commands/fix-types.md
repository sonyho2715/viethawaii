# Fix TypeScript Types Command

Fix all TypeScript type errors in the project.

## Steps to Execute

1. **Check for Type Errors**
   ```bash
   npx tsc --noEmit
   ```
   - List all type errors found
   - Count total errors

2. **Categorize Errors**
   - Implicit any errors
   - Type mismatch errors
   - Missing type definitions
   - Null/undefined errors
   - Import/export errors

3. **Fix Errors Systematically**

   **Priority 1: Implicit Any**
   - Add explicit types to function parameters
   - Type variables properly
   - Use proper generic types

   **Priority 2: Type Mismatches**
   - Align actual types with expected types
   - Fix incorrect return types
   - Correct prop types in components

   **Priority 3: Null/Undefined**
   - Add proper null checks
   - Use optional chaining `?.`
   - Use nullish coalescing `??`
   - Add proper type guards

4. **Standards**
   - **NO** `@ts-ignore` without explicit permission and comment
   - **NO** `@ts-expect-error` without explanation
   - **NO** `any` type without justification
   - **YES** to proper type definitions
   - **YES** to type imports from source
   - **YES** to generic types where appropriate

5. **Common Patterns**

   ```typescript
   // ✅ Good: Proper typing
   interface User {
     id: string;
     email: string;
     name: string | null;
   }

   async function getUser(id: string): Promise<User | null> {
     const user = await db.user.findUnique({ where: { id } });
     return user;
   }

   // ❌ Bad: Using any
   async function getUser(id: any): Promise<any> {
     return await db.user.findUnique({ where: { id } });
   }
   ```

   ```typescript
   // ✅ Good: Proper React component typing
   interface ButtonProps {
     label: string;
     onClick: () => void;
     variant?: 'primary' | 'secondary';
   }

   export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
     return <button onClick={onClick}>{label}</button>;
   }

   // ❌ Bad: No prop types
   export function Button({ label, onClick, variant }: any) {
     return <button onClick={onClick}>{label}</button>;
   }
   ```

6. **Verify Success**
   ```bash
   # Must pass with zero errors
   npx tsc --noEmit

   # Build must succeed
   npm run build
   ```

7. **Report**
   - Total errors found
   - Errors fixed
   - Any remaining issues (with explanation)
   - Confirmation that TypeScript compiles cleanly
