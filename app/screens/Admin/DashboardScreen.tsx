import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import RecentOrders from '../../components/Admin/RecentOrders';
import SalesChart from '../../components/Admin/SalesChart';
import StatsCard from '../../components/Admin/StatsCard';
import { useGetDishesQuery } from '../../store/api/dishApi';
import { useGetOrdersQuery } from '../../store/api/orderApi';
import { useGetRestaurantQuery } from '../../store/api/restaurantApi';
import { useGetUsersQuery } from '../../store/api/userApi';

const DashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: usersData, refetch: refetchUsers } = useGetUsersQuery({ page: 1, limit: 1 });
  const { data: restaurantData, refetch: refetchRestaurant } = useGetRestaurantQuery();
  const { data: ordersData, refetch: refetchOrders } = useGetOrdersQuery();
  const { data: dishesData, refetch: refetchDishes } = useGetDishesQuery({ page: 1, limit: 1 });
  
  const totalUsers = usersData?.data?.pagination?.total || 0;
  const totalDishes = dishesData?.pagination?.totalDishes || 0;
  const orders = ordersData?.data || [];
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  
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
  
  // Prepare data for chart
  const salesData = React.useMemo(() => {
    // Group orders by date and calculate daily totals
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const dailyTotals = last7Days.map(date => {
      const dailyOrders = orders.filter(order => order.createdAt.startsWith(date));
      const total = dailyOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      return { date, total };
    });
    
    return dailyTotals;
  }, [orders]);

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
          />
          
          <StatsCard
            title="Revenu aujourd'hui"
            value={todaysRevenue.toFixed(2) + " MAD"}
            icon="dollar-sign"
            iconColor="#10B981"
            iconBgColor="#ECFDF5"
            className="w-[48%]"
          />
          
          <StatsCard
            title="Total utilisateurs"
            value={totalUsers.toString()}
            icon="users"
            iconColor="#F59E0B"
            iconBgColor="#FFFBEB"
            className="w-[48%] mt-4"
          />
          
          <StatsCard
            title="Total plats"
            value={totalDishes.toString()}
            icon="coffee"
            iconColor="#6366F1"
            iconBgColor="#EEF2FF"
            className="w-[48%] mt-4"
          />
        </View>

        {/* Sales Chart */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <Text className="text-lg font-bold mb-4">Ventes des 7 derniers jours</Text>
          <SalesChart data={salesData} />
        </View>

        {/* Recent Orders */}
        <RecentOrders orders={orders.slice(0, 5)} />
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;