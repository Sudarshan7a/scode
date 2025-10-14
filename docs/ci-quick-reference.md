# CI/CD Quick Reference Guide

## 🚀 Quick Start

### Before Committing
```bash
# Run all pre-commit checks
pnpm lint && pnpm type-check && pnpm test:run && pnpm build
```

### Individual Checks
```bash
pnpm lint            # Check code style
pnpm lint:fix        # Fix linting issues
pnpm format          # Format all files
pnpm format:check    # Check formatting
pnpm type-check      # TypeScript validation
pnpm test:run        # Run tests + coverage
pnpm test:threshold  # Enforce coverage thresholds
pnpm build           # Production build
```

---

## 📊 Coverage Status

**Current Coverage:** 11.46%  
**Threshold:** 80% lines, 66% functions, 76% branches

**View Coverage:**
```bash
pnpm test:coverage
open coverage/lcov-report/index.html  # Mac/Linux
start coverage/lcov-report/index.html # Windows
```

---

## ✅ CI Pipeline Status

**Workflows:**
- **Test Suite** → Runs on every push/PR
- **Dependency Update** → Runs weekly (Mondays 9 AM UTC)

**Jobs (parallel execution):**
1. **Lint** (5 min) → ESLint + TypeScript + Prettier
2. **Test** (10 min) → 84 tests + coverage + reports
3. **Build** (10 min) → Next.js production build
4. **Security** (5 min) → Audit + secret scan

**Total Time:** ~10 minutes (parallel)

---

## 🔥 Common Issues & Fixes

### Issue: "Coverage threshold not met"
```bash
# Check current coverage
pnpm test:coverage

# View detailed report
open coverage/lcov-report/index.html

# Add more tests to increase coverage
```

### Issue: "ESLint errors"
```bash
# Auto-fix most issues
pnpm lint:fix

# Check remaining issues
pnpm lint
```

### Issue: "TypeScript errors"
```bash
# Check types
pnpm type-check

# Common fixes:
# - Add type annotations
# - Fix type mismatches
# - Add missing imports
```

### Issue: "Build failed"
```bash
# Clean and rebuild
rm -rf .next
pnpm build

# Check for:
# - Missing dependencies
# - Import errors
# - Environment variables
```

### Issue: "Prettier formatting"
```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

---

## 📦 Artifacts

**Available Downloads** (after CI runs):
1. **coverage-report** → HTML coverage (30 days)
2. **test-results** → JUnit XML (30 days)
3. **build-output** → `.next/` build (7 days)

**Access:** GitHub Actions → Workflow run → Artifacts section

---

## 🎯 Best Practices

1. **Run tests locally before pushing**
   ```bash
   pnpm test:run
   ```

2. **Fix linting issues immediately**
   ```bash
   pnpm lint:fix
   ```

3. **Check coverage impact**
   ```bash
   pnpm test:coverage
   ```

4. **Keep commits atomic**
   - One logical change per commit
   - Use conventional commit format
   - Detailed commit messages

5. **Monitor CI status**
   - Check badges in README
   - Review failed job logs
   - Fix issues before requesting review

---

## 🔗 Quick Links

- [CI/CD Documentation](./ci-cd-pipeline.md)
- [Phase 3 Completion Report](./phase-3-completion.md)
- [GitHub Actions](https://github.com/Sudarshan7a/scode/actions)
- [Codecov Dashboard](https://codecov.io/gh/Sudarshan7a/scode)

---

## 🆘 Need Help?

1. Check [CI/CD Documentation](./ci-cd-pipeline.md)
2. Review [Troubleshooting Section](./ci-cd-pipeline.md#troubleshooting)
3. Check workflow logs in GitHub Actions
4. Run commands locally to debug
5. Open an issue with error details

---

*Last Updated: October 14, 2025*
