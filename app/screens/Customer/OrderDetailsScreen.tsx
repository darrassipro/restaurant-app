// app/screens/Customer/OrderDetailsScreen.tsx
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../components/ui/Button';
import { useGetOrderByIdQuery } from '../../../store/api/orderApi';
import { ORDER_STATUS } from '../../../utils/constants';
import { formatCurrency, formatDate, formatPhoneNumber } from '../../../utils/formatters';

// Define OrderStatus types for type safety
type OrderStatusKey = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams();
  const orderId = typeof params.id === 'string' ? parseInt(params.id) : 0;
  
  const { data: orderData, isLoading, refetch } = useGetOrderByIdQuery(orderId);
  const order = orderData?.data;

  const getStatusColor = (status: string): string => {
    const statusKey = status as OrderStatusKey;
    return ORDER_STATUS[statusKey]?.color || '#666';
  };

  const getStatusLabel = (status: string): string => {
    const statusKey = status as OrderStatusKey;
    return ORDER_STATUS[statusKey]?.label || status;
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
        
        {/* Restaurant Information */}
        {order.Restaurant && (
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-bold mb-3">Restaurant</Text>
            
            <View className="flex-row items-center">
              {order.Restaurant.logo && (
                <Image
                  source={{ uri: order.Restaurant.logo }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              )}
              
              <View className="ml-3">
                <Text className="font-medium text-lg">{order.Restaurant.name}</Text>
                {order.Restaurant.phone && (
                  <TouchableOpacity 
                    className="flex-row items-center mt-1"
                  >
                    <Feather name="phone" size={14} color="#666" />
                    <Text className="text-gray-600 ml-1">{formatPhoneNumber(order.Restaurant.phone)}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
        
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
          <Button
            title="Rafraîchir l'état de la commande"
            onPress={() => refetch()}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}