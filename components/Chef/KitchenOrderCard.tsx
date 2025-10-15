// components/Chef/KitchenOrderCard.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Order } from '../../types/order';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Define props interface using imported types
interface KitchenOrderCardProps {
  order: Order;
  onViewDetails: (orderId: number) => void;
  onUpdateStatus: (status: 'preparing' | 'ready' | 'confirmed') => void;
  currentTab: 'pending' | 'preparing' | 'ready';
}

const KitchenOrderCard = ({ 
  order, 
  onViewDetails, 
  onUpdateStatus, 
  currentTab 
}: KitchenOrderCardProps) => {
  
  // Get appropriate action button based on current tab
  const getActionButton = () => {
    switch (currentTab) {
      case 'pending':
        return (
          <TouchableOpacity
            onPress={() => onUpdateStatus('confirmed')}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Confirmer</Text>
          </TouchableOpacity>
        );
      case 'preparing':
        return (
          <TouchableOpacity
            onPress={() => onUpdateStatus('ready')}
            className="bg-green-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Marquer prêt</Text>
          </TouchableOpacity>
        );
      case 'ready':
        return (
          <TouchableOpacity
            className="bg-gray-300 px-4 py-2 rounded-lg"
            disabled
          >
            <Text className="text-gray-700 font-medium">En attente de livraison</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  // Get secondary action button based on current tab
  const getSecondaryButton = () => {
    if (currentTab === 'pending') {
      return (
        <TouchableOpacity
          onPress={() => onUpdateStatus('preparing')}
          className="bg-yellow-500 px-4 py-2 rounded-lg ml-2"
        >
          <Text className="text-white font-medium">Préparer</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  // Get status badge style
  const getStatusBadge = () => {
    let bgColor = '';
    let textColor = '';
    let label = '';

    switch (order.status) {
      case 'pending':
        bgColor = 'bg-gray-200';
        textColor = 'text-gray-700';
        label = 'En attente';
        break;
      case 'confirmed':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        label = 'Confirmé';
        break;
      case 'preparing':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        label = 'En préparation';
        break;
      case 'ready':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        label = 'Prêt';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        label = order.status;
    }

    return (
      <View className={`px-3 py-1 rounded-full ${bgColor}`}>
        <Text className={`text-xs font-medium ${textColor}`}>{label}</Text>
      </View>
    );
  };

  return (
    <View className="bg-white p-4 mx-4 my-2 rounded-lg shadow-sm">
      {/* Order header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold mr-2">#{order.orderNumber}</Text>
          {getStatusBadge()}
        </View>
        <TouchableOpacity
          onPress={() => onViewDetails(order.id)}
          className="bg-gray-200 p-2 rounded-full"
        >
          <Feather name="eye" size={18} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Order items */}
      <View className="mb-3">
        <Text className="font-medium mb-2">Articles:</Text>
        {order.items && order.items.map((item) => (
          <View key={item.id} className="flex-row justify-between mb-1">
            <Text className="text-gray-700">
              {item.quantity} x {item.dishNameFr  || `Article #${item.dishId}`}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Order details */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-gray-600">
          {formatDate(order.createdAt)}
        </Text>
        <Text className="font-bold text-primary">{formatCurrency(order.total)}</Text>
      </View>
      
      {/* Action buttons */}
      <View className="flex-row">
        {getActionButton()}
        {getSecondaryButton()}
      </View>
    </View>
  );
};

export default KitchenOrderCard;