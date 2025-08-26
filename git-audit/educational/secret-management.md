# Secret Management for Developers

## What Are Secrets?

**Secrets** are sensitive pieces of information that should never be publicly visible:

- 🔑 API keys (Google Maps, Stripe, AWS)
- 🔐 Database passwords and connection strings
- 🎫 Authentication tokens (JWT secrets, OAuth tokens)
- 🔗 Service URLs with embedded credentials
- 📧 Email service credentials
- 🛡️ Encryption keys and certificates

## Why Secret Management Matters

### The Nightmare Scenario
```bash
# ❌ This actually happened to real developers:
git add .
git commit -m "add payment integration"
git push origin main

# 3 minutes later...
# 💸 $2,400 charged to AWS account by crypto miners
# 🚨 GitHub automated email: "Secret detected in your repository"
```

### Real Consequences
- **Financial loss**: Unauthorized usage of paid services
- **Data breaches**: Access to your databases and user data
- **Reputation damage**: Customer trust and company credibility
- **Legal issues**: GDPR violations, compliance failures
- **Security incidents**: Full system compromise

## How Secrets Leak Into Git

### 1. Direct Hardcoding
```javascript
// ❌ NEVER DO THIS
const API_KEY = "sk_live_1234567890abcdef...";
const DATABASE_URL = "mongodb://user:password@cluster.mongodb.net/mydb";

// ❌ Also bad in config files
{
  "apiKey": "your-secret-api-key",
  "dbPassword": "super-secret-password"
}
```

### 2. Accidental .env Commits
```bash
# ❌ Common mistake
git add .  # This includes .env file!
git commit -m "add environment config"
```

### 3. Debugging and Testing
```javascript
// ❌ Left in code after debugging
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("DB connection:", connectionString);

// ❌ Test files with real credentials
const testConfig = {
  apiKey: "sk_test_real_key_here"  // Should be mock!
};
```

### 4. Copy-Paste from Documentation
```javascript
// ❌ Copied example from docs with real key
const stripe = require('stripe')('sk_live_your_key_here');
```

## The Right Way: Environment Variables

### 1. Use .env Files (Locally)
```bash
# .env file (NEVER commit this file)
API_KEY=your-secret-api-key
DATABASE_URL=mongodb://user:password@cluster.mongodb.net/mydb
JWT_SECRET=your-super-secure-jwt-secret
STRIPE_SECRET_KEY=sk_live_1234567890abcdef
```

### 2. Reference in Code
```javascript
// ✅ Correct way
const API_KEY = process.env.API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

// ✅ With validation
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
```

### 3. Create .env.example
```bash
# .env.example (safe to commit)
API_KEY=your-api-key-here
DATABASE_URL=your-database-url-here
JWT_SECRET=your-jwt-secret-here
STRIPE_SECRET_KEY=your-stripe-secret-key-here
```

### 4. Update .gitignore
```bash
# .gitignore
.env
.env.local
.env.production
*.key
*.pem
config/secrets.json
```

## Different Environments

### Development (Your Computer)
```bash
# .env.development
API_KEY=dev_key_safe_to_lose
DATABASE_URL=mongodb://localhost:27017/myapp_dev
JWT_SECRET=development-secret-not-secure
```

### Production (Deployment)
```bash
# Set via hosting platform (Vercel, Netlify, Heroku)
# OR via CI/CD pipeline
# OR via cloud secret managers

# Never in code or committed files!
```

### CI/CD Pipeline
```yaml
# GitHub Actions example
env:
  API_KEY: ${{ secrets.API_KEY }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Gitignore Best Practices

### Essential Patterns
```bash
# Environment files
.env
.env.local
.env.development
.env.production
.env.test
.env.*.local

# Credential files
*.key
*.pem
*.p12
*.crt
*.csr
*.pfx

# Config with secrets
config/secrets.*
config/database.yml
config/production.json

# IDE and OS files that might contain secrets
.vscode/settings.json
.idea/
*.swp
*.swo

# Cloud provider configs
.aws/credentials
.azure/
.gcloud/

# Application-specific
/secrets/
/private/
auth.json
credentials.json
```

### Template .gitignore
```bash
# Dependencies
node_modules/
vendor/

# Build outputs
dist/
build/
*.log

# Environment and secrets
.env*
!.env.example
*.key
*.pem
config/secrets.*

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Application specific
/uploads/
/storage/app/
```

## Secret Detection Tools

### 1. Pre-commit Hooks
```bash
# Install git-secrets
npm install --save-dev git-secrets

# Set up hooks
git secrets --register-aws
git secrets --install

