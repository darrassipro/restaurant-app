import { Feather } from '@expo/vector-icons';
import { styled } from 'nativewind';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Order } from '../../types/order';
import { formatDate } from '../../utils/formatters';

interface KitchenOrderCardProps {
  order: Order;
  onViewDetails: () => void;
  onUpdateStatus: (status: 'confirmed' | 'preparing' | 'ready') => void;
  currentTab: 'pending' | 'preparing' | 'ready';
}

const KitchenOrderCard = ({ order, onViewDetails, onUpdateStatus, currentTab }: KitchenOrderCardProps) => {
  return (
    <View className="bg-white rounded-lg shadow-sm mb-4">
      {/* Header */}
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="font-bold text-lg">#{order.orderNumber}</Text>
            {order.items && (
              <Text className="text-gray-600 ml-2">
                ({order.items.length} article{order.items.length !== 1 ? 's' : ''})
              </Text>
            )}
          </View>
          <Text className="text-gray-600">{formatDate(order.createdAt)}</Text>
        </View>
      </View>
      
      {/* Items */}
      <View className="p-4">
        {order.items && order.items.map((item) => (
          <View key={item.id} className="flex-row mb-3 items-center">
            <View className="w-6 h-6 bg-gray-200 rounded-full items-center justify-center mr-2">
              <Text className="font-medium">{item.quantity}</Text>
            </View>
            
            {item.Dish?.image && item.Dish.image[0] ? (
              <Image
                source={{ uri: item.Dish.image[0] }}
                className="w-10 h-10 rounded mr-2"
              />
            ) : (
              <View className="w-10 h-10 bg-gray-200 rounded mr-2" />
            )}
            
            <Text className="flex-1 font-medium">{item.dishNameFr}</Text>
          </View>
        ))}
        
        {order.notes && (
          <View className="bg-yellow-50 p-3 rounded mt-2">
            <Text className="text-gray-700">
              <Text className="font-medium">Note: </Text>
              {order.notes}
            </Text>
          </View>
        )}
      </View>
      
      {/* Actions */}
      <View className="p-4 border-t border-gray-100">
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={onViewDetails}
            className="flex-row items-center"
          >
            <Feather name="eye" size={18} color="#666" />
            <Text className="text-gray-600 ml-1">Détails</Text>
          </TouchableOpacity>
          
          {currentTab === 'pending' && (
            <TouchableOpacity
              onPress={() => onUpdateStatus('preparing')}
              className="bg-orange-500 px-4 py-2 rounded-md"
            >
              <Text className="text-white font-medium">Commencer la préparation</Text>
            </TouchableOpacity>
          )}
          
          {currentTab === 'preparing' && (
            <TouchableOpacity
              onPress={() => onUpdateStatus('ready')}
              className="bg-green-500 px-4 py-2 rounded-md"
            >
              <Text className="text-white font-medium">Marquer comme prêt</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default styled(KitchenOrderCard);