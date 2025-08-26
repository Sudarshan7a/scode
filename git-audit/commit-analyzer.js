#!/usr/bin/env node

/**
 * Commit Pattern Analyzer
 * Analyzes commit patterns to identify common beginner mistakes
 */

const { execSync } = require('child_process');

class CommitAnalyzer {
  constructor() {
    this.patterns = {
      // Anti-patterns (things to avoid)
      vague: /^(update|fix|change|modify|improve|refactor)$/i,
      wip: /^(wip|temp|test|temporary|backup)/i,
      emotional: /^(oops|again|final|last|damn|fuck|shit)/i,
      tooLong: /.{73,}/, // Over 72 characters
      tooShort: /^.{1,9}$/, // Under 10 characters
      noCapital: /^[a-z]/, // Should start with capital or conventional prefix
      
      // Good patterns
      conventional: /^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?: /,
      imperative: /^(add|remove|update|fix|implement|create|delete|optimize)/i,
      issueRef: /#\d+|closes?\s+#\d+|fixes?\s+#\d+/i
    };
  }

  analyzeCommits(limit = 100) {
    try {
      const commits = execSync(`git log --format="%H|%s|%an|%ad" --date=short -n ${limit}`)
        .toString()
        .trim()
        .split('\n')
        .filter(line => line)
        .map(line => {
          const [hash, subject, author, date] = line.split('|');
          return { hash, subject, author, date };
        });

      console.log(`\n📝 Analyzing ${commits.length} commits...\n`);

      const analysis = {
        total: commits.length,
        patterns: this.categorizeCommits(commits),
        statistics: this.calculateStatistics(commits),
        recommendations: []
      };

      this.generateReport(analysis);
      return analysis;

    } catch (error) {
      console.error('❌ Error analyzing commits:', error.message);
      return null;
    }
  }

  categorizeCommits(commits) {
    const categories = {
      excellent: [],
      good: [],
      needsWork: [],
      problematic: []
    };

    commits.forEach(commit => {
      const score = this.scoreCommit(commit);
      const category = score >= 4 ? 'excellent' : 
                     score >= 3 ? 'good' : 
                     score >= 2 ? 'needsWork' : 'problematic';
      
      categories[category].push({
        ...commit,
        score,
        issues: this.identifyIssues(commit)
      });
    });

    return categories;
  }

  scoreCommit(commit) {
    let score = 5;
    const subject = commit.subject;

    // Deduct points for anti-patterns
    if (this.patterns.vague.test(subject)) score -= 2;
    if (this.patterns.wip.test(subject)) score -= 3;
    if (this.patterns.emotional.test(subject)) score -= 2;
    if (this.patterns.tooLong.test(subject)) score -= 1;
    if (this.patterns.tooShort.test(subject)) score -= 1;
    if (this.patterns.noCapital.test(subject) && !this.patterns.conventional.test(subject)) score -= 1;

    // Add points for good patterns
    if (this.patterns.conventional.test(subject)) score += 1;
    if (this.patterns.issueRef.test(subject)) score += 1;

    return Math.max(0, Math.min(5, score));
  }

  identifyIssues(commit) {
    const issues = [];
    const subject = commit.subject;

    if (this.patterns.vague.test(subject)) {
      issues.push('Too vague - describe WHAT you changed');
    }
    if (this.patterns.wip.test(subject)) {
      issues.push('WIP commits should be squashed before merging');
    }
    if (this.patterns.emotional.test(subject)) {
      issues.push('Keep it professional - avoid emotional language');
    }
    if (this.patterns.tooLong.test(subject)) {
      issues.push('Too long - keep first line under 72 characters');
    }
    if (this.patterns.tooShort.test(subject)) {
      issues.push('Too short - provide more context');
    }
    if (this.patterns.noCapital.test(subject) && !this.patterns.conventional.test(subject)) {
      issues.push('Start with capital letter or use conventional format');
    }

    return issues;
  }

  calculateStatistics(commits) {
    const stats = {
      byAuthor: {},
      byPattern: {},
      frequency: this.analyzeCommitFrequency(commits),
      averageLength: 0
    };

    // Author statistics
    commits.forEach(commit => {
      stats.byAuthor[commit.author] = (stats.byAuthor[commit.author] || 0) + 1;
    });

    // Pattern statistics
    Object.entries(this.patterns).forEach(([patternName, pattern]) => {
      stats.byPattern[patternName] = commits.filter(c => pattern.test(c.subject)).length;
    });

    // Average message length
    stats.averageLength = Math.round(
      commits.reduce((sum, c) => sum + c.subject.length, 0) / commits.length
    );

    return stats;
  }

