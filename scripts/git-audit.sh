#!/bin/bash

# Git Repository Audit Script
# Evaluates repository health and identifies beginner mistakes

echo "🔍 Git Repository Audit Tool"
echo "============================"
echo ""

# Color codes for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize score
total_score=0
max_score=100

echo_score() {
    local category="$1"
    local score="$2"
    local max="$3"
    local color=""
    
    if [ $score -ge 4 ]; then
        color=$GREEN
    elif [ $score -ge 3 ]; then
        color=$YELLOW
    else
        color=$RED
    fi
    
    echo -e "${color}${category}: ${score}/${max}${NC}"
}

# 1. Commit History Analysis
echo -e "${BLUE}📊 COMMIT HISTORY ANALYSIS${NC}"
echo "=============================="

echo ""
echo "Recent 30 commits:"
git log --oneline --decorate --graph -n 30

echo ""
echo "Commit statistics (last 60 days):"
git log --shortstat --since="60 days ago"

echo ""
echo "Formatted commit log (last 50):"
git log --format="%h%x09%an%x09%ad%x09%s" --date=short -n 50

# Analyze commit frequency
commit_count=$(git log --since="30 days ago" --oneline | wc -l)
echo ""
echo "📈 Commits in last 30 days: $commit_count"

commit_hygiene_score=3
if [ $commit_count -gt 100 ]; then
    echo "⚠️  Very high commit frequency - consider atomic commits"
    commit_hygiene_score=2
elif [ $commit_count -eq 0 ]; then
    echo "⚠️  No commits in 30 days - inactive project"
    commit_hygiene_score=1
else
    echo "✅ Reasonable commit frequency"
    commit_hygiene_score=4
fi

# 2. Branch Analysis
echo ""
echo -e "${BLUE}🌳 BRANCH ANALYSIS${NC}"
echo "==================="

echo ""
echo "All branches:"
git branch -a

branch_count=$(git branch -r | wc -l)
current_branch=$(git branch --show-current)

echo ""
echo "📋 Current branch: $current_branch"
echo "📋 Total remote branches: $branch_count"

branch_score=3
if [[ $current_branch == "master" || $current_branch == "main" ]]; then
    echo "⚠️  Working directly on main/master branch"
    branch_score=2
elif [[ $current_branch == *"feature/"* || $current_branch == *"fix/"* || $current_branch == *"feat/"* ]]; then
    echo "✅ Good branch naming convention"
    branch_score=5
else
    echo "⚠️  Consider using feature/ or fix/ branch prefixes"
    branch_score=3
fi

# 3. Commit Message Quality Analysis
echo ""
echo -e "${BLUE}💬 COMMIT MESSAGE ANALYSIS${NC}"
echo "============================"

# Analyze recent commit messages
echo ""
echo "Analyzing commit message quality..."

conventional_commits=0
bad_messages=0
total_commits=0

while IFS= read -r line; do
    if [[ -n "$line" ]]; then
        total_commits=$((total_commits + 1))
        
        # Check for conventional commit format
        if [[ $line =~ ^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: ]]; then
            conventional_commits=$((conventional_commits + 1))
        fi
        
        # Check for bad message patterns
        if [[ $line =~ ^(WIP|wip|temp|temporary|fix|update|changes|misc|oops|again|final|test) ]]; then
            bad_messages=$((bad_messages + 1))
            echo "❌ Poor message: $line"
        fi
    fi
done < <(git log --format="%s" -n 20)

message_score=3
if [ $total_commits -gt 0 ]; then
    conventional_ratio=$((conventional_commits * 100 / total_commits))
    bad_ratio=$((bad_messages * 100 / total_commits))
    
    echo "📊 Conventional commits: $conventional_commits/$total_commits ($conventional_ratio%)"
    echo "📊 Poor messages: $bad_messages/$total_commits ($bad_ratio%)"
    
    if [ $conventional_ratio -gt 80 ]; then
        message_score=5
        echo "✅ Excellent commit message quality"
    elif [ $conventional_ratio -gt 50 ]; then
        message_score=4
        echo "✅ Good commit message quality"
    elif [ $bad_ratio -gt 30 ]; then
        message_score=1
        echo "❌ Many poor commit messages"
    else
        message_score=3
        echo "⚠️  Average commit message quality"
    fi
fi

# 4. Security Audit
echo ""
echo -e "${BLUE}🔒 SECURITY AUDIT${NC}"
echo "=================="

echo ""
echo "Checking for exposed secrets..."

