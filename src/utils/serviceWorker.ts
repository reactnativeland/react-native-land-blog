import { registerSW } from 'virtual:pwa-register';

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    registerSW({
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
