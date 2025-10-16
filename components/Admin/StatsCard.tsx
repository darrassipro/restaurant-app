import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  className?: string;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  iconColor, 
  iconBgColor, 
  className = '',
  loading = false,
  trend
}: StatsCardProps) => {
  return (
    <View className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <View className="flex-row items-center mb-3">
        <View 
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: iconBgColor }}
        >
          <Feather name={icon as any} size={20} color={iconColor} />
        </View>
        <Text className="text-gray-600 flex-1">{title}</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <>
          <Text className="text-2xl font-bold text-gray-800">{value}</Text>
          {trend && (
            <View className="flex-row items-center mt-1">
              <Feather 
                name={trend.isPositive ? 'trending-up' : 'trending-down'} 
                size={14} 
                color={trend.isPositive ? '#10B981' : '#EF4444'} 
              />
              <Text 
                className="text-xs ml-1"
                style={{ color: trend.isPositive ? '#10B981' : '#EF4444' }}
              >
                {Math.abs(trend.value)}%
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default StatsCard;