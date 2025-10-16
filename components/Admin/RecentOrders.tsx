import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useGetOrdersQuery } from '../../store/api/orderApi';
import { formatCurrency, formatDate } from '../../utils/formatters';

const RecentOrders = () => {
  const { data: ordersData, isLoading, refetch } = useGetOrdersQuery();
  const orders = ordersData?.data?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <View className="bg-white rounded-lg shadow-sm p-4 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg shadow-sm p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Commandes récentes</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text className="text-primary">Actualiser</Text>
        </TouchableOpacity>
      </View>

      {orders.length > 0 ? (
        <>
          {orders.map((order) => (
            <View key={order.id} className="border-b border-gray-100 py-3">
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
                  <Text className="text-gray-600 text-sm capitalize">{order.status}</Text>
                </View>
              </View>
              <Text className="text-gray-500 text-sm mt-1">{formatDate(order.createdAt)}</Text>
            </View>
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