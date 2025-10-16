// app/(admin)/dashboard.tsx
import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import RecentOrders from '../../components/Admin/RecentOrders';
import SalesChart from '../../components/Admin/SalesChart';
import StatsCard from '../../components/Admin/StatsCard';
import { useGetDishesQuery } from '../../store/api/dishApi';
import { useGetOrdersQuery } from '../../store/api/orderApi';
import { useGetRestaurantQuery } from '../../store/api/restaurantApi';
import { useGetUsersQuery } from '../../store/api/userApi';

export default function AdminDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: usersData, refetch: refetchUsers, isLoading: loadingUsers } = useGetUsersQuery({ page: 1, limit: 1 });
  const { data: restaurantData, refetch: refetchRestaurant } = useGetRestaurantQuery();
  const { data: ordersData, refetch: refetchOrders, isLoading: loadingOrders } = useGetOrdersQuery();
  const { data: dishesData, refetch: refetchDishes, isLoading: loadingDishes } = useGetDishesQuery({ page: 1, limit: 1 });
  
  const totalUsers = usersData?.data?.pagination?.total || 0;
  const totalDishes = dishesData?.pagination?.totalDishes || 0;
  const orders = ordersData?.data || [];
  
  // Calculate today's orders
  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter(order => order.createdAt.startsWith(today));
  const todaysRevenue = todaysOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchUsers(),
      refetchRestaurant(),
      refetchOrders(),
      refetchDishes()
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

        {/* Stats Overview */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <StatsCard
            title="Commandes aujourd'hui"
            value={todaysOrders.length.toString()}
            icon="shopping-bag"
            iconColor="#3B82F6"
            iconBgColor="#EFF6FF"
            className="w-[48%]"
            loading={loadingOrders}
          />
          
          <StatsCard
            title="Revenu aujourd'hui"
            value={todaysRevenue.toFixed(2) + " MAD"}
            icon="dollar-sign"
            iconColor="#10B981"
            iconBgColor="#ECFDF5"
            className="w-[48%]"
            loading={loadingOrders}
          />
          
          <StatsCard
            title="Total utilisateurs"
            value={totalUsers.toString()}
            icon="users"
            iconColor="#F59E0B"
            iconBgColor="#FFFBEB"
            className="w-[48%] mt-4"
            loading={loadingUsers}
          />
          
          <StatsCard
            title="Total plats"
            value={totalDishes.toString()}
            icon="coffee"
            iconColor="#6366F1"
            iconBgColor="#EEF2FF"
            className="w-[48%] mt-4"
            loading={loadingDishes}
          />
        </View>

        {/* Sales Chart */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <SalesChart />
        </View>

        {/* Recent Orders */}
        <RecentOrders />
      </View>
    </ScrollView>
  );
}