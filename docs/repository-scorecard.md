# Repository Health Scorecard

Use this scorecard to evaluate your repository's health and identify improvement areas.

## 📊 Scoring Guide

**Rating Scale:**
- **5**: Exemplary 🌟 
- **4**: Good 👍
- **3**: Adequate ✅
- **2**: Needs improvement ⚠️
- **1**: Poor ❌
- **0**: Missing/Broken 💥

## 🎯 Categories & Criteria

### 1. Commit Hygiene (0-5): ___/5

**Evaluate:**
- Commit frequency (not too many, not too few)
- Atomic commits (one logical change per commit)
- Consistent commit timing
- Logical commit progression

**Common Issues:**
- Massive "catch-up" commits after long breaks
- Mixing multiple concerns in one commit
- Too many tiny commits for simple changes
- "WIP" commits left in main branch

**Score yourself:**
- 5: Perfect atomic commits, good frequency
- 4: Mostly atomic, occasional large commits
- 3: Mixed sizes, generally reasonable
- 2: Frequent large or unclear commits
- 1: Chaotic commit pattern
- 0: No clear commit strategy

### 2. Commit Message Quality (0-5): ___/5

**Evaluate:**
- Uses clear, descriptive messages
- Follows consistent format (e.g., Conventional Commits)
- Avoids vague words like "fix", "update", "changes"
- Uses imperative mood

**Count recent commits (last 20):**
- Conventional format: ___/20
- Clear descriptions: ___/20
- Vague/poor messages: ___/20

**Score yourself:**
- 5: 90%+ follow conventions, all clear
- 4: 70%+ conventional, mostly clear
- 3: 50%+ good messages, some unclear
- 2: Many vague messages, inconsistent format
- 1: Mostly poor messages
- 0: No message standards

### 3. Branching Strategy (0-5): ___/5

**Evaluate:**
- Uses feature branches instead of working on main
- Meaningful branch names (feature/, fix/, etc.)
- Deletes merged branches
- Reasonable branch lifetime

**Current branches:**
- Feature branches: ___
- Good naming: ___
- Stale branches (>2 weeks): ___

**Score yourself:**
- 5: Excellent branch strategy, clean naming
- 4: Good branching, minor naming issues
- 3: Inconsistent branching or naming
- 2: Some direct main commits, poor naming
- 1: Mostly working on main, bad names
- 0: No branching strategy

### 4. Security & Secrets (0-5): ___/5

**Check for:**
- No hardcoded secrets in code
- Proper .env usage
- No committed sensitive files
- Clean commit history

**Run audit:** `git log -p | grep -i 'api_key\|secret\|token\|password'`

**Score yourself:**
- 5: No secrets, excellent security practices
- 4: Good practices, minor exposure
- 3: Mostly secure, some .env issues
- 2: Some secrets in history
- 1: Multiple security issues
- 0: Secrets currently exposed

### 5. File Structure & Artifacts (0-5): ___/5

**Check for:**
- No build artifacts (node_modules, dist, .next)
- Good .gitignore coverage
- Clean repository structure
- Appropriate file organization

**Artifacts present:** ___
**Missing .gitignore patterns:** ___

**Score yourself:**
- 5: Perfect .gitignore, no artifacts
- 4: Good structure, minor artifacts
- 3: Adequate .gitignore, some issues
- 2: Build artifacts present
- 1: Poor structure, many artifacts
- 0: No .gitignore, major artifacts

### 6. Documentation Quality (0-5): ___/5

**Evaluate:**
- README.md exists and is comprehensive
- CONTRIBUTING.md with clear guidelines
- API documentation
- Code comments where needed

**Documentation files:**
- README.md: ___lines
- CONTRIBUTING.md: Yes/No
- Other docs: ___

**Score yourself:**
- 5: Comprehensive docs, clear guidelines
- 4: Good README, some additional docs
- 3: Basic README, minimal other docs
- 2: Poor README, missing guidelines
- 1: Minimal documentation
- 0: No documentation

### 7. Issue & PR Integration (0-5): ___/5

**Evaluate:**
- Issues created for features/bugs
- Commits reference issues
- PRs used instead of direct commits
- Good PR descriptions

**Recent commits with issue refs:** ___/20
**Open issues:** ___
**Recent PRs:** ___

**Score yourself:**
- 5: Excellent issue tracking, PR discipline
- 4: Good issue usage, most PRs
- 3: Some issue tracking, occasional PRs
- 2: Minimal issue usage, few PRs
- 1: Poor issue integration
- 0: No issue/PR workflow

### 8. Testing Integration (0-5): ___/5