  analyzeCommitFrequency(commits) {
    const dates = commits.map(c => c.date);
    const uniqueDates = [...new Set(dates)];
    
    // Calculate gaps between commits
    const gaps = [];
    for (let i = 1; i < uniqueDates.length; i++) {
      const daysDiff = Math.abs(
        (new Date(uniqueDates[i]) - new Date(uniqueDates[i-1])) / (1000 * 60 * 60 * 24)
      );
      gaps.push(daysDiff);
    }

    return {
      activeDays: uniqueDates.length,
      averageGap: gaps.length ? Math.round(gaps.reduce((a, b) => a + b) / gaps.length) : 0,
      longestGap: gaps.length ? Math.max(...gaps) : 0
    };
  }

  generateReport(analysis) {
    console.log('📊 COMMIT ANALYSIS REPORT');
    console.log('=========================\n');

    // Overall statistics
    console.log(`📈 Overall Statistics:`);
    console.log(`   Total commits: ${analysis.total}`);
    console.log(`   Average message length: ${analysis.statistics.averageLength} chars`);
    console.log(`   Active days: ${analysis.statistics.frequency.activeDays}`);
    console.log(`   Average gap: ${analysis.statistics.frequency.averageGap} days`);
    console.log(`   Longest gap: ${analysis.statistics.frequency.longestGap} days\n`);

    // Category breakdown
    const patterns = analysis.patterns;
    console.log(`📋 Quality Breakdown:`);
    console.log(`   🟢 Excellent: ${patterns.excellent.length} commits`);
    console.log(`   🟡 Good: ${patterns.good.length} commits`);
    console.log(`   🟠 Needs Work: ${patterns.needsWork.length} commits`);
    console.log(`   🔴 Problematic: ${patterns.problematic.length} commits\n`);

    // Show problematic commits
    if (patterns.problematic.length > 0) {
      console.log(`🚨 Most Problematic Commits:`);
      patterns.problematic.slice(0, 5).forEach(commit => {
        console.log(`   ${commit.hash.substring(0, 7)}: "${commit.subject}"`);
        commit.issues.forEach(issue => {
          console.log(`      ⚠️  ${issue}`);
        });
        console.log('');
      });
    }

    // Pattern analysis
    console.log(`🔍 Pattern Analysis:`);
    console.log(`   Conventional commits: ${analysis.statistics.byPattern.conventional}/${analysis.total} (${Math.round(analysis.statistics.byPattern.conventional/analysis.total*100)}%)`);
    console.log(`   Issue references: ${analysis.statistics.byPattern.issueRef}/${analysis.total} (${Math.round(analysis.statistics.byPattern.issueRef/analysis.total*100)}%)`);
    console.log(`   Vague messages: ${analysis.statistics.byPattern.vague}/${analysis.total}`);
    console.log(`   WIP commits: ${analysis.statistics.byPattern.wip}/${analysis.total}\n`);

    // Recommendations
    this.generateRecommendations(analysis);
  }

  generateRecommendations(analysis) {
    console.log('💡 RECOMMENDATIONS');
    console.log('==================\n');

    const recommendations = [];
    const stats = analysis.statistics;

    // Frequency recommendations
    if (stats.frequency.longestGap > 14) {
      recommendations.push('🔄 Commit more frequently - avoid gaps longer than 2 weeks');
    }
    if (stats.frequency.averageGap > 7) {
      recommendations.push('📅 Consider daily commits for active development periods');
    }

    // Message quality recommendations
    if (stats.byPattern.vague > analysis.total * 0.2) {
      recommendations.push('📝 Be more specific in commit messages - describe WHAT you changed');
    }
    if (stats.byPattern.conventional < analysis.total * 0.5) {
      recommendations.push('📋 Consider adopting Conventional Commits (feat:, fix:, docs:, etc.)');
    }
    if (stats.byPattern.wip > 0) {
      recommendations.push('🔨 Squash WIP commits before merging to main branch');
    }
    if (stats.byPattern.issueRef < analysis.total * 0.3) {
      recommendations.push('🔗 Link commits to issues using #123 or "fixes #123"');
    }

    // Size recommendations
    if (stats.averageLength > 72) {
      recommendations.push('📏 Keep first line of commit messages under 72 characters');
    }
    if (stats.averageLength < 20) {
      recommendations.push('📖 Provide more context in commit messages');
    }

    if (recommendations.length === 0) {
      console.log('🎉 Excellent! Your commit patterns look great!');
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    console.log('\n📚 Learn More:');
    console.log('   • Conventional Commits: https://conventionalcommits.org/');
    console.log('   • Git Best Practices: git-audit/educational/commit-best-practices.md');
    console.log('   • How to Write Good Commit Messages: git-audit/educational/commit-messages.md');
  }
}

// CLI usage
if (require.main === module) {
  const analyzer = new CommitAnalyzer();
  const limit = process.argv[2] ? parseInt(process.argv[2]) : 50;
  analyzer.analyzeCommits(limit);
}

module.exports = CommitAnalyzer;