# Git Hygiene Learning Path for Beginners

Welcome to your Git improvement journey! This guide will help you level up from beginner mistakes to professional Git practices.

## Quick Assessment

Before you start, run the audit to see where you stand:

```bash
cd your-project
node git-audit/audit.js
```

You'll get scores in 6 areas. Focus on the lowest scores first!

## Learning Path by Score

### 🔴 Score 0-2: Critical Areas (Start Here!)

**Secret Safety (0-2 points)**
- 🚨 **URGENT**: You may have committed secrets
- 📚 Read: `git-audit/educational/secret-management.md`
- 🛠️ Actions:
  1. Check for leaked API keys, passwords, or tokens
  2. Update `.gitignore` to exclude `.env` files
  3. Use environment variables for all secrets
  4. If secrets were committed, rotate them immediately

**Commit Hygiene (0-2 points)**
- 📚 Read: `git-audit/educational/commit-best-practices.md`
- 🛠️ Actions:
  1. Start making smaller, focused commits
  2. Commit every 30 minutes to 2 hours of work
  3. Test your code before committing
  4. Write descriptive commit messages

### 🟡 Score 3-4: Needs Improvement

**Message Quality (3-4 points)**
- 🎯 **Goal**: Write clear, consistent commit messages
- 📚 Read: `git-audit/educational/commit-best-practices.md#commit-message-structure`
- 🛠️ Actions:
  1. Use conventional commits: `feat:`, `fix:`, `docs:`
  2. Keep first line under 72 characters
  3. Start with capital letter or conventional prefix
  4. Describe WHAT you changed, not HOW

**Branch Strategy (3-4 points)**
- 🎯 **Goal**: Use feature branches and good naming
- 📚 Read: `git-audit/educational/branching-strategies.md`
- 🛠️ Actions:
  1. Never work directly on `main`/`master`
  2. Use format: `feature/description` or `fix/description`
  3. Use kebab-case (hyphens, not spaces or underscores)
  4. Clean up merged branches regularly

### 🟢 Score 5: Excellent (Maintain and Help Others!)

If you're scoring 5s, you're doing great! Consider:
- Helping teammates improve their Git practices
- Setting up team conventions and documentation
- Implementing automated checks (pre-commit hooks)
- Contributing to open source projects

## 30-Day Improvement Plan

### Week 1: Foundation
**Days 1-2: Secret Safety**
- [ ] Run secret scanner: `node git-audit/secret-scanner.js`
- [ ] Update `.gitignore` with secret patterns
- [ ] Move all secrets to environment variables
- [ ] Create `.env.example` file

**Days 3-4: Basic Commits**
- [ ] Start using conventional commit format
- [ ] Practice writing descriptive messages
- [ ] Make smaller, focused commits
- [ ] Run commit analyzer daily

**Days 5-7: Branch Basics**
- [ ] Stop working on `main` branch
- [ ] Create feature branches for all work
- [ ] Use proper branch naming conventions
- [ ] Practice merge workflow

### Week 2: Consistency
**Days 8-10: Message Improvement**
- [ ] Aim for 80%+ conventional commits
- [ ] Keep messages under 72 characters
- [ ] Add issue references when possible
- [ ] Review your commit history

**Days 11-14: Workflow Practice**
- [ ] Use feature branch workflow consistently
- [ ] Practice small, regular commits
- [ ] Start using git aliases for efficiency
- [ ] Clean up old branches

### Week 3: Quality
**Days 15-17: Advanced Commits**
- [ ] Write commit messages that explain WHY
- [ ] Use proper commit message body when needed
- [ ] Link commits to issues: `Closes #123`
- [ ] Review and improve old commit messages

**Days 18-21: Team Practices**
- [ ] Document your Git workflow
- [ ] Set up pre-commit hooks
- [ ] Practice code review process
- [ ] Help teammates with Git issues

### Week 4: Mastery
**Days 22-24: Automation**
- [ ] Set up automated secret scanning
- [ ] Configure commit message linting
- [ ] Add Git hooks to prevent problems
- [ ] Create team Git guidelines

