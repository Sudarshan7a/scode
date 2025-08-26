#!/usr/bin/env node

/**
 * Git Repository Hygiene Audit System
 * Main audit runner that evaluates repository health across multiple dimensions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class GitAudit {
  constructor() {
    this.repoPath = process.cwd();
    this.results = {};
    this.recommendations = [];
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async runAudit() {
    this.log('\n🔍 Git Repository Hygiene Audit', 'bright');
    this.log('=====================================\n', 'cyan');

    try {
      // Check if we're in a Git repository
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    } catch (error) {
      this.log('❌ Not a Git repository! Please run this in a Git repository.', 'red');
      process.exit(1);
    }

    // Run all audit components
    this.auditCommitHygiene();
    this.auditBranchStrategy();
    this.auditMessageQuality();
    this.auditSecretSafety();
    this.auditProjectHygiene();
    this.auditIssueIntegration();

    // Generate final report
    this.generateReport();
    this.saveReport();
  }

  auditCommitHygiene() {
    this.log('📝 Analyzing Commit Hygiene...', 'blue');
    
    try {
      // Get commit statistics
      const commits = execSync('git log --oneline --since="60 days ago"').toString().trim().split('\n').filter(line => line);
      const commitStats = execSync('git log --shortstat --since="60 days ago"').toString();
      
      let score = 5;
      const issues = [];
      
      // Check commit frequency (should be regular, not huge gaps)
      if (commits.length < 5) {
        score -= 2;
        issues.push('Very few commits in last 60 days - consider more frequent commits');
      }
      
      // Analyze commit sizes
      const largeCommits = this.findLargeCommits();
      if (largeCommits.length > 0) {
        score -= 1;
        issues.push(`Found ${largeCommits.length} large commits (>300 lines changed)`);
      }
      
      this.results.commitHygiene = {
        score: Math.max(0, score),
        totalCommits: commits.length,
        issues,
        largeCommits
      };
      
      this.log(`   Score: ${this.getScoreDisplay(score)} (${commits.length} commits in 60 days)`, 'cyan');
      
    } catch (error) {
      this.results.commitHygiene = { score: 0, error: 'Unable to analyze commits' };
    }
  }

  auditBranchStrategy() {
    this.log('🌿 Analyzing Branch Strategy...', 'blue');
    
    try {
      const branches = execSync('git branch -a').toString().trim().split('\n');
      const currentBranch = execSync('git branch --show-current').toString().trim();
      
      let score = 5;
      const issues = [];
      
      // Check branch naming conventions
      const badBranchNames = branches.filter(branch => {
        const name = branch.replace(/^\*?\s+/, '').replace(/^remotes\/origin\//, '');
        return /^(test|temp|new|patch|fix)$|[\s_A-Z]/.test(name) && !name.includes('HEAD');
      });
      
      if (badBranchNames.length > 0) {
        score -= 2;
        issues.push('Poor branch naming detected (avoid spaces, use kebab-case)');
      }
      
      // Check if working directly on master/main
      if (['master', 'main'].includes(currentBranch)) {
        score -= 1;
        issues.push('Working directly on master/main branch - consider feature branches');
      }
      
      this.results.branchStrategy = {
        score: Math.max(0, score),
        currentBranch,
        totalBranches: branches.length,
        issues,
        badBranchNames
      };
      
      this.log(`   Score: ${this.getScoreDisplay(score)} (${branches.length} branches)`, 'cyan');
      
    } catch (error) {
      this.results.branchStrategy = { score: 0, error: 'Unable to analyze branches' };
    }
  }

  auditMessageQuality() {
    this.log('💬 Analyzing Commit Message Quality...', 'blue');
    
    try {
      const commits = execSync('git log --format="%s" -n 50').toString().trim().split('\n');
      
      let score = 5;
      const issues = [];
      
      // Check for bad message patterns
      const badMessages = commits.filter(msg => {
        return /^(wip|temp|test|fix|update|changes|misc|oops|again|final)/i.test(msg) ||
               msg.length < 10 || msg.length > 72 ||
               /^[a-z]/.test(msg); // Should start with capital or conventional commit
      });
      
      if (badMessages.length > commits.length * 0.3) {
        score -= 2;
        issues.push('Many commit messages need improvement (too vague, wrong format)');
      }
      
      // Check for conventional commits usage
      const conventionalCommits = commits.filter(msg => 
        /^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?: /.test(msg)
      );
      
      const conventionalPercentage = conventionalCommits.length / commits.length;
      if (conventionalPercentage < 0.5) {
        score -= 1;
        issues.push('Consider using Conventional Commits format for better changelog generation');
      }
      
      this.results.messageQuality = {
        score: Math.max(0, score),
        totalMessages: commits.length,
        badMessages: badMessages.length,
        conventionalPercentage: Math.round(conventionalPercentage * 100),
        issues
      };
      
      this.log(`   Score: ${this.getScoreDisplay(score)} (${conventionalPercentage * 100}% conventional)`, 'cyan');
      
    } catch (error) {
      this.results.messageQuality = { score: 0, error: 'Unable to analyze commit messages' };
    }
  }

  auditSecretSafety() {
    this.log('🔐 Scanning for Secrets...', 'blue');
    
    try {
      // Check .gitignore for common secret patterns
      const gitignoreContent = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
      
      let score = 5;
      const issues = [];
      const secretPatterns = [
        { pattern: /\.env/, name: '.env files' },
        { pattern: /\*\.key/, name: 'key files' },
        { pattern: /\*\.pem/, name: 'certificate files' },
        { pattern: /config\/secrets/, name: 'secret config files' }
      ];
      
      const missingPatterns = secretPatterns.filter(p => !p.pattern.test(gitignoreContent));
      if (missingPatterns.length > 0) {
        score -= 1;
        issues.push(`Consider adding to .gitignore: ${missingPatterns.map(p => p.name).join(', ')}`);
      }
      
      // Scan recent commits for potential secrets
      try {
        const recentCommits = execSync('git log -p -n 10').toString();
        const suspiciousPatterns = [
          /api[_-]?key["\s]*[:=]["\s]*[a-zA-Z0-9]{20,}/gi,
          /secret["\s]*[:=]["\s]*[a-zA-Z0-9]{20,}/gi,
          /token["\s]*[:=]["\s]*[a-zA-Z0-9]{20,}/gi,
          /password["\s]*[:=]["\s]*[^"\s\n]{8,}/gi
        ];
        
        const foundSecrets = suspiciousPatterns.some(pattern => pattern.test(recentCommits));
        if (foundSecrets) {
          score -= 3;
          issues.push('⚠️  Potential secrets found in recent commits - please review and rotate if needed');
        }
      } catch (error) {
        // If we can't scan, assume it's safe but note the limitation
      }
      
      this.results.secretSafety = {
        score: Math.max(0, score),
        issues,
        gitignoreExists: fs.existsSync('.gitignore')
      };
      
      this.log(`   Score: ${this.getScoreDisplay(score)}`, 'cyan');
      
    } catch (error) {
      this.results.secretSafety = { score: 3, error: 'Limited secret scanning capability' };
    }
  }

  auditProjectHygiene() {
    this.log('🧹 Checking Project Hygiene...', 'blue');
    
    let score = 5;
    const issues = [];
    
    // Check for README
    if (!fs.existsSync('README.md') && !fs.existsSync('README.txt')) {
      score -= 1;
      issues.push('Missing README file');
    }
    
    // Check for CONTRIBUTING guide
    if (!fs.existsSync('CONTRIBUTING.md')) {
      score -= 1;
      issues.push('Consider adding CONTRIBUTING.md for collaboration guidelines');
    }
    
    // Check for .gitignore
    if (!fs.existsSync('.gitignore')) {
      score -= 2;
      issues.push('Missing .gitignore file');
    }
    
    // Check for package.json if it's a Node.js project
    if (fs.existsSync('package.json')) {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (!packageJson.description) {
        score -= 1;
        issues.push('package.json missing description');
      }
    }
    
    this.results.projectHygiene = {
      score: Math.max(0, score),
      issues
    };
    
    this.log(`   Score: ${this.getScoreDisplay(score)}`, 'cyan');
  }

  auditIssueIntegration() {
    this.log('🔗 Checking Issue Integration...', 'blue');
    
    try {
      const commits = execSync('git log --format="%s" -n 50').toString().trim().split('\n');
      
      let score = 3; // Start neutral since not all projects use issues
      const issues = [];
      
      // Check for issue references in commits
      const issueRefs = commits.filter(msg => 
        /#\d+/.test(msg) || /closes?\s+#\d+/i.test(msg) || /fixes?\s+#\d+/i.test(msg)
      );
      
      if (issueRefs.length > commits.length * 0.3) {
        score += 2; // Bonus for good integration
      } else if (issueRefs.length === 0) {
        issues.push('No issue references found in commits - consider linking work to issues');
      }
      
      this.results.issueIntegration = {
        score: Math.max(0, Math.min(5, score)),
        issueReferences: issueRefs.length,
        totalCommits: commits.length,
        issues
      };
      
      this.log(`   Score: ${this.getScoreDisplay(score)} (${issueRefs.length} issue refs)`, 'cyan');
      
    } catch (error) {
      this.results.issueIntegration = { score: 3, error: 'Unable to analyze issue integration' };
    }
  }

  findLargeCommits() {
    try {
      const stats = execSync('git log --shortstat --format="%h" -n 20').toString();
      const commits = stats.split('\n\n').filter(block => block.trim());
      
      return commits.filter(commit => {
        const match = commit.match(/(\d+) insertions?\(\+\), (\d+) deletions?\(-\)/);
        if (match) {
          const insertions = parseInt(match[1]) || 0;
          const deletions = parseInt(match[2]) || 0;
          return (insertions + deletions) > 300;
        }
        return false;
      }).map(commit => commit.split('\n')[0]);
    } catch (error) {
      return [];
    }
  }

  getScoreDisplay(score) {
    if (score >= 5) return '🟢 5/5 Excellent';
    if (score >= 4) return '🟡 4/5 Good';
    if (score >= 3) return '🟡 3/5 Decent';
    if (score >= 2) return '🔴 2/5 Needs Work';
    if (score >= 1) return '🔴 1/5 Poor';
    return '🔴 0/5 Critical';
  }

  generateReport() {
    this.log('\n📊 AUDIT RESULTS', 'bright');
    this.log('=================\n', 'cyan');
    
    const categories = [
      { name: 'Commit Hygiene', key: 'commitHygiene' },
      { name: 'Branch Strategy', key: 'branchStrategy' },
      { name: 'Message Quality', key: 'messageQuality' },
      { name: 'Secret Safety', key: 'secretSafety' },
      { name: 'Project Hygiene', key: 'projectHygiene' },
      { name: 'Issue Integration', key: 'issueIntegration' }
    ];
    
    let totalScore = 0;
    let maxScore = 0;
    
    categories.forEach(category => {
      const result = this.results[category.key];
      if (result && typeof result.score === 'number') {
        totalScore += result.score;
        maxScore += 5;
        
        this.log(`${category.name}: ${this.getScoreDisplay(result.score)}`, 'bright');
        
        if (result.issues && result.issues.length > 0) {
          result.issues.forEach(issue => {
            this.log(`  ⚠️  ${issue}`, 'yellow');
          });
        }
        this.log('');
      }
    });
    
    const overallPercentage = Math.round((totalScore / maxScore) * 100);
    const overallGrade = overallPercentage >= 90 ? '🟢 A' : 
                        overallPercentage >= 80 ? '🟡 B' : 
                        overallPercentage >= 70 ? '🟡 C' : 
                        overallPercentage >= 60 ? '🔴 D' : '🔴 F';
    
    this.log(`OVERALL SCORE: ${overallGrade} (${totalScore}/${maxScore} - ${overallPercentage}%)`, 'bright');
    
    // Generate recommendations
    this.generateRecommendations();
  }

  generateRecommendations() {
    this.log('\n💡 TOP RECOMMENDATIONS', 'bright');
    this.log('========================\n', 'cyan');
    
    const allIssues = [];
    Object.values(this.results).forEach(result => {
      if (result.issues) {
        allIssues.push(...result.issues);
      }
    });
    
    if (allIssues.length === 0) {
      this.log('🎉 Great job! Your repository hygiene is excellent!', 'green');
      return;
    }
    
    // Prioritize recommendations based on impact
    const prioritized = this.prioritizeRecommendations(allIssues);
    
    prioritized.slice(0, 5).forEach((issue, index) => {
      this.log(`${index + 1}. ${issue}`, 'yellow');
    });
    
    this.log('\n📚 For detailed guidance, check:', 'bright');
    this.log('   • git-audit/educational/ folder', 'cyan');
    this.log('   • CONTRIBUTING.md', 'cyan');
    this.log('   • https://conventionalcommits.org/', 'cyan');
  }

  prioritizeRecommendations(issues) {
    // Simple prioritization based on keywords
    const highPriority = issues.filter(issue => 
      /secret|password|token|api[_-]?key/i.test(issue)
    );
    const mediumPriority = issues.filter(issue => 
      /commit|message|branch/i.test(issue) && !highPriority.includes(issue)
    );
    const lowPriority = issues.filter(issue => 
      !highPriority.includes(issue) && !mediumPriority.includes(issue)
    );
    
    return [...highPriority, ...mediumPriority, ...lowPriority];
  }

  saveReport() {
    const reportPath = path.join(__dirname, 'reports', `audit-${new Date().toISOString().split('T')[0]}.json`);
    
    try {
      if (!fs.existsSync(path.dirname(reportPath))) {
        fs.mkdirSync(path.dirname(reportPath), { recursive: true });
      }
      
      const report = {
        timestamp: new Date().toISOString(),
        repository: path.basename(this.repoPath),
        results: this.results
      };
      
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      this.log(`\n💾 Report saved to: ${reportPath}`, 'green');
    } catch (error) {
      this.log('\n⚠️  Could not save report to file', 'yellow');
    }
  }
}

// Run audit if called directly
if (require.main === module) {
  const audit = new GitAudit();
  audit.runAudit().catch(error => {
    console.error('❌ Audit failed:', error.message);
    process.exit(1);
  });
}

module.exports = GitAudit;