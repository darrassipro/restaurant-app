import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  data?: any;
}

interface NotificationsState {
  notifications: Notification[];
  soundEnabled: boolean;
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  soundEnabled: true,
  unreadCount: 0,
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const newNotification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      state.notifications.unshift(newNotification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      
      if (index !== -1 && !state.notifications[index].read) {
        state.unreadCount -= 1;
      }
      
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  toggleSound,
  setSoundEnabled,
} = notificationsSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectSoundEnabled = (state: RootState) => state.notifications.soundEnabled;

export default notificationsSlice.reducer;