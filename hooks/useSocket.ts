// hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { selectUser } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { Order } from '../types/order';
import { SOCKET_URL } from '../utils/constants';

interface LowStockAlert {
  dishId: number;
  dishName: string;
  currentStock: number;
  minimumStock: number;
  percentage: number;
}

interface OrderStatusUpdate {
  orderId: number;
  newStatus: string;
  orderNumber: string;
  customerId?: number;
  restaurantId?: number;
  timestamp: string;
}

interface CustomerNotification {
  orderId: number;
  message: string;
  orderNumber: string;
  status: string;
}

export const useSocket = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if we have a user
    if (user) {
      // Initialize socket connection
      socketRef.current = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      // Connection events
      socketRef.current.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        
        // Join user-specific rooms
        socketRef.current?.emit('join', {
          userId: user.id,
          role: user.role,
          restaurantId: user.role === 'manager' || user.role === 'chef' ? 1 : undefined, // Assuming restaurant ID 1
        });
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socketRef.current.on('error', (error: Error) => {
        console.error('Socket error:', error);
      });

      // Listen for notifications based on user role
      if (user.role === 'admin' || user.role === 'manager' || user.role === 'chef') {
        // Restaurant staff notifications
        socketRef.current.on('newOrder', (order: Order) => {
          dispatch(
            addNotification({
              message: `Nouvelle commande reçue: ${order.orderNumber}`,
              type: 'info',
              data: order,
            })
          );
        });

        socketRef.current.on('lowStockAlert', (alert: LowStockAlert) => {
          dispatch(
            addNotification({
              message: `Stock bas: ${alert.dishName} (${alert.currentStock} restant)`,
              type: 'warning',
              data: alert,
            })
          );
        });
      }

      if (user.role === 'customer') {
        // Customer notifications
        socketRef.current.on('customerNotification', (notification: CustomerNotification) => {
          dispatch(
            addNotification({
              message: notification.message,
              type: 'info',
              data: notification,
            })
          );
        });
      }

      socketRef.current.on('orderStatusUpdated', (update: OrderStatusUpdate) => {
        const statusMessages: Record<string, string> = {
          confirmed: 'Commande confirmée',
          preparing: 'Commande en préparation',
          ready: 'Commande prête',
          delivered: 'Commande livrée',
          cancelled: 'Commande annulée',
        };
        
        const message = `${statusMessages[update.newStatus] || 'Statut mis à jour'}: ${update.orderNumber}`;
        
        dispatch(
          addNotification({
            message,
            type: update.newStatus === 'cancelled' ? 'error' : 'info',
            data: update,
          })
        );
      });

      // Clean up on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user, dispatch]);

  // Function to emit events
  const emit = (eventName: string, data?: any): boolean => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(eventName, data);
      return true;
    }
    return false;
  };

  // Toggle sound alerts
  const toggleSoundAlerts = (enabled: boolean): void => {
    if (user) {
      emit('toggleSoundAlerts', {
        userId: user.id,
        enabled,
      });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    toggleSoundAlerts,
  };
};