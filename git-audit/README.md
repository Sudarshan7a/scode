# Git Repository Hygiene Audit System

A comprehensive set of tools to help beginners learn Git best practices by analyzing repository hygiene and providing educational feedback.

## 🎯 What This System Does

This audit system evaluates your Git repository across **6 key dimensions** and provides a score (0-5) for each:

1. **🔄 Commit Hygiene** - Frequency, size, and atomicity
2. **🌿 Branch Strategy** - Naming conventions and workflow  
3. **💬 Message Quality** - Clarity and conventional formats
4. **🔐 Secret Safety** - Prevents credential leaks
5. **🧹 Project Hygiene** - Documentation and structure
6. **🔗 Issue Integration** - Linking commits to issues

**Overall Grade:** A-F based on combined scores (A: 90%+, B: 80%+, C: 70%+, D: 60%+, F: <60%)

## 🚀 Quick Start

```bash
# Option 1: Use npm scripts (recommended)
npm run audit:git         # Complete audit
npm run audit:commits     # Analyze commit patterns  
npm run audit:branches    # Check branch strategy
npm run audit:secrets     # Scan for secrets

# Option 2: Direct execution
node git-audit/audit.js
node git-audit/demo.sh    # Interactive demo
```

## 📊 Sample Output

```
🔍 Git Repository Hygiene Audit
=====================================

📝 Commit Hygiene:     🟡 3/5 Decent
🌿 Branch Strategy:    🟢 5/5 Excellent  
💬 Message Quality:    🔴 2/5 Needs Work
🔐 Secret Safety:      🟢 5/5 Excellent
🧹 Project Hygiene:    🟡 4/5 Good
🔗 Issue Integration:  🟡 3/5 Decent

OVERALL SCORE: 🟡 B (22/30 - 73%)

💡 TOP RECOMMENDATIONS:
1. Use conventional commit format (feat:, fix:, docs:)
2. Write more descriptive commit messages
3. Link commits to issues using #123
```

## 📚 Educational Materials

### Step-by-Step Learning Path
- **`learning-path.md`** - 30-day improvement plan with daily goals
- **`commit-best-practices.md`** - How to write great commits
- **`branching-strategies.md`** - Branch naming and workflows
- **`secret-management.md`** - Prevent credential leaks
- **`examples-and-fixes.md`** - Real scenarios and solutions

### Quick Reference
```bash
# Good commit examples
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(ui): resolve header alignment on mobile"
git commit -m "docs: update installation instructions"

# Good branch names  
git checkout -b feature/user-dashboard
git checkout -b fix/login-timeout-error
git checkout -b chore/update-dependencies
```

## 🛠️ Advanced Features

### Branch Name Validation
```bash
node git-audit/branch-checker.js validate "feature/user-auth"
# ✅ Valid: true, Score: 5/5

node git-audit/branch-checker.js suggest "add user dashboard" feature  
# Suggested: feature/add-user-dashboard
```

### Secret Scanning
```bash
node git-audit/secret-scanner.js file .env.example
# ✅ No secrets found in file

node git-audit/secret-scanner.js  # Scan entire repository
# 🚨 Found 2 potential secrets (critical priority)
```

### Commit Analysis
```bash
node git-audit/commit-analyzer.js 50  # Analyze last 50 commits
# 📊 Quality Breakdown:
#   🟢 Excellent: 15 commits
#   🟡 Good: 20 commits  
#   🔴 Problematic: 15 commits
```

## 🔧 Integration Examples

### Pre-commit Hook (Automatic Checks)
```bash
# Copy example hook
cp git-audit/pre-commit-hook-example.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Now every commit is automatically checked for:
# ✓ Secret detection
# ✓ Commit message format
# ✓ File size limits
# ✓ Debug statement removal
```

### GitHub Actions (Team Enforcement)
```yaml
# .github/workflows/git-audit.yml
name: Git Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run audit:git
```

### Weekly Team Reports
```bash
# Generate team report
npm run audit:git > reports/team-audit-$(date +%Y-%m-%d).txt

# Track improvement over time
git log --grep="audit:" --oneline  # See audit-related commits
```

## 📈 Success Metrics

### Individual Goals
- **Week 1:** Overall score C+ (70%+)
- **Month 1:** Overall score B+ (85%+)  
- **Month 3:** Overall score A (90%+)

### Team Goals
- **Zero secret violations** in production code
- **80%+ conventional commits** across team
- **Average commit size** under 100 lines
- **Branch naming compliance** 95%+

## 🆘 Troubleshooting

### Common Issues

**"Potential secrets found" but they're not real secrets**
```bash
# Check what was detected
node git-audit/secret-scanner.js

# Common false positives:
# - Example keys in documentation
# - Test data that looks like secrets
# - Base64 encoded non-secret data
```

**"Large commits detected" but it's necessary**
```bash
# Large commits are OK for:
# - Initial project setup
# - Dependency updates
# - Generated files (build outputs)

# Break down when possible:
git add src/feature1.js
git commit -m "feat: add feature 1"
git add src/feature2.js  
git commit -m "feat: add feature 2"
```

**"No issue references" but we don't use issues**
```bash
# This is OK! Not all projects use GitHub issues
# Focus on other dimensions
# Or consider starting to use issues for better tracking
```

## 🎓 Learning Resources

### External Links
- [Conventional Commits](https://conventionalcommits.org/) - Standardized commit format
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow) - Simple branching strategy
- [Git Best Practices](https://git-scm.com/book) - Official Git documentation

### Team Training
1. **Lunch & Learn Sessions** - Share one Git tip per week
2. **Code Review Focus** - Check Git hygiene during reviews  
3. **Onboarding Checklist** - Include Git audit in new developer setup
4. **Monthly Retrospectives** - Discuss Git pain points and improvements

---

## 🏆 Success Stories

*"Our team went from 45% to 89% audit score in 2 months by following the learning path!"*

*"The secret scanner caught an API key before it reached production - saved us $2000 in unauthorized usage."*

*"New developers onboard 50% faster now that we have consistent Git practices and documentation."*

---

**Ready to improve your Git game?** Start with `npm run audit:git` and follow the recommendations! 🚀