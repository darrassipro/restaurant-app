import React, { useMemo } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useGetOrdersQuery } from '../../store/api/orderApi';

const SalesChart = () => {
  const { data: ordersData, isLoading } = useGetOrdersQuery();
  const screenWidth = Dimensions.get('window').width - 40;

  const salesData = useMemo(() => {
    const orders = ordersData?.data || [];
    
    // Get last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Calculate daily totals
    return last7Days.map(date => {
      const dailyOrders = orders.filter(order => order.createdAt.startsWith(date));
      const total = dailyOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      return { date, total };
    });
  }, [ordersData]);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(255, 87, 51, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const chartData = {
    labels: salesData.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: salesData.map(item => item.total || 0),
        color: (opacity = 1) => `rgba(255, 87, 51, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  if (isLoading) {
    return (
      <View className="bg-white rounded-lg shadow-sm p-4 mb-6 justify-center items-center" style={{ height: 250 }}>
        <ActivityIndicator size="large" color="#FF5733" />
        <Text className="text-gray-600 mt-2">Chargement des données...</Text>
      </View>
    );
  }

  // Check if there's any data
  const hasData = salesData.some(item => item.total > 0);

  if (!hasData) {
    return (
      <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <Text className="text-lg font-bold mb-4">Ventes des 7 derniers jours</Text>
        <View className="items-center justify-center py-12">
          <Text className="text-gray-500">Aucune vente dans les 7 derniers jours</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <Text className="text-lg font-bold mb-4">Ventes des 7 derniers jours</Text>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          borderRadius: 8,
        }}
        yAxisSuffix=" MAD"
      />
    </View>
  );
};

export default SalesChart;