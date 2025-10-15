import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface ChefStatsProps {
  pendingCount: number;
  preparingCount: number;
  readyCount: number;
}

const ChefStats = ({ pendingCount, preparingCount, readyCount }: ChefStatsProps) => {
  return (
    <View className="flex-row justify-between">
      <View className="bg-yellow-50 rounded-lg p-4 flex-1 mr-2 shadow-sm">
        <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mb-2">
          <Feather name="clock" size={20} color="#F59E0B" />
        </View>
        <Text className="text-2xl font-bold text-gray-800">{pendingCount}</Text>
        <Text className="text-gray-600">En attente</Text>
      </View>
      
      <View className="bg-orange-50 rounded-lg p-4 flex-1 mr-2 shadow-sm">
        <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mb-2">
          <Feather name="thermometer" size={20} color="#F97316" />
        </View>
        <Text className="text-2xl font-bold text-gray-800">{preparingCount}</Text>
        <Text className="text-gray-600">En préparation</Text>
      </View>
      
      <View className="bg-green-50 rounded-lg p-4 flex-1 shadow-sm">
        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-2">
          <Feather name="check-circle" size={20} color="#10B981" />
        </View>
        <Text className="text-2xl font-bold text-gray-800">{readyCount}</Text>
        <Text className="text-gray-600">Prêts</Text>
      </View>
    </View>
  );
};

export default ChefStats;