import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  className?: string;
}

const StatsCard = ({ title, value, icon, iconColor, iconBgColor, className }: StatsCardProps) => {
  return (
    <View className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <View className="flex-row items-center mb-3">
        <View 
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: iconBgColor }}
        >
          <Feather name={icon as any} size={20} color={iconColor} />
        </View>
        <Text className="text-gray-600">{title}</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800">{value}</Text>
    </View>
  );
};

export default StatsCard;