#!/usr/bin/env node

/**
 * Secret Scanner
 * Scans repository for accidentally committed secrets and sensitive data
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SecretScanner {
  constructor() {
    this.secretPatterns = [
      // API Keys
      { name: 'Generic API Key', pattern: /api[_-]?key["\s]*[:=]["\s]*[a-zA-Z0-9]{20,}/gi, severity: 'high' },
      { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g, severity: 'critical' },
      { name: 'Google API Key', pattern: /AIza[0-9A-Za-z_\-]{35}/g, severity: 'high' },
      { name: 'GitHub Token', pattern: /gh[pousr]_[A-Za-z0-9_]{36,}/g, severity: 'critical' },
      { name: 'Slack Token', pattern: /xox[baprs]-[A-Za-z0-9-]{10,}/g, severity: 'high' },
      
      // Database URLs
      { name: 'MongoDB URI', pattern: /mongodb(\+srv)?:\/\/[^\s"']+/gi, severity: 'high' },
      { name: 'PostgreSQL URI', pattern: /postgresql:\/\/[^\s"']+/gi, severity: 'high' },
      { name: 'MySQL URI', pattern: /mysql:\/\/[^\s"']+/gi, severity: 'high' },
      
      // Generic secrets
      { name: 'Generic Secret', pattern: /secret["\s]*[:=]["\s]*[a-zA-Z0-9]{20,}/gi, severity: 'medium' },
      { name: 'Generic Token', pattern: /token["\s]*[:=]["\s]*[a-zA-Z0-9]{20,}/gi, severity: 'medium' },
      { name: 'Generic Password', pattern: /password["\s]*[:=]["\s]*[^"\s\n]{8,}/gi, severity: 'medium' },
      
      // JWT Tokens
      { name: 'JWT Token', pattern: /eyJ[A-Za-z0-9_\/+-]*\.[A-Za-z0-9_\/+-]*\.[A-Za-z0-9_\/+-]*/g, severity: 'medium' },
      
      // Private Keys
      { name: 'Private Key', pattern: /-----BEGIN [A-Z ]+PRIVATE KEY-----/g, severity: 'critical' },
      { name: 'SSH Key', pattern: /ssh-(rsa|dss|ed25519) [A-Za-z0-9+\/]+=*/g, severity: 'high' },
      
      // Specific service patterns
      { name: 'Stripe Key', pattern: /sk_live_[0-9a-zA-Z]{24}/g, severity: 'critical' },
      { name: 'Twilio Key', pattern: /SK[a-zA-Z0-9]{32}/g, severity: 'high' },
      { name: 'SendGrid Key', pattern: /SG\.[a-zA-Z0-9_\-\.]{66}/g, severity: 'high' },
    ];

    this.safePatterns = [
      // These are likely examples or placeholders
      /your[_-]?api[_-]?key[_-]?here/gi,
      /replace[_-]?with[_-]?your/gi,
      /example[_-]?key/gi,
      /dummy[_-]?secret/gi,
      /placeholder/gi,
      /\*{4,}/g, // Asterisks masking
      /x{4,}/gi, // X's masking
    ];

    this.excludedFiles = [
      '.git/',
      'node_modules/',
      '.env.example',
      '.env.template',
      'package-lock.json',
      'pnpm-lock.yaml',
      'yarn.lock',
      'README.md',
      'CHANGELOG.md',
      'LICENSE',
      '.md',
      '.txt'
    ];
  }

  async scanRepository() {
    console.log('\n🔐 Scanning Repository for Secrets...\n');

    try {
      const results = {
        commitHistory: await this.scanCommitHistory(),
        currentFiles: await this.scanCurrentFiles(),
        gitignoreCheck: this.checkGitignore(),
        recommendations: []
      };

      this.generateReport(results);
      return results;

    } catch (error) {
      console.error('❌ Error during secret scan:', error.message);
      return null;
    }
  }

  async scanCommitHistory(commitLimit = 50) {
    console.log('📜 Scanning commit history...');
    
    try {
      const commits = execSync(`git log -p --all -n ${commitLimit}`).toString();
      const findings = [];

      this.secretPatterns.forEach(({ name, pattern, severity }) => {
        pattern.lastIndex = 0; // Reset regex
        let match;
        
        while ((match = pattern.exec(commits)) !== null) {
          const context = this.extractContext(commits, match.index);
          
          // Skip if it looks like a safe pattern
          if (this.isSafePattern(match[0])) continue;
          
          findings.push({
            type: name,
            value: this.maskSecret(match[0]),
            severity,
            context: context.slice(0, 100) + '...',
            location: 'commit history'
          });
        }
      });

      return findings;

    } catch (error) {
      console.log('⚠️  Could not scan commit history (limited access)');
      return [];
    }
  }

  async scanCurrentFiles() {
    console.log('📁 Scanning current files...');
    
    const findings = [];
    const files = this.getTrackableFiles();

    files.forEach(filePath => {
      if (this.shouldSkipFile(filePath)) return;

      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        this.secretPatterns.forEach(({ name, pattern, severity }) => {
          pattern.lastIndex = 0; // Reset regex
          let match;
          
          while ((match = pattern.exec(content)) !== null) {
            // Skip if it looks like a safe pattern
            if (this.isSafePattern(match[0])) continue;
            
            const lineNumber = this.getLineNumber(content, match.index);
            
            findings.push({
              type: name,
              value: this.maskSecret(match[0]),
              severity,
              file: filePath,
              line: lineNumber,
              location: 'current files'
            });
          }
        });

      } catch (error) {
        // Skip files that can't be read as text
      }
    });

    return findings;
  }

  getTrackableFiles() {
    try {
      const gitFiles = execSync('git ls-files').toString().trim().split('\n');
      return gitFiles.filter(file => file && !this.shouldSkipFile(file));
    } catch (error) {
      // Fallback to manual file discovery
      return this.getAllFiles('.').filter(file => !this.shouldSkipFile(file));
    }
  }

  getAllFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        this.getAllFiles(fullPath, files);
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  shouldSkipFile(filePath) {
    return this.excludedFiles.some(pattern => 
      filePath.includes(pattern) || 
      filePath.endsWith(pattern) ||
      filePath.startsWith(pattern)
    );
  }

  isSafePattern(value) {
    return this.safePatterns.some(pattern => pattern.test(value));
  }

  extractContext(text, index, contextLength = 50) {
    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + contextLength);
    return text.slice(start, end);
  }

  getLineNumber(content, index) {
    return content.slice(0, index).split('\n').length;
  }

  maskSecret(secret) {
    if (secret.length <= 8) return '***';
    const visibleChars = Math.min(4, Math.floor(secret.length / 4));
    const masked = '*'.repeat(secret.length - visibleChars * 2);
    return secret.slice(0, visibleChars) + masked + secret.slice(-visibleChars);
  }

  checkGitignore() {
    console.log('📋 Checking .gitignore coverage...');
    
    const recommendations = [];
    let score = 5;

    if (!fs.existsSync('.gitignore')) {
      score = 0;
      recommendations.push('Create a .gitignore file');
      return { score, recommendations };
    }

    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    
    const importantPatterns = [
      { pattern: /\.env/m, name: '.env files', critical: true },
      { pattern: /\*\.key/m, name: 'key files', critical: true },
      { pattern: /\*\.pem/m, name: 'certificate files', critical: true },
      { pattern: /\*\.p12/m, name: 'certificate files', critical: false },
      { pattern: /config\/secrets/m, name: 'secrets directory', critical: false },
      { pattern: /\.aws\/credentials/m, name: 'AWS credentials', critical: true },
      { pattern: /\.ssh\/id_rsa/m, name: 'SSH private keys', critical: true },
    ];

    importantPatterns.forEach(({ pattern, name, critical }) => {
      if (!pattern.test(gitignoreContent)) {
        if (critical) {
          score -= 2;
          recommendations.push(`Add ${name} to .gitignore (CRITICAL)`);
        } else {
          score -= 1;
          recommendations.push(`Consider adding ${name} to .gitignore`);
        }
      }
    });

    return {
      score: Math.max(0, score),
      recommendations,
      hasGitignore: true
    };
  }

  generateReport(results) {
    console.log('📊 SECRET SCAN REPORT');
    console.log('=====================\n');

    const allFindings = [...results.commitHistory, ...results.currentFiles];
    const critical = allFindings.filter(f => f.severity === 'critical');
    const high = allFindings.filter(f => f.severity === 'high');
    const medium = allFindings.filter(f => f.severity === 'medium');

    // Overall status
    if (allFindings.length === 0) {
      console.log('🟢 No secrets detected! Great job!');
    } else {
      console.log(`🚨 Found ${allFindings.length} potential secrets:`);
      console.log(`   🔴 Critical: ${critical.length}`);
      console.log(`   🟠 High: ${high.length}`);
      console.log(`   🟡 Medium: ${medium.length}`);
    }

    // Show critical findings first
    if (critical.length > 0) {
      console.log('\n🚨 CRITICAL FINDINGS (Immediate Action Required):');
      critical.forEach((finding, index) => {
        console.log(`${index + 1}. ${finding.type}`);
        console.log(`   Value: ${finding.value}`);
        console.log(`   Location: ${finding.location}`);
        if (finding.file) console.log(`   File: ${finding.file}:${finding.line}`);
        console.log('');
      });
    }

    // Show high severity findings
    if (high.length > 0) {
      console.log('\n🟠 HIGH SEVERITY FINDINGS:');
      high.slice(0, 5).forEach((finding, index) => {
        console.log(`${index + 1}. ${finding.type}`);
        console.log(`   Value: ${finding.value}`);
        if (finding.file) console.log(`   File: ${finding.file}:${finding.line}`);
      });
    }

    // Gitignore status
    console.log('\n📋 .gitignore Status:');
    if (results.gitignoreCheck.hasGitignore) {
      console.log(`   Score: ${results.gitignoreCheck.score}/5`);
      if (results.gitignoreCheck.recommendations.length > 0) {
        console.log('   Recommendations:');
        results.gitignoreCheck.recommendations.forEach(rec => {
          console.log(`     • ${rec}`);
        });
      }
    } else {
      console.log('   🔴 No .gitignore found!');
    }

    // Generate recommendations
    this.generateRecommendations(allFindings, results.gitignoreCheck);
  }

  generateRecommendations(findings, gitignoreCheck) {
    console.log('\n💡 RECOMMENDATIONS');
    console.log('==================\n');

    const recommendations = [];

    // Critical actions
    if (findings.some(f => f.severity === 'critical')) {
      recommendations.push('🚨 IMMEDIATE: Rotate any real secrets found in the repository');
      recommendations.push('🔒 IMMEDIATE: Remove secrets from commit history using git filter-repo');
      recommendations.push('📧 IMMEDIATE: Notify team members about potential secret exposure');
    }

    // General security improvements
    if (findings.length > 0) {
      recommendations.push('🔐 Use environment variables for all secrets');
      recommendations.push('📁 Add .env files to .gitignore');
      recommendations.push('🏗️  Use secret management services (AWS Secrets Manager, Azure Key Vault, etc.)');
    }

    // Gitignore improvements
    if (gitignoreCheck.recommendations.length > 0) {
      recommendations.push('📋 Update .gitignore with recommended patterns');
    }

    // Prevention
    recommendations.push('🪝 Set up pre-commit hooks to scan for secrets');
    recommendations.push('🔍 Run secret scans regularly (weekly/monthly)');
    recommendations.push('📚 Educate team on secret management best practices');

    if (recommendations.length === 0) {
      console.log('🎉 Excellent! Your repository looks secure!');
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    console.log('\n🛠️  Tools to Help:');
    console.log('   • git-secrets: https://github.com/awslabs/git-secrets');
    console.log('   • truffleHog: https://github.com/dxa4481/truffleHog');
    console.log('   • detect-secrets: https://github.com/Yelp/detect-secrets');
    console.log('   • Pre-commit hooks: https://pre-commit.com/');

    console.log('\n📚 Learn More:');
    console.log('   • Secret management: git-audit/educational/secret-management.md');
    console.log('   • Environment variables: git-audit/educational/env-variables.md');
  }

  // Utility method for checking a specific file
  scanFile(filePath) {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return [];
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const findings = [];

    this.secretPatterns.forEach(({ name, pattern, severity }) => {
      pattern.lastIndex = 0;
      let match;
      
      while ((match = pattern.exec(content)) !== null) {
        if (this.isSafePattern(match[0])) continue;
        
        const lineNumber = this.getLineNumber(content, match.index);
        findings.push({
          type: name,
          value: this.maskSecret(match[0]),
          severity,
          line: lineNumber
        });
      }
    });

    return findings;
  }
}

// CLI usage
if (require.main === module) {
  const scanner = new SecretScanner();
  
  const command = process.argv[2];
  
  if (command === 'file' && process.argv[3]) {
    const filePath = process.argv[3];
    console.log(`Scanning file: ${filePath}`);
    const findings = scanner.scanFile(filePath);
    
    if (findings.length === 0) {
      console.log('✅ No secrets found in file');
    } else {
      console.log(`⚠️  Found ${findings.length} potential secrets:`);
      findings.forEach(finding => {
        console.log(`  Line ${finding.line}: ${finding.type} (${finding.severity})`);
        console.log(`    ${finding.value}`);
      });
    }
  } else {
    scanner.scanRepository();
  }
}

module.exports = SecretScanner;