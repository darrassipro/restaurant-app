// app/(chef)/kitchen.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import KitchenOrderCard from '../../components/Chef/KitchenOrderCard';
import { useSocket } from '../../hooks/useSocket';
import { useSound } from '../../hooks/useSound';
import { useGetRestaurantOrdersQuery, useUpdateOrderStatusMutation } from '../../store/api/orderApi';

export default function KitchenScreen() {
  const { playSound } = useSound();
  const { isConnected } = useSocket();
  
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready'>('pending');
  
  const { data: ordersData, isLoading, refetch } = useGetRestaurantOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  
  const orders = ordersData?.data || [];
  
  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');
  
  let displayOrders = [];
  switch (activeTab) {
    case 'pending':
      displayOrders = pendingOrders;
      break;
    case 'preparing':
      displayOrders = preparingOrders;
      break;
    case 'ready':
      displayOrders = readyOrders;
      break;
  }

  const handleUpdateStatus = async (orderId: number, newStatus: 'confirmed' | 'preparing' | 'ready') => {
    try {
      await updateOrderStatus({ id: orderId, newStatus }).unwrap();
      playSound('notification');
      refetch();
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  const handleViewOrder = (orderId: number) => {
    router.push(`/chef/order-details/${orderId}`);
  };

  const renderTab = (
    tabId: 'pending' | 'preparing' | 'ready', 
    label: string, 
    count: number, 
    icon: string
  ) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tabId)}
      className={`flex-1 py-3 ${
        activeTab === tabId 
          ? 'border-b-2 border-primary' 
          : 'border-b border-gray-300'
      }`}
    >
      <View className="flex-row justify-center items-center">
        <Feather 
          name={icon as any} 
          size={18} 
          color={activeTab === tabId ? '#FF5733' : '#666'} 
        />
        <Text
          className={`ml-2 ${
            activeTab === tabId 
              ? 'text-primary font-bold' 
              : 'text-gray-600'
          }`}
        >
          {label} ({count})
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Socket Status */}
      {!isConnected && (
        <View className="bg-red-100 px-4 py-2">
          <Text className="text-red-800 text-center">
            <Feather name="wifi-off" size={14} /> Déconnecté des mises à jour en temps réel
          </Text>
        </View>
      )}
      
      {/* Tabs */}
      <View className="flex-row bg-white shadow-sm">
        {renderTab('pending', 'En attente', pendingOrders.length, 'clock')}
        {renderTab('preparing', 'En préparation', preparingOrders.length, 'thermometer')}
        {renderTab('ready', 'Prêts', readyOrders.length, 'check-circle')}
      </View>
      
      {/* Order List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF5733" />
        </View>
      ) : displayOrders.length > 0 ? (
        <FlatList
          data={displayOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <KitchenOrderCard
              order={item}
              onViewDetails={() => handleViewOrder(item.id)}
              onUpdateStatus={(status) => handleUpdateStatus(item.id, status)}
              currentTab={activeTab}
            />
          )}
          contentContainerClassName="p-4"
          refreshing={isLoading || isUpdating}
          onRefresh={refetch}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Feather name="inbox" size={60} color="#ccc" />
          <Text className="text-lg text-gray-500 mt-4">
            Aucune commande {
              activeTab === 'pending' ? 'en attente' : 
              activeTab === 'preparing' ? 'en préparation' : 'prête'
            }
          </Text>
        </View>
      )}
    </View>
  );
}