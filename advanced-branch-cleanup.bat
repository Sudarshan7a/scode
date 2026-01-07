@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Advanced Branch Cleanup Script
echo ========================================
echo.
echo This script will:
echo 1. Commit your current changes
echo 2. Rename the branch
echo 3. Optionally rewrite recent commits
echo.

REM Show current status
echo Current branch status:
git branch --show-current
echo.
echo Recent commits:
git log --oneline -5
echo.
echo ========================================
echo.

REM Ask user if they want to proceed
set /p PROCEED="Do you want to proceed? (y/n): "
if /i not "%PROCEED%"=="y" (
    echo Operation cancelled.
    exit /b 0
)

echo.
echo [Step 1/4] Staging and committing current changes...
git add .
git commit -m "feat(ui): enhance date-time picker with dropdown navigation" -m "- Add DateTimePicker component with calendar dropdown" -m "- Upgrade Calendar component with month/year dropdowns" -m "- Integrate DateTimePicker into ScheduleFields" -m "- Update UI components for better styling" -m "- Improve room scheduling UX"

if %errorlevel% neq 0 (
    echo ERROR: Failed to commit. Check if there are changes to commit.
    pause
    exit /b 1
)

echo.
echo [Step 2/4] Renaming branch...
git branch -m feature/datetime-picker-and-cookie-utils feature/enhanced-datetime-picker

if %errorlevel% neq 0 (
    echo ERROR: Failed to rename branch
    pause
    exit /b 1
)

echo.
echo [Step 3/4] Branch renamed successfully!
echo New branch: feature/enhanced-datetime-picker
echo.

REM Ask about rewriting old commits
set /p REWRITE="Do you want to rewrite old commits interactively? (y/n): "
if /i "%REWRITE%"=="y" (
    echo.
    echo Opening interactive rebase...
    echo You can use 'reword' to change commit messages
    echo.
    pause
    git rebase -i HEAD~5
)

echo.
echo [Step 4/4] Final status:
git log --oneline -5
echo.

echo ========================================
echo SUCCESS!
echo ========================================
echo.
echo Branch: feature/enhanced-datetime-picker
echo.
echo Next steps:
echo 1. Review commits: git log --oneline
echo 2. If you rewrote commits, you may need: git push --force-with-lease
echo 3. Otherwise: git push origin feature/enhanced-datetime-picker
echo.
pause
