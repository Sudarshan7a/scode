#!/bin/bash

# Git Audit System Demo
# This script demonstrates all the features of the Git audit system

echo "🎯 Git Repository Hygiene Audit System Demo"
echo "============================================="
echo ""

echo "📋 Available Commands:"
echo "  npm run audit:git      # Complete audit (recommended)"
echo "  npm run audit:commits  # Analyze commit patterns"
echo "  npm run audit:branches # Check branch strategy"
echo "  npm run audit:secrets  # Scan for secrets"
echo ""

echo "🔍 Running Complete Audit..."
echo "----------------------------"
npm run audit:git
echo ""

echo "🌟 Specialized Tools Examples:"
echo "------------------------------"

echo ""
echo "📝 Branch Name Suggestions:"
echo "  node git-audit/branch-checker.js suggest 'add user dashboard' feature"
node git-audit/branch-checker.js suggest "add user dashboard" feature

echo "  node git-audit/branch-checker.js suggest 'fix login error' fix"  
node git-audit/branch-checker.js suggest "fix login error" fix

echo ""
echo "🔐 Secret Scanner for Specific File:"
echo "  node git-audit/secret-scanner.js file package.json"
node git-audit/secret-scanner.js file package.json

echo ""
echo "📊 Educational Resources Available:"
echo "----------------------------------"
echo "📚 Learning Materials:"
echo "  • git-audit/educational/learning-path.md - 30-day improvement plan"
echo "  • git-audit/educational/commit-best-practices.md - How to write great commits"
echo "  • git-audit/educational/branching-strategies.md - Branch naming and workflows"
echo "  • git-audit/educational/secret-management.md - Prevent credential leaks"
echo "  • git-audit/educational/examples-and-fixes.md - Real scenarios and solutions"
echo ""

echo "🛠️ Integration Examples:"
echo "------------------------"
echo "  • git-audit/pre-commit-hook-example.sh - Automated pre-commit checks"
echo "  • Package.json scripts for easy execution"
echo "  • CI/CD integration examples in documentation"
echo ""

echo "📈 Reports and Tracking:"
echo "-----------------------"
echo "  • JSON reports saved in git-audit/reports/"
echo "  • Track progress over time"
echo "  • Share team results and goals"
echo ""

if [ -f "git-audit/reports/audit-$(date +%Y-%m-%d).json" ]; then
    echo "📄 Today's Report Summary:"
    node -e "
        const fs = require('fs');
        const report = JSON.parse(fs.readFileSync('git-audit/reports/audit-$(date +%Y-%m-%d).json'));
        const scores = Object.values(report.results).map(r => r.score || 0);
        const total = scores.reduce((a, b) => a + b, 0);
        const average = (total / scores.length).toFixed(1);
        console.log(\`   📊 Average Score: \${average}/5\`);
        console.log(\`   📈 Total: \${total}/30\`);
        console.log(\`   🎯 Grade: \${total >= 24 ? 'A' : total >= 21 ? 'B' : total >= 18 ? 'C' : total >= 15 ? 'D' : 'F'}\`);
    "
fi

echo ""
echo "🚀 Getting Started:"
echo "------------------"
echo "1. Run 'npm run audit:git' to see your current scores"
echo "2. Focus on areas with lowest scores first"
echo "3. Read the educational materials for improvement tips"
echo "4. Set up automation with pre-commit hooks"
echo "5. Track progress weekly and celebrate improvements!"
echo ""

echo "💡 Pro Tips:"
echo "------------"
echo "• Start with secret safety - it's the most critical"
echo "• Use conventional commits (feat:, fix:, docs:) for better messages"
echo "• Create feature branches instead of working on main"
echo "• Make small, focused commits frequently"
echo "• Link commits to issues when possible (#123)"
echo ""

echo "🎓 Learning Path:"
echo "----------------"
echo "Week 1: Secret safety and basic commit hygiene"
echo "Week 2: Branch strategy and message quality"  
echo "Week 3: Consistency and team practices"
echo "Week 4: Automation and advanced workflows"
echo ""

echo "✨ Happy Git Hygiene Improvement! ✨"