// src/components/Admin/RecentOrders.tsx
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Order } from '../../types/order';
import { ORDER_STATUS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const navigation = useNavigation();

  const navigateToOrderDetails = (orderId: number) => {
    // navigation.navigate('OrderDetails', { orderId });
  };

  const navigateToAllOrders = () => {
    // navigation.navigate('OrdersDrawer');
  };

  const getStatusColor = (status: string) => {
    // return ORDER_STATUS[status]?.color || '#666';
  };

  return (
    <View className="bg-white rounded-lg shadow-sm p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Commandes récentes</Text>
        <TouchableOpacity onPress={navigateToAllOrders}>
          <Text className="text-primary">Voir tout</Text>
        </TouchableOpacity>
      </View>

      {orders.length > 0 ? (
        <>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => navigateToOrderDetails(order.id)}
              className="border-b border-gray-100 py-3"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="font-medium">#{order.orderNumber}</Text>
                  <Text className="text-gray-600 text-sm">
                    {order.User?.firstName} {order.User?.lastName}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="font-bold text-primary">
                    {formatCurrency(order.total)}
                  </Text>
                  <View className="flex-row items-center">
                    <View
                      className="w-2 h-2 rounded-full mr-1"
                      // style={{ backgroundColor: getStatusColor(order.status) }}
                    />
                    <Text className="text-gray-600 text-sm">
                      {ORDER_STATUS[order.status]?.label || order.status}
                    </Text>
                  </View>
                </View>
              </View>

              <Text className="text-gray-500 text-sm mt-1">
                {formatDate(order.createdAt)}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View className="py-6 items-center">
          <Feather name="inbox" size={40} color="#ccc" />
          <Text className="text-gray-500 mt-2">Aucune commande récente</Text>
        </View>
      )}
    </View>
  );
};

export default RecentOrders;
