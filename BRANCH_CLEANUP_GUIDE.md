# Branch Cleanup Guide

## Current Situation

**Branch:** `feature/datetime-picker-and-cookie-utils` (misleading name)
**Actual Changes:** Enhanced date-time picker UI with dropdown navigation

### Modified Files:
- ✅ `components/custom/schedule/fields/DateTimePicker.tsx` (NEW)
- ✅ `components/custom/schedule/fields/ScheduleFields.tsx`
- ✅ `components/ui/calendar.tsx` (major upgrade)
- ✅ `components/ui/button.tsx`
- ✅ `components/ui/popover.tsx`
- ✅ `package.json` + `pnpm-lock.yaml`

### What Changed:
1. **DateTimePicker Component** - New reusable date/time picker with calendar dropdown
2. **Calendar Enhancement** - Added month/year dropdown navigation (captionLayout="dropdown")
3. **Better UX** - Improved room scheduling interface
4. **UI Polish** - Updated button and popover styling

---

## Quick Fix (Recommended)

Run the simple script:
```bash
.\rename-branch-and-commits.bat
```

This will:
1. ✅ Commit current changes with proper message
2. ✅ Rename branch to `feature/enhanced-datetime-picker`
3. ✅ Keep all history intact

---

## Advanced Fix (If you want to rewrite old commits)

Run the advanced script:
```bash
.\advanced-branch-cleanup.bat
```

This will:
1. ✅ Commit current changes
2. ✅ Rename branch
3. ✅ Open interactive rebase to reword old commits

### In Interactive Rebase:
- Change `pick` to `reword` for commits you want to rename
- Save and close
- Git will prompt you to edit each commit message

---

## Manual Steps (If scripts don't work)

### 1. Commit Current Changes
```bash
git add .
git commit -m "feat(ui): enhance date-time picker with dropdown navigation"
```

### 2. Rename Branch
```bash
git branch -m feature/datetime-picker-and-cookie-utils feature/enhanced-datetime-picker
```

### 3. (Optional) Rewrite Old Commits
```bash
git rebase -i HEAD~5
```
Change `pick` to `reword` for commits to rename, then save.

### 4. Push Changes
```bash
# If you didn't rebase:
git push origin feature/enhanced-datetime-picker

# If you rebased (rewrote history):
git push --force-with-lease origin feature/enhanced-datetime-picker
```

---

## Suggested Commit Message Format

For the current changes:
```
feat(ui): enhance date-time picker with dropdown navigation

- Add DateTimePicker component with calendar dropdown
- Upgrade Calendar component with month/year dropdowns
- Integrate DateTimePicker into ScheduleFields
- Update UI components (button, popover) for better styling
- Improve room scheduling UX with better date selection
```

---

## Next Steps After Cleanup

1. **Test the changes:**
   - Navigate to room creation
   - Test date/time picker functionality
   - Verify dropdown navigation works

2. **Continue development:**
   - Add any remaining features
   - Write tests if needed
   - Update documentation

3. **Create PR:**
   - Use descriptive title: "feat(ui): Enhanced Date-Time Picker with Dropdown Navigation"
   - Reference any related issues
   - Add screenshots of the new UI

---

## Troubleshooting

**"Nothing to commit"**
- Your changes are already committed
- Skip to step 2 (rename branch)

**"Branch already exists"**
- You already renamed it
- Check: `git branch --show-current`

**"Cannot rebase"**
- You may have conflicts
- Run: `git rebase --abort`
- Try manual commit message editing instead

---

## Questions?

- Check git status: `git status`
- View recent commits: `git log --oneline -10`
- View current branch: `git branch --show-current`
