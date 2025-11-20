# New Feature Command

Create a new feature following our standard architecture patterns.

## Steps to Execute

1. **Understand Requirements**
   - Ask clarifying questions about the feature if needed
   - Identify which existing project this applies to (or if it's a new project)
   - Understand data models, user flows, and business logic

2. **Database Schema (if needed)**
   - Add Prisma models to `prisma/schema.prisma`
   - Include proper relations, indexes, and constraints
   - Run `npm run db:generate` after schema changes
   - Run `npm run db:push` (dev) or `npm run db:migrate` (prod)

3. **Create Feature Folder Structure**
   ```
   app/[feature-name]/
   ├── page.tsx              # Main page component
   ├── layout.tsx            # Feature-specific layout (if needed)
   ├── actions.ts            # Server Actions
   ├── types.ts              # TypeScript types
   └── components/           # Feature-specific components
       ├── FeatureForm.tsx
       └── FeatureList.tsx
   ```

4. **API Routes (if needed)**
   - Create routes in `app/api/[feature-name]/route.ts`
   - Follow our standard API pattern with error handling
   - Use Zod for validation
   - Return consistent response shape: `{ success: boolean, data?: T, error?: string }`

5. **Validation Schemas**
   - Create Zod schemas in `lib/validations/[feature-name].ts`
   - Export schemas for reuse in both client and server

6. **Components**
   - Build UI components with Tailwind CSS
   - Keep components small and focused
   - Use TypeScript strict mode
   - Implement proper loading and error states

7. **Integration**
   - Add navigation links to main layout
   - Update dashboard or relevant parent pages
   - Test user flows end-to-end

8. **Testing**
   - Test happy path
   - Test error cases
   - Verify database operations work correctly
   - Check TypeScript compilation: `npm run build`

## Standards to Follow

- **TypeScript**: Use strict mode, no `any` without explanation
- **Error Handling**: Always handle errors gracefully with user-friendly messages
- **Validation**: Validate at API boundaries using Zod
- **Database**: Use Prisma transactions for multi-step operations
- **Security**: Check authentication/authorization where needed
- **Code Style**: Match existing patterns in the project

## Reference Projects

When implementing, reference similar features from:
- `~/viethawaii/` for booking/reservation features
- `~/lee-meadows-saas/` for SaaS patterns
- `~/bg-walter-peters/` for dashboard features
- `~/aloha-massage-spa/` for service management

## Checklist Before Completion

- [ ] Database schema added (if needed)
- [ ] Prisma client generated
- [ ] Feature folder structure created
- [ ] Components implemented with proper TypeScript types
- [ ] Validation schemas created
- [ ] Error handling implemented
- [ ] Navigation updated
- [ ] Build succeeds: `npm run build`
- [ ] Feature tested manually
- [ ] Code follows project conventions
