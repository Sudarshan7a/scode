# Git Best Practices & Common Beginner Mistakes

## 🎯 Overview

This guide helps beginners avoid common Git mistakes and establish good repository hygiene practices. It covers commit quality, branching strategies, and project maintenance.

## 📊 Scoring System

Each category is scored 0-5:
- **0-2**: Needs work ⚠️
- **3-4**: Decent 👍
- **5**: Exemplary 🌟

## 🔧 Quick Audit

Run the audit script to evaluate your repository:
```bash
./scripts/git-audit.sh
```

## 📝 A. Commit Quality

### ✅ Good Patterns
- **Atomic commits**: One logical change per commit
- **Descriptive messages**: Clear, imperative mood
- **Consistent format**: Use Conventional Commits
- **Reasonable size**: < 300 lines except intentional refactors

### ❌ Common Mistakes

#### 1. Monolithic Commits
```bash
# BAD: Giant commits mixing concerns
git log --oneline
a1b2c3d Add login + refactor styles + update deps + fix typos

# GOOD: Separate atomic commits  
a1b2c3d feat(auth): add JWT login validation
b2c3d4e style: standardize button components
c3d4e5f chore(deps): update React to v18
d4e5f6g fix(typo): correct error message text
```

#### 2. Poor Commit Messages
```bash
# BAD Examples:
"fix"
"update stuff" 
"WIP"
"changes"
"final commit"
"oops"
"temp"

# GOOD Examples:
"feat(auth): add password reset functionality"
"fix(api): handle null response in user endpoint" 
"refactor(utils): extract validation helpers"
"docs: add API documentation"
"chore(deps): bump lodash to v4.17.21"
```

### 🎯 Conventional Commits Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix  
- `docs`: Documentation only
- `style`: Formatting (no code logic changes)
- `refactor`: Code restructuring  
- `test`: Adding tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

**Examples:**
```bash
feat(auth): add OAuth2 GitHub integration
fix(cart): prevent duplicate item additions  
docs(api): add endpoint documentation
refactor(utils): extract common validation logic
chore(deps): update ESLint configuration
```

## 🌳 B. Branching Strategy

### ✅ Recommended Structure

```
main/master (protected)
├── develop (optional integration branch)
├── feature/user-authentication  
├── feature/shopping-cart
├── fix/memory-leak-in-parser
├── hotfix/security-patch-2024-01
└── chore/update-dependencies
```

### 🏷️ Branch Naming Conventions

```bash
# Feature branches
feature/user-profile-page
feature/payment-integration  
feat/real-time-notifications

# Bug fixes
fix/login-redirect-issue
fix/cart-total-calculation
bugfix/mobile-responsive-header

# Hotfixes (urgent production fixes)
hotfix/security-vulnerability
hotfix/payment-gateway-down

# Maintenance  
chore/update-dependencies
chore/cleanup-unused-components
```

### ❌ Bad Branch Names
```bash
# Avoid these:
new
test  
temp
patch-1
john-branch
latest
backup
```

### 🔄 Workflow Example

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/user-dashboard

# 2. Make atomic commits
git add components/Dashboard.tsx
git commit -m "feat(dashboard): add user profile section"

git add components/Charts.tsx  
git commit -m "feat(dashboard): add analytics charts"

# 3. Keep branch updated (optional)
git checkout main
git pull origin main
git checkout feature/user-dashboard
git rebase main  # or merge main

# 4. Push and create PR
git push origin feature/user-dashboard
# Create PR: feature/user-dashboard → main

# 5. Clean up after merge
git checkout main
git pull origin main
git branch -d feature/user-dashboard
git push origin --delete feature/user-dashboard
```

## 🔒 C. Security & Secrets

### ❌ Never Commit These

```bash
# Environment files
.env
.env.local
.env.production

# API Keys & Tokens  
API_KEY=sk_live_abcd1234...
GITHUB_TOKEN=ghp_xyz789...
DATABASE_PASSWORD=secret123

# Private keys
id_rsa
private.key
certificate.pem
```

### ✅ Security Best Practices

1. **Use .gitignore**:
```gitignore
# Environment variables
.env*
!.env.example

# Secrets
secrets/
*.key
*.pem

