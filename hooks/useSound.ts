// hooks/useSound.ts
import { Audio, AVPlaybackSource, AVPlaybackStatus } from 'expo-av';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectSoundEnabled } from '../store/slices/notificationsSlice';

// Define sound assets with proper AVPlaybackSource type
// Using require directly causes type issues, so we need to properly cast them
const SOUND_ASSETS: Record<string, AVPlaybackSource> = {
  notification: require('../assets/sounds/notification.mp3') as unknown as AVPlaybackSource,
  order: require('../assets/sounds/order.mp3') as unknown as AVPlaybackSource,
  error: require('../assets/sounds/error.mp3') as unknown as AVPlaybackSource,
};

export const useSound = () => {
  const soundEnabled = useSelector(selectSoundEnabled);
  
  // Configure audio on mount
  useEffect(() => {
    const configureAudio = async (): Promise<void> => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Failed to configure audio:', error);
      }
    };
    
    configureAudio();
  }, []);
  
  const playSound = async (type: keyof typeof SOUND_ASSETS): Promise<void> => {
    if (!soundEnabled) return;
    
    try {
      const { sound } = await Audio.Sound.createAsync(SOUND_ASSETS[type]);
      await sound.playAsync();
      
      // Clean up after playing
      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  return {
    playSound,
  };
};