# TypeScript Beginner Guide for S-code

## Common TypeScript Mistakes & How to Fix Them

This guide demonstrates common TypeScript mistakes found in real codebases and how to fix them. All examples are based on actual code patterns from this repository.

### 1. Missing Generic Types in Collections

**❌ Bad: Untyped Collections**
```typescript
// From lib/mongodb.ts - BEFORE
export async function connectToMongo(): Promise<{
  usersCollection: Collection;  // Missing generic type!
  refreshTokensCollection: Collection;  // Missing generic type!
}> {
```

**✅ Good: Properly Typed Collections**
```typescript
// AFTER - with proper typing
export async function connectToMongo(): Promise<{
  usersCollection: Collection<User>;
  refreshTokensCollection: Collection<RefreshToken>;
}> {
```

**Why this matters:**
- Without generics, you lose type safety and autocomplete
- Operations like `findOne()` return `any` instead of the proper type
- Runtime errors become more likely

### 2. Poor Type Naming Conventions

**❌ Bad: Inconsistent Naming**
```typescript
// From types/roomsTypes.ts - BEFORE
export type mockRooms = {  // Wrong: lowercase, plural for single type
  id: string;
  // ...
};
```

**✅ Good: Proper Naming**
```typescript
// AFTER - following TypeScript conventions
export interface MockRoom {  // PascalCase, singular, use interface for objects
  id: string;
  // ...
}

export type MockRoomStatus = "live" | "scheduled" | "ended" | "saved";
```

**TypeScript Naming Rules:**
- Types/Interfaces: `PascalCase` (e.g., `User`, `ApiResponse`)
- Variables/functions: `camelCase` (e.g., `userId`, `getUserData`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- Use `interface` for object shapes, `type` for unions/primitives

### 3. Missing Function Return Types

**❌ Bad: Implicit Return Types**
```typescript
// API routes without explicit return types
export async function GET(req: NextRequest) {  // Return type inferred as Promise<any>
  // ...
  return NextResponse.json({ success: true });
}
```

**✅ Good: Explicit Return Types**
```typescript
export async function GET(
  req: NextRequest
): Promise<NextResponse<{ success: boolean; data?: any; error?: string }>> {
  // ...
  return NextResponse.json({ success: true });
}
```

### 4. Weak Environment Variable Typing

**❌ Bad: No Environment Variable Validation**
```typescript
// From lib/mongodb.ts - risky
const uri = process.env.MONGODB_URI!;  // Force unwrap - can cause runtime errors
```

**✅ Good: Validated Environment Variables**
```typescript
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const uri = getRequiredEnv('MONGODB_URI');
```

### 5. Missing Error Type Definitions

**❌ Bad: Generic Error Handling**
```typescript
catch (error) {  // error is 'any'
  console.error('Something went wrong:', error);
}
```

**✅ Good: Typed Error Handling**
```typescript
interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

catch (error: unknown) {
  if (isApiError(error)) {
    console.error('API Error:', error.message, error.code);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Best Practices Checklist

### ✅ Type Safety
- [ ] All function parameters have explicit types
- [ ] All function return types are explicit (except simple one-liners)
- [ ] No use of `any` without justification
- [ ] Generic types used for collections and reusable functions
- [ ] Environment variables validated at startup

### ✅ Naming Conventions
- [ ] Types and interfaces use PascalCase
- [ ] Variables and functions use camelCase
- [ ] Constants use SCREAMING_SNAKE_CASE
- [ ] File names use kebab-case or camelCase consistently
- [ ] Interface names don't start with 'I' (modern TypeScript convention)

### ✅ Code Organization
- [ ] Types defined in appropriate `/types` files
- [ ] Related types grouped together
- [ ] Utility types reused across the application
- [ ] API response types defined for consistency

### ✅ Error Handling
- [ ] Custom error types defined
- [ ] Error boundaries implemented where needed
- [ ] Validation errors properly typed
- [ ] API errors have consistent structure

## Quick Fixes for This Codebase

### 1. Fix Collection Types
```bash
# Search for untyped Collections
grep -r "Collection;" lib/ types/
```

### 2. Add Missing Return Types
```bash
# Find functions without return types
grep -r "function.*{" --include="*.ts" --include="*.tsx" | grep -v ": "
```

### 3. Validate Environment Variables
Create a `lib/env.ts` file to centralize environment validation.

### 4. Add API Response Types
Create consistent types for all API responses in `types/api.ts`.

## Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

## Next Steps

1. Review your code against this checklist
2. Fix one category of issues at a time
3. Set up ESLint rules to catch these issues automatically
4. Use TypeScript strict mode for better type checking