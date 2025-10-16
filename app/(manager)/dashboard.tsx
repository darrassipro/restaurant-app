// app/(manager)/dashboard.tsx
import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import InventoryStatus from '../../components/Manager/InventoryStatus';
import OrdersOverview from '../../components/Manager/OrdersOverview';
import TodaysSales from '../../components/Manager/TodaysSales';
import { useGetLowStockInventoryQuery } from '../../store/api/inventoryApi';
import { useGetRestaurantOrdersQuery } from '../../store/api/orderApi';

export default function ManagerDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  
  const { refetch: refetchOrders } = useGetRestaurantOrdersQuery();
  const { refetch: refetchInventory } = useGetLowStockInventoryQuery();

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchOrders(), refetchInventory()]);
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Tableau de bord Manager
        </Text>

        {/* Today's Sales */}
        <TodaysSales />

        {/* Orders Overview */}
        <OrdersOverview />

        {/* Inventory Status */}
        <InventoryStatus />
      </View>
    </ScrollView>
  );
}