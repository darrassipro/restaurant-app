// app/screens/Admin/RecentOrders.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Order } from '../../../types/order';
import { ORDER_STATUS } from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface RecentOrdersProps {
  orders: Order[];
  limit?: number;
  showViewAll?: boolean;
}

export default function RecentOrders({ orders, limit = 5, showViewAll = true }: RecentOrdersProps) {
  const displayOrders = limit ? orders.slice(0, limit) : orders;

  const navigateToOrderDetails = (orderId: number) => {
    router.push(`/(admin)/orders/${orderId}`);
  };

  const navigateToAllOrders = () => {
    router.push('/(admin)/orders');
  };

  const getStatusColor = (status: string) => {
    return ORDER_STATUS[status]?.color || '#666';
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      onPress={() => navigateToOrderDetails(item.id)}
      className="border-b border-gray-100 py-3"
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="font-medium">#{item.orderNumber}</Text>
          <Text className="text-gray-600 text-sm">
            {item.User?.firstName} {item.User?.lastName}
          </Text>
        </View>
        
        <View className="items-end">
          <Text className="font-bold text-primary">{formatCurrency(item.total)}</Text>
          <View className="flex-row items-center">
            <View
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: getStatusColor(item.status) }}
            />
            <Text className="text-gray-600 text-sm">
              {ORDER_STATUS[item.status]?.label || item.status}
            </Text>
          </View>
        </View>
      </View>
      
      <Text className="text-gray-500 text-sm mt-1">
        {formatDate(item.createdAt)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="bg-white rounded-lg shadow-sm p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Commandes récentes</Text>
        {showViewAll && (
          <TouchableOpacity onPress={navigateToAllOrders}>
            <Text className="text-primary">Voir tout</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {displayOrders.length > 0 ? (
        <FlatList
          data={displayOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          scrollEnabled={false}
        />
      ) : (
        <View className="py-6 items-center">
          <Feather name="inbox" size={40} color="#ccc" />
          <Text className="text-gray-500 mt-2">Aucune commande récente</Text>
        </View>
      )}
    </View>
  );
}