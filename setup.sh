#!/usr/bin/env bash
set -e

# ── Colors ────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo -e "${CYAN}${BOLD}  TeamFinder - Automated Build System${NC}"
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo ""

RUST_OK=1

# ── Step 1: Check Node.js ─────────────────────────────────────
echo -e "${BOLD}[1/6] Checking Node.js...${NC}"
if ! command -v node &>/dev/null; then
    echo -e "  ${RED}ERROR: Node.js is not installed.${NC}"
    echo "  Download it from: https://nodejs.org/"
    exit 1
fi
NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo -e "  ${RED}ERROR: Node.js 18+ required. Found: $(node -v)${NC}"
    exit 1
fi
echo -e "  ${GREEN}OK${NC} - Node.js $(node -v) found"

# ── Step 2: Check Rust ────────────────────────────────────────
echo -e "${BOLD}[2/6] Checking Rust...${NC}"
if ! command -v rustc &>/dev/null; then
    echo -e "  ${YELLOW}WARNING: Rust is not installed. Desktop build will be skipped.${NC}"
    echo "  To build the desktop app, install Rust from: https://rustup.rs/"
    RUST_OK=0
else
    echo -e "  ${GREEN}OK${NC} - Rust $(rustc --version | cut -d' ' -f2) found"
fi

# ── Step 2b: Check platform deps (Linux) ─────────────────────
if [[ "$OSTYPE" == "linux-gnu"* ]] && [ "$RUST_OK" -eq 1 ]; then
    echo -e "${BOLD}  Checking Linux build dependencies...${NC}"
    MISSING=""
    for pkg in libwebkit2gtk-4.1-dev libayatana-appindicator3-dev build-essential libssl-dev libgtk-3-dev librsvg2-dev; do
        if ! dpkg -s "$pkg" &>/dev/null; then
            MISSING="$MISSING $pkg"
        fi
    done
    if [ -n "$MISSING" ]; then
        echo -e "  ${YELLOW}Missing packages:${NC}$MISSING"
        echo "  Installing (requires sudo)..."
        sudo apt-get install -y $MISSING
    fi
fi

# ── Step 3: Check .env ────────────────────────────────────────
echo -e "${BOLD}[3/6] Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "  Created .env from .env.example"
        echo ""
        echo -e "  ${YELLOW}*** ACTION REQUIRED ***${NC}"
        echo "  Edit the .env file and add your API keys:"
        echo "    - VITE_SUPABASE_URL"
        echo "    - VITE_SUPABASE_ANON_KEY"
        echo "    - VITE_GEMINI_API_KEY (optional, for AI features)"
        echo ""
        read -p "  Press Enter to continue after editing .env (or type SKIP): " REPLY
    else
        echo -e "  ${YELLOW}WARNING: No .env or .env.example found.${NC}"
    fi
else
    echo -e "  ${GREEN}OK${NC} - .env file exists"
fi

# ── Step 4: Install dependencies ─────────────────────────────
echo -e "${BOLD}[4/6] Installing dependencies...${NC}"
npm install
echo -e "  ${GREEN}OK${NC} - Dependencies installed"

# ── Step 5: Build web app ────────────────────────────────────
echo -e "${BOLD}[5/6] Building web app...${NC}"
npm run build
echo -e "  ${GREEN}OK${NC} - Web build complete (dist/ folder)"

# ── Step 6: Build desktop app ────────────────────────────────
if [ "$RUST_OK" -eq 1 ]; then
    echo -e "${BOLD}[6/6] Building desktop app (Tauri)...${NC}"
    echo "  This may take several minutes on first build..."
    npm run tauri:build
    echo -e "  ${GREEN}OK${NC} - Desktop build complete"
else
    echo -e "${BOLD}[6/6] Skipping desktop build (Rust not installed)${NC}"
fi

# ── Done ─────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo -e "${CYAN}${BOLD}  BUILD COMPLETE${NC}"
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo ""
echo "  Web app:"
echo "    Run 'npm run dev' to start the dev server"
echo "    Or serve the dist/ folder with any static file server"
echo ""
if [ "$RUST_OK" -eq 1 ]; then
    echo "  Desktop installers:"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "    src-tauri/target/release/bundle/dmg/TeamFinder_*.dmg"
        echo "    src-tauri/target/release/bundle/macos/TeamFinder.app"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "    src-tauri/target/release/bundle/appimage/TeamFinder_*.AppImage"
        echo "    src-tauri/target/release/bundle/deb/TeamFinder_*.deb"
    fi
    echo ""
fi
echo -e "${CYAN}${BOLD}============================================================${NC}"
