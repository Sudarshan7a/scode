# Git Audit Examples and Common Issues

This document shows real examples of common Git hygiene issues and how to fix them.

## Before and After Examples

### Commit Messages

#### ❌ Bad Examples
```bash
git commit -m "fix"
git commit -m "update stuff"  
git commit -m "changes"
git commit -m "final commit"
git commit -m "oops forgot this"
git commit -m "Added some new functionality and also fixed a bug and updated the documentation"
```

#### ✅ Good Examples
```bash
git commit -m "fix(auth): handle expired token error"
git commit -m "feat(ui): add user profile dropdown menu"
git commit -m "docs: update installation instructions"
git commit -m "refactor(api): extract user validation helpers"
git commit -m "fix(form): prevent double submission on enter key"
```

### Branch Names

#### ❌ Bad Examples
```bash
git checkout -b fix
git checkout -b new-feature
git checkout -b test
git checkout -b John_Smith_Login
git checkout -b "user authentication"  # has spaces
git checkout -b BUGFIX-123              # all caps
```

#### ✅ Good Examples
```bash
git checkout -b feature/user-authentication
git checkout -b fix/header-alignment
git checkout -b chore/update-dependencies
git checkout -b docs/api-reference
git checkout -b feat/payment-integration
```

### Secret Management

#### ❌ Bad Examples
```javascript
// Hardcoded in source code
const API_KEY = "sk_live_1234567890abcdef";
const dbUrl = "mongodb://user:password@cluster.mongodb.net/db";

// In config files committed to Git
{
  "production": {
    "apiKey": "real-production-key",
    "dbPassword": "super-secret-password"
  }
}

// Console logs left in code
console.log("JWT_SECRET:", process.env.JWT_SECRET);
```

#### ✅ Good Examples
```javascript
// Using environment variables
const API_KEY = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;

// With validation
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Safe config with examples
{
  "development": {
    "apiKey": process.env.API_KEY,
    "dbUrl": process.env.DATABASE_URL
  }
}

// .env.example file (safe to commit)
API_KEY=your-api-key-here
DATABASE_URL=your-database-url-here
JWT_SECRET=your-jwt-secret-here
```

## Common Beginner Scenarios

### Scenario 1: "I Have Too Many WIP Commits"

**Problem:**
```bash
* a1b2c3d wip
* e4f5g6h wip again  
* i7j8k9l almost done
* m9n0p1q final wip
* r2s3t4u working on login
```

**Solution - Squash Commits:**
```bash
# Interactive rebase to combine last 5 commits
git rebase -i HEAD~5

# In the editor, change "pick" to "squash" for commits to combine:
pick r2s3t4u working on login
squash m9n0p1q final wip
squash i7j8k9l almost done  
squash e4f5g6h wip again
squash a1b2c3d wip

# Write a proper commit message:
feat(auth): implement user login functionality

Includes form validation, API integration, and error handling.
Users can now log in with email and password.
```

### Scenario 2: "I Committed a Secret by Accident"

**Problem:**
```bash
git log --oneline
a1b2c3d feat: add payment integration  # Contains API key!
```

**Solution:**
```bash
# 1. Immediately rotate/change the secret
# 2. Remove from current code
git add .
git commit -m "remove leaked api key"

# 3. Clean commit history (DANGEROUS - only if not pushed)
git filter-repo --invert-paths --path config/secrets.json

# 4. If already pushed, force push (team coordination required)
git push --force-with-lease origin main

# 5. Notify team to re-clone repository
```

### Scenario 3: "I'm Working on Main Branch"

**Problem:**
```bash
git branch
* main  # ← Working directly on main!
```

**Solution:**
```bash
# 1. Create a feature branch from current state
git checkout -b feature/current-work

# 2. Reset main to last known good state
git checkout main
git reset --hard origin/main

# 3. Continue work on feature branch
git checkout feature/current-work

# 4. When done, merge properly
git checkout main
git pull origin main
git merge feature/current-work
```

### Scenario 4: "My Commits Are Too Large"

**Problem:**
```bash
git show --stat
login.js     | 150 +++++++++++++++++
auth.js      | 200 ++++++++++++++++++++++
styles.css   |  80 ++++++++++
readme.md    |  30 +++++
package.json |  15 +++
5 files changed, 475 insertions(+)
```

**Solution - Break Into Logical Commits:**
```bash
# Instead of one large commit, break it down:
git add login.js auth.js
git commit -m "feat(auth): add login functionality"

git add styles.css  
git commit -m "style(auth): add login form styling"

git add readme.md
git commit -m "docs: update readme with auth instructions"

git add package.json
git commit -m "chore: add auth dependencies"
```

