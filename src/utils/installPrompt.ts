/**
 * Dev helper utilities for testing the install prompt
 * Only available in development mode
 */

export function resetInstallPrompt(): void {
  if (import.meta.env.DEV) {
    localStorage.removeItem('pwa-install-dismissed');
    location.reload();
  }
}

export function exposeResetFunction(): void {
  if (import.meta.env.DEV) {
    (window as any).resetInstallPrompt = resetInstallPrompt;
  }
}
