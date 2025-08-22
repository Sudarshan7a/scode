#!/usr/bin/env node

/**
 * Branch Strategy Checker
 * Analyzes branching patterns and naming conventions
 */

const { execSync } = require('child_process');

class BranchChecker {
  constructor() {
    this.namingPatterns = {
      // Good patterns
      feature: /^(feature|feat)\/[a-z0-9-]+$/,
      bugfix: /^(bugfix|fix|hotfix)\/[a-z0-9-]+$/,
      release: /^(release|rel)\/[a-z0-9.-]+$/,
      chore: /^chore\/[a-z0-9-]+$/,
      docs: /^docs\/[a-z0-9-]+$/,
      kebabCase: /^[a-z0-9-]+\/[a-z0-9-]+$/,
      
      // Bad patterns  
      badNames: /^(test|temp|new|patch|fix|update|branch|main|master)$/,
      hasSpaces: /\s/,
      hasUnderscore: /_/,
      hasUpperCase: /[A-Z]/,
      startsWithNumber: /^[0-9]/,
      tooShort: /^.{1,3}$/,
      tooLong: /^.{51,}$/
    };
  }

  analyzeBranches() {
    try {
      console.log('\n🌿 Analyzing Branch Strategy...\n');

      const branches = this.getBranches();
      const currentBranch = this.getCurrentBranch();
      
      const analysis = {
        total: branches.length,
        current: currentBranch,
        categories: this.categorizeBranches(branches),
        issues: this.identifyIssues(branches, currentBranch),
        recommendations: []
      };

      this.generateReport(analysis);
      return analysis;

    } catch (error) {
      console.error('❌ Error analyzing branches:', error.message);
      return null;
    }
  }

  getBranches() {
    try {
      const output = execSync('git branch -a --format="%(refname:short)|%(committerdate:short)|%(HEAD)"').toString();
      return output.trim().split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [name, date, isHead] = line.split('|');
          const cleanName = name.replace(/^remotes\/origin\//, '');
          return {
            name: cleanName,
            fullName: name,
            lastCommitDate: date,
            isCurrent: isHead === '*',
            isRemote: name.startsWith('remotes/'),
            isLocal: !name.startsWith('remotes/')
          };
        })
        .filter(branch => !branch.name.includes('HEAD') && branch.name !== '');
    } catch (error) {
      // Fallback to simpler command
      const output = execSync('git branch -a').toString();
      return output.trim().split('\n')
        .map(line => line.trim().replace(/^\*\s*/, ''))
        .filter(line => line && !line.includes('HEAD'))
        .map(name => ({
          name: name.replace(/^remotes\/origin\//, ''),
          fullName: name,
          isRemote: name.startsWith('remotes/'),
          isLocal: !name.startsWith('remotes/')
        }));
    }
  }

  getCurrentBranch() {
    try {
      return execSync('git branch --show-current').toString().trim();
    } catch (error) {
      return 'unknown';
    }
  }

  categorizeBranches(branches) {
    const categories = {
      excellent: [],
      good: [],
      needsWork: [],
      problematic: []
    };

    branches.forEach(branch => {
      const score = this.scoreBranch(branch);
      const category = score >= 4 ? 'excellent' : 
                     score >= 3 ? 'good' : 
                     score >= 2 ? 'needsWork' : 'problematic';
      
      categories[category].push({
        ...branch,
        score,
        issues: this.identifyBranchIssues(branch)
      });
    });

    return categories;
  }

  scoreBranch(branch) {
    let score = 5;
    const name = branch.name;

    // Skip scoring for main branches
    if (['main', 'master', 'develop', 'dev'].includes(name)) {
      return 5;
    }

    // Deduct points for bad patterns
    if (this.namingPatterns.badNames.test(name)) score -= 3;
    if (this.namingPatterns.hasSpaces.test(name)) score -= 2;
    if (this.namingPatterns.hasUpperCase.test(name)) score -= 1;
    if (this.namingPatterns.hasUnderscore.test(name)) score -= 1;
    if (this.namingPatterns.startsWithNumber.test(name)) score -= 1;
    if (this.namingPatterns.tooShort.test(name)) score -= 2;
    if (this.namingPatterns.tooLong.test(name)) score -= 1;

    // Add points for good patterns
    if (this.namingPatterns.feature.test(name) ||
        this.namingPatterns.bugfix.test(name) ||
        this.namingPatterns.release.test(name) ||
        this.namingPatterns.chore.test(name) ||
        this.namingPatterns.docs.test(name)) {
      score += 1;
    }

    return Math.max(0, Math.min(5, score));
  }

  identifyBranchIssues(branch) {
    const issues = [];
    const name = branch.name;

    // Skip analysis for main branches
    if (['main', 'master', 'develop', 'dev'].includes(name)) {
      return issues;
    }

    if (this.namingPatterns.badNames.test(name)) {
      issues.push('Generic name - be more descriptive about the feature/fix');
    }
    if (this.namingPatterns.hasSpaces.test(name)) {
      issues.push('Contains spaces - use hyphens instead');
    }
    if (this.namingPatterns.hasUpperCase.test(name)) {
      issues.push('Contains uppercase - use lowercase with hyphens');
    }
    if (this.namingPatterns.hasUnderscore.test(name)) {
      issues.push('Uses underscores - prefer hyphens for readability');
    }
    if (this.namingPatterns.startsWithNumber.test(name)) {
      issues.push('Starts with number - begin with letter or prefix');
    }
    if (this.namingPatterns.tooShort.test(name)) {
      issues.push('Too short - provide more context about the work');
    }
    if (this.namingPatterns.tooLong.test(name)) {
      issues.push('Too long - consider shorter, more focused names');
    }

    return issues;
  }

