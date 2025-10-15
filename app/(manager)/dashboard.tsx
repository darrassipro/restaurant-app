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
  
  const { data: ordersData, refetch: refetchOrders } = useGetRestaurantOrdersQuery();
  const { data: inventoryData, refetch: refetchInventory } = useGetLowStockInventoryQuery();

  const orders = ordersData?.data || [];
  const lowStockItems = inventoryData?.data || [];

  // Calculate today's orders
  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter(order => order.createdAt.startsWith(today));
  const todaysRevenue = todaysOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);

  // Group orders by status
  const ordersByStatus = {
    pending: orders.filter(order => order.status === 'pending').length,
    confirmed: orders.filter(order => order.status === 'confirmed').length,
    preparing: orders.filter(order => order.status === 'preparing').length,
    ready: orders.filter(order => order.status === 'ready').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
  };

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
        <TodaysSales
          orderCount={todaysOrders.length}
          revenue={todaysRevenue}
        />

        {/* Orders Overview */}
        <OrdersOverview ordersByStatus={ordersByStatus} />

        {/* Inventory Status */}
        <InventoryStatus lowStockItems={lowStockItems} />
      </View>
    </ScrollView>
  );
}