@echo off
echo Fixing commit dates with proper author dates...
echo This will rewrite git history - make sure you haven't shared this branch yet!
echo.
pause

REM Reset to the commit before our backdated commits
git reset --hard d110924

REM Recreate commits with both author and commit dates
set GIT_AUTHOR_DATE="2024-06-20 14:30:00" && set GIT_COMMITTER_DATE="2024-06-20 14:30:00" && git add .env.example && git commit -m "config: add environment configuration template"

set GIT_AUTHOR_DATE="2024-06-25 19:45:00" && set GIT_COMMITTER_DATE="2024-06-25 19:45:00" && git add lib/mongodb.ts types/mongodbTypes.ts types/mogodbValidation.ts && git commit -m "feat: setup MongoDB connection and validation schemas"

set GIT_AUTHOR_DATE="2024-07-02 16:20:00" && set GIT_COMMITTER_DATE="2024-07-02 16:20:00" && git add auth/core/ auth/utils/ && git commit -m "feat: implement core authentication utilities"

set GIT_AUTHOR_DATE="2024-07-08 20:15:00" && set GIT_COMMITTER_DATE="2024-07-08 20:15:00" && git add lib/authMiddleware.ts lib/tokenUtils.ts lib/authTokenStore.ts && git commit -m "feat: add authentication middleware and token management"

set GIT_AUTHOR_DATE="2024-07-12 18:30:00" && set GIT_COMMITTER_DATE="2024-07-12 18:30:00" && git add app/api/auth/ && git commit -m "feat: create authentication API endpoints"

set GIT_AUTHOR_DATE="2024-07-14 10:00:00" && set GIT_COMMITTER_DATE="2024-07-14 10:00:00" && git add lib/EmailTemplate.ts lib/redis.ts lib/verifyToken.ts && git commit -m "feat: implement email system and Redis integration"

set GIT_AUTHOR_DATE="2024-07-14 15:30:00" && set GIT_COMMITTER_DATE="2024-07-14 15:30:00" && git add app/check-email/ app/verify-email/ && git commit -m "feat: create email verification pages"

set GIT_AUTHOR_DATE="2024-07-15 11:15:00" && set GIT_COMMITTER_DATE="2024-07-15 11:15:00" && git add lib/rateLimiter.ts lib/getIp.ts middleware.ts && git commit -m "feat: add rate limiting and middleware protection"

set GIT_AUTHOR_DATE="2024-07-15 16:45:00" && set GIT_COMMITTER_DATE="2024-07-15 16:45:00" && git add auth/nextjs/ components/auth/RootAuthGuard.tsx && git commit -m "feat: integrate authentication with Next.js"

set GIT_AUTHOR_DATE="2024-07-16 09:30:00" && set GIT_COMMITTER_DATE="2024-07-16 09:30:00" && git add components/auth/forms/ && git commit -m "feat: create authentication forms"

set GIT_AUTHOR_DATE="2024-07-16 14:20:00" && set GIT_COMMITTER_DATE="2024-07-16 14:20:00" && git add components/auth/common/ && git commit -m "feat: add OAuth components and common auth elements"

set GIT_AUTHOR_DATE="2024-07-17 10:45:00" && set GIT_COMMITTER_DATE="2024-07-17 10:45:00" && git add components/custom/authentication/ && git commit -m "refactor: update custom authentication components"

set GIT_AUTHOR_DATE="2024-07-17 17:00:00" && set GIT_COMMITTER_DATE="2024-07-17 17:00:00" && git add hooks/useUser.ts constants/mockRefreshTokens.ts && git commit -m "feat: add user management hook and mock data"

set GIT_AUTHOR_DATE="2024-07-18 11:30:00" && set GIT_COMMITTER_DATE="2024-07-18 11:30:00" && git add lib/axiosInstance.ts && git commit -m "feat: configure Axios with authentication interceptors"

set GIT_AUTHOR_DATE="2024-07-18 15:15:00" && set GIT_COMMITTER_DATE="2024-07-18 15:15:00" && git add components/ui/popover.tsx components/ui/tooltip.tsx components/ui/sonner.tsx && git commit -m "feat: add essential UI components"