# Manual scan
git secrets --scan
```

### 2. GitHub Secret Scanning
- Automatically scans public repos
- Notifies you when secrets are detected
- Partners with services to auto-revoke tokens

### 3. Third-party Tools
```bash
# truffleHog - finds secrets in commit history
pip install truffleHog
truffleHog --regex --entropy=False https://github.com/user/repo.git

# detect-secrets - baseline scanner
pip install detect-secrets
detect-secrets scan --all-files .
```

## What to Do If You Leaked a Secret

### Immediate Actions (Do ALL of these)

1. **Revoke the secret immediately**
   - Change API keys
   - Rotate passwords
   - Generate new tokens

2. **Remove from current files**
   ```bash
   # Remove from code
   git add .
   git commit -m "remove leaked credentials"
   ```

3. **Clean commit history**
   ```bash
   # Use git filter-repo (preferred)
   pip install git-filter-repo
   git filter-repo --invert-paths --path secrets.txt
   
   # Or BFG Repo Cleaner
   java -jar bfg.jar --delete-files secrets.txt
   ```

4. **Force push cleaned history**
   ```bash
   git push --force-with-lease origin main
   ```

5. **Notify team members**
   - Tell them to reclone the repository
   - Update any deployed instances

6. **Monitor for unauthorized usage**
   - Check service logs
   - Monitor billing/usage
   - Set up alerts

### Prevention for Next Time
```bash
# Add to .gitignore
echo "secrets.txt" >> .gitignore

# Set up pre-commit hooks
npm install --save-dev @commitlint/cli husky
npx husky add .husky/pre-commit "npm run check-secrets"
```

## Service-Specific Guidelines

### AWS
```bash
# ❌ Never commit
aws_access_key_id = AKIA1234567890
aws_secret_access_key = abcdef1234567890

# ✅ Use IAM roles in production
# ✅ Use aws configure for local development
# ✅ Use environment variables
```

### Database Connections
```javascript
// ❌ Never hardcode
const db = mongoose.connect('mongodb://user:pass@host:port/db');

// ✅ Use environment variables
const db = mongoose.connect(process.env.DATABASE_URL);

// ✅ Use connection pools and secrets managers in production
```

### API Keys
```javascript
// ❌ Never hardcode
const stripe = Stripe('sk_live_real_key');

// ✅ Environment variables
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Validate existence
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}
```

## Advanced Secret Management

### 1. Secret Management Services
- **AWS Secrets Manager** - Automatic rotation
- **Azure Key Vault** - Enterprise-grade
- **Google Secret Manager** - GCP integration
- **HashiCorp Vault** - Self-hosted solution

### 2. Encrypted Environment Files
```bash
# Use tools like:
# - sops (Mozilla)
# - ansible-vault
# - git-crypt

# Example with sops
sops -e .env > .env.encrypted
git add .env.encrypted  # Safe to commit
```

### 3. Runtime Secret Injection
```dockerfile
# Docker secrets
# Don't bake secrets into images
FROM node:16
COPY . .
# Secrets mounted at runtime via orchestrator
```

## Common Mistakes and Solutions

### Mistake 1: "It's just a dev key"
```bash
# ❌ Bad thinking
"This is just a development API key, it's fine to commit"

# ✅ Good practice
# Even dev keys can be abused or accidentally promoted to production
# Always use environment variables
```

### Mistake 2: "I'll remove it in the next commit"
```bash
# ❌ Bad approach
git commit -m "add feature with API key"  # Secret committed!
git commit -m "remove API key"            # Too late, it's in history

# ✅ Good practice
# Use environment variables from the start
# Never commit secrets, even temporarily
```

### Mistake 3: "It's a private repo"
```bash
# ❌ False security
"Our repo is private, so secrets are safe"

# ✅ Reality check
# - Repos can become public
# - Team members come and go
# - Backups might not be secure
# - Always assume repositories might be compromised
```

## Quick Checklist

Before every commit:

- [ ] No hardcoded API keys or passwords
- [ ] .env files are gitignored
- [ ] No console.log with sensitive data
- [ ] All secrets use environment variables
- [ ] .env.example is up to date
- [ ] No commented-out code with secrets

## Resources

### Tools
- [git-secrets](https://github.com/awslabs/git-secrets)
- [truffleHog](https://github.com/dxa4481/truffleHog)
- [detect-secrets](https://github.com/Yelp/detect-secrets)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

### Services
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)
- [Google Secret Manager](https://cloud.google.com/secret-manager)

### Learning
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [12-Factor App Config](https://12factor.net/config)

Remember: **When in doubt, don't commit it!** It's always easier to prevent a leak than to clean up after one.