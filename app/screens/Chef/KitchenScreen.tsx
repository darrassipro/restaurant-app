// app/screens/Chef/KitchenScreen.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import KitchenOrderCard from '../../../components/Chef/KitchenOrderCard';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../../store/api/orderApi';
import { selectUser } from '../../../store/slices/authSlice';
import { KitchenTab, Order, OrderStatusType } from '../../../types/order';

export default function KitchenScreen() {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState<KitchenTab>('pending');
  const [refreshing, setRefreshing] = useState(false);

  // Since there is only one restaurant with ID 1, use a constant
  const RESTAURANT_ID = 1;
  
  // Check how the useGetOrdersQuery is implemented - modify this based on your actual API
  const {
    data: ordersData,
    isLoading,
    refetch,
    error
  } = useGetOrdersQuery();

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  // Extract orders from the response data and filter manually if needed
  const allOrders: Order[] = ordersData?.data || [];
  
  // Filter orders based on activeTab and restaurantId
  const orders = allOrders.filter(order => 
    order.status === activeTab && 
    (order.id === RESTAURANT_ID || !order.Restaurant)
  );

  // Handle refreshing orders
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Initial load on mount when user is available
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  // Navigate to order details screen
  const handleViewOrderDetails = (orderId: number) => {
    router.push({
      pathname: '/order-details/[id]',
      params: { id: orderId }
    } as never);
  };

  // Update order status
  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatusType) => {
    try {
      await updateOrderStatus({
        id: orderId,
        newStatus
      }).unwrap();
      
      // Refetch orders to update the UI
      refetch();
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Show error message or toast here
    }
  };

  // Render tab button
  const renderTabButton = (tab: KitchenTab, label: string, icon: keyof typeof Feather.glyphMap) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      className={`flex-1 flex-row items-center justify-center py-3 ${
        activeTab === tab ? 'bg-primary rounded-lg' : 'bg-gray-200 rounded-lg'
      }`}
      disabled={activeTab === tab}
    >
      <Feather
        name={icon}
        size={18}
        color={activeTab === tab ? '#FFF' : '#333'}
      />
      <Text
        className={`ml-2 font-medium ${
          activeTab === tab ? 'text-white' : 'text-gray-700'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Render placeholder for empty state
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-4">
      <Feather name="clipboard" size={60} color="#ccc" />
      <Text className="text-lg font-medium text-gray-500 mt-4">
        {activeTab === 'pending'
          ? 'Aucune commande en attente'
          : activeTab === 'preparing'
          ? 'Aucune commande en préparation'
          : 'Aucune commande prête'}
      </Text>
      <TouchableOpacity
        onPress={onRefresh}
        className="mt-4 bg-gray-200 px-4 py-2 rounded-lg"
      >
        <Text>Rafraîchir</Text>
      </TouchableOpacity>
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center p-4">
      <Feather name="alert-circle" size={60} color="#FF5733" />
      <Text className="text-lg font-medium text-gray-700 mt-4">
        Une erreur est survenue
      </Text>
      <Text className="text-gray-500 text-center mb-4">
        Impossible de charger les commandes
      </Text>
      <TouchableOpacity
        onPress={onRefresh}
        className="bg-primary px-4 py-2 rounded-lg"
      >
        <Text className="text-white">Réessayer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header section */}
      <View className="bg-white p-4 shadow-sm">
        <Text className="text-2xl font-bold">Cuisine</Text>
        <Text className="text-gray-600">
          Gérez les commandes en cuisine
        </Text>
      </View>

      {/* Tab navigation */}
      <View className="flex-row p-4 space-x-2">
        {renderTabButton('pending', 'En attente', 'clock')}
        {renderTabButton('preparing', 'En préparation', 'loader')}
        {renderTabButton('ready', 'Prêts', 'check-circle')}
      </View>

      {/* Orders list */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF5733" />
          <Text className="mt-2 text-gray-600">Chargement des commandes...</Text>
        </View>
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <KitchenOrderCard
              order={item}
              onViewDetails={() => handleViewOrderDetails(item.id)}
              onUpdateStatus={(status) => handleUpdateStatus(item.id, status)}
              currentTab={activeTab}
            />
          )}
          contentContainerStyle={{ 
            flexGrow: 1,
            padding: 4,
            paddingBottom: 20
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF5733']}
            />
          }
          ListEmptyComponent={renderEmptyState()}
        />
      )}

      {/* Floating action button for filtering or additional actions */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={onRefresh}
      >
        <Feather name="refresh-cw" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Loading overlay when updating status */}
      {isUpdating && (
        <View className="absolute inset-0 bg-black/30 items-center justify-center">
          <View className="bg-white p-4 rounded-lg">
            <ActivityIndicator size="large" color="#FF5733" />
            <Text className="mt-2">Mise à jour...</Text>
          </View>
        </View>
      )}
    </View>
  );
}