@echo off
title Kekulawala Master ERP - Central Backend Server
echo =========================================================
echo    KEKULAWALA UNIFIED ENTERPRISE ERP - MASTER BACKEND
echo    Firebase Cloud Project: kekulawala-erp
echo =========================================================
echo.
cd /d "%~dp0Kekulawala-Unified-ERP"
echo Starting Backend API on port 5000...
node server/server.js
pause
