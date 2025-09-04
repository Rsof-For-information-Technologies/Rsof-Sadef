// Import Firebase scripts - using latest stable version
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

console.log('Firebase Messaging Service Worker loaded');

// Do NOT use process.env in service worker files
const firebaseConfig = {
  apiKey: "AIzaSyANWfzP0ee4P_VRpwwmOn1tOxvZYGihP3o",
  authDomain: "sadef-push-notifcation.firebaseapp.com",
  projectId: "sadef-push-notifcation",
  storageBucket: "sadef-push-notifcation.firebasestorage.app",
  messagingSenderId: "286878483915",
  appId: "1:286878483915:web:5c46350d9962a456f4224e",
  measurementId: "G-1B7FKNJXWV",
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully in service worker');
} catch (error) {
  console.error('Firebase initialization error in service worker:', error);
}

const messaging = firebase.messaging();

// Handle background messages (when app is closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Extract notification data
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Sadef Notification';
  const notificationBody = payload.notification?.body || payload.data?.body || 'You have a new message!';
  const icon = payload.notification?.icon || payload.data?.icon || '/favicon.ico';
  const image = payload.notification?.image || payload.data?.image;
  
  const notificationOptions = {
    body: notificationBody,
    icon: icon,
    badge: '/favicon.ico',
    image: image,
    data: {
      ...payload.data,
      url: payload.data?.click_action || payload.data?.url || '/',
      timestamp: Date.now(),
      soundUrl: '/notification.mp3' // Add sound URL to data
    },
    tag: 'sadef-notification',
    requireInteraction: false, // Changed to false for better compatibility
    actions: [
      {
        action: 'open',
        title: '🔗 Open App'
      },
      {
        action: 'dismiss',
        title: '❌ Dismiss'
      }
    ],
    vibrate: [200, 100, 200],
    silent: false, // Make sure it's not silent
    renotify: true
  };

  console.log('[firebase-messaging-sw.js] Showing notification:', notificationTitle, notificationOptions);
  
  // Play notification sound
  try {
    // Note: Service workers have limited audio capabilities
    // Sound will be played when notification is clicked/shown if supported
    console.log('[firebase-messaging-sw.js] Notification sound will be handled by the system');
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error with notification sound:', error);
  }
  
  // Show the notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Fallback push event handler (in case onBackgroundMessage doesn't work)
self.addEventListener('push', function(event) {
  console.log('[firebase-messaging-sw.js] Push event received:', event);
  
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[firebase-messaging-sw.js] Push payload:', payload);
      
      const title = payload.notification?.title || payload.data?.title || 'Sadef Notification';
      const options = {
        body: payload.notification?.body || payload.data?.body || 'You have a new message!',
        icon: payload.notification?.icon || '/favicon.ico',
        badge: '/favicon.ico',
        data: payload.data || {},
        tag: 'sadef-push',
        vibrate: [200, 100, 200]
      };
      
      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    } catch (error) {
      console.error('[firebase-messaging-sw.js] Error parsing push data:', error);
      // Show default notification
      event.waitUntil(
        self.registration.showNotification('Sadef Notification', {
          body: 'You have a new message!',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        })
      );
    }
  } else {
    console.log('[firebase-messaging-sw.js] Push event without data');
    event.waitUntil(
      self.registration.showNotification('Sadef Notification', {
        body: 'You have a new message!',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      })
    );
  }
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    console.log('[firebase-messaging-sw.js] Notification dismissed');
    return;
  }
  
  // Get the URL from notification data
  const data = event.notification.data || {};
  const urlToOpen = data.url || '/';
  const fullUrl = new URL(urlToOpen, self.location.origin).href;
  
  console.log('[firebase-messaging-sw.js] Opening URL:', fullUrl);
  
  // Handle the click event (open app or specific URL)
  event.waitUntil(
    clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    }).then(function(clientList) {
      console.log('[firebase-messaging-sw.js] Found clients:', clientList.length);
      
      // Check if app is already open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        console.log('[firebase-messaging-sw.js] Checking client:', client.url);
        
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          console.log('[firebase-messaging-sw.js] Focusing existing client');
          // If app is open, focus it and navigate if needed
          if (urlToOpen !== '/') {
            client.navigate(fullUrl);
          }
          // Send message to client to play sound
          client.postMessage({
            type: 'PLAY_NOTIFICATION_SOUND',
            soundUrl: '/notification.mp3'
          });
          return client.focus();
        }
      }
      
      // If app is not open, open it
      console.log('[firebase-messaging-sw.js] Opening new window');
      if (clients.openWindow) {
        return clients.openWindow(fullUrl);
      }
    }).catch(function(error) {
      console.error('[firebase-messaging-sw.js] Error handling notification click:', error);
    })
  );
});

// Handle notification close events
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event);
  // You can track notification close analytics here
});

// Keep service worker alive
self.addEventListener('install', function(event) {
  console.log('Service worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service worker activating...');
  event.waitUntil(self.clients.claim());
});