**Days 25-28: Advanced Features**
- [ ] Learn interactive rebase for cleaning history
- [ ] Practice cherry-picking commits
- [ ] Use git stash effectively
- [ ] Explore Git Flow or GitHub Flow

**Days 29-30: Assessment**
- [ ] Run full audit and compare to Day 1
- [ ] Identify remaining improvement areas
- [ ] Set goals for next month
- [ ] Share learnings with team

## Daily Habits to Build

### Before Each Commit
```bash
# 1. Check what you're committing
git status
git diff

# 2. Verify you're on the right branch
git branch

# 3. Stage specific files (not everything)
git add specific-file.js
# NOT: git add .

# 4. Write meaningful message
git commit -m "feat(auth): add password validation

Includes minimum length and complexity requirements.
Shows helpful error messages to users.

Closes #45"
```

### Weekly Review
```bash
# Check your progress
node git-audit/audit.js

# Review recent commits
git log --oneline -10

# Clean up old branches
git branch --merged | grep -v main | xargs -n 1 git branch -d
```

## Common Beginner Scenarios

### "I committed to the wrong branch"
```bash
# If you haven't pushed yet:
git reset --soft HEAD~1  # Undo commit, keep changes
git checkout correct-branch
git add .
git commit -m "your message"
```

### "I need to fix my last commit message"
```bash
# If you haven't pushed yet:
git commit --amend -m "better commit message"
```

### "I accidentally committed a secret"
```bash
# 1. Remove from current code immediately
# 2. Rotate/change the secret
# 3. Clean commit history:
git filter-repo --invert-paths --path file-with-secret.js
# 4. Force push (if safe)
git push --force-with-lease
```

### "I have too many small commits"
```bash
# Squash last 3 commits:
git rebase -i HEAD~3
# Change "pick" to "squash" for commits to combine
```

## Tools and Resources

### Essential Tools
- **Git Audit System** (this tool!)
- **pre-commit hooks** for automated checks
- **GitHub Desktop** or **SourceTree** for visual Git
- **VS Code Git extensions** for IDE integration

### Learning Resources
- [Conventional Commits](https://conventionalcommits.org/)
- [GitHub Flow Guide](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Pro Git Book](https://git-scm.com/book) (free online)
- [Git Immersion Tutorial](http://gitimmersion.com/)

### Team Resources
- Set up `.gitmessage` template for your team
- Create `CONTRIBUTING.md` with Git guidelines
- Use GitHub issue templates
- Set up branch protection rules

## Success Metrics

Track your improvement with these metrics:

### Weekly Goals
- [ ] Audit score improves by 2+ points
- [ ] 80%+ commits use conventional format
- [ ] No secrets detected in scans
- [ ] Average commit size < 100 lines changed
- [ ] Branch naming follows conventions

### Monthly Goals
- [ ] Overall audit grade B or higher (80%+)
- [ ] Help at least one teammate improve their Git practices
- [ ] Contribute to team Git documentation
- [ ] Set up automated Git quality checks

### Long-term Goals
- [ ] Become the Git expert on your team
- [ ] Contribute to open source projects
- [ ] Mentor new developers on Git best practices
- [ ] Develop team Git workflows and standards

## Getting Help

### When You're Stuck
1. **Check the educational guides** in `git-audit/educational/`
2. **Run the specific audit tool** for detailed feedback
3. **Ask teammates** who score well in audits
4. **Search Stack Overflow** with specific error messages
5. **Use Git's built-in help**: `git help command`

### Emergency Git Help
```bash
# Undo the last commit (keep changes)
git reset --soft HEAD~1

# Undo changes to a file
git checkout -- filename

# See what changed
git diff
git status

# Get back lost commits (within 30 days)
git reflog
```

Remember: **Git is forgiving** - most mistakes can be fixed. The key is to learn from them and build better habits!

Start with your lowest audit scores and work your way up. Small, consistent improvements will make you a Git pro in no time! 🚀