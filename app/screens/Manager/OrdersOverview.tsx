import { Feather } from '@expo/vector-icons';
import { styled } from 'nativewind';
import React from 'react';
import { Text, View } from 'react-native';
import { ORDER_STATUS } from '../../utils/constants';

interface OrdersOverviewProps {
  ordersByStatus: {
    pending: number;
    confirmed: number;
    preparing: number;
    ready: number;
    delivered: number;
  };
}

const OrdersOverview = ({ ordersByStatus }: OrdersOverviewProps) => {
  const getStatusIconAndColor = (status: string) => {
    const color = ORDER_STATUS[status]?.color || '#666';
    let icon;
    
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
      default:
        icon = 'circle';
    }
    
    return { icon, color };
  };

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <Text className="text-lg font-bold mb-4">Aperçu des commandes</Text>
      
      <View className="flex-row flex-wrap justify-between">
        {Object.entries(ordersByStatus).map(([status, count]) => {
          const { icon, color } = getStatusIconAndColor(status);
          
          return (
            <View key={status} className="w-[30%] items-center mb-4">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: `${color}20` }}
              >
                <Feather name={icon as any} size={24} color={color} />
              </View>
              <Text className="text-xl font-bold text-gray-800">{count}</Text>
              <Text className="text-gray-600 text-center">{ORDER_STATUS[status]?.label || status}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default styled(OrdersOverview);