secrets_found=0
if git log -p -n 50 | grep -qi 'api_key\|secret\|token\|password.*='; then
    echo "❌ Potential secrets found in commit history!"
    git log -p -n 50 | grep -i 'api_key\|secret\|token\|password.*=' | head -5
    secrets_found=1
else
    echo "✅ No obvious secrets in recent commit history"
fi

security_score=5
if [ $secrets_found -eq 1 ]; then
    security_score=1
fi

# 5. File Structure and Artifacts
echo ""
echo -e "${BLUE}📁 FILE STRUCTURE AUDIT${NC}"
echo "========================"

echo ""
echo "Checking for build artifacts..."

artifacts_score=5
if find . -name "node_modules" -o -name "dist" -o -name ".next" -o -name "build" | grep -v ".git" | head -1 >/dev/null; then
    echo "❌ Build artifacts found in repository"
    find . -name "node_modules" -o -name "dist" -o -name ".next" -o -name "build" | grep -v ".git" | head -5
    artifacts_score=2
else
    echo "✅ No build artifacts in repository"
fi

echo ""
echo "Checking .gitignore coverage..."
if [ -f ".gitignore" ]; then
    echo "✅ .gitignore file exists"
    gitignore_score=4
    
    # Check for common patterns
    if grep -q "node_modules\|\.env\|dist\|build" .gitignore; then
        echo "✅ Good .gitignore patterns found"
        gitignore_score=5
    fi
else
    echo "❌ No .gitignore file"
    gitignore_score=1
fi

# 6. Documentation Quality
echo ""
echo -e "${BLUE}📚 DOCUMENTATION AUDIT${NC}"
echo "======================="

docs_score=3
if [ -f "README.md" ]; then
    echo "✅ README.md exists"
    docs_score=4
    
    readme_size=$(wc -l < README.md)
    if [ $readme_size -gt 50 ]; then
        echo "✅ Comprehensive README ($readme_size lines)"
        docs_score=5
    fi
else
    echo "❌ No README.md file"
    docs_score=1
fi

if [ -f "CONTRIBUTING.md" ]; then
    echo "✅ CONTRIBUTING.md exists"
    docs_score=$((docs_score + 1))
fi

# 7. Calculate Final Score
echo ""
echo -e "${BLUE}📊 FINAL SCORING${NC}"
echo "=================="

echo ""
echo_score "Commit Hygiene" $commit_hygiene_score 5
echo_score "Branch Strategy" $branch_score 5
echo_score "Message Quality" $message_score 5
echo_score "Security" $security_score 5
echo_score "File Structure" $artifacts_score 5
echo_score ".gitignore" $gitignore_score 5
echo_score "Documentation" $docs_score 5

total_score=$((commit_hygiene_score + branch_score + message_score + security_score + artifacts_score + gitignore_score + docs_score))
max_score=35

percentage=$((total_score * 100 / max_score))

echo ""
echo "=============================="
echo -e "🏆 OVERALL SCORE: ${total_score}/${max_score} (${percentage}%)"

if [ $percentage -ge 80 ]; then
    echo -e "${GREEN}🌟 EXCELLENT - Exemplary repository hygiene!${NC}"
elif [ $percentage -ge 60 ]; then
    echo -e "${YELLOW}👍 GOOD - Minor improvements needed${NC}"
else
    echo -e "${RED}⚠️  NEEDS WORK - Several issues to address${NC}"
fi
echo "=============================="

echo ""
echo -e "${BLUE}📋 RECOMMENDATIONS${NC}"
echo "==================="

if [ $commit_hygiene_score -lt 4 ]; then
    echo "• Improve commit frequency and atomicity"
fi

if [ $branch_score -lt 4 ]; then
    echo "• Use feature/ and fix/ branch naming convention"
    echo "• Avoid working directly on main/master"
fi

if [ $message_score -lt 4 ]; then
    echo "• Adopt Conventional Commits format"
    echo "• Avoid vague commit messages like 'fix', 'update', 'WIP'"
fi

if [ $security_score -lt 4 ]; then
    echo "• Remove secrets from commit history using git filter-repo"
    echo "• Add .env* to .gitignore"
fi

if [ $artifacts_score -lt 4 ]; then
    echo "• Remove build artifacts from repository"
    echo "• Update .gitignore to exclude build outputs"
fi

echo ""
echo "📖 For detailed best practices, see: docs/git-best-practices.md"
echo "🛠️  For setup guides, see: docs/development-setup.md"