import { useEffect, useState } from 'react';
import { useTranslation } from '@i18n';
import { exposeResetFunction } from '@utils/installPrompt';
import { CloseIcon } from './icons/CloseIcon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [forceShow, setForceShow] = useState(false);

  // Dev helper: expose reset function and manual show function to window for testing
  useEffect(() => {
    exposeResetFunction();
    if (import.meta.env.DEV) {
      (window as any).showInstallPrompt = () => {
        setForceShow(true);
        setShowPrompt(true);
        console.log('[InstallPrompt] Install prompt manually triggered for testing');
      };
      (window as any).hideInstallPrompt = () => {
        setForceShow(false);
        setShowPrompt(false);
      };
      (window as any).checkPWAStatus = () => {
        console.log('=== PWA Installation Status Check ===');
        console.log('1. Service Worker Support:', 'serviceWorker' in navigator);
        console.log('2. Manifest Link:', document.querySelector('link[rel="manifest"]') ? 'Found' : 'NOT FOUND');
        console.log('3. Is Standalone:', window.matchMedia('(display-mode: standalone)').matches);
        console.log('4. Current URL:', window.location.href);
        console.log('5. Is HTTPS/localhost:', window.location.protocol === 'https:' || window.location.hostname === 'localhost');

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            console.log('6. Service Worker Registrations:', registrations.length);
            registrations.forEach((reg, i) => {
              console.log(`   SW ${i + 1}:`, reg.scope, reg.active ? 'Active' : 'Not Active');
            });
          });
        }

        fetch('/manifest.json')
          .then(r => r.json())
          .then(manifest => {
            console.log('7. Manifest:', manifest);
          })
          .catch(e => console.error('7. Manifest Error:', e));
      };
    }
  }, []);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      if (import.meta.env.DEV) {
        console.log('[InstallPrompt] App is already installed (standalone mode)');
      }
      return;
    }

    // Check if prompt was previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        if (import.meta.env.DEV) {
          console.log(`[InstallPrompt] Prompt was dismissed ${Math.round(daysSinceDismissed)} days ago. Will show again in ${Math.round(7 - daysSinceDismissed)} days.`);
        }
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      console.log('[InstallPrompt] beforeinstallprompt event fired!');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (import.meta.env.DEV) {
      console.log('[InstallPrompt] Listening for beforeinstallprompt event...');
      console.log('[InstallPrompt] Service worker support:', 'serviceWorker' in navigator);
      console.log('[InstallPrompt] To test manually, run: window.showInstallPrompt()');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt && !forceShow) {
      console.warn('[InstallPrompt] Install prompt not available. Make sure service worker is registered and manifest is valid.');
      console.log('[InstallPrompt] Checking PWA requirements...');
      console.log('[InstallPrompt] Service worker:', 'serviceWorker' in navigator ? 'Supported' : 'Not supported');
      console.log('[InstallPrompt] Manifest:', document.querySelector('link[rel="manifest"]') ? 'Found' : 'Not found');
      return;
    }

    if (deferredPrompt) {
      // Real browser install prompt
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          console.log('[InstallPrompt] User accepted the install prompt');
          setIsInstalled(true);
          setShowPrompt(false);
        } else {
          console.log('[InstallPrompt] User dismissed the install prompt');
          localStorage.setItem('pwa-install-dismissed', Date.now().toString());
          setShowPrompt(false);
        }

        setDeferredPrompt(null);
      } catch (error) {
        console.error('[InstallPrompt] Error during installation:', error);
      }
    } else if (forceShow) {
      // Test mode - check if we can trigger real prompt
      console.log('[InstallPrompt] Test mode: Checking for browser install prompt...');
      console.log('[InstallPrompt] If you see this, the beforeinstallprompt event has not fired yet.');
      console.log('[InstallPrompt] Make sure:');
      console.log('  1. Service worker is registered (check Application > Service Workers)');
      console.log('  2. Manifest is valid (check Application > Manifest)');
      console.log('  3. You are on HTTPS or localhost');
      console.log('[InstallPrompt] The prompt will appear automatically when browser detects installability.');

      // Don't hide the prompt in test mode, let user see it
      // setShowPrompt(false);
      // setForceShow(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  // Show prompt if: we have a deferred prompt OR force show is enabled (dev mode)
  const shouldShow = showPrompt && (deferredPrompt || forceShow);

  // Dev mode: Show a test button if prompt isn't showing
  if (import.meta.env.DEV && !shouldShow && !isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            setForceShow(true);
            setShowPrompt(true);
            console.log('[InstallPrompt] Manually showing prompt for testing');
          }}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md shadow-lg"
          title="Test install prompt (dev only)"
        >
          Test Install Prompt
        </button>
      </div>
    );
  }

  if (isInstalled || !shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {t('install.title')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {t('install.description')}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
            >
              {t('install.button')}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('install.dismiss')}
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
          aria-label={t('install.close')}
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
