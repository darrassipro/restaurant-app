import { Feather } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useGetRestaurantOrdersQuery } from '../../store/api/orderApi';
import { formatCurrency } from '../../utils/formatters';

const TodaysSales = () => {
  const { data: ordersData, isLoading } = useGetRestaurantOrdersQuery();

  const stats = useMemo(() => {
    const orders = ordersData?.data || [];
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orders.filter(order => order.createdAt.startsWith(today));
    const revenue = todaysOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);

    return { orderCount: todaysOrders.length, revenue };
  }, [ordersData]);

  if (isLoading) {
    return (
      <View className="bg-white rounded-lg shadow-sm p-4 mb-6 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <Text className="text-lg font-bold mb-4">Ventes aujourd'hui</Text>
      <View className="flex-row justify-between">
        <View className="items-center">
          <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
            <Feather name="shopping-bag" size={24} color="#3B82F6" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">{stats.orderCount}</Text>
          <Text className="text-gray-600">Commandes</Text>
        </View>
        <View className="items-center">
          <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
            <Feather name="dollar-sign" size={24} color="#10B981" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">{formatCurrency(stats.revenue)}</Text>
          <Text className="text-gray-600">Revenus</Text>
        </View>
      </View>
    </View>
  );
};

export default TodaysSales;