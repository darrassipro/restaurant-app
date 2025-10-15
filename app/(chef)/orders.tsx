// app/(chef)/orders.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useGetRestaurantOrdersQuery } from '../../store/api/orderApi';
import { Order } from '../../types/order';
import { ORDER_STATUS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ChefOrdersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { data: ordersData, isLoading, refetch } = useGetRestaurantOrdersQuery();

  const orders: Order[] = ordersData?.data || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const navigateToOrderDetails = (orderId: number) => {
    router.push({ pathname: '/(chef)/order-details/[id]', params: { id: orderId } } as never);
  };

  const getStatusColor = (status: string) => {
    const statusKey = status as keyof typeof ORDER_STATUS;
    return ORDER_STATUS[statusKey]?.color || '#666';
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      onPress={() => navigateToOrderDetails(item.id)}
      className="bg-white mx-4 my-2 rounded-lg shadow-sm p-4"
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Text className="font-bold text-gray-800 mr-2">#{item.orderNumber}</Text>
          <View
            style={{ backgroundColor: `${getStatusColor(item.status)}20` }}
            className="px-2 py-1 rounded-full"
          >
            <Text style={{ color: getStatusColor(item.status) }} className="text-xs font-medium">
              {ORDER_STATUS[item.status as keyof typeof ORDER_STATUS]?.label || item.status}
            </Text>
          </View>
        </View>
        <Text className="font-bold text-primary">{formatCurrency(item.total)}</Text>
      </View>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-600">
          {item.items?.length || 0} article{item.items?.length !== 1 ? 's' : ''}
        </Text>
        <Text className="text-gray-600">{formatDate(item.createdAt)}</Text>
      </View>
      {item.User && (
        <View className="flex-row items-center">
          <Feather name="user" size={14} color="#666" />
          <Text className="text-gray-700 ml-1">
            {item.User.firstName} {item.User.lastName}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">Toutes les commandes</Text>
      </View>

      {isLoading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF5733" />
        </View>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF5733']} />
          }
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-6">
          <Feather name="inbox" size={80} color="#ccc" />
          <Text className="text-xl font-medium text-gray-800 mt-4">Aucune commande</Text>
          <Text className="text-gray-500 text-center mt-2">
            Les commandes apparaîtront ici
          </Text>
        </View>
      )}
    </View>
  );
}
