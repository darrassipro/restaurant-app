// app/screens/Chef/DashboardScreen.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import ChefStats from '../../../components/Chef/ChefStats';
import { useGetRestaurantOrdersQuery } from '../../../store/api/orderApi';
import { selectUser } from '../../../store/slices/authSlice';
import { formatCurrency } from '../../../utils/formatters';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector(selectUser);
  
  const { data: ordersData, isLoading, refetch } = useGetRestaurantOrdersQuery();
  const orders = ordersData?.data || [];

  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const navigateToKitchen = () => {
    router.push('/(chef)/kitchen');
  };

  const navigateToOrder = (orderId: number) => {
    router.push(`/(chef)/order-details/${orderId}`);
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        {/* Welcome Message */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            Bonjour, {user?.firstName}!
          </Text>
          <Text className="text-gray-600">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </View>

        {/* Stats */}
        <ChefStats
          pendingCount={pendingOrders.length}
          preparingCount={preparingOrders.length}
          readyCount={readyOrders.length}
        />

        {/* New Orders Section */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">Commandes à traiter</Text>
            <TouchableOpacity onPress={navigateToKitchen}>
              <Text className="text-primary">Voir tout</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="py-10 items-center">
              <ActivityIndicator size="large" color="#FF5733" />
            </View>
          ) : pendingOrders.length > 0 ? (
            pendingOrders.slice(0, 3).map(order => (
              <TouchableOpacity
                key={order.id}
                onPress={() => navigateToOrder(order.id)}
                className="bg-white rounded-lg shadow-sm p-4 mb-3"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-bold text-gray-800">#{order.orderNumber}</Text>
                  <View className="bg-yellow-100 px-2 py-1 rounded">
                    <Text className="text-yellow-800 text-xs">En attente</Text>
                  </View>
                </View>

                <Text className="text-gray-600 mb-2">
                  {order.items?.length} article{order.items?.length !== 1 ? 's' : ''}
                </Text>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">
                    {new Date(order.createdAt).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                  <Text className="font-bold">{formatCurrency(order.total)}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-white rounded-lg shadow-sm p-6 items-center">
              <Feather name="info" size={40} color="#ccc" />
              <Text className="text-gray-500 mt-3">Aucune commande en attente</Text>
            </View>
          )}
        </View>

        {/* Preparing Orders Section */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">En préparation</Text>
          </View>

          {isLoading ? (
            <View className="py-6 items-center">
              <ActivityIndicator size="small" color="#FF5733" />
            </View>
          ) : preparingOrders.length > 0 ? (
            preparingOrders.slice(0, 2).map(order => (
              <TouchableOpacity
                key={order.id}
                onPress={() => navigateToOrder(order.id)}
                className="bg-white rounded-lg shadow-sm p-4 mb-3"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-bold text-gray-800">#{order.orderNumber}</Text>
                  <View className="bg-orange-100 px-2 py-1 rounded">
                    <Text className="text-orange-800 text-xs">En préparation</Text>
                  </View>
                </View>

                <Text className="text-gray-600 mb-2">
                  {order.items?.length} article{order.items?.length !== 1 ? 's' : ''}
                </Text>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">
                    {new Date(order.createdAt).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-white rounded-lg shadow-sm p-6 items-center">
              <Feather name="info" size={40} color="#ccc" />
              <Text className="text-gray-500 mt-3">Aucune commande en préparation</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}