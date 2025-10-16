import { Feather } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useGetRestaurantOrdersQuery } from '../../store/api/orderApi';
import { ORDER_STATUS } from '../../utils/constants';

type OrderStatusKey = keyof typeof ORDER_STATUS;

const OrdersOverview = () => {
  const { data: ordersData, isLoading } = useGetRestaurantOrdersQuery();

  const ordersByStatus = useMemo(() => {
    const orders = ordersData?.data || [];
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  }, [ordersData]);

  if (isLoading) {
    return (
      <View className="bg-white rounded-lg shadow-sm p-4 mb-6 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  const getStatusIconAndColor = (status: OrderStatusKey) => {
    const iconMap = {
      pending: 'clock',
      confirmed: 'check-circle',
      preparing: 'thermometer',
      ready: 'package',
      delivered: 'check-square',
      cancelled: 'x-circle',
    };
    return { icon: iconMap[status], color: ORDER_STATUS[status].color };
  };

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <Text className="text-lg font-bold mb-4">Aperçu des commandes</Text>
      <View className="flex-row flex-wrap justify-between">
        {(Object.keys(ordersByStatus) as OrderStatusKey[]).map((status) => {
          const { icon, color } = getStatusIconAndColor(status);
          return (
            <View key={status} className="w-[30%] items-center mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: `${color}20` }}
              >
                <Feather name={icon as any} size={24} color={color} />
              </View>
              <Text className="text-xl font-bold text-gray-800">{ordersByStatus[status]}</Text>
              <Text className="text-gray-600 text-center">{ORDER_STATUS[status].label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default OrdersOverview;