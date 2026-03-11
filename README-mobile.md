# TeamFinder Mobile App (Capacitor v6)

This document covers building and running TeamFinder as a native mobile app for Android and iOS using Capacitor v6.

## Prerequisites

### Android Development
- **Android Studio** — Download from https://developer.android.com/studio
- **JDK 17+** — Included with Android Studio
- **Android SDK** — Installed via Android Studio SDK Manager

### iOS Development (macOS only)
- **Xcode 14+** — Download from Mac App Store
- **CocoaPods** — Install via `sudo gem install cocoapods`
- **iOS Simulator** or physical device

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Platforms
```bash
# Android
npx cap add android

# iOS (macOS only)
npx cap add ios
```

This creates `android/` and `ios/` directories with native project files.

## Build and Sync

Whenever you make changes to the web app, rebuild and sync to native platforms:

```bash
# Build web assets and sync to all platforms
npm run mobile:build

# Or run steps separately
npm run build      # Vite build → dist/
npx cap sync       # Copy dist/ to android/ios + update plugins
```

**When to sync:**
- After `npm install` (new plugins)
- After code changes (new build)
- After modifying `capacitor.config.ts`

## Running on Devices

### Android

```bash
# Open in Android Studio
npm run cap:android

# Or use CLI
npx cap open android
```

In Android Studio:
1. Wait for Gradle sync to complete
2. Select device/emulator from dropdown
3. Click **Run** (green play button)

### iOS (macOS only)

```bash
# Open in Xcode
npm run cap:ios

# Or use CLI
npx cap open ios
```

In Xcode:
1. Select target device/simulator
2. Click **Run** (play button) or press `Cmd+R`

## App Icons and Splash Screens

### Generate App Icons
Use a tool like [Capacitor Assets](https://github.com/ionic-team/capacitor-assets):

```bash
npm install -g @capacitor/assets

# Place your icon at resources/icon.png (1024x1024)
# Place your splash at resources/splash.png (2732x2732)

npx capacitor-assets generate
```

Or manually:
- **Android:** Replace files in `android/app/src/main/res/mipmap-*/`
- **iOS:** Use Xcode Asset Catalog in `ios/App/Assets.xcassets/`

### Splash Screen
Splash screen is controlled by `@capacitor/splash-screen`:

```typescript
import { SplashScreen } from '@capacitor/splash-screen';

// Hide splash after app loads
await SplashScreen.hide();
```

Configure in `capacitor.config.ts`:
```typescript
{
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    }
  }
}
```

## Features

### Platform Detection
The app automatically detects mobile vs web:

```typescript
import { detectPlatform } from '@/lib/platform';

const platform = detectPlatform();
// Returns: 'tauri' | 'capacitor' | 'web'
```

### Haptic Feedback
Provides tactile feedback on interactions:

```typescript
import { hapticFeedback } from '@/lib/platform';

// Trigger on button press, selection, etc.
await hapticFeedback('medium'); // 'light' | 'medium' | 'heavy'
```

### Native File Operations
Save files to device storage:

```typescript
import { saveTextFile } from '@/lib/platform';

await saveTextFile('project-details.txt', 'Project information...');
```

On mobile, this uses `@capacitor/filesystem` to save to app's data directory.

### Native Sharing
Share content via native share sheet:

```typescript
import { nativeShare } from '@/lib/platform';

await nativeShare({
  title: 'Project Details',
  text: 'Check out this project...',
  url: 'https://example.com'
});
```

### Data Persistence
Store user preferences across app restarts:

```typescript
import { storageSet, storageGet } from '@/lib/platform';

// Save user's last selected major
await storageSet('lastMajor', 'Computer Science');

// Restore on app load
const major = await storageGet('lastMajor');
```

Uses `@capacitor/preferences` on mobile (native key-value storage).

## Mobile-Specific Considerations

### Tailwind CDN (Offline Limitation)
The app currently uses Tailwind via CDN:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Caveat:** This requires an internet connection. For offline support:
1. Install Tailwind locally: `npm install -D tailwindcss postcss autoprefixer`
2. Run `npx tailwindcss init`
3. Import in CSS: `@import 'tailwindcss/base'` etc.
4. Remove CDN script from `index.html`

### Touch-Friendly UI
Mobile overrides in `index.css`:
```css
/* Disable hover effects on touch devices */
@media (hover: none) {
  .hover\:scale-105 {
    transform: none;
  }
}

/* Minimum 44px touch targets */
@media (pointer: coarse) {
  button, a, input {
    min-height: 44px;
  }
}
```

### Pull-to-Refresh
Capacitor supports native pull-to-refresh:
```typescript
import { App } from '@capacitor/app';

App.addListener('appStateChange', ({ isActive }) => {
  if (isActive) {
    // Refresh data when app comes to foreground
  }
});
```

### Safe Area Insets
Use CSS environment variables for notch/home indicator:
```css
.app-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Configuration

Mobile-specific settings are in `capacitor.config.ts`:

```typescript
{
  appId: 'com.teamfinder.app',      // Reverse-domain identifier
  appName: 'TeamFinder',             // Display name
  webDir: 'dist',                    // Build output directory
  bundledWebRuntime: false,          // Use system WebView

  server: {
    androidScheme: 'https'           // Use HTTPS for Android WebView
  }
}
```

## Debugging

### Android Debugging
1. Enable USB debugging on device
2. Connect via USB
3. Chrome → `chrome://inspect` → Inspect WebView

Or use Android Studio Logcat.

### iOS Debugging (macOS only)
1. Connect device via USB
2. Safari → Develop → [Device Name] → [App]

Or use Xcode console.

### Remote Debugging
```bash
# Live reload on device (same WiFi network)
npx cap run android --livereload --external

npx cap run ios --livereload --external
```

## Building Release APK/IPA

### Android APK/Bundle

In Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Select **APK** or **Android App Bundle**
3. Create/select keystore
4. Select release variant
5. Output: `android/app/build/outputs/apk/release/`

### iOS IPA (macOS only)

In Xcode:
1. Select **Any iOS Device (arm64)**
2. **Product → Archive**
3. **Distribute App** → App Store Connect or Ad Hoc
4. Follow provisioning steps

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Android Developer Guide](https://developer.android.com/studio/run)
- [iOS Developer Guide](https://developer.apple.com/documentation/xcode)