  identifyIssues(branches, currentBranch) {
    const issues = [];
    
    // Check if working on main branches
    if (['main', 'master'].includes(currentBranch)) {
      issues.push('Currently on main/master branch - consider using feature branches');
    }

    // Check for too many branches
    const activeBranches = branches.filter(b => !['main', 'master', 'develop', 'dev'].includes(b.name));
    if (activeBranches.length > 10) {
      issues.push('Many active branches - consider cleaning up merged/stale branches');
    }

    // Check for remote tracking
    const localBranches = branches.filter(b => b.isLocal);
    const remoteBranches = branches.filter(b => b.isRemote);
    if (localBranches.length > remoteBranches.length * 2) {
      issues.push('Many local-only branches - consider pushing or cleaning up');
    }

    return issues;
  }

  generateReport(analysis) {
    console.log('📊 BRANCH ANALYSIS REPORT');
    console.log('=========================\n');

    // Current status
    console.log(`📍 Current Status:`);
    console.log(`   Active branch: ${analysis.current}`);
    console.log(`   Total branches: ${analysis.total}`);
    
    // Show issues if any
    if (analysis.issues.length > 0) {
      console.log(`\n⚠️  Issues Detected:`);
      analysis.issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
    }

    // Category breakdown
    const categories = analysis.categories;
    console.log(`\n📋 Branch Quality:`);
    console.log(`   🟢 Excellent: ${categories.excellent.length} branches`);
    console.log(`   🟡 Good: ${categories.good.length} branches`);
    console.log(`   🟠 Needs Work: ${categories.needsWork.length} branches`);
    console.log(`   🔴 Problematic: ${categories.problematic.length} branches`);

    // Show problematic branches
    if (categories.problematic.length > 0) {
      console.log(`\n🚨 Problematic Branches:`);
      categories.problematic.forEach(branch => {
        console.log(`   ${branch.name}:`);
        branch.issues.forEach(issue => {
          console.log(`      ⚠️  ${issue}`);
        });
      });
    }

    // Show branches that need work
    if (categories.needsWork.length > 0) {
      console.log(`\n🔧 Branches Needing Work:`);
      categories.needsWork.slice(0, 5).forEach(branch => {
        console.log(`   ${branch.name}:`);
        branch.issues.forEach(issue => {
          console.log(`      💡 ${issue}`);
        });
      });
    }

    // Generate recommendations
    this.generateRecommendations(analysis);
  }

  generateRecommendations(analysis) {
    console.log('\n💡 RECOMMENDATIONS');
    console.log('==================\n');

    const recommendations = [];
    
    // Current branch recommendations
    if (['main', 'master'].includes(analysis.current)) {
      recommendations.push('🌱 Create a feature branch for your work instead of committing to main/master');
      recommendations.push('📖 Example: git checkout -b feature/user-authentication');
    }

    // Naming recommendations
    if (analysis.categories.problematic.length > 0 || analysis.categories.needsWork.length > 0) {
      recommendations.push('📝 Use descriptive branch names that explain the feature or fix');
      recommendations.push('🔤 Follow convention: type/description (e.g., feature/login-form, fix/header-bug)');
      recommendations.push('🔗 Use kebab-case (hyphens) instead of spaces or underscores');
    }

    // Cleanup recommendations
    if (analysis.total > 15) {
      recommendations.push('🧹 Clean up old branches: git branch -d branch-name');
      recommendations.push('🔄 Remove remote tracking: git push origin --delete branch-name');
    }

    // Strategy recommendations
    recommendations.push('🎯 Recommended branch strategy:');
    recommendations.push('   • main/master: stable, deployable code');
    recommendations.push('   • feature/: new features (feature/payment-integration)');
    recommendations.push('   • fix/: bug fixes (fix/login-error)');
    recommendations.push('   • chore/: maintenance tasks (chore/update-dependencies)');

    if (recommendations.length === 0) {
      console.log('🎉 Excellent! Your branching strategy looks great!');
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    console.log('\n📚 Learn More:');
    console.log('   • Git Flow: https://nvie.com/posts/a-successful-git-branching-model/');
    console.log('   • GitHub Flow: https://docs.github.com/en/get-started/quickstart/github-flow');
    console.log('   • Branch best practices: git-audit/educational/branching-strategies.md');
  }

  // Utility methods for external use
  suggestBranchName(description, type = 'feature') {
    const cleanDesc = description
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    return `${type}/${cleanDesc}`;
  }

  validateBranchName(name) {
    const issues = this.identifyBranchIssues({ name });
    return {
      isValid: issues.length === 0,
      issues,
      score: this.scoreBranch({ name })
    };
  }
}

// CLI usage
if (require.main === module) {
  const checker = new BranchChecker();
  
  // Handle command line arguments
  const command = process.argv[2];
  
  if (command === 'suggest' && process.argv[3]) {
    const description = process.argv[3];
    const type = process.argv[4] || 'feature';
    console.log(`Suggested branch name: ${checker.suggestBranchName(description, type)}`);
  } else if (command === 'validate' && process.argv[3]) {
    const name = process.argv[3];
    const result = checker.validateBranchName(name);
    console.log(`Branch name: ${name}`);
    console.log(`Valid: ${result.isValid ? '✅' : '❌'}`);
    console.log(`Score: ${result.score}/5`);
    if (result.issues.length > 0) {
      console.log('Issues:');
      result.issues.forEach(issue => console.log(`  • ${issue}`));
    }
  } else {
    checker.analyzeBranches();
  }
}

module.exports = BranchChecker;