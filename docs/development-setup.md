# Development Setup & Workflow Guide

## 🎯 Quick Start for Beginners

This guide helps you set up a professional development workflow that prevents common Git mistakes and maintains repository hygiene.

## 🛠️ Essential Tools Setup

### 1. Git Configuration

```bash
# Set up your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Improve Git workflow
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input # Mac/Linux

# Better Git output
git config --global color.ui auto
git config --global core.editor "code --wait"  # VS Code
```

### 2. Install Commit Message Tools

```bash
# Install commitizen for guided commit messages
npm install -g commitizen cz-conventional-changelog

# Set up the adapter globally
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc

# Install commitlint for validation
npm install -g @commitlint/cli @commitlint/config-conventional
```

### 3. Project-Level Setup

```bash
# In your project root
npm install --save-dev husky lint-staged prettier eslint

# Initialize husky for git hooks
npx husky init

# Create pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit

# Create commit-msg hook
echo "npx commitlint --edit \$1" > .husky/commit-msg
chmod +x .husky/commit-msg
```

## ⚙️ Configuration Files

### package.json additions:

```json
{
  "scripts": {
    "commit": "cz",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "format": "prettier --write .",
    "audit-repo": "./scripts/git-audit.sh"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{md,json,yml,yaml}": [
      "prettier --write"
    ]
  },
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  }
}
```

### .prettierrc:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### commitlint.config.js:

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
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci',
        'build',
        'revert'
      ]
    ],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100]
  }
};
```

## 🔄 Daily Workflow

### Starting a New Feature

```bash
# 1. Switch to main and update
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/user-authentication

# 3. Work in small chunks
# Edit files...
git add src/components/LoginForm.tsx
git commit -m "feat(auth): add login form component"

# Edit more files...
git add src/utils/validation.ts  
git commit -m "feat(auth): add form validation helpers"

# 4. Push regularly
git push -u origin feature/user-authentication
```

### Making Good Commits

```bash
# Use the guided commit tool
npm run commit

# Or manually with proper format
git add specific-files
git commit -m "feat(scope): add specific feature

- Add user login functionality
- Include form validation
- Add error handling

Closes #123"
```

### Before Pushing

```bash
# Check your work
git log --oneline -10
git diff main...HEAD

# Run quality checks
npm run lint
npm run format
./scripts/git-audit.sh

# Push when ready
git push origin feature/user-authentication
```

## 🚫 Common Mistakes & Solutions

### Mistake 1: Working on Main Branch

```bash
# If you accidentally worked on main:
git stash                    # Save your work
git checkout -b feature/my-work  # Create proper branch
git stash pop               # Restore your work
git add .
git commit -m "feat: proper commit message"
```

### Mistake 2: Committing Secrets

```bash
# If you committed .env file:
git reset --soft HEAD~1     # Undo commit (if not pushed)
git reset .env              # Unstage the file
echo ".env" >> .gitignore   # Add to gitignore
git add .gitignore
git commit -m "chore: add .env to gitignore"

# If already pushed (DANGEROUS):
git filter-repo --invert-paths --path .env
git push --force-with-lease
```

### Mistake 3: Huge Monolithic Commits

```bash
# Use interactive staging
git add -p                  # Stage parts of files
git commit -m "feat(auth): add login validation"

git add remaining-files
git commit -m "feat(auth): add logout functionality"
```

### Mistake 4: Poor Commit Messages

```bash
# Edit the last commit message (if not pushed)
git commit --amend -m "feat(auth): add user login validation"

