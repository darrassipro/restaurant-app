import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { useUpdateOrderStatusMutation } from '../../store/api/orderApi';
import { Order } from '../../types/order';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface KitchenOrderCardProps {
  order: Order;
  onViewDetails: (orderId: number) => void;
  onUpdateSuccess?: () => void;
  currentTab: 'pending' | 'preparing' | 'ready';
}

const KitchenOrderCard = ({ 
  order, 
  onViewDetails, 
  onUpdateSuccess,
  currentTab 
}: KitchenOrderCardProps) => {
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  
  const handleUpdateStatus = async (newStatus: 'confirmed' | 'preparing' | 'ready') => {
    try {
      await updateOrderStatus({ id: order.id, newStatus }).unwrap();
      Alert.alert('Succès', `Commande ${order.orderNumber} mise à jour`);
      onUpdateSuccess?.();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour la commande');
    }
  };

  const getActionButton = () => {
    if (isUpdating) {
      return (
        <View className="bg-gray-300 px-4 py-2 rounded-lg items-center">
          <ActivityIndicator size="small" color="#666" />
        </View>
      );
    }

    switch (currentTab) {
      case 'pending':
        return (
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => handleUpdateStatus('confirmed')}
              className="bg-blue-500 px-4 py-2 rounded-lg flex-1 mr-2"
            >
              <Text className="text-white font-medium text-center">Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUpdateStatus('preparing')}
              className="bg-yellow-500 px-4 py-2 rounded-lg flex-1"
            >
              <Text className="text-white font-medium text-center">Préparer</Text>
            </TouchableOpacity>
          </View>
        );
      case 'preparing':
        return (
          <TouchableOpacity
            onPress={() => handleUpdateStatus('ready')}
            className="bg-green-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium text-center">Marquer prêt</Text>
          </TouchableOpacity>
        );
      case 'ready':
        return (
          <View className="bg-gray-300 px-4 py-2 rounded-lg">
            <Text className="text-gray-700 font-medium text-center">En attente de livraison</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    const statusColors = {
      pending: { bg: 'bg-gray-200', text: 'text-gray-700' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
      preparing: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      ready: { bg: 'bg-green-100', text: 'text-green-800' },
      delivered: { bg: 'bg-purple-100', text: 'text-purple-800' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
    };

    const statusLabels = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      preparing: 'En préparation',
      ready: 'Prêt',
      delivered: 'Livré',
      cancelled: 'Annulé',  
    };

    const colors = statusColors[order.status] || statusColors.pending;
    const label = statusLabels[order.status] || order.status;

    return (
      <View className={`px-3 py-1 rounded-full ${colors.bg}`}>
        <Text className={`text-xs font-medium ${colors.text}`}>{label}</Text>
      </View>
    );
  };

  // Calculate order time elapsed
  const orderTime = new Date(order.createdAt);
  const now = new Date();
  const minutesElapsed = Math.floor((now.getTime() - orderTime.getTime()) / 60000);

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

      {/* Time indicator */}
      <View className="flex-row items-center mb-3">
        <Feather name="clock" size={14} color={minutesElapsed > 30 ? '#EF4444' : '#6B7280'} />
        <Text 
          className="ml-1 text-sm"
          style={{ color: minutesElapsed > 30 ? '#EF4444' : '#6B7280' }}
        >
          Il y a {minutesElapsed} min
        </Text>
      </View>
      
      {/* Order items */}
      <View className="mb-3 bg-gray-50 p-3 rounded-md">
        <Text className="font-medium mb-2">Articles ({order.items?.length || 0}):</Text>
        {order.items && order.items.map((item) => (
          <View key={item.id} className="flex-row justify-between mb-1">
            <Text className="text-gray-700">
              <Text className="font-bold">{item.quantity}x</Text> {item.dishNameFr}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Customer info */}
      {order.User && (
        <View className="flex-row items-center mb-3">
          <Feather name="user" size={14} color="#6B7280" />
          <Text className="text-gray-700 ml-1">
            {order.User.firstName} {order.User.lastName}
          </Text>
        </View>
      )}

      {/* Order details */}
      <View className="flex-row justify-between items-center mb-4 pt-3 border-t border-gray-200">
        <Text className="text-gray-600">{formatDate(order.createdAt)}</Text>
        <Text className="font-bold text-primary">{formatCurrency(order.total)}</Text>
      </View>
      
      {/* Action buttons */}
      {getActionButton()}
    </View>
  );
};

export default KitchenOrderCard;