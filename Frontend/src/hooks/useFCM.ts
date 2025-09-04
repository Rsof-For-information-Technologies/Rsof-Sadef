import { useState, useEffect, useCallback } from 'react';
import { getFcmToken } from '@/libs/firebase';
import { getDeviceType } from '@/utils/deviceDetection';

interface UseFCMResult {
  fcmToken: string | null;
  deviceType: string;
  isLoading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  hasPermission: boolean;
}

export function useFCM(): UseFCMResult {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [deviceType, setDeviceType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const initializeFCM = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we're on client side
      if (typeof window === 'undefined') {
        setError('FCM not available on server side');
        return;
      }

      // Get device type
      const detectedDeviceType = getDeviceType();
      setDeviceType(detectedDeviceType);

      // Check notification permission
      const permission = Notification.permission;
      setHasPermission(permission === 'granted');

      if (permission === 'denied') {
        setError('Notifications are blocked. Please enable them in browser settings.');
        return;
      }

      // Get FCM token
      const token = await getFcmToken();
      
      if (token) {
        setFcmToken(token);
        setHasPermission(true);
        console.log('FCM initialized successfully with token:', token);
      } else {
        // Provide more specific error messages
        if (permission === 'default') {
          setError('Please allow notifications to continue with login.');
        } else if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
          setError('Firebase VAPID key not configured.');
        } else {
          setError('Unable to initialize push notifications. Please try refreshing the page.');
        }
      }
    } catch (err) {
      console.error('Error initializing FCM:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Notification setup failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    await initializeFCM();
  }, [initializeFCM]);

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeFCM();
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeFCM]);

  return {
    fcmToken,
    deviceType,
    isLoading,
    error,
    refreshToken,
    hasPermission,
  };
}