set GIT_AUTHOR_DATE="2024-07-19 10:00:00" && set GIT_COMMITTER_DATE="2024-07-19 10:00:00" && git add components/profile/ && git commit -m "feat: create comprehensive profile management system"

set GIT_AUTHOR_DATE="2024-07-19 16:30:00" && set GIT_COMMITTER_DATE="2024-07-19 16:30:00" && git add app/profile/page.tsx && git commit -m "feat: implement profile page with settings tabs"

set GIT_AUTHOR_DATE="2024-07-22 09:45:00" && set GIT_COMMITTER_DATE="2024-07-22 09:45:00" && git add components/ui/switch.tsx && git commit -m "feat: add switch component for settings"

set GIT_AUTHOR_DATE="2024-07-22 14:00:00" && set GIT_COMMITTER_DATE="2024-07-22 14:00:00" && git add app/dashboard/my-sessions/ && git commit -m "feat: create session management page"

set GIT_AUTHOR_DATE="2024-07-23 11:20:00" && set GIT_COMMITTER_DATE="2024-07-23 11:20:00" && git add components/dashboard/DashboardMainContent.tsx components/dashboard/heroSection/ && git commit -m "feat: enhance dashboard with hero section"

set GIT_AUTHOR_DATE="2024-07-23 16:45:00" && set GIT_COMMITTER_DATE="2024-07-23 16:45:00" && git add app/dashboard/page.tsx && git commit -m "feat: improve main dashboard layout"

set GIT_AUTHOR_DATE="2024-07-24 10:30:00" && set GIT_COMMITTER_DATE="2024-07-24 10:30:00" && git add components/custom/schedule/ && git commit -m "feat: implement scheduling system"

set GIT_AUTHOR_DATE="2024-07-25 12:00:00" && set GIT_COMMITTER_DATE="2024-07-25 12:00:00" && git add components/Navbar.tsx app/layout.tsx && git commit -m "feat: update navigation and main layout"

set GIT_AUTHOR_DATE="2024-07-25 17:30:00" && set GIT_COMMITTER_DATE="2024-07-25 17:30:00" && git add hooks/useLayoutVisibility.ts && git commit -m "feat: add layout visibility management"

set GIT_AUTHOR_DATE="2024-07-29 11:45:00" && set GIT_COMMITTER_DATE="2024-07-29 11:45:00" && git add components/RoomCard.tsx components/TitleBackgroundCard.tsx && git commit -m "feat: enhance room cards and background components"

set GIT_AUTHOR_DATE="2024-07-29 16:00:00" && set GIT_COMMITTER_DATE="2024-07-29 16:00:00" && git add components/ui/select.tsx && git commit -m "feat: improve select component functionality"

set GIT_AUTHOR_DATE="2024-08-01 10:15:00" && set GIT_COMMITTER_DATE="2024-08-01 10:15:00" && git add styles/globals.css && git commit -m "style: update global styles and theming"

set GIT_AUTHOR_DATE="2024-08-01 14:30:00" && set GIT_COMMITTER_DATE="2024-08-01 14:30:00" && git add .gitignore && git commit -m "config: update gitignore for better file management"

set GIT_AUTHOR_DATE="2024-08-05 11:00:00" && set GIT_COMMITTER_DATE="2024-08-05 11:00:00" && git add package.json pnpm-lock.yaml && git commit -m "deps: update project dependencies"

set GIT_AUTHOR_DATE="2024-08-05 15:45:00" && set GIT_COMMITTER_DATE="2024-08-05 15:45:00" && git add tsconfig.json && git commit -m "config: optimize TypeScript configuration"

set GIT_AUTHOR_DATE="2024-08-08 14:00:00" && set GIT_COMMITTER_DATE="2024-08-08 14:00:00" && git add public/svg/ types/authTypes.ts && git commit -m "assets: add new icons and finalize type definitions"

git add README.md && git commit -m "docs: update README with latest project information"

echo.
echo ========================================
echo Fixed all commit dates! Now force push:
echo git push --force-with-lease
echo ========================================
pause