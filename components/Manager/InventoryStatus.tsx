// components/Manager/InventoryStatus.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styled } from 'nativewind';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Inventory } from '../../types/inventory';

interface InventoryStatusProps {
  lowStockItems: Inventory[];
}

const InventoryStatus = ({ lowStockItems }: InventoryStatusProps) => {
  const navigateToInventory = () => {
    router.push('/inventory' as never);
  };

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Alertes d'inventaire</Text>
        <TouchableOpacity onPress={navigateToInventory}>
          <Text className="text-primary">Voir tout</Text>
        </TouchableOpacity>
      </View>
      
      {lowStockItems.length > 0 ? (
        lowStockItems.slice(0, 3).map((item) => (
          <View 
            key={item.id}
            className="flex-row justify-between items-center py-3 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                <Feather name="alert-triangle" size={18} color="#EF4444" />
              </View>
              <Text className="font-medium">{item.dish?.nameFr}</Text>
            </View>
            
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-1">Stock:</Text>
              <Text 
                className={`font-medium ${
                  item.currentStock < item.minimumStock / 2 
                    ? 'text-red-600' 
                    : 'text-orange-500'
                }`}
              >
                {item.currentStock}/{item.minimumStock}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View className="py-6 items-center">
          <Feather name="check-circle" size={40} color="#10B981" />
          <Text className="text-gray-600 mt-2">Tous les stocks sont à un niveau acceptable</Text>
        </View>
      )}
      
      {lowStockItems.length > 3 && (
        <TouchableOpacity 
          onPress={navigateToInventory}
          className="mt-3"
        >
          <Text className="text-primary text-center">
            +{lowStockItems.length - 3} autres articles en stock faible
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default styled(InventoryStatus);