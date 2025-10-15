// hooks/useSound.ts
import { useAudioPlayer } from 'expo-audio';
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
  const notificationPlayer = useAudioPlayer(SOUND_ASSETS.notification);
  const orderPlayer = useAudioPlayer(SOUND_ASSETS.order);
  const errorPlayer = useAudioPlayer(SOUND_ASSETS.error);

  const playSound = async (type: keyof typeof SOUND_ASSETS): Promise<void> => {
    if (!soundEnabled) return;

    try {
      let player;
      switch (type) {
        case 'notification':
          player = notificationPlayer;
          break;
        case 'order':
          player = orderPlayer;
          break;
        case 'error':
          player = errorPlayer;
          break;
        default:
          return;
      }

      // Reset to start and play
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  return {
    playSound,
  };
};