import { useCallback } from 'react';

export interface NotificationSoundOptions {
  volume?: number; // 0 to 1
  loop?: boolean;
  autoplay?: boolean;
}

export function useNotificationSound() {
  const playSound = useCallback((options: NotificationSoundOptions = {}) => {
    try {
      const { volume = 0.5, loop = false } = options;
      
      console.log('Playing notification sound with options:', options);
      
      const audio = new Audio('/notification.mp3');
      audio.volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0-1
      audio.loop = loop;
      audio.preload = 'auto';
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        return playPromise
          .then(() => {
            console.log('Notification sound played successfully');
            return true;
          })
          .catch((error) => {
            console.error('Error playing notification sound:', error);
            
            // Provide fallback options
            if (error.name === 'NotAllowedError') {
              console.warn('Audio playback was prevented by browser policy. User interaction may be required.');
            }
            
            return false;
          });
      }
      
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error setting up notification sound:', error);
      return Promise.resolve(false);
    }
  }, []);

  const preloadSound = useCallback(() => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.preload = 'auto';
      audio.load();
      console.log('Notification sound preloaded');
    } catch (error) {
      console.error('Error preloading notification sound:', error);
    }
  }, []);

  const testSoundAvailability = useCallback(() => {
    try {
      const audio = new Audio();
      return {
        supported: true,
        canPlayMP3: audio.canPlayType('audio/mpeg') !== '',
        userInteractionRequired: false // This would need to be tested dynamically
      };
    } catch (error) {
      return {
        supported: false,
        canPlayMP3: false,
        userInteractionRequired: true
      };
    }
  }, []);

  return {
    playSound,
    preloadSound,
    testSoundAvailability
  };
}

export default useNotificationSound;
