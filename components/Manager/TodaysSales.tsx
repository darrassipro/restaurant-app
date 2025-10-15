// components/Manager/TodaysSales.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { formatCurrency } from '../../utils/formatters';

interface TodaysSalesProps {
  orderCount: number;
  revenue: number;
}

const TodaysSales = ({ orderCount, revenue }: TodaysSalesProps) => {
  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <Text className="text-lg font-bold mb-4">Ventes aujourd'hui</Text>
      
      <View className="flex-row justify-between">
        <View className="items-center">
          <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
            <Feather name="shopping-bag" size={24} color="#3B82F6" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">{orderCount}</Text>
          <Text className="text-gray-600">Commandes</Text>
        </View>
        
        <View className="items-center">
          <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
            <Feather name="dollar-sign" size={24} color="#10B981" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">{formatCurrency(revenue)}</Text>
          <Text className="text-gray-600">Revenus</Text>
        </View>
      </View>
    </View>
  );
};

export default TodaysSales;