# Build artifacts
node_modules/
dist/
build/
.next/
```

2. **Create .env.example**:
```bash
# .env.example (safe to commit)
DATABASE_URL=your-database-url-here
API_KEY=your-api-key-here
JWT_SECRET=your-jwt-secret-here
```

3. **Scan for secrets**:
```bash
# Check commit history for secrets
git log -p | grep -i 'api_key\|secret\|token\|password'

# Use tools like gitleaks or truffleHog
npm install -g gitleaks
gitleaks detect --source . --verbose
```

### 🚨 If You Accidentally Commit Secrets

1. **Rotate the secret immediately**
2. **Remove from history**:
```bash
# For recent commits (NOT pushed yet)
git reset --soft HEAD~1
git reset HEAD -- .env  
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: add .env to gitignore"

# For pushed commits (USE WITH CAUTION)
# Install git-filter-repo: pip install git-filter-repo
git filter-repo --invert-paths --path .env
git push origin --force-with-lease
```

## 📁 D. File & Dependency Management

### ✅ What to Commit
- Source code
- Configuration files
- Documentation  
- Tests
- Package manifests (package.json, requirements.txt)
- Lock files (package-lock.json, yarn.lock) - *project decision*

### ❌ What NOT to Commit
- `node_modules/`
- `dist/`, `build/`, `.next/`
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Logs (`*.log`)
- Cache directories

### 🔧 Dependency Best Practices

```bash
# GOOD: Separate dependency updates
git add package.json package-lock.json
git commit -m "chore(deps): update React to v18.2.0"

# Then in separate commit:
git add src/components/
git commit -m "feat(ui): migrate to React 18 concurrent features"

# BAD: Mixed concerns
git add .
git commit -m "update React and add new features"
```

## 🔍 E. Issue & PR Discipline

### 📋 Issue Linkage

```bash
# Reference issues in commits
git commit -m "feat(auth): add 2FA support

Closes #123
Refs #124"

# In PR descriptions
"This PR implements user authentication as discussed in #45"
```

### 📏 PR Size Guidelines

- **Small**: < 200 lines changed ✅
- **Medium**: 200-500 lines ⚠️
- **Large**: > 500 lines ❌ (consider splitting)

### 📝 PR Template Example

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature  
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Edge cases considered

## Screenshots (if applicable)

## Related Issues
Closes #123
```

## 🧪 F. Testing Integration

### ✅ Test-Related Commits

```bash
# GOOD: Tests with feature
git commit -m "feat(auth): add login validation

- Add LoginForm component
- Add validation for email/password
- Add unit tests for validation logic
- Add integration tests for login flow"

# GOOD: Test-only commits when needed
git commit -m "test(auth): add edge cases for password validation"

# BAD: Features without tests (address separately)
git commit -m "feat(auth): add login (TODO: add tests later)"
```

## 📈 G. Project Maintenance

### 🗂️ Regular Housekeeping

```bash
# Monthly branch cleanup
git branch --merged main | grep -v main | xargs git branch -d

# Check for large files
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '/^blob/ {print substr($0,6)}' | sort --numeric-sort --key=2 | tail -10

# Audit dependencies  
npm audit
npm outdated
```

### 📊 Metrics to Track

- Commit frequency (avoid long gaps)
- PR review time
- Branch lifetime (keep < 1 week for features)
- Test coverage trends
- Build success rate

## 🎓 H. Learning Progression

### Beginner → Intermediate

1. **Week 1-2**: Master basic commit message format
2. **Week 3-4**: Practice atomic commits  
3. **Month 2**: Adopt consistent branching
4. **Month 3**: Learn interactive rebase, squashing
5. **Month 4**: Master conflict resolution
6. **Month 6**: Implement pre-commit hooks

### 🛠️ Tools to Adopt

```bash
# Commit message validation
npm install -g @commitlint/cli @commitlint/config-conventional

# Pre-commit hooks
npm install -g husky lint-staged

# Semantic versioning
npm install -g semantic-release

# Changelog generation  
npm install -g conventional-changelog-cli
```

## ⚡ Quick Reference Checklist

Before committing, ask:
- [ ] Is this one logical change?
- [ ] Is the message clear and descriptive?  
- [ ] Are tests included/updated?
- [ ] No secrets or build artifacts?
- [ ] Does it follow project conventions?
- [ ] Will this be easy to review?

## 🔗 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

*Run `./scripts/git-audit.sh` to evaluate your repository against these practices.*