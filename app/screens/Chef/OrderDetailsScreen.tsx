import { Feather } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/UI/Button';
import { ChefStackParamList } from '../../navigation/types';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '../../store/api/orderApi';
import { ORDER_STATUS } from '../../utils/constants';
import { formatCurrency, formatDate, formatPhoneNumber } from '../../utils/formatters';

type OrderDetailsScreenRouteProp = RouteProp<ChefStackParamList, 'OrderDetails'>;

const OrderDetailsScreen = () => {
  const route = useRoute<OrderDetailsScreenRouteProp>();
  const { orderId } = route.params;
  
  const { data: orderData, isLoading, refetch } = useGetOrderByIdQuery(orderId);
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  
  const order = orderData?.data;

  const getStatusColor = (status: string) => {
    return ORDER_STATUS[status]?.color || '#666';
  };

  const getStatusLabel = (status: string) => {
    return ORDER_STATUS[status]?.label || status;
  };

  const handleUpdateStatus = async (newStatus: 'confirmed' | 'preparing' | 'ready') => {
    try {
      await updateOrderStatus({ id: orderId, newStatus }).unwrap();
      refetch();
      Alert.alert('Succès', 'Statut de la commande mis à jour');
    } catch (error) {
      console.error('Update status error:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Commande non trouvée</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Order Header */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold">Commande #{order.orderNumber}</Text>
            <View 
              style={{ backgroundColor: `${getStatusColor(order.status)}20` }}
              className="px-3 py-1 rounded-full"
            >
              <Text style={{ color: getStatusColor(order.status) }} className="font-medium">
                {getStatusLabel(order.status)}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-2">
            <Feather name="calendar" size={16} color="#666" />
            <Text className="text-gray-600 ml-2">{formatDate(order.createdAt)}</Text>
          </View>
        </View>
        
        {/* Customer Info */}
        {order.User && (
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-bold mb-3">Client</Text>
            
            <Text className="font-medium text-lg">
              {order.User.firstName} {order.User.lastName}
            </Text>
            
            {order.User.phone && (
              <TouchableOpacity className="flex-row items-center mt-1">
                <Feather name="phone" size={16} color="#666" />
                <Text className="text-gray-600 ml-2">{formatPhoneNumber(order.User.phone)}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Order Items */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-lg font-bold mb-3">Articles commandés</Text>
          
          {order.items && order.items.map((item) => (
            <View 
              key={item.id}
              className="flex-row py-3 border-b border-gray-100"
            >
              {item.Dish?.image && item.Dish.image[0] && (
                <Image
                  source={{ uri: item.Dish.image[0] }}
                  className="w-16 h-16 rounded-md"
                  resizeMode="cover"
                />
              )}
              
              <View className="flex-1 ml-3">
                <View className="flex-row justify-between">
                  <Text className="font-medium">{item.dishNameFr}</Text>
                  <Text className="font-bold text-primary">{formatCurrency(item.dishPrice)}</Text>
                </View>
                
                <Text className="text-gray-600 mt-1">Quantité: {item.quantity}</Text>
                <Text className="text-gray-800 font-medium mt-1">
                  Sous-total: {formatCurrency(parseFloat(item.dishPrice) * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Delivery Address */}
        {order.Address && (
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-bold mb-3">Adresse de livraison</Text>
            
            <Text className="font-medium">{order.Address.addressName}</Text>
            <Text className="text-gray-600 mt-1">{order.Address.sector}, {order.Address.city}</Text>
          </View>
        )}
        
        {/* Order Notes */}
        {order.notes && (
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-bold mb-2">Notes</Text>
            <Text className="text-gray-700">{order.notes}</Text>
          </View>
        )}
        
        {/* Actions */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-lg font-bold mb-3">Actions</Text>
          
          {order.status === 'pending' && (
            <Button
              title="Commencer la préparation"
              onPress={() => handleUpdateStatus('preparing')}
              loading={isUpdating}
              fullWidth
              className="mb-3"
            />
          )}
          
          {order.status === 'preparing' && (
            <Button
              title="Marquer comme prêt"
              onPress={() => handleUpdateStatus('ready')}
              loading={isUpdating}
              fullWidth
              className="mb-3"
              variant="success"
            />
          )}
          
          <Button
            title="Rafraîchir les informations"
            onPress={() => refetch()}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderDetailsScreen;