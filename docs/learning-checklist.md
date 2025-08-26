# Git Learning Path & Self-Assessment Checklist

## 🎯 Learning Objectives

This checklist helps beginners progressively build good Git habits. Complete each section before moving to the next.

## 📚 Phase 1: Git Fundamentals (Week 1-2)

### Basic Commands
- [ ] Understand `git add`, `git commit`, `git push`, `git pull`
- [ ] Know the difference between working directory, staging area, and repository
- [ ] Can view commit history with `git log`
- [ ] Understand `git status` and `git diff`

### Repository Setup
- [ ] Create meaningful `.gitignore` file
- [ ] Set up proper Git configuration (name, email)
- [ ] Understand remote repositories (origin)

### First Commits
- [ ] Make 5 commits with descriptive messages
- [ ] Practice staging specific files with `git add`
- [ ] Use `git commit -m` with clear descriptions

### Self-Assessment:
Run: `./scripts/git-audit.sh`
Target: Documentation score 4+/5

---

## 📝 Phase 2: Commit Quality (Week 3-4)

### Commit Messages
- [ ] Learn Conventional Commits format: `type(scope): description`
- [ ] Practice using valid types: feat, fix, docs, refactor, etc.
- [ ] Write commit messages in imperative mood
- [ ] Keep subject line under 72 characters

### Atomic Commits
- [ ] Make commits that represent single logical changes
- [ ] Avoid mixing unrelated changes in one commit
- [ ] Use `git add -p` for partial staging
- [ ] Practice splitting large changes into multiple commits

### Tools Integration
- [ ] Install and use commit message validator
- [ ] Set up pre-commit hooks (if desired)
- [ ] Use `git commit --amend` to fix recent commit messages

### Practice Exercises:
1. Convert this bad commit into 3 good ones:
   ```
   git commit -m "update login and fix styles and add tests"
   ```
   
2. Validate these messages with the validator:
   ```bash
   node scripts/validate-commit.js "feat(auth): add user login validation"
   node scripts/validate-commit.js "fix"
   node scripts/validate-commit.js "WIP: working on stuff"
   ```

### Self-Assessment:
Run: `./scripts/git-audit.sh`
Target: Message Quality score 4+/5

---

## 🌳 Phase 3: Branching Strategy (Week 5-6)

### Branch Basics
- [ ] Understand what branches are and why they're useful
- [ ] Create branches with `git checkout -b branch-name`
- [ ] Switch between branches with `git checkout`
- [ ] Delete branches with `git branch -d`

### Branch Naming
- [ ] Use consistent naming: `feature/`, `fix/`, `chore/`
- [ ] Avoid generic names like "test", "new", "temp"
- [ ] Keep names descriptive but concise

### Branch Workflow
- [ ] Always create feature branches from main
- [ ] Make changes on feature branches, not main
- [ ] Merge or rebase feature branches back to main
- [ ] Delete feature branches after merging

### Advanced Branching
- [ ] Understand `git merge` vs `git rebase`
- [ ] Handle merge conflicts
- [ ] Use `git stash` to temporarily save work

### Practice Exercises:
1. Create a feature branch for adding a new component:
   ```bash
   git checkout -b feature/user-profile-card
   # Make changes and commits
   git checkout main
   git merge feature/user-profile-card
   git branch -d feature/user-profile-card
   ```

2. Practice handling conflicts:
   ```bash
   # Create conflict scenario and resolve
   ```

### Self-Assessment:
Run: `./scripts/git-audit.sh`
Target: Branch Strategy score 4+/5

---

## 🔒 Phase 4: Security & File Management (Week 7-8)

### Security Practices
- [ ] Never commit secrets (.env files, API keys, passwords)
- [ ] Use `.env.example` for environment variable templates
- [ ] Scan commit history for accidentally committed secrets
- [ ] Know how to remove secrets from Git history

### File Management
- [ ] Understand what should and shouldn't be committed
- [ ] Keep build artifacts out of repository
- [ ] Manage dependencies properly (package-lock.json)
- [ ] Use appropriate .gitignore patterns

### Repository Cleanliness
- [ ] Regular cleanup of merged branches
- [ ] Monitor repository size
- [ ] Audit for large files
- [ ] Keep commit history clean

### Security Exercises:
1. Create a comprehensive .gitignore:
   ```bash
   # Add patterns for your project type
   node_modules/
   .env*
   dist/
   .DS_Store
   ```

2. Scan for secrets:
   ```bash
   git log -p | grep -i 'api_key\|secret\|token\|password'
   ```

3. Practice secret removal (in a test repo):
   ```bash
   # Simulate accidentally committing .env
   # Practice removal with git filter-repo
   ```

### Self-Assessment:
Run: `./scripts/git-audit.sh`
Target: Security score 5/5, File Structure score 4+/5

---