# Use interactive rebase for multiple commits
git rebase -i HEAD~3
```

## 🎨 VS Code Integration

### Essential Extensions:

1. **GitLens** - Git visualization
2. **Conventional Commits** - Commit message helper
3. **Prettier** - Code formatting
4. **ESLint** - Code linting
5. **Git Graph** - Branch visualization

### VS Code Settings (settings.json):

```json
{
  "git.confirmSync": false,
  "git.autofetch": true,
  "git.enableSmartCommit": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "conventionalCommits.scopes": [
    "auth",
    "ui", 
    "api",
    "db",
    "config"
  ]
}
```

## 🔍 Quality Checks

### Pre-Commit Checklist

Before every commit, verify:
- [ ] Code is formatted consistently
- [ ] Linting passes without errors
- [ ] Commit message follows convention
- [ ] No secrets or sensitive data
- [ ] Tests pass (if applicable)
- [ ] Only related changes included

### Pre-Push Checklist

Before pushing to remote:
- [ ] All commits have good messages
- [ ] Branch is up to date with main
- [ ] No WIP or temporary commits
- [ ] README updated if needed
- [ ] No build artifacts included

### Weekly Repository Health Check

```bash
# Run full audit
./scripts/git-audit.sh

# Check for large files
git rev-list --objects --all | \
  git cat-file --batch-check='%(objectsize) %(rest)' | \
  sort -n | tail -10

# Review branch health
git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(committerdate) %(refname:short)'

# Security scan
git log --all --full-history -- "*.env*"
```

## 🚀 Advanced Workflow Tips

### Interactive Rebase for Cleanup

```bash
# Clean up commits before push
git rebase -i HEAD~3

# In the editor:
pick a1b2c3d feat(auth): add login
squash b2c3d4e fix typo
fixup c3d4e5f another small fix
```

### Handling Conflicts

```bash
# When conflicts occur during merge/rebase
git status                  # See conflicted files
# Edit files to resolve conflicts
git add resolved-file.js
git rebase --continue       # Or git merge --continue
```

### Useful Aliases

Add to your ~/.gitconfig:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    ca = commit -a
    ps = push
    pl = pull
    mg = merge
    rb = rebase
    lg = log --oneline --graph --all
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
    cleanup = "!git branch --merged | grep -v '\\*\\|main\\|master' | xargs -n 1 git branch -d"
```

## 📊 Measuring Success

### Weekly Metrics to Track:

1. **Commit Quality Score**: Run audit weekly
2. **Average PR Size**: Aim for <300 lines
3. **Time to Merge**: Keep branches short-lived
4. **Revert Rate**: Track how often you need to revert
5. **Security Incidents**: Zero tolerance for secrets

### Monthly Review Questions:

- Are commit messages consistently helpful?
- Do branches follow naming conventions?
- Is the repository clean and organized?
- Are there any recurring mistake patterns?
- What workflow improvements are needed?

## 🎓 Learning Path

### Week 1-2: Foundations
- Set up tools and configurations
- Practice atomic commits
- Learn basic branch workflow

### Week 3-4: Quality Habits  
- Master commit message format
- Use pre-commit hooks consistently
- Practice interactive staging

### Month 2: Advanced Workflow
- Learn interactive rebase
- Master conflict resolution
- Optimize team workflow

### Month 3: Automation
- Set up CI/CD integration
- Implement automated testing
- Create project templates

## 🆘 Troubleshooting

### "I messed up my Git history"

```bash
# Create backup branch first
git checkout -b backup-branch

# Then fix main branch
git checkout main
git reset --hard origin/main  # Nuclear option
```

### "My pre-commit hooks aren't working"

```bash
# Check hook permissions
ls -la .husky/
chmod +x .husky/*

# Test hooks manually
.husky/pre-commit
```

### "Commitlint is failing"

```bash
# Test your message format
echo "feat: add new feature" | npx commitlint

# Check configuration
npx commitlint --print-config
```

## 📞 Getting Help

1. **Run the audit**: `./scripts/git-audit.sh`
2. **Check documentation**: `docs/git-best-practices.md`
3. **Review scorecard**: `docs/repository-scorecard.md`
4. **Ask team members**: Share knowledge
5. **Online resources**: Git documentation, Stack Overflow

---

**Remember**: Good Git hygiene is a journey, not a destination. Start with the basics and gradually adopt more advanced practices as you become comfortable.