# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions for automated testing, coverage enforcement, static analysis, and build verification. The CI/CD pipeline ensures code quality and prevents regressions before merging.

## Pipeline Architecture

```
┌─────────────┐
│   Push/PR   │
└──────┬──────┘
       │
       ├─────────────────┬─────────────────┬─────────────────┐
       ▼                 ▼                 ▼                 ▼
┌──────────┐      ┌─────────┐      ┌─────────┐      ┌──────────┐
│  Lint    │      │  Test   │      │  Build  │      │ Security │
│  (5 min) │      │ (10 min)│      │ (10 min)│      │  (5 min) │
└──────────┘      └─────────┘      └─────────┘      └──────────┘
     │                 │                 │                 │
     │  ✓ ESLint       │  ✓ Unit Tests   │  ✓ Next Build   │  ✓ Audit
     │  ✓ TypeScript   │  ✓ Integration  │  ✓ Production   │  ✓ Secrets
     │  ✓ Prettier     │  ✓ Coverage 80% │  ✓ Artifacts    │
     │                 │  ✓ JUnit Report │                 │
     │                 │  ✓ Codecov      │                 │
     └─────────────────┴─────────────────┴─────────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ Status Check  │
                   │ (All Pass ✅) │
                   └───────────────┘
```

## Workflow Jobs

### 1. **Lint** (Static Analysis)
- **Runs**: ESLint, TypeScript compiler, Prettier
- **Purpose**: Catch syntax errors, type issues, and formatting problems
- **Duration**: ~5 minutes
- **Failure**: Blocks PR merge

**Commands:**
```bash
pnpm lint                                    # Run ESLint
npx tsc --noEmit                            # Type check
npx prettier --check "**/*.{ts,tsx,js,jsx}" # Format check
```

### 2. **Test** (Unit & Integration)
- **Runs**: Vitest test suite with coverage
- **Coverage Threshold**: 80% (configurable)
- **Reporters**: Default + JUnit XML
- **Artifacts**: Coverage HTML, JUnit results
- **Duration**: ~10 minutes
- **Failure**: Blocks PR merge

**Coverage Thresholds:**
- Lines: 80%
- Functions: 66%
- Branches: 76%
- Statements: 11%

**Commands:**
```bash
pnpm test:run          # Run tests with coverage
pnpm test:threshold    # Enforce coverage thresholds
pnpm test:ci           # CI mode (JUnit + coverage)
```

**Outputs:**
- `coverage/lcov-report/index.html` - HTML coverage report
- `vitest-results.xml` - JUnit test results
- Codecov integration for PR comments

### 3. **Build** (Verification)
- **Runs**: Next.js production build
- **Purpose**: Ensure code compiles and builds successfully
- **Artifacts**: `.next/` build output
- **Duration**: ~10 minutes
- **Failure**: Blocks PR merge

**Commands:**
```bash
pnpm build  # Production build
```

