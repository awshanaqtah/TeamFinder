@echo off
setlocal enabledelayedexpansion
title TeamFinder - One-Click Build
color 0B

echo.
echo ============================================================
echo   TeamFinder - Automated Build System
echo ============================================================
echo.

:: ── Step 1: Check Node.js ─────────────────────────────────────
echo [1/6] Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo   ERROR: Node.js is not installed.
    echo   Download it from: https://nodejs.org/
    echo   Install Node.js 18+ and re-run this script.
    pause
    exit /b 1
)
for /f "tokens=1 delims=." %%m in ('node -v') do set NODE_MAJOR=%%m
set NODE_MAJOR=!NODE_MAJOR:v=!
if !NODE_MAJOR! lss 18 (
    echo   ERROR: Node.js 18+ required.
    pause
    exit /b 1
)
echo   OK - Node.js found

:: ── Step 2: Check Rust (for desktop build) ────────────────────
set RUST_OK=0
echo [2/6] Checking Rust...
where rustc >nul 2>&1
if !errorlevel! equ 0 (
    echo   OK - Rust found
    set RUST_OK=1
) else (
    echo   WARNING: Rust is not installed. Desktop build will be skipped.
    echo   To build the desktop app, install Rust from: https://rustup.rs/
)

:: ── Step 3: Check .env file ──────────────────────────────────
echo [3/6] Checking environment configuration...
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo   Created .env from .env.example
        echo.
        echo   *** ACTION REQUIRED ***
        echo   Edit the .env file and add your API keys:
        echo     - VITE_SUPABASE_URL
        echo     - VITE_SUPABASE_ANON_KEY
        echo     - VITE_GEMINI_API_KEY ^(optional, for AI features^)
        echo.
    ) else (
        echo   WARNING: No .env or .env.example found. App may not work without API keys.
    )
) else (
    echo   OK - .env file exists
)

:: ── Step 4: Install dependencies ─────────────────────────────
echo [4/6] Installing dependencies...
call npm install
if !errorlevel! neq 0 (
    echo   ERROR: npm install failed.
    pause
    exit /b 1
)
echo   OK - Dependencies installed

:: ── Step 5: Build web app ────────────────────────────────────
echo [5/6] Building web app...
call npm run build
if !errorlevel! neq 0 (
    echo   ERROR: Web build failed.
    pause
    exit /b 1
)
echo   OK - Web build complete

:: ── Step 6: Build desktop app (if Rust available) ────────────
if !RUST_OK! equ 1 (
    echo [6/6] Building desktop app ^(Tauri^)...
    echo   This may take several minutes on first build...
    call npm run tauri:build
    if !errorlevel! neq 0 (
        echo   ERROR: Desktop build failed.
        echo   Check the troubleshooting section in README-desktop.md
        pause
        exit /b 1
    )
    echo   OK - Desktop build complete
) else (
    echo [6/6] Skipping desktop build ^(Rust not installed^)
)

:: ── Done ─────────────────────────────────────────────────────
echo.
echo ============================================================
echo   BUILD COMPLETE
echo ============================================================
echo.
echo   Web app:
echo     Run "npm run dev" to start the dev server
echo     Or serve the dist/ folder with any static file server
echo.
if !RUST_OK! equ 1 (
    echo   Desktop installers:
    echo     src-tauri\target\release\bundle\nsis\TeamFinder_*-setup.exe
    echo     src-tauri\target\release\bundle\msi\TeamFinder_*.msi
    echo.
)
echo ============================================================
pause
