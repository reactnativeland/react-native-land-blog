/**
 * Dev helper utilities for testing the install prompt
 * Only available in development mode
 */

interface WindowWithResetPrompt extends Window {
  resetInstallPrompt?: () => void;
}

export function resetInstallPrompt(): void {
  if (import.meta.env.DEV) {
    localStorage.removeItem('pwa-install-dismissed');
    location.reload();
  }
}

export function exposeResetFunction(): void {
  if (import.meta.env.DEV) {
    const win = window as WindowWithResetPrompt;
    win.resetInstallPrompt = resetInstallPrompt;
  }
}