## 📋 Phase 5: Issue Tracking & PRs (Week 9-10)

### Issue Integration
- [ ] Create GitHub issues for features and bugs
- [ ] Reference issues in commit messages
- [ ] Use closing keywords: "Closes #123", "Fixes #456"
- [ ] Link related issues with "Refs #789"

### Pull Request Workflow
- [ ] Create PRs for feature branches
- [ ] Write descriptive PR descriptions
- [ ] Use PR templates
- [ ] Request and provide code reviews

### Project Organization
- [ ] Use labels for issues and PRs
- [ ] Create milestones for releases
- [ ] Maintain project boards (if using)
- [ ] Document decisions in issues

### PR Exercise:
1. Create a complete feature workflow:
   ```
   Issue → Feature Branch → Commits → PR → Review → Merge
   ```

### Self-Assessment:
Run: `./scripts/git-audit.sh`
Target: Issue & PR Integration score 4+/5

---

## 🧪 Phase 6: Testing & CI/CD (Week 11-12)

### Test Integration
- [ ] Include tests with new features
- [ ] Commit tests in same or related commits
- [ ] Ensure tests pass before pushing
- [ ] Understand test coverage

### Automation
- [ ] Set up pre-commit hooks
- [ ] Configure automated linting
- [ ] Use automated formatting (Prettier)
- [ ] Set up CI/CD pipelines (GitHub Actions)

### Quality Gates
- [ ] All tests must pass before merge
- [ ] Code coverage requirements
- [ ] Linting and formatting checks
- [ ] Security scanning

### Automation Exercise:
1. Set up pre-commit hooks:
   ```bash
   npm install --save-dev husky lint-staged
   npx husky init
   ```

### Self-Assessment:
Run: `./scripts/git-audit.sh`
Target: Testing Integration score 4+/5

---

## 🎓 Phase 7: Advanced Git Skills (Month 4+)

### Interactive Git
- [ ] Master `git rebase -i` for commit cleanup
- [ ] Use `git cherry-pick` for selective commits
- [ ] Understand `git bisect` for debugging
- [ ] Practice `git reflog` for recovery

### Collaboration Skills
- [ ] Handle complex merge conflicts
- [ ] Coordinate with team on branching strategy
- [ ] Review others' code effectively
- [ ] Mentor new developers

### Repository Maintenance
- [ ] Regular repository audits
- [ ] Performance optimization
- [ ] History cleanup strategies
- [ ] Backup and recovery plans

### Advanced Exercises:
1. Practice interactive rebase:
   ```bash
   git rebase -i HEAD~5
   # Squash, reorder, edit commits
   ```

2. Simulate and recover from disasters:
   ```bash
   # Practice using git reflog to recover lost commits
   ```

---

## 📊 Overall Assessment Scorecard

Complete this monthly to track progress:

| Phase | Week | Score | Target | Status |
|-------|------|-------|--------|---------|
| Fundamentals | 1-2 | ___/35 | 20+ | [ ] |
| Commit Quality | 3-4 | ___/35 | 25+ | [ ] |
| Branching | 5-6 | ___/35 | 28+ | [ ] |
| Security | 7-8 | ___/35 | 30+ | [ ] |
| Issues/PRs | 9-10 | ___/35 | 32+ | [ ] |
| Testing/CI | 11-12 | ___/35 | 34+ | [ ] |

### Monthly Habits Checklist:
- [ ] Run `./scripts/git-audit.sh` weekly
- [ ] Review and clean up branches monthly
- [ ] Update documentation as needed
- [ ] Share learnings with team
- [ ] Seek feedback on Git practices

## 🎯 Graduation Criteria

You've mastered Git basics when you can:

1. **Consistently score 30+/35** on the audit tool
2. **Write clear, conventional commit messages** without thinking
3. **Use feature branches** for all development work
4. **Handle merge conflicts** confidently
5. **Never commit secrets** or build artifacts
6. **Link commits to issues** and create good PRs
7. **Help others** improve their Git practices

## 🏆 Advanced Challenges

Once you've mastered the basics:

1. **Contribute to open source** projects using their Git workflow
2. **Set up automated workflows** with GitHub Actions
3. **Mentor a beginner** through this learning path
4. **Create Git training materials** for your team
5. **Optimize your team's branching strategy**

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Pro Git Book](https://git-scm.com/book)

## 🛠️ Tools Mastery Checklist

- [ ] Git command line proficiency
- [ ] VS Code Git integration
- [ ] GitHub web interface
- [ ] Git audit script usage
- [ ] Commit message validator
- [ ] Pre-commit hooks setup
- [ ] Automated formatting tools

---

**Remember**: This is a journey, not a race. Focus on building good habits rather than speed. Each phase builds on the previous one, so don't skip ahead until you're comfortable with your current level.

**Track your progress** by running the audit script weekly and celebrating improvements!