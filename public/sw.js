// Service Worker for CuraLens PWA
const CACHE_NAME = 'curalens-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/Curalens app logo.png',
  '/screenshots/screenshot-phone.png',
  '/screenshots/screenshot-desktop.png',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/styles/main.css',
  '/src/styles/layout.css',
  '/src/styles/components.css',
  '/src/styles/pages.css',
  '/src/styles/drug-interaction.css',
  '/src/styles/responsive.css',
  '/src/styles/toast.css'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle notification click events
self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;
  
  notification.close();
  
  if (action === 'take') {
    // Handle "Take" action - mark medication as taken
    // Post a message to the client to update the UI
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'MEDICATION_TAKEN',
          medicationId: notification.tag
        });
      });
    });
    
    // Also open the app if no clients are open
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clientList => {
        if (clientList.length === 0 && self.clients.openWindow) {
          return self.clients.openWindow('/dashboard');
        }
      })
    );
  } else if (action === 'snooze') {
    // Snooze the notification for 5 minutes
    const snoozeTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    // Ensure vibration pattern works on mobile
    const vibrationPattern = [200, 100, 200];
    
    setTimeout(() => {
      self.registration.showNotification(notification.title, {
        body: notification.body,
        icon: '/Curalens app logo.png', // Ensure icon is available
        badge: '/icons/icon-192.png',
        vibrate: vibrationPattern,
        tag: notification.tag,
        renotify: true,
        requireInteraction: true,
        actions: notification.actions,
        // Add sound for better notification visibility
        silent: false
      });
    }, snoozeTime);
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clientList => {
        // If a window client is already open, focus it
        for (const client of clientList) {
          if (client.url.includes('/dashboard') && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow('/dashboard');
        }
      })
    );
  }
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests and requests to other origins
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Skip handling HMR (Hot Module Replacement) requests to prevent refresh loops
  if (event.request.url.includes('hot-update') || 
      event.request.url.includes('__webpack_hmr') || 
      event.request.url.includes('/@vite/client') ||
      event.request.url.includes('/@react-refresh')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Cache-first strategy for navigation requests (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }
  
  // Cache-first strategy for other requests
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached response and update cache in background
        fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      
      // If not in cache, fetch from network
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      });
    })
  );
});