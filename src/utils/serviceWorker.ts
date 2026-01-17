import { registerSW } from 'virtual:pwa-register';

interface WindowWithUninstallPWA extends Window {
  uninstallPWA?: () => Promise<void>;
  updateSW?: () => Promise<void>;
}

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      immediate: true,
      onRegistered(registration: ServiceWorkerRegistration | undefined) {
        if (registration) {
          console.log('Service worker registered successfully');
          if (config?.onSuccess) {
            config.onSuccess(registration);
          }
        }
      },
      onRegisterError(error: Error) {
        console.error('Error during service worker registration:', error);
      },
      onNeedRefresh() {
        console.log('New content is available; please refresh.');
        if (config?.onUpdate) {
          navigator.serviceWorker.ready.then((registration) => {
            if (config.onUpdate) {
              config.onUpdate(registration);
            }
          });
        }
      },
      onOfflineReady() {
        console.log('Content cached for offline use.');
        navigator.serviceWorker.ready.then((registration) => {
          if (config?.onSuccess) {
            config.onSuccess(registration);
          }
        });
      },
    });
    if (typeof window !== 'undefined') {
      const win = window as WindowWithUninstallPWA;
      win.updateSW = updateSW;
    }
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

export function exposeUninstallFunction(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const win = window as WindowWithUninstallPWA;
  win.uninstallPWA = async () => {
    console.log('Uninstalling PWA...');

    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('Service worker unregistered');
        }
      } catch (error) {
        console.error('Error unregistering service worker:', error);
      }
    }

    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            console.log(`Deleting cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
        console.log('All caches cleared');
      } catch (error) {
        console.error('Error clearing caches:', error);
      }
    }

    localStorage.removeItem('pwa-install-dismissed');
    console.log('LocalStorage cleared');

    console.log(
      'PWA uninstalled! Please uninstall the app manually from your device/browser.'
    );
    console.log('Then reload the page and reinstall.');
  };

  if (import.meta.env.DEV) {
    console.log('window.uninstallPWA() is now available');
  }
}
