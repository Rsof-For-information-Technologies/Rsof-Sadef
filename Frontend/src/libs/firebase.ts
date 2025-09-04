import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';
import { toast } from 'sonner';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
}

const firebaseConfig: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firebaseApp: FirebaseApp | null = null;
let messaging: Messaging | null = null;

// Initialize Firebase only on client side
if (typeof window !== 'undefined') {
    try {
        firebaseApp = initializeApp(firebaseConfig);
        messaging = getMessaging(firebaseApp);
        
        // Setup foreground message handler
        setupForegroundMessageHandler();
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

export async function getFcmToken(): Promise<string | null> {
    if (typeof window === 'undefined') {
        console.warn('getFcmToken called on server side');
        return null;
    }

    if (!messaging) {
        console.error('Firebase Messaging not initialized');
        return null;
    }

    try {
        // Check if service worker is supported
        if (!('serviceWorker' in navigator)) {
            console.error('Service Worker not supported');
            return null;
        }

        // Register service worker with proper scope for persistent notifications
        console.log('Registering service worker...');
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/firebase-cloud-messaging-push-scope',
            updateViaCache: 'none' // Ensures service worker updates immediately
        });
        
        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;
        
        console.log('Service Worker registered and ready:', registration);
        console.log('Service Worker scope:', registration.scope);
        console.log('Service Worker active:', !!registration.active);

        // Check current permission
        let permission = Notification.permission;
        
        // Request permission if not already granted
        if (permission !== 'granted') {
            permission = await Notification.requestPermission();
        }
        
        if (permission !== 'granted') {
            console.warn('Notification permission denied');
            return null;
        }

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        console.log('VAPID Key configured:', !!vapidKey);
        
        if (!vapidKey || vapidKey === 'YOUR_VAPID_KEY_HERE') {
            console.error('VAPID key not configured properly. Please set NEXT_PUBLIC_FIREBASE_VAPID_KEY in .env.local');
            // Try to get token without VAPID key as fallback
            try {
                const tokenWithoutVapid = await getToken(messaging, {
                    serviceWorkerRegistration: registration,
                });
                if (tokenWithoutVapid) {
                    console.log('FCM Token generated without VAPID (fallback):', tokenWithoutVapid);
                    return tokenWithoutVapid;
                }
            } catch (fallbackError) {
                console.error('Failed to get token without VAPID:', fallbackError);
            }
            return null;
        }

        const token = await getToken(messaging, {
            vapidKey: vapidKey,
            serviceWorkerRegistration: registration,
        });
        
        if (token) {
            console.log('FCM Token generated:', token);
            return token;
        } else {
            console.warn('No registration token available');
            return null;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
        
        // Try without service worker registration as fallback
        try {
            console.log('Attempting fallback without service worker...');
            const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
            if (!vapidKey) {
                console.error('VAPID key not configured');
                return null;
            }

            const token = await getToken(messaging, {
                vapidKey: vapidKey,
            });
            
            if (token) {
                console.log('FCM Token generated (fallback):', token);
                return token;
            }
        } catch (fallbackError) {
            console.error('Fallback FCM token generation failed:', fallbackError);
        }
        
        return null;
    }
}

// Setup foreground message handler
function setupForegroundMessageHandler() {
    if (!messaging) {
        console.warn('Messaging not initialized, cannot setup foreground handler');
        return;
    }

    onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        
        const title = payload.notification?.title || 'New Notification';
        const body = payload.notification?.body || 'You have a new message!';
        
        playNotificationSound();
        
        toast.success(`${title}: ${body}`, {
            duration: 6000,
            action: {
                label: 'View',
                onClick: () => {
                    // Handle notification click - you can customize this
                    console.log('Notification clicked:', payload);
                    // Example: navigate to a specific page if payload contains URL
                    if (payload.data?.url) {
                        window.open(payload.data.url, '_blank');
                    }
                }
            }
        });
    });
    
    // Listen for messages from service worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'PLAY_NOTIFICATION_SOUND') {
                console.log('Playing sound from service worker message');
                playNotificationSound();
            }
        });
    }
}

// Function to ensure service worker is always active for background notifications
export async function ensureServiceWorkerActive(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    try {
        if ('serviceWorker' in navigator) {
            console.log('Checking service worker status...');
            
            // Check for existing registration
            const existingRegistration = await navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope');
            
            if (!existingRegistration) {
                console.log('Service worker not found, registering...');
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                    scope: '/firebase-cloud-messaging-push-scope',
                    updateViaCache: 'none'
                });
                await navigator.serviceWorker.ready;
                console.log('Service worker registered for background notifications:', registration);
                return true;
            } else {
                console.log('Service worker already active:', existingRegistration);
                
                // Check if it's actually active
                if (!existingRegistration.active) {
                    console.log('Service worker not active, updating...');
                    await existingRegistration.update();
                    await navigator.serviceWorker.ready;
                }
                return true;
            }
        } else {
            console.error('Service Worker not supported in this browser');
        }
    } catch (error) {
        console.error('Error ensuring service worker is active:', error);
    }
    
    return false;
}

// Export messaging instance for external use
export { messaging };

// Export sound function for external use
export function playNotificationSound() {
    try {
        console.log('Playing notification sound...');
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.5; // Set volume to 50%
        
        // Set preload to make it load faster
        audio.preload = 'auto';
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Notification sound played successfully');
                })
                .catch((error) => {
                    console.error('Error playing notification sound:', error);
                    // Fallback: try to play a system notification sound
                    if ('Notification' in window && Notification.permission === 'granted') {
                        // Some browsers play default sound for notifications
                        console.log('Using system notification sound as fallback');
                    }
                });
        }
    } catch (error) {
        console.error('Error setting up notification sound:', error);
    }
}