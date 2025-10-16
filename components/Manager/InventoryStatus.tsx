import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useGetLowStockInventoryQuery } from '../../store/api/inventoryApi';

const InventoryStatus = () => {
  const { data: inventoryData, isLoading } = useGetLowStockInventoryQuery();
  const lowStockItems = inventoryData?.data || [];

  const navigateToInventory = () => {
    router.push('/inventory' as never);
  };

  if (isLoading) {
    return (
      <View className="bg-white rounded-lg shadow-sm p-4 mb-6 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  // Calculate severity level
  const criticalItems = lowStockItems.filter(item => 
    item.currentStock < item.minimumStock / 2
  );

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold">Alertes d'inventaire</Text>
          {lowStockItems.length > 0 && (
            <View className={`ml-2 px-2 py-1 rounded-full ${
              criticalItems.length > 0 ? 'bg-red-100' : 'bg-orange-100'
            }`}>
              <Text className={`text-xs font-bold ${
                criticalItems.length > 0 ? 'text-red-800' : 'text-orange-800'
              }`}>
                {lowStockItems.length}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={navigateToInventory}>
          <Text className="text-primary">Voir tout</Text>
        </TouchableOpacity>
      </View>
      
      {lowStockItems.length > 0 ? (
        <>
          {lowStockItems.slice(0, 3).map((item) => {
            const isCritical = item.currentStock < item.minimumStock / 2;
            const percentage = (item.currentStock / item.minimumStock) * 100;

            return (
              <View 
                key={item.id}
                className="flex-row justify-between items-center py-3 border-b border-gray-100"
              >
                <View className="flex-row items-center flex-1">
                  <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                    isCritical ? 'bg-red-100' : 'bg-orange-100'
                  }`}>
                    <Feather 
                      name="alert-triangle" 
                      size={18} 
                      color={isCritical ? '#EF4444' : '#F97316'} 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium">{item.dish?.nameFr}</Text>
                    <Text className="text-xs text-gray-500">
                      {percentage.toFixed(0)}% du stock minimum
                    </Text>
                  </View>
                </View>
                
                <View className="items-end">
                  <Text className="text-gray-600 text-sm">Stock:</Text>
                  <Text className={`font-medium ${
                    isCritical ? 'text-red-600' : 'text-orange-500'
                  }`}>
                    {item.currentStock}/{item.minimumStock}
                  </Text>
                </View>
              </View>
            );
          })}
        </>
      ) : (
        <View className="py-6 items-center">
          <Feather name="check-circle" size={40} color="#10B981" />
          <Text className="text-gray-600 mt-2 text-center">
            Tous les stocks sont à un niveau acceptable
          </Text>
        </View>
      )}
      
      {lowStockItems.length > 3 && (
        <TouchableOpacity 
          onPress={navigateToInventory}
          className="mt-3 py-2"
        >
          <Text className="text-primary text-center">
            +{lowStockItems.length - 3} autres articles en stock faible
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InventoryStatus;