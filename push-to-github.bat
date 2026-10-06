@echo off
title Push Kekulawala ERP to GitHub
echo =========================================================
echo    KEKULAWALA UNIFIED ENTERPRISE ERP - GIT PUSH
echo    Target: https://github.com/AU-kahandawa/Kekulawala-ERP-system.git
echo =========================================================
echo.

git status
echo.
echo Pushing branch 'main' to origin...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ---------------------------------------------------------
    echo Push encountered a permission issue.
    echo If your GitHub username is 'AU-kahandawa':
    echo   1. Please ensure your token or account is authenticated:
    echo      run: gh auth login
    echo   2. OR add 'arjunaudesh-dev' as a collaborator at:
    echo      https://github.com/AU-kahandawa/Kekulawala-ERP-system/settings/access
    echo ---------------------------------------------------------
) else (
    echo.
    echo =========================================================
    echo [SUCCESS] Codebase successfully pushed to GitHub!
    echo =========================================================
)

pause
