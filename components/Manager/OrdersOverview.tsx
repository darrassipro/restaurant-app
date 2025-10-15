// components/Manager/OrdersOverview.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { ORDER_STATUS } from '../../utils/constants';

// Define OrderStatus types for type safety
type OrderStatusKey = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface OrderStatusCounts {
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  delivered: number;
  cancelled: number;
}

interface OrdersOverviewProps {
  ordersByStatus: OrderStatusCounts;
}

const OrdersOverview = ({ ordersByStatus }: OrdersOverviewProps) => {
  // Type-safe function to get icon and color for a status
  const getStatusIconAndColor = (status: OrderStatusKey): { icon: string; color: string } => {
    const color = ORDER_STATUS[status].color;
    let icon: string;
    
    switch (status) {
      case 'pending':
        icon = 'clock';
        break;
      case 'confirmed':
        icon = 'check-circle';
        break;
      case 'preparing':
        icon = 'thermometer';
        break;
      case 'ready':
        icon = 'package';
        break;
      case 'delivered':
        icon = 'check-square';
        break;
      case 'cancelled':
        icon = 'x-circle';
        break;
      default:
        icon = 'circle';
        // This case won't occur due to our type system, but TypeScript expects a default
    }
    
    return { icon, color };
  };

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <Text className="text-lg font-bold mb-4">Aperçu des commandes</Text>
      
      <View className="flex-row flex-wrap justify-between">
        {(Object.keys(ordersByStatus) as OrderStatusKey[]).map((status) => {
          const { icon, color } = getStatusIconAndColor(status);
          
          return (
            <View key={status} className="w-[30%] items-center mb-4">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: `${color}20` }}
              >
                <Feather name={icon as any} size={24} color={color} />
              </View>
              <Text className="text-xl font-bold text-gray-800">{ordersByStatus[status]}</Text>
              <Text className="text-gray-600 text-center">{ORDER_STATUS[status].label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default OrdersOverview;