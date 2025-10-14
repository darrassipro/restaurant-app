// app/screens/Manager/DashboardScreen.tsx
import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import InventoryStatus from '../../../components/Manager/InventoryStatus';
import OrdersOverview from '../../../components/Manager/OrdersOverview';
import TodaysSales from '../../../components/Manager/TodaysSales';
import { useGetLowStockInventoryQuery } from '../../../store/api/inventoryApi';
import { useGetRestaurantOrdersQuery } from '../../../store/api/orderApi';
import { Inventory } from '../../../types/inventory';
import { Order } from '../../../types/order';

// Define OrderStatus types for type safety
type OrderStatusKey = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

// Define the shape of ordersByStatus for better type checking
interface OrderStatusCounts {
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  delivered: number;
  cancelled: number;
}

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const { 
    data: ordersData, 
    refetch: refetchOrders 
  } = useGetRestaurantOrdersQuery();
  
  const { 
    data: inventoryData, 
    refetch: refetchInventory 
  } = useGetLowStockInventoryQuery();

  const orders: Order[] = ordersData?.data || [];
  const lowStockItems: Inventory[] = inventoryData?.data || [];

  // Calculate today's orders
  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter(order => 
    order.createdAt.startsWith(today)
  );
  
  const totalRevenue = todaysOrders.reduce(
    (sum, order) => sum + parseFloat(order.total), 0
  );

  // Group orders by status with proper typing
  const ordersByStatus: OrderStatusCounts = {
    pending: orders.filter(order => order.status === 'pending').length,
    confirmed: orders.filter(order => order.status === 'confirmed').length,
    preparing: orders.filter(order => order.status === 'preparing').length,
    ready: orders.filter(order => order.status === 'ready').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await Promise.all([
      refetchOrders(),
      refetchInventory()
    ]);
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
          Tableau de bord
        </Text>

        {/* Today's Sales Summary */}
        <TodaysSales
          orderCount={todaysOrders.length}
          revenue={totalRevenue}
        />

        {/* Orders Overview */}
        <OrdersOverview ordersByStatus={ordersByStatus} />

        {/* Inventory Alerts */}
        <InventoryStatus lowStockItems={lowStockItems} />
      </View>
    </ScrollView>
  );
}