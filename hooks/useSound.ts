// hooks/useSound.ts
import { Audio } from 'expo-av';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectSoundEnabled } from '../store/slices/notificationsSlice';

// Define sound assets
const SOUND_ASSETS = {
  notification: require('../assets/sounds/notification.mp3'),
  order: require('../assets/sounds/order.mp3'),
  error: require('../assets/sounds/error.mp3'),
};

export const useSound = () => {
  const soundEnabled = useSelector(selectSoundEnabled);
  
  // Configure audio on mount
  useEffect(() => {
    const configureAudio = async () => {
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
  
  const playSound = async (type: keyof typeof SOUND_ASSETS) => {
    if (!soundEnabled) return;
    
    try {
      const { sound } = await Audio.Sound.createAsync(SOUND_ASSETS[type]);
      await sound.playAsync();
      
      // Clean up after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
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