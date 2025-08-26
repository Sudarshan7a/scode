# Commit Best Practices for Beginners

## What Makes a Good Commit?

A good commit is like a good book chapter - it tells a complete story that makes sense on its own.

### The Golden Rules

1. **One logical change per commit**
   - ✅ `feat: add user login form`
   - ❌ `feat: add login form, fix header bug, update README`

2. **Make it reversible**
   - Each commit should be safe to revert without breaking anything
   - Test your code before committing

3. **Write for your future self**
   - You'll need to understand this change in 6 months
   - Your teammates need to understand it too

## Commit Message Structure

### Format
```
type(scope): short description

Optional longer explanation of what and why vs how.
Can be multiple paragraphs.

Closes #123
```

### Types (Choose One)
- `feat`: new feature
- `fix`: bug fix  
- `docs`: documentation changes
- `style`: formatting, missing semicolons, etc.
- `refactor`: code change that neither fixes a bug nor adds a feature
- `perf`: performance improvement
- `test`: adding missing tests
- `chore`: updating build tasks, package manager configs, etc.

### Examples

#### ✅ Good Examples
```bash
feat(auth): add password reset functionality

Users can now reset their password via email link.
Includes rate limiting to prevent abuse.

Closes #142

---

fix(api): handle null response from user service

The user service sometimes returns null instead of empty object.
Added null check to prevent TypeError in user profile component.

---

docs: update installation instructions

Added troubleshooting section for Windows users.
```

#### ❌ Bad Examples
```bash
# Too vague
update stuff
fix things
changes

# Emotional
oops forgot this
damn bug again
final commit I swear

# Too long first line
feat(auth): add comprehensive user authentication system with password reset email verification rate limiting and session management

# Mixed concerns
feat: add login form, fix header colors, update dependencies
```

## Commit Frequency

### How Often Should You Commit?

**Good rhythm:** Commit every 30 minutes to 2 hours of focused work

**Signs you should commit:**
- ✅ Just implemented one feature/fix
- ✅ All tests are passing
- ✅ Code compiles/builds successfully
- ✅ You're about to switch tasks

**Don't commit when:**
- ❌ Code doesn't compile
- ❌ Tests are failing (unless that's intentional)
- ❌ You're in the middle of refactoring

### Commit Size Guidelines

**Ideal commit size:** 20-100 lines changed
**Maximum recommended:** 300 lines changed

If your commit is larger:
1. Can you break it into logical pieces?
2. Did you mix different types of changes?
3. Should some changes be in separate commits?

## Common Beginner Mistakes

### 1. The "Dump" Commit
```bash
# ❌ Bad
git add .
git commit -m "finished feature"
```

**Problems:**
- No context about what was finished
- Might include unrelated changes
- Difficult to review or revert

**✅ Better:**
```bash
git add src/login-form.tsx src/auth-api.ts
git commit -m "feat(auth): add login form with validation

Includes email/password validation and error handling.
Connects to auth API for user authentication.

Closes #45"
```

### 2. The "WIP" Trap
```bash
# ❌ Bad pattern
git commit -m "wip"
git commit -m "wip again"  
git commit -m "almost done"
git commit -m "final wip"
```

**Problems:**
- No useful information
- Creates messy history
- Hard to find actual changes

**✅ Better approaches:**
1. **Wait until it's ready:**
   ```bash
   # Only commit when feature is complete
   git commit -m "feat: add user profile editing"
   ```

2. **Use meaningful WIP messages:**
   ```bash
   git commit -m "feat(profile): add basic form structure"
   git commit -m "feat(profile): add validation logic"
   git commit -m "feat(profile): connect to API endpoint"
   ```

3. **Squash before merging:**
   ```bash
   # Combine WIP commits into one clean commit
   git rebase -i HEAD~3
   ```

### 3. The "Everything" Commit
```bash
# ❌ Bad
400 files changed, 2000 insertions, 500 deletions
git commit -m "major updates"
```

**Problems:**
- Impossible to review
- Mixes multiple concerns
- Cannot safely revert
- Hides what actually changed

**✅ Better:**
Break into focused commits:
```bash
git commit -m "chore: update dependencies"
git commit -m "refactor: extract user validation helpers"  
git commit -m "feat: add user profile page"
git commit -m "fix: handle edge case in login flow"
```

## Tools to Help

### 1. Git Hooks (Automated Checks)
```bash
# Install pre-commit hook to check messages
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Check before committing
git add .
git commit -m "my message"  # Will be checked automatically
```

### 2. IDE Extensions
- **VS Code:** "Conventional Commits" extension
- **IntelliJ:** Built-in commit message templates

### 3. Git Aliases
```bash
# Add to ~/.gitconfig
[alias]
    c = commit -m
    ca = commit -am
    co = checkout
    st = status
    
# Usage
git c "feat: add new feature"
```

## Practice Exercise

Try improving these commit messages:

1. `fix stuff` → ?
2. `add feature` → ?
3. `updates` → ?
4. `oops` → ?

**Sample answers:**
1. `fix(auth): handle expired token error`
2. `feat(dashboard): add activity timeline widget`  
3. `docs: update API documentation with new endpoints`
4. `fix(ui): correct button alignment in mobile view`

## Next Steps

1. **Read your old commits** - What would confuse you now?
2. **Use conventional commits** - Start with `feat:` and `fix:`
3. **Review before committing** - Does this tell a clear story?
4. **Practice daily** - Good habits take time to develop

Remember: Great commits are a gift to your future self and your team!