import { useTranslation } from '@i18n';
import { useEffect, useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  // Initialize isInstalled state based on standalone mode check
  const [isInstalled, setIsInstalled] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(display-mode: standalone)').matches
      : false
  );

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    if (isStandalone) {
      if (import.meta.env.DEV) {
        console.log(
          '[InstallPrompt] App is already installed (standalone mode)'
        );
      }
      return;
    }

    // Check if prompt was previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed =
        (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        if (import.meta.env.DEV) {
          console.log(
            `[InstallPrompt] Prompt was dismissed ${Math.round(daysSinceDismissed)} days ago. Will show again in ${Math.round(7 - daysSinceDismissed)} days.`
          );
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
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

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
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
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
