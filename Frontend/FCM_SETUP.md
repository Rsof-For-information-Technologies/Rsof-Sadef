# FCM Integration Setup Guide

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-your_measurement_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

## CRITICAL: Update Service Worker File

**Important:** You MUST update `/public/firebase-messaging-sw.js` with your actual Firebase config values. The service worker cannot use environment variables.

Replace the placeholder values in `/public/firebase-messaging-sw.js`:

```javascript
firebase.initializeApp({
  apiKey: "your-actual-api-key", // Replace with your real API key
  authDomain: "your-project-id.firebaseapp.com", // Replace with your real auth domain
  projectId: "your-project-id", // Replace with your real project ID
  storageBucket: "your-project-id.appspot.com", // Replace with your real storage bucket
  messagingSenderId: "your-sender-id", // Replace with your real sender ID
  appId: "your-app-id", // Replace with your real app ID
  measurementId: "G-your-measurement-id", // Replace with your real measurement ID
});
```

## How to Get These Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Go to Project Settings > General > Your apps
4. Click on the web app icon or "Add app" if you haven't created one
5. Copy the config object values
6. Update BOTH `.env.local` AND `/public/firebase-messaging-sw.js`

## VAPID Key Setup

1. In Firebase Console, go to Project Settings > Cloud Messaging
2. In the "Web configuration" section, click "Generate key pair"
3. Copy the generated key and use it as `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

## Troubleshooting Common Issues

### Service Worker Registration Error
- Ensure `/public/firebase-messaging-sw.js` has actual config values, not environment variables
- Check browser console for service worker errors
- Try clearing browser cache and service workers

### Permission Issues
- The app will automatically request notification permissions
- If denied, users can click "Enable" or "Try to fix notification issues" buttons
- Check browser notification settings

### HTTPS Requirement
- FCM requires HTTPS in production
- `localhost` works for development

## Backend API Changes Required

Your backend login endpoint now expects:

```json
{
  "email": "string",
  "password": "string",
  "fcmToken": "string",
  "deviceType": "string"
}
```

Device types detected:
- `android` - Android devices
- `ios` - iOS devices  
- `mobile` - Other mobile devices
- `tablet` - Tablet devices
- `desktop` - Desktop/laptop devices

## Features Added

1. **Automatic FCM token generation** on login page load
2. **Device type detection** (android, ios, mobile, tablet, desktop)
3. **Permission handling** with user-friendly error messages
4. **Service worker registration** with proper error handling
5. **Retry mechanisms** for FCM initialization
6. **Visual status indicators** for notification state
7. **Debug information** in development mode
8. **Reusable useFCM hook** for other components

## Testing

1. Make sure Firebase is properly configured in BOTH places
2. Clear browser cache and service workers
3. Test notification permissions in browser
4. Check browser console for FCM token generation
5. Verify the login payload includes fcmToken and deviceType

## Usage in Other Components

```tsx
import { useFCM } from '@/hooks/useFCM';

function MyComponent() {
  const { fcmToken, deviceType, isLoading, error, refreshToken, hasPermission } = useFCM();
  
  // Use the values as needed
}
```
