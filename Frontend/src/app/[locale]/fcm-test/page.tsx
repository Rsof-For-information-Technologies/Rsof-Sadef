"use client";

import { useState, useEffect } from 'react';
import { getFcmToken, ensureServiceWorkerActive, playNotificationSound } from '@/libs/firebase';

export default function FCMTestPage() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [swActive, setSwActive] = useState<boolean>(false);

  useEffect(() => {
    testFCMSetup();
  }, []);

  const testFCMSetup = async () => {
    try {
      setStatus('Checking service worker...');
      
      // First ensure service worker is active
      const swResult = await ensureServiceWorkerActive();
      setSwActive(swResult);
      
      if (!swResult) {
        setError('Service worker registration failed');
        setStatus('Service worker failed');
        return;
      }

      setStatus('Service worker active. Getting FCM token...');
      
      // Get FCM token
      const fcmToken = await getFcmToken();
      
      if (fcmToken) {
        setToken(fcmToken);
        setStatus('FCM setup successful');
        setError(null);
      } else {
        setError('Failed to get FCM token. Check VAPID key configuration.');
        setStatus('FCM token failed');
      }
    } catch (err) {
      console.error('FCM test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('Error occurred');
    }
  };

  const retryTest = () => {
    setToken(null);
    setError(null);
    testFCMSetup();
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      alert('Token copied to clipboard!');
    }
  };

  const testNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from your app',
        icon: '/favicon.ico'
      });
      // Also play sound for local test
      playNotificationSound();
    } else {
      alert('Notifications not permitted or supported');
    }
  };

  const testSound = () => {
    playNotificationSound();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">FCM Test & Debug Page</h1>
      
      {/* Status Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <p className="text-lg">{status}</p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Service Worker Status */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Service Worker Status</h2>
        <p>Active: <span className={swActive ? 'text-green-600' : 'text-red-600'}>{swActive ? 'Yes' : 'No'}</span></p>
      </div>

      {/* FCM Token */}
      {token && (
        <div className="bg-green-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">FCM Token</h2>
          <div className="bg-white p-3 rounded border">
            <code className="text-sm break-all">{token}</code>
          </div>
          <button 
            onClick={copyToken}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Copy Token
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="space-x-4 mb-6">
        <button 
          onClick={retryTest}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Retry Test
        </button>
        <button 
          onClick={testNotification}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Test Local Notification
        </button>
        <button 
          onClick={testSound}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          🔊 Test Sound
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Make sure your .env.local file has all Firebase config values</li>
          <li>You need to generate a VAPID key from Firebase Console:</li>
          <ul className="list-disc list-inside ml-4 mt-1">
            <li>Go to Firebase Console → Project Settings → Cloud Messaging</li>
            <li>In "Web configuration" section, click "Generate key pair"</li>
            <li>Copy the key and set it as NEXT_PUBLIC_FIREBASE_VAPID_KEY in .env.local</li>
          </ul>
          <li>Once you have the VAPID key, restart the app and retry this test</li>
          <li>Use the FCM token above to send test notifications from Firebase Console</li>
        </ol>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h2 className="text-xl font-semibold mb-2">Debug Info</h2>
        <div className="text-sm space-y-1">
          <p>Browser: {navigator.userAgent}</p>
          <p>Service Worker Support: {('serviceWorker' in navigator) ? 'Yes' : 'No'}</p>
          <p>Notification Support: {('Notification' in window) ? 'Yes' : 'No'}</p>
          <p>Notification Permission: {typeof Notification !== 'undefined' ? Notification.permission : 'N/A'}</p>
          <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
