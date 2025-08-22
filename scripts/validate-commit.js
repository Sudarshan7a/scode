#!/usr/bin/env node

/**
 * Commit Message Validator
 * Validates commit messages against conventional commit standards
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

// Valid commit types
const validTypes = [
  'feat',     // New feature
  'fix',      // Bug fix
  'docs',     // Documentation only changes
  'style',    // Changes that do not affect the meaning of the code
  'refactor', // Code change that neither fixes a bug nor adds a feature
  'perf',     // Code change that improves performance
  'test',     // Adding missing tests or correcting existing tests
  'chore',    // Changes to the build process or auxiliary tools
  'ci',       // Changes to CI configuration files and scripts
  'build',    // Changes that affect the build system or external dependencies
  'revert'    // Reverts a previous commit
];

// Common scopes (can be customized per project)
const commonScopes = [
  'auth', 'api', 'ui', 'db', 'config', 'deps', 'core', 'utils', 'tests', 'docs'
];

// Bad message patterns to avoid
const badPatterns = [
  /^(wip|WIP)/i,
  /^(temp|temporary)/i,
  /^(fix|update|change)$/i,
  /^(oops|again|final)/i,
  /^(misc|stuff)/i,
  /^\./,
  /^$/
];

class CommitValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
  }

  validate(message) {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];

    const lines = message.trim().split('\n');
    const header = lines[0];

    // Validate header format
    this.validateHeader(header);
    
    // Validate body if present
    if (lines.length > 1) {
      this.validateBody(lines.slice(1));
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions
    };
  }

  validateHeader(header) {
    // Check length
    if (header.length > 72) {
      this.errors.push(`Header too long (${header.length} chars). Keep under 72 characters.`);
    }

    if (header.length < 10) {
      this.warnings.push('Header is quite short. Consider adding more detail.');
    }

    // Check for bad patterns
    badPatterns.forEach(pattern => {
      if (pattern.test(header)) {
        this.errors.push(`Avoid vague commit messages. "${header}" doesn't provide useful information.`);
      }
    });

    // Parse conventional commit format
    const conventionalRegex = /^(\w+)(\(.+\))?: (.+)$/;
    const match = header.match(conventionalRegex);

    if (!match) {
      this.errors.push('Header should follow format: type(scope): description');
      this.suggestions.push('Example: feat(auth): add user login validation');
      return;
    }

    const [, type, scope, description] = match;

    // Validate type
    if (!validTypes.includes(type)) {
      this.errors.push(`Invalid type "${type}". Valid types: ${validTypes.join(', ')}`);
    }

    // Validate scope
    if (scope) {
      const scopeName = scope.slice(1, -1); // Remove parentheses
      if (scopeName.length === 0) {
        this.warnings.push('Empty scope. Either remove parentheses or add a scope.');
      } else if (!commonScopes.includes(scopeName)) {
        this.warnings.push(`Unusual scope "${scopeName}". Common scopes: ${commonScopes.join(', ')}`);
      }
    }

    // Validate description
    if (description[0] !== description[0].toLowerCase()) {
      this.warnings.push('Description should start with lowercase letter.');
    }

    if (description.endsWith('.')) {
      this.warnings.push('Description should not end with a period.');
    }

    // Check for imperative mood
    const nonImperativePatterns = [
      /^(added|adds|adding)/i,
      /^(fixed|fixes|fixing)/i,
      /^(updated|updates|updating)/i,
      /^(removed|removes|removing)/i,
      /^(changed|changes|changing)/i
    ];

    nonImperativePatterns.forEach(pattern => {
      if (pattern.test(description)) {
        this.warnings.push('Use imperative mood: "add" not "added", "fix" not "fixed"');
      }
    });

    // Provide suggestions for improvement
    if (type === 'feat') {
      this.suggestions.push('Good! New features help users understand what changed.');
    } else if (type === 'fix') {
      this.suggestions.push('Consider adding the issue number if this fixes a bug: "fix(api): handle null response (fixes #123)"');
    }
  }

  validateBody(bodyLines) {
    bodyLines.forEach((line, index) => {
      if (line.length > 100) {
        this.warnings.push(`Body line ${index + 2} is too long (${line.length} chars). Keep under 100 characters.`);
      }
    });

    // Check for useful body content
    const bodyText = bodyLines.join(' ').trim();
    if (bodyText.length > 0 && bodyText.length < 20) {
      this.warnings.push('Body is quite short. Consider explaining the "why" behind the change.');
    }
  }
}

function printResult(result, message) {
  console.log(`\n${colors.blue}🔍 Commit Message Validation${colors.reset}`);
  console.log('='.repeat(40));
  
  console.log(`\n${colors.cyan}Message:${colors.reset}`);
  console.log(`"${message}"`);

  if (result.valid) {
    console.log(`\n${colors.green}✅ Valid commit message!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ Invalid commit message${colors.reset}`);
  }

  if (result.errors.length > 0) {
    console.log(`\n${colors.red}Errors:${colors.reset}`);
    result.errors.forEach(error => {
      console.log(`  • ${error}`);
    });
  }

  if (result.warnings.length > 0) {
    console.log(`\n${colors.yellow}Warnings:${colors.reset}`);
    result.warnings.forEach(warning => {
      console.log(`  • ${warning}`);
    });
  }

  if (result.suggestions.length > 0) {
    console.log(`\n${colors.cyan}Suggestions:${colors.reset}`);
    result.suggestions.forEach(suggestion => {
      console.log(`  💡 ${suggestion}`);
    });
  }

  console.log(`\n${colors.blue}Examples of good commit messages:${colors.reset}`);
  console.log('  feat(auth): add user registration with email verification');
  console.log('  fix(api): handle edge case in user data parsing');
  console.log('  docs(readme): add installation instructions');
  console.log('  refactor(utils): extract validation helper functions');
  console.log('  chore(deps): update React to version 18.2.0');

  console.log(`\n${colors.magenta}For more help, see: docs/git-best-practices.md${colors.reset}`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/validate-commit.js "commit message"');
    console.log('   or: node scripts/validate-commit.js --file commit-msg-file');
    process.exit(1);
  }

  let message;
  
  if (args[0] === '--file') {
    // Read from file (used by git hook)
    const filepath = args[1];
    if (!fs.existsSync(filepath)) {
      console.error(`File not found: ${filepath}`);
      process.exit(1);
    }
    message = fs.readFileSync(filepath, 'utf8').trim();
  } else {
    // Read from command line argument
    message = args.join(' ');
  }

  const validator = new CommitValidator();
  const result = validator.validate(message);
  
  printResult(result, message);
  
  // Exit with error code if validation failed
  process.exit(result.valid ? 0 : 1);
}

// Export for testing
if (require.main === module) {
  main();
} else {
  module.exports = CommitValidator;
}