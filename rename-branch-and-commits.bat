@echo off
echo ========================================
echo Branch and Commit Rename Script
echo ========================================
echo.

REM Stage all current changes
echo [1/5] Staging current changes...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to stage changes
    exit /b 1
)

REM Commit with proper message
echo [2/5] Committing changes...
git commit -m "feat(ui): enhance date-time picker with dropdown navigation" -m "- Add DateTimePicker component with calendar dropdown" -m "- Upgrade Calendar component with month/year dropdowns" -m "- Integrate DateTimePicker into ScheduleFields" -m "- Update UI components (button, popover) for better styling" -m "- Improve room scheduling UX with better date selection"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit changes
    exit /b 1
)

REM Rename branch
echo [3/5] Renaming branch...
git branch -m feature/datetime-picker-and-cookie-utils feature/enhanced-datetime-picker
if %errorlevel% neq 0 (
    echo ERROR: Failed to rename branch
    exit /b 1
)

echo [4/5] Checking out main branch...
git checkout main
if %errorlevel% neq 0 (
    echo ERROR: Failed to checkout main
    exit /b 1
)

echo [5/5] Switching back to renamed branch...
git checkout feature/enhanced-datetime-picker
if %errorlevel% neq 0 (
    echo ERROR: Failed to checkout renamed branch
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Branch renamed and changes committed
echo ========================================
echo.
echo New branch name: feature/enhanced-datetime-picker
echo Latest commit: Enhanced date-time picker with dropdown navigation
echo.
echo Next steps:
echo 1. Review the commit: git log -1
echo 2. Continue with remaining work
echo 3. When ready to push: git push origin feature/enhanced-datetime-picker
echo.
pause