## Repository Health Patterns

### Healthy Repository Signs
- ✅ Regular, small commits (daily activity)
- ✅ Descriptive commit messages following conventions
- ✅ Feature branches for all changes
- ✅ No secrets in commit history
- ✅ Clean .gitignore covering all sensitive files
- ✅ Issue references in commits
- ✅ Proper branch naming conventions

### Unhealthy Repository Signs
- ❌ Long gaps between commits followed by massive changes
- ❌ Vague commit messages ("fix", "update", "changes")
- ❌ All work done on main/master branch
- ❌ API keys, passwords in commit history
- ❌ Missing or inadequate .gitignore
- ❌ No issue tracking or linking
- ❌ Inconsistent or poor branch naming

## Team Workflows

### Simple Feature Branch Workflow
```bash
# 1. Start new feature
git checkout main
git pull origin main
git checkout -b feature/user-profiles

# 2. Work in small commits
git add profile-component.js
git commit -m "feat(profile): add user profile component"

git add profile-styles.css  
git commit -m "style(profile): add profile component styling"

# 3. Push branch
git push -u origin feature/user-profiles

# 4. Create pull request for review
# 5. After approval, merge and cleanup
git checkout main
git pull origin main
git branch -d feature/user-profiles
```

### Emergency Hotfix Workflow
```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-login-bug

# 2. Fix the issue
git add login-fix.js
git commit -m "fix(auth): resolve login timeout issue

Critical fix for production login failures.
Users were experiencing 30-second timeouts.

Fixes #456"

# 3. Fast-track review and deploy
git push -u origin hotfix/critical-login-bug
# Create PR, get quick review, merge immediately
```

## Useful Git Aliases

Add these to your `~/.gitconfig`:

```bash
[alias]
    # Shortcuts
    st = status
    co = checkout  
    br = branch
    ci = commit
    
    # Better logging
    lg = log --oneline --graph --decorate --all
    hist = log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short
    
    # Useful operations
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
    
    # Cleanup
    cleanup = "!git branch --merged | grep -v '\\*\\|main\\|master' | xargs -n 1 git branch -d"
    
    # Conventional commits
    feat = "!f() { git commit -m \"feat: $*\"; }; f"
    fix = "!f() { git commit -m \"fix: $*\"; }; f"
    docs = "!f() { git commit -m \"docs: $*\"; }; f"
```

Usage:
```bash
git st                           # git status
git lg                          # pretty log
git feat "add user dashboard"   # git commit -m "feat: add user dashboard"
git cleanup                     # remove merged branches
```

## IDE Integration

### VS Code Extensions
- **Conventional Commits** - Helps write better commit messages
- **GitLens** - Enhanced Git capabilities
- **Git Graph** - Visual commit history
- **Git History** - View file history

### VS Code Settings
```json
{
  "git.enableCommitSigning": true,
  "git.inputValidation": "warn",
  "git.suggestSmartCommit": false,
  "gitlens.hovers.currentLine.over": "line",
  "conventionalCommits.showEditor": true
}
```

## Automation Examples

### GitHub Actions Workflow
```yaml
# .github/workflows/git-audit.yml
name: Git Audit
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  # Full history for audit
          
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm install
        
      - name: Run Git Audit
        run: npm run audit:git
        
      - name: Check for secrets
        run: npm run audit:secrets
```

### Pre-commit Hook with Husky
```bash
# Install husky
npm install --save-dev husky

# Add hook
npx husky add .husky/pre-commit "npm run audit:secrets"
npx husky add .husky/commit-msg "npx commitlint --edit \$1"
```

## Measuring Improvement

### Weekly Metrics
Track these weekly:
- Overall audit score
- Number of conventional commits
- Average commit size (lines changed)
- Number of secret violations
- Branch naming compliance

### Monthly Goals
- Audit score improvement (aim for 80%+ overall)
- Zero secret violations
- 90%+ conventional commit usage
- Average commit size under 100 lines

## Getting Team Buy-in

### Introducing Git Standards
1. **Start with documentation** - Create team Git guidelines
2. **Lead by example** - Improve your own practices first
3. **Automate where possible** - Use hooks and CI checks
4. **Educate gradually** - Share one tip per week
5. **Celebrate improvements** - Recognize good practices

### Common Objections and Responses

**"This slows down development"**
- Response: Good practices prevent much slower debugging and security incidents

**"Commit messages don't matter"**  
- Response: They matter for code review, debugging, and team collaboration

**"We're too small for these practices"**
- Response: Small teams benefit most from good habits before scaling

Remember: Good Git hygiene is an investment in your team's future productivity!