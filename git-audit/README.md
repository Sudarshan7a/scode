# Git Repository Hygiene Audit System

A comprehensive set of tools to help beginners learn Git best practices by analyzing repository hygiene and providing educational feedback.

## Overview

This audit system evaluates your Git repository across multiple dimensions:
- **Commit Quality**: Frequency, size, atomicity, and message clarity
- **Branching Strategy**: Naming conventions, isolation, and cleanup
- **Security**: Secret detection and sensitive data protection
- **Project Hygiene**: .gitignore effectiveness, dependency management
- **Documentation**: Issue linkage and contribution guidelines

## Quick Start

```bash
# Run comprehensive audit
node git-audit/audit.js

# Run specific audits
node git-audit/commit-analyzer.js
node git-audit/branch-checker.js
node git-audit/secret-scanner.js
```

## Scoring System

Each area is scored 0-5:
- **0-2**: Needs work (🔴)
- **3-4**: Decent (🟡) 
- **5**: Exemplary (🟢)

## Files in this directory

- `audit.js` - Main audit runner and report generator
- `commit-analyzer.js` - Analyzes commit patterns and quality
- `branch-checker.js` - Evaluates branching strategy and hygiene
- `secret-scanner.js` - Scans for accidentally committed secrets
- `message-quality.js` - Evaluates commit message conventions
- `educational/` - Learning materials and best practice guides
- `reports/` - Generated audit reports and examples

## Learning Path for Beginners

1. **Start Here**: Run the main audit to get your baseline scores
2. **Focus Areas**: Work on the lowest-scoring areas first  
3. **Learn**: Read the educational materials for each area
4. **Practice**: Apply improvements and re-run audits
5. **Iterate**: Track progress over time

## Integration

Add to your development workflow:
- Pre-commit hooks for instant feedback
- CI/CD pipeline integration for team enforcement
- Regular audits (weekly/monthly) for continuous improvement

---

*This system is designed to be educational first - helping you understand the "why" behind Git best practices, not just the "what".*