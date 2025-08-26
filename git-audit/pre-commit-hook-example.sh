#!/bin/sh
#
# Git pre-commit hook to check for common issues
# This runs before each commit to catch problems early
#
# To install: chmod +x .git/hooks/pre-commit
# Or use husky for team-wide hooks

echo "🔍 Running pre-commit checks..."

# Check for secrets in staged files
echo "  Checking for secrets..."
node git-audit/secret-scanner.js file $(git diff --staged --name-only) 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Secret detected! Please remove secrets before committing."
    echo "   Use environment variables instead of hardcoded secrets."
    exit 1
fi

# Check commit message format (if COMMIT_EDITMSG exists)
if [ -f .git/COMMIT_EDITMSG ]; then
    echo "  Checking commit message..."
    commit_msg=$(head -n1 .git/COMMIT_EDITMSG)
    
    # Check for conventional commit format or capital letter
    if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?: " && \
       ! echo "$commit_msg" | grep -qE "^[A-Z]"; then
        echo "❌ Commit message should start with capital letter or use conventional format:"
        echo "   feat: add new feature"
        echo "   fix: resolve bug"
        echo "   docs: update documentation"
        echo ""
        echo "   Your message: $commit_msg"
        exit 1
    fi
    
    # Check message length
    if [ ${#commit_msg} -gt 72 ]; then
        echo "❌ Commit message too long (${#commit_msg} chars). Keep under 72 characters."
        echo "   Your message: $commit_msg"
        exit 1
    fi
fi

# Check for large files (>1MB)
echo "  Checking file sizes..."
for file in $(git diff --staged --name-only); do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        if [ $size -gt 1048576 ]; then
            echo "❌ Large file detected: $file ($(($size / 1024))KB)"
            echo "   Consider using Git LFS for large files."
            exit 1
        fi
    fi
done

# Check for debug statements
echo "  Checking for debug statements..."
for file in $(git diff --staged --name-only | grep -E '\.(js|ts|jsx|tsx)$'); do
    if [ -f "$file" ]; then
        if grep -n "console\.log\|debugger\|alert(" "$file"; then
            echo "❌ Debug statements found in $file"
            echo "   Please remove console.log, debugger, or alert statements"
            exit 1
        fi
    fi
done

echo "✅ Pre-commit checks passed!"
exit 0