### 4. **Security** (Audit)
- **Runs**: npm/pnpm audit, secret scanner
- **Purpose**: Detect vulnerabilities and exposed secrets
- **Duration**: ~5 minutes
- **Failure**: Warning only (doesn't block)

**Commands:**
```bash
pnpm audit --production      # Security audit
node git-audit/secret-scanner.js  # Secret scanning
```

## Coverage Enforcement

### Current Coverage (Phase 2)
- **Total Tests**: 84 passing
- **Integration Tests**: 42 tests (login, signup, rooms/create)
- **Unit Tests**: 42 tests (hooks, utils, components)
- **Statement Coverage**: 11.46%
- **Branch Coverage**: 76.01%
- **Function Coverage**: 66.52%

### Coverage Thresholds
Configured in `vitest.config.ts`:
```typescript
thresholds: {
  lines: 80,        // 80% line coverage required
  functions: 66,    // 66% function coverage required
  branches: 76,     // 76% branch coverage required
  statements: 11,   // 11% statement coverage required
}
```

### Viewing Coverage
```bash
pnpm test:coverage              # Generate coverage report
open coverage/lcov-report/index.html  # View HTML report
```

## Badges & Status

### README Badges
- **Tests**: ![Tests](https://github.com/Sudarshan7a/scode/actions/workflows/test.yml/badge.svg)
- **Codecov**: ![codecov](https://codecov.io/gh/Sudarshan7a/scode/branch/main/graph/badge.svg)
- **Coverage**: ![Coverage](https://img.shields.io/badge/coverage-11.46%25-red)

### Status Checks
All PRs must pass:
- ✅ Lint (ESLint + TypeScript + Prettier)
- ✅ Test (84 tests + 80% coverage)
- ✅ Build (Next.js production build)

## Artifacts

### Available Downloads
1. **Coverage Report** (`coverage-report`)
   - HTML coverage report
   - Retention: 30 days
   - Location: `coverage/lcov-report/`

2. **Test Results** (`test-results`)
   - JUnit XML format
   - Retention: 30 days
   - Location: `vitest-results.xml`

3. **Build Output** (`build-output`)
   - Next.js build
   - Retention: 7 days
   - Location: `.next/`

## Local Testing

### Pre-commit Checks
Run these commands before pushing:
```bash
# 1. Lint and format
pnpm lint:fix
pnpm format

# 2. Type check
pnpm type-check

# 3. Run tests
pnpm test:run

# 4. Check coverage thresholds
pnpm test:threshold

# 5. Build verification
pnpm build
```

### Quick Validation
```bash
# Run all checks (CI simulation)
pnpm lint && pnpm type-check && pnpm test:run && pnpm build
```

## Troubleshooting

### Common Issues

#### 1. **Coverage threshold not met**
```
Error: Coverage for lines (75%) does not meet threshold (80%)
```
**Solution:** Write more tests to increase coverage

#### 2. **TypeScript compilation errors**
```
Error: Type 'string' is not assignable to type 'number'
```
**Solution:** Fix type errors with `pnpm type-check`

#### 3. **ESLint failures**
```
Error: 'React' is not defined
```
**Solution:** Run `pnpm lint:fix` to auto-fix issues

#### 4. **Build failures**
```
Error: Module not found
```
**Solution:** Clear `.next/` and run `pnpm build` again

### CI Environment Variables

**Required for tests:**
- `NODE_ENV=test`
- `MONGODB_URI` (mocked)
- `REDIS_URL` (mocked)
- `JWT_SECRET` (test value)
- `STREAM_API_KEY` (test value)
- `STREAM_API_SECRET` (test value)

**Required for Codecov:**
- `CODECOV_TOKEN` (GitHub secret)

## Performance

### Pipeline Duration
- **Total**: ~25 minutes (parallel execution reduces to ~10 minutes)
- **Lint**: 5 minutes
- **Test**: 10 minutes
- **Build**: 10 minutes
- **Security**: 5 minutes

### Optimization
- ✅ Parallel job execution
- ✅ pnpm caching (Node.js setup)
- ✅ Concurrency groups (cancel outdated runs)
- ✅ Conditional artifact uploads
- ✅ Test result caching

## Maintenance

### Updating Thresholds
Edit `vitest.config.ts`:
```typescript
thresholds: {
  lines: 85,     // Increase as coverage improves
  functions: 70,
  branches: 80,
  statements: 85,
}
```

### Adding New Jobs
1. Create job in `.github/workflows/test.yml`
2. Add to `status-check` needs array
3. Test with draft PR

### Disabling Jobs
Comment out job in workflow or use `if: false`

## Best Practices

1. **Atomic Commits**: Each commit should be small and focused
2. **Test Coverage**: Aim for >80% coverage
3. **Type Safety**: No `any` types, enable `strict` mode
4. **Code Review**: All PRs require review + passing CI
5. **Documentation**: Update docs when changing CI

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vitest Coverage](https://vitest.dev/guide/coverage.html)
- [Codecov Documentation](https://docs.codecov.com/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)

## Support

For CI/CD issues:
1. Check [Actions tab](https://github.com/Sudarshan7a/scode/actions)
2. Review job logs
3. Run locally with same commands
4. Open issue with error details
