# Branching Strategies for Beginners

## Why Use Branches?

Think of branches as parallel universes for your code:
- **Main branch**: The stable, working version
- **Feature branches**: Experimental changes that might break things
- **Bug fix branches**: Isolated fixes that won't interfere with new features

## Basic Concepts

### Default Branch Names
- **`main`** (modern standard) or **`master`** (traditional)
- This contains your stable, deployable code
- Never work directly on this branch!

### Branch Types
```
main                    ← Stable code
├── feature/user-auth   ← New feature
├── fix/login-bug      ← Bug fix
└── chore/update-deps  ← Maintenance
```

## Simple Workflow for Beginners

### 1. Before Starting Work
```bash
# Make sure you're on main and it's up to date
git checkout main
git pull origin main

# Create a new branch for your work
git checkout -b feature/your-feature-name
```

### 2. Work on Your Feature
```bash
# Make changes, commit regularly
git add .
git commit -m "feat: add login form"
git commit -m "feat: add form validation"

# Push your branch (first time)
git push -u origin feature/your-feature-name

# Push updates
git push
```

### 3. When Feature is Complete
```bash
# Switch back to main
git checkout main

# Pull latest changes
git pull origin main

# Merge your feature
git merge feature/your-feature-name

# Push the updated main
git push origin main

# Clean up (optional)
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

## Branch Naming Conventions

### Good Patterns
```bash
# Type/description format
feature/user-authentication
feature/shopping-cart
feature/email-notifications

fix/login-error
fix/header-styling
fix/database-connection

chore/update-dependencies
chore/cleanup-old-files
chore/improve-documentation

docs/api-reference
docs/installation-guide
```

### Bad Patterns
```bash
# ❌ Too vague
test
temp
new
patch
fix

# ❌ Contains spaces
feature/user authentication
fix/login error

# ❌ Uses underscores or capitals
feature/User_Authentication
FIX/LoginError

# ❌ Too short
f1
x
bugfix
```

### Rules for Good Branch Names
1. **Use lowercase with hyphens** (kebab-case)
2. **Include the type** (feature/, fix/, chore/)
3. **Be descriptive** but not too long
4. **No spaces or special characters**
5. **Maximum 50 characters**

## Common Branching Strategies

### 1. Feature Branch Workflow (Recommended for Beginners)
```
main
├── feature/search-functionality  ← You work here
├── feature/user-profiles         ← Teammate works here  
└── fix/broken-navigation        ← Another fix
```

**When to use:** Small teams, simple projects

**Pros:**
- Simple to understand
- Each feature is isolated
- Easy to revert changes

### 2. Git Flow (For Larger Projects)
```
main                    ← Production-ready code
├── develop            ← Integration branch
│   ├── feature/login  ← Features merge here first
│   └── feature/cart   
└── hotfix/urgent-bug  ← Emergency fixes
```

**When to use:** Larger teams, release cycles

### 3. GitHub Flow (Simplified)
```
main
├── feature-branch-1   ← Create PR when ready
├── feature-branch-2   ← Create PR when ready
└── hotfix-branch      ← Create PR when ready
```

**When to use:** Continuous deployment, GitHub/GitLab

## Beginner Mistakes to Avoid

### 1. Working Directly on Main
```bash
# ❌ Bad
git checkout main
git add .
git commit -m "add new feature"
```

**Problems:**
- Unstable code on main branch
- Hard to collaborate
- Difficult to revert

**✅ Better:**
```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
```

### 2. Creating Too Many Branches
```bash
# ❌ Bad - too many branches for one person
feature/login
feature/login-styling  
feature/login-validation
feature/login-testing
```

**✅ Better:**
```bash
# One branch per logical feature
feature/user-authentication
```

### 3. Forgetting to Switch Branches
```bash
# ❌ Bad - committing to wrong branch
git checkout main
# ... make changes ...
git commit -m "work in progress"  # Oops, on main!
```

**✅ Better:**
```bash
# Always check which branch you're on
git branch  # Shows current branch with *
git status  # Also shows current branch
```

### 4. Not Pulling Before Creating Branch
```bash
# ❌ Bad
git checkout -b feature/new-feature  # Based on old main
```

**✅ Better:**
```bash
git checkout main
git pull origin main  # Get latest changes
git checkout -b feature/new-feature
```

## Branch Management Commands

### Essential Commands
```bash
# See all branches
git branch -a

# See current branch
git branch
git status

# Create and switch to new branch
git checkout -b branch-name

# Switch between branches
git checkout branch-name

# Delete local branch (after merging)
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Rename current branch
git branch -m new-branch-name
```

### Useful Aliases
Add to your `~/.gitconfig`:
```bash
[alias]
    co = checkout
    cb = checkout -b
    br = branch
    st = status
    
# Usage
git cb feature/new-feature  # Create and switch
git co main                # Switch to main
git br                    # List branches
```

## Visual Tools

### Command Line
```bash
# See branch structure
git log --oneline --graph --all

# Example output:
* a1b2c3d (feature/login) feat: add login form
* e4f5g6h (main) fix: header styling
* i7j8k9l docs: update README
```

### GUI Tools
- **GitHub Desktop** - Beginner-friendly
- **SourceTree** - Visual branching
- **VS Code** - Built-in Git support
- **GitKraken** - Beautiful branch visualization

## Practice Exercise

Try this workflow:

1. Create a branch for adding a contact form:
   ```bash
   git checkout -b feature/contact-form
   ```

2. Make some commits:
   ```bash
   echo "Contact form HTML" > contact.html
   git add contact.html
   git commit -m "feat: add contact form structure"
   
   echo "/* Contact form styles */" > contact.css
   git add contact.css  
   git commit -m "style: add contact form styling"
   ```

3. Merge back to main:
   ```bash
   git checkout main
   git merge feature/contact-form
   ```

4. Clean up:
   ```bash
   git branch -d feature/contact-form
   ```

## When Things Go Wrong

### Help! I'm on the Wrong Branch
```bash
# If you haven't committed yet
git stash                    # Save your changes
git checkout correct-branch  # Switch to right branch
git stash pop               # Restore your changes

# If you already committed
git checkout correct-branch
git cherry-pick commit-hash  # Move the commit
git checkout wrong-branch
git reset --hard HEAD~1     # Remove from wrong branch
```

### Help! I Need to Switch Branches but Have Uncommitted Changes
```bash
# Option 1: Commit your work
git add .
git commit -m "wip: save progress"

# Option 2: Stash your work
git stash
git checkout other-branch
# ... do other work ...
git checkout original-branch
git stash pop
```

## Next Steps

1. **Practice** the feature branch workflow
2. **Use descriptive** branch names
3. **Clean up** old branches regularly
4. **Learn about** pull requests/merge requests
5. **Explore** GitFlow when ready for more complexity

Remember: Branches are cheap and safe - use them liberally!