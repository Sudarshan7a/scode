# Code Quality & Pre-commit Setup Guide

This guide shows how to set up automated code quality checks to prevent common beginner mistakes from reaching your repository.

## Current Project Status

✅ **Already configured:**
- ESLint with Next.js rules
- TypeScript compilation
- Prettier (basic)

❌ **Missing (recommended):**
- Pre-commit hooks
- Automated formatting
- Commit message validation
- Type checking on commit

## Quick Setup (5 minutes)

### 1. Install Development Tools
```bash
npm install --save-dev husky lint-staged prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### 2. Initialize Husky (Git Hooks)
```bash
npx husky install
npm pkg set scripts.prepare="husky install"
```

### 3. Add Pre-commit Hook
```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

### 4. Configure Lint-Staged (package.json)
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "prettier --write",
      "eslint --fix",
      "git add"
    ],
    "*.{json,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

### 5. Add Prettier Configuration (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## Advanced Setup

### Enhanced ESLint Configuration

Create `eslint.config.advanced.mjs`:
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Prevent common TypeScript mistakes
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/prefer-const": "error",
      
      // Prevent common React mistakes
      "react-hooks/exhaustive-deps": "error",
      "react/prop-types": "off", // Using TypeScript instead
      
      // Code quality
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];

export default eslintConfig;
```

### TypeScript Strict Mode (tsconfig.strict.json)
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "quality": "npm run type-check && npm run lint && npm run format:check"
  }
}
```

## Git Hook Examples

### Pre-commit Hook (.husky/pre-commit)
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run lint-staged for file-specific checks
npx lint-staged

# Run TypeScript compilation check
echo "📝 Checking TypeScript..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript check failed. Please fix the errors before committing."
  exit 1
fi

echo "✅ Pre-commit checks passed!"
```

### Commit Message Hook (.husky/commit-msg)
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Check commit message format (Conventional Commits)
npx commitlint --edit $1
```

### Commitlint Configuration (.commitlintrc.js)
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'chore',
        'docs',
        'style',
        'test',
        'perf',
        'build',
        'ci'
      ]
    ],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never']
  }
};
```

## IDE Configuration

### VS Code Settings (.vscode/settings.json)
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.rulers": [80],
  "files.exclude": {
    "node_modules": true,
    ".next": true,
    "dist": true
  }
}
```

### VS Code Extensions (.vscode/extensions.json)
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## Quality Gates

### GitHub Actions (.github/workflows/quality.yml)
```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run TypeScript check
      run: npm run type-check
    
    - name: Run ESLint
      run: npm run lint
    
    - name: Run Prettier check
      run: npm run format:check
    
    - name: Build project
      run: npm run build
```

## Common Issues & Solutions

### Issue: "Prettier and ESLint conflicts"
**Solution:** Install `eslint-config-prettier` to disable conflicting rules:
```bash
npm install --save-dev eslint-config-prettier
```

### Issue: "Husky hooks not running"
**Solution:** Make hooks executable:
```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Issue: "Type errors in build but not in editor"
**Solution:** Ensure VS Code is using workspace TypeScript version:
- Cmd/Ctrl + Shift + P
- "TypeScript: Select TypeScript Version"
- Choose "Use Workspace Version"

## Gradual Adoption Strategy

### Week 1: Basic Setup
- [ ] Install Prettier and configure
- [ ] Set up basic pre-commit hook
- [ ] Configure VS Code settings

### Week 2: Enhanced Linting
- [ ] Add stricter ESLint rules
- [ ] Fix existing lint warnings
- [ ] Add type checking to pre-commit

### Week 3: Commit Quality
- [ ] Add commit message validation
- [ ] Create commit message templates
- [ ] Document commit conventions

### Week 4: CI/CD Integration
- [ ] Add GitHub Actions for quality checks
- [ ] Set up branch protection rules
- [ ] Configure automated code review

## Measuring Success

Track these metrics to see improvement:

1. **Commit Quality**
   - % of commits following conventional format
   - Average commits per feature (lower is better)
   - Number of "fix typo" commits (should decrease)

2. **Code Quality**
   - TypeScript errors in production (should be 0)
   - ESLint warnings (should trend down)
   - Code review feedback volume (should decrease)

3. **Developer Experience**
   - Time to set up development environment
   - Number of "works on my machine" issues
   - Developer onboarding feedback

## Benefits You'll See

✅ **Immediate:**
- Consistent code formatting
- Fewer typos and syntax errors
- Better commit messages

✅ **Short-term (1-2 weeks):**
- Reduced code review feedback
- Fewer bugs making it to production
- Better team collaboration

✅ **Long-term (1+ months):**
- Improved code maintainability
- Faster onboarding for new developers
- Higher code quality across the team

Remember: Start small and gradually add more checks as your team gets comfortable with the workflow!