**Evaluate:**
- Tests exist for new features
- Tests updated with changes
- Good test coverage
- CI/CD pipeline

**Test files present:** Yes/No
**Test commands:** ___
**CI configured:** Yes/No

**Score yourself:**
- 5: Comprehensive tests, CI/CD setup
- 4: Good test coverage, some automation
- 3: Basic tests, manual process
- 2: Minimal tests, no automation
- 1: Few tests, poor coverage
- 0: No testing strategy

### 9. Dependency Management (0-5): ___/5

**Evaluate:**
- Lock files committed appropriately
- Dependencies separated from features
- Regular security audits
- Minimal dependency count

**Recent dependency updates:** ___
**Security vulnerabilities:** ___
**Mixed commits (deps + features):** ___

**Score yourself:**
- 5: Excellent dep management, secure
- 4: Good practices, occasional mixing
- 3: Adequate management, some issues
- 2: Poor separation, security concerns
- 1: Chaotic dependency handling
- 0: No dependency strategy

### 10. Code Quality & Formatting (0-5): ___/5

**Evaluate:**
- Consistent code formatting
- Linting rules enforced
- No formatting-only commits mixed with logic
- Pre-commit hooks

**Linting:** Pass/Fail
**Formatting consistency:** Good/Poor
**Pre-commit hooks:** Yes/No

**Score yourself:**
- 5: Automated formatting, pre-commit hooks
- 4: Good consistency, manual enforcement
- 3: Mostly consistent, some issues
- 2: Inconsistent formatting, no automation
- 1: Poor formatting standards
- 0: No formatting standards

## 📊 Final Score Calculation

**Total Score:** ___/50
**Percentage:** ___%

### Score Interpretation:

- **90-100% (45-50 points)**: 🌟 **EXEMPLARY** - Outstanding repository hygiene!
- **80-89% (40-44 points)**: 👍 **EXCELLENT** - Minor improvements needed
- **70-79% (35-39 points)**: ✅ **GOOD** - Solid practices, some areas to improve
- **60-69% (30-34 points)**: ⚠️ **ADEQUATE** - Multiple areas need attention
- **50-59% (25-29 points)**: ❌ **POOR** - Significant improvements required
- **Below 50% (<25 points)**: 💥 **CRITICAL** - Major overhaul needed

## 🎯 Action Items Based on Score

### For scores 90-100%:
- Share your practices with the team
- Consider mentoring others
- Document your workflow for consistency

### For scores 80-89%:
- Identify the 1-2 lowest scoring areas
- Create specific improvement goals
- Set up automation where possible

### For scores 70-79%:
- Focus on the bottom 3 categories
- Implement basic automation (linting, formatting)
- Establish clear team guidelines

### For scores 60-69%:
- Start with commit message standards
- Implement basic branching strategy
- Set up proper .gitignore
- Create documentation

### For scores below 60%:
- Begin with fundamentals:
  1. Fix .gitignore and remove artifacts
  2. Establish commit message format
  3. Create basic documentation
  4. Implement security audit
- Consider pairing with experienced developer
- Take time to learn Git best practices

## 📅 Re-evaluation Schedule

- **Beginners**: Weekly for first month, then monthly
- **Intermediate**: Monthly reviews
- **Advanced**: Quarterly assessments

## 🛠️ Tools to Improve Scores

### Automation Tools:
```bash
# Commit message validation
npm install -g @commitlint/config-conventional @commitlint/cli

# Code formatting
npm install -g prettier eslint

# Pre-commit hooks  
npm install -g husky lint-staged

# Security scanning
npm install -g audit-ci
```

### Useful Commands:
```bash
# Run our audit script
./scripts/git-audit.sh

# Check commit message quality
git log --oneline -n 20

# Analyze branch health
git for-each-ref --sort=-committerdate refs/heads/

# Security scan
git log -p | grep -i 'api_key\|secret\|token\|password'
```

## 📈 Tracking Progress

Create a simple spreadsheet or use this template monthly:

| Date | Total Score | Commit Quality | Branching | Security | Documentation | Top Priority |
|------|-------------|----------------|-----------|----------|---------------|--------------|
| 2024-01 | 32/50 | 3/5 | 2/5 | 4/5 | 2/5 | Branching strategy |
| 2024-02 | 38/50 | 4/5 | 4/5 | 4/5 | 3/5 | Documentation |
| 2024-03 | 44/50 | 4/5 | 5/5 | 4/5 | 4/5 | Security practices |

---

**Next Steps:**
1. Complete this scorecard
2. Identify your lowest 2-3 scores  
3. Read the detailed guide: `docs/git-best-practices.md`
4. Implement changes gradually
5. Re-score in 2-4 weeks