/**
 * Cross-platform abstraction layer.
 * Detects whether the app is running inside Tauri (desktop),
 * Capacitor (mobile), or a plain browser (web) and exposes a
 * unified API for: file saving, haptics, persistent storage,
 * and native sharing.
 *
 * All functions are async and gracefully fall back to web APIs
 * so that the same React components work on every platform.
 */

export type Platform = 'tauri' | 'capacitor' | 'web';

export function detectPlatform(): Platform {
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    return 'tauri';
  }
  if (typeof window !== 'undefined' && 'Capacitor' in window) {
    return 'capacitor';
  }
  return 'web';
}

export const platform: Platform = detectPlatform();
export const isDesktop = platform === 'tauri';
export const isMobile  = platform === 'capacitor';
export const isWeb     = platform === 'web';

// ── File saving ──────────────────────────────────────────────────────────────

/**
 * Save text content to the local device.
 * - Tauri: shows a native Save-As dialog then writes via plugin-fs
 * - Capacitor: writes to the Documents directory
 * - Web: triggers a browser download
 */
export async function saveTextFile(filename: string, content: string): Promise<boolean> {
  if (platform === 'tauri') {
    try {
      const { save } = await import('@tauri-apps/plugin-dialog');
      const { writeTextFile } = await import('@tauri-apps/plugin-fs');
      const filePath = await save({
        defaultPath: filename,
        filters: [{ name: 'Text', extensions: ['txt'] }],
      });
      if (filePath) {
        await writeTextFile(filePath, content);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  if (platform === 'capacitor') {
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      await Filesystem.writeFile({
        path: filename,
        data: content,
        directory: Directory.Documents,
      });
      return true;
    } catch {
      return false;
    }
  }

  // Web: browser download
  const blob = new Blob([content], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

// ── Haptic feedback ───────────────────────────────────────────────────────────

/** Trigger medium haptic feedback. No-op on desktop and web. */
export async function hapticFeedback(): Promise<void> {
  if (platform === 'capacitor') {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Not available on all devices
    }
  }
}

// ── Persistent key-value store ────────────────────────────────────────────────

/**
 * Read a value from persistent storage.
 * - Tauri: tauri-plugin-store (JSON file in app data dir)
 * - Capacitor: @capacitor/preferences
 * - Web: localStorage
 */
export async function storageGet(key: string): Promise<string | null> {
  if (platform === 'tauri') {
    try {
      const { load } = await import('@tauri-apps/plugin-store');
      const store = await load('teamfinder.json', { autoSave: true });
      const val = await store.get<string>(key);
      return val ?? null;
    } catch {
      return null;
    }
  }

  if (platform === 'capacitor') {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      const { value } = await Preferences.get({ key });
      return value;
    } catch {
      return null;
    }
  }

  return localStorage.getItem(key);
}

/**
 * Write a value to persistent storage.
 * - Tauri: tauri-plugin-store
 * - Capacitor: @capacitor/preferences
 * - Web: localStorage
 */
export async function storageSet(key: string, value: string): Promise<void> {
  if (platform === 'tauri') {
    try {
      const { load } = await import('@tauri-apps/plugin-store');
      const store = await load('teamfinder.json', { autoSave: true });
      await store.set(key, value);
    } catch {
      // Ignore
    }
    return;
  }

  if (platform === 'capacitor') {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.set({ key, value });
    } catch {
      // Ignore
    }
    return;
  }

  localStorage.setItem(key, value);
}

// ── Native share ──────────────────────────────────────────────────────────────

/**
 * Share text via the native share sheet (mobile) or Web Share API (web).
 * Returns false if sharing is unavailable.
 */
export async function nativeShare(title: string, text: string): Promise<boolean> {
  if (platform === 'capacitor') {
    try {
      const { Share } = await import('@capacitor/share');
      await Share.share({ title, text, dialogTitle: 'Share Project Idea' });
      return true;
    } catch {
      return false;
    }
  }

  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
