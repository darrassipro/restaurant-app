// app/(manager)/order-details/[id].tsx
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../components/ui/Button';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '../../../store/api/orderApi';
import { ORDER_STATUS, OrderStatus } from '../../../utils/constants';
import { formatCurrency, formatDate, formatPhoneNumber } from '../../../utils/formatters';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const orderId = typeof id === 'string' ? parseInt(id) : 0;
  
  const { data: orderData, isLoading, refetch } = useGetOrderByIdQuery(orderId);
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  
  const order = orderData?.data;

const getStatusColor = (status: OrderStatus) => ORDER_STATUS[status].color;

  const getStatusLabel = (status: OrderStatus) => ORDER_STATUS[status]?.label || status;

  const handleUpdateStatus = async (newStatus: 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled') => {
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
          
          {order.estimatedDelivery && (
            <View className="flex-row items-center">
              <Feather name="clock" size={16} color="#666" />
              <Text className="text-gray-600 ml-2">
                Livraison estimée: {formatDate(order.estimatedDelivery)}
              </Text>
            </View>
          )}
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
        
        {/* Order Summary */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-lg font-bold mb-3">Récapitulatif</Text>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Sous-total</Text>
            <Text className="font-medium">{formatCurrency(order.subtotal)}</Text>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Frais de livraison</Text>
            <Text className="font-medium">{formatCurrency(order.deliveryFee)}</Text>
          </View>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">TVA</Text>
            <Text className="font-medium">{formatCurrency(order.tax)}</Text>
          </View>
          
          <View className="border-t border-gray-200 my-2" />
          
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">Total</Text>
            <Text className="text-lg font-bold text-primary">{formatCurrency(order.total)}</Text>
          </View>
          
          <View className="flex-row items-center mt-3">
            <Text className="text-gray-600">Mode de paiement:</Text>
            <Text className="ml-1 font-medium">
              {order.paymentMethod === 'cod' ? 'Paiement à la livraison' : 'Carte bancaire'}
            </Text>
          </View>
          
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-600">Statut de paiement:</Text>
            <Text 
              className={`ml-1 font-medium ${
                order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {order.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
            </Text>
          </View>
        </View>
        
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
          
          <View className="flex-row flex-wrap justify-between mb-2">
            {order.status === 'pending' && (
              <Button
                title="Confirmer"
                onPress={() => handleUpdateStatus('confirmed')}
                loading={isUpdating}
                variant="primary"
                className="w-[48%] mb-2"
              />
            )}
            
            {(order.status === 'pending' || order.status === 'confirmed') && (
              <Button
                title="Préparer"
                onPress={() => handleUpdateStatus('preparing')}
                loading={isUpdating}
                variant="secondary"
                className="w-[48%] mb-2"
              />
            )}
            
            {order.status === 'preparing' && (
              <Button
                title="Prêt"
                onPress={() => handleUpdateStatus('ready')}
                loading={isUpdating}
                variant="success"
                className="w-[48%] mb-2"
              />
            )}
            
            {order.status === 'ready' && (
              <Button
                title="Livré"
                onPress={() => handleUpdateStatus('delivered')}
                loading={isUpdating}
                variant="success"
                className="w-[48%] mb-2"
              />
            )}
            
            {['pending', 'confirmed', 'preparing'].includes(order.status) && (
              <Button
                title="Annuler"
                onPress={() => handleUpdateStatus('cancelled')}
                loading={isUpdating}
                variant="danger"
                className="w-[48%] mb-2"
              />
            )}
          </View>
          
          <Button
            title="Rafraîchir les informations"
            onPress={() => refetch()}
            variant="outline"
            fullWidth
            className="mt-2"
          />
        </View>
      </View>
    </ScrollView>
  );
}