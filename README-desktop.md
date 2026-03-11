# TeamFinder Desktop App (Tauri v2)

This document covers building and running TeamFinder as a native desktop application using Tauri v2.

## Prerequisites

### Install Rust
Tauri requires Rust and Cargo to build native desktop apps.

**Windows/macOS/Linux:**
```bash
# Install via rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Verify installation
rustc --version
cargo --version
```

Visit https://rustup.rs for more installation options.

### Additional Platform Requirements

**Windows:**
- Microsoft Visual Studio C++ Build Tools
- WebView2 (usually pre-installed on Windows 10/11)

**macOS:**
- Xcode Command Line Tools: `xcode-select --install`

**Linux:**
- webkit2gtk, libayatana-appindicator3, and build essentials
- Ubuntu/Debian: `sudo apt install libwebkit2gtk-4.1-dev libayatana-appindicator3-dev build-essential curl wget file libssl-dev libgtk-3-dev librsvg2-dev`

## Icon Generation

Before building for production, generate platform-specific icons from a 1024x1024 PNG source image:

```bash
# Create or obtain your app icon (1024x1024 PNG)
npx @tauri-apps/cli icon path/to/your-icon.png
```

This generates all required icon files in `src-tauri/icons/`:
- `32x32.png` — Windows app icon (small)
- `128x128.png` — macOS/Linux app icon
- `128x128@2x.png` — macOS retina display
- `icon.icns` — macOS bundle icon
- `icon.ico` — Windows executable icon
- `tray-icon.png` — System tray icon

**Note:** Building without icons will fail. Skip this step only for development mode (`tauri:dev`).

## Development Mode

Run the app in development mode with hot-reload:

```bash
npm install
npm run tauri:dev
```

This will:
1. Start Vite dev server on `http://localhost:3000`
2. Open a native desktop window with your app
3. Hot-reload on code changes (both frontend and Rust)

## Production Build

Build a production-ready installer:

```bash
npm run tauri:build
```

### Output Locations

Build artifacts are located in `src-tauri/target/release/bundle/`:

**Windows:**
- `msi/TeamFinder_0.0.0_x64_en-US.msi` — MSI installer
- `nsis/TeamFinder_0.0.0_x64-setup.exe` — NSIS installer

**macOS:**
- `dmg/TeamFinder_0.0.0_universal.dmg` — DMG disk image
- `macos/TeamFinder.app` — Application bundle

**Linux:**
- `appimage/TeamFinder_0.0.0_amd64.AppImage` — AppImage (portable)
- `deb/TeamFinder_0.0.0_amd64.deb` — Debian package

## Features

### System Tray
The app runs in the system tray with the following menu options:
- **Show/Hide** — Toggle window visibility
- **Quit** — Exit the application

### Global Shortcuts
Keyboard shortcuts are configured in `src-tauri/tauri.conf.json` under `globalShortcut`.

Example:
```json
{
  "globalShortcut": {
    "shortcuts": [
      {
        "shortcut": "CmdOrCtrl+Shift+F",
        "event": "show-window"
      }
    ]
  }
}
```

Register handlers in `src-tauri/src/lib.rs` or `main.rs`.

### Native File Operations
The app uses `@tauri-apps/plugin-fs` and `@tauri-apps/plugin-dialog` for native file operations:

```typescript
import { saveTextFile } from '@/lib/platform';

// Cross-platform file save (works on web, desktop, mobile)
await saveTextFile('project-details.txt', 'Project information...');
```

On desktop, this opens a native save dialog.

### Data Persistence
Uses `@tauri-apps/plugin-store` for persistent key-value storage:

```typescript
import { storageSet, storageGet } from '@/lib/platform';

await storageSet('lastMajor', 'Computer Science');
const major = await storageGet('lastMajor');
```

## Configuration

Desktop-specific settings are in `src-tauri/tauri.conf.json`:

- **Window size/position** — `windows` array
- **Permissions** — `permissions` and `capabilities/default.json`
- **Build targets** — `bundle.targets`
- **App metadata** — `productName`, `version`, `identifier`

## Troubleshooting

### Build Fails with "Icon not found"
Generate icons: `npx @tauri-apps/cli icon path/to/icon.png`

### "Cargo not found" error
Install Rust: https://rustup.rs

### WebView2 missing (Windows)
Download: https://developer.microsoft.com/microsoft-edge/webview2/

### Permission denied errors
Check `src-tauri/capabilities/default.json` and ensure required plugins are allowed.

## Resources

- [Tauri Documentation](https://v2.tauri.app/)
- [Tauri API Reference](https://v2.tauri.app/reference/javascript/api/)
- [Plugin Store](https://v2.tauri.app/plugin/store/)
- [Plugin Dialog](https://v2.tauri.app/plugin/dialog/)
