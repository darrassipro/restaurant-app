// app/screens/Chef/OrderDetailsScreen.tsx
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../components/ui/Button';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '../../../store/api/orderApi';
import { Order, OrderItem, OrderStatusType } from '../../../types/order';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function OrderDetailsScreen() {
  // Get order ID from URL params
  const { id } = useLocalSearchParams();
  const orderId = typeof id === 'string' ? parseInt(id) : 0;
  
  // Status transition options for chef
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusType | null>(null);
  
  // Fetch order details
  const { 
    data: orderData, 
    isLoading, 
    error,
    refetch 
  } = useGetOrderByIdQuery(orderId);
  
  const order: Order | undefined = orderData?.data;
  
  // Update order status mutation
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  // Set initial selected status when order loads
  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  // Define possible next statuses based on current status
  const getNextPossibleStatuses = (currentStatus: OrderStatusType): OrderStatusType[] => {
    switch (currentStatus) {
      case 'pending':
        return ['preparing'];
      case 'preparing':
        return ['ready'];
      case 'ready':
        return [];
      case 'confirmed':
        return ['preparing'];
      default:
        return [];
    }
  };

  // Handle order status update
  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order?.status) return;
    
    try {
      await updateOrderStatus({
        id: orderId,
        newStatus: selectedStatus
      }).unwrap();
      
      Alert.alert('Succès', `Statut de la commande mis à jour: ${getStatusLabel(selectedStatus)}`);
      refetch();
    } catch (error) {
      console.error('Failed to update order status:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut de la commande');
    }
  };

  // Get human-readable status label
  const getStatusLabel = (status: OrderStatusType): string => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prête';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  // Get status color
  const getStatusColor = (status: OrderStatusType): string => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'confirmed': return '#3498DB';
      case 'preparing': return '#F39C12';
      case 'ready': return '#27AE60';
      case 'delivered': return '#2ECC71';
      case 'cancelled': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  // Render order items
  const renderOrderItems = (items: OrderItem[]) => {
    return items.map((item, index) => (
      <View 
        key={item.id} 
        className="flex-row py-4 border-b border-gray-200"
      >
        {item.Dish?.image && item.Dish.image.length > 0 ? (
          <Image 
            source={{ uri: item.Dish.image[0] }} 
            className="w-16 h-16 rounded-lg"
          />
        ) : (
          <View className="w-16 h-16 bg-gray-200 rounded-lg items-center justify-center">
            <Feather name="image" size={24} color="#999" />
          </View>
        )}
        
        <View className="flex-1 ml-3">
          <Text className="text-lg font-medium">{item.dishNameFr}</Text>
          <Text className="text-gray-500">Quantité: {item.quantity}</Text>
          <Text className="text-primary font-medium">
            {formatCurrency(parseFloat(item.dishPrice))}
          </Text>
        </View>
      </View>
    ));
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
        <Text className="mt-2 text-gray-600">Chargement de la commande...</Text>
      </View>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Feather name="alert-circle" size={60} color="#FF5733" />
        <Text className="text-lg font-medium text-gray-700 mt-4">
          Erreur de chargement
        </Text>
        <Text className="text-gray-500 text-center mb-4">
          Impossible de charger les détails de la commande
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-primary px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Possible next statuses
  const nextStatuses = getNextPossibleStatuses(order.status);
  
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with back button */}
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4"
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold">Commande #{order.orderNumber}</Text>
          <View className="flex-row items-center mt-1">
            <View 
              style={{ backgroundColor: getStatusColor(order.status) }}
              className="h-2 w-2 rounded-full mr-2"
            />
            <Text className="text-gray-600">{getStatusLabel(order.status)}</Text>
          </View>
        </View>
      </View>
      
      <ScrollView className="flex-1">
        {/* Order info section */}
        <View className="bg-white p-4 mt-2">
          <Text className="text-lg font-bold mb-2">Informations</Text>
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-600">Date</Text>
            <Text className="font-medium">{formatDate(order.createdAt)}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-600">Client</Text>
            <Text className="font-medium">
              {order.User ? `${order.User.firstName} ${order.User.lastName}` : 'Non spécifié'}
            </Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-600">Téléphone</Text>
            <Text className="font-medium">{order.User?.phone || 'Non spécifié'}</Text>
          </View>
          {order.estimatedDelivery && (
            <View className="flex-row justify-between py-1">
              <Text className="text-gray-600">Livraison estimée</Text>
              <Text className="font-medium">{formatDate(order.estimatedDelivery)}</Text>
            </View>
          )}
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-600">Paiement</Text>
            <Text className="font-medium">
              {order.paymentMethod === 'cod' ? 'Espèces à la livraison' : 'Carte bancaire'} 
              {' - '}
              {order.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
            </Text>
          </View>
        </View>
        
        {/* Order items section */}
        <View className="bg-white p-4 mt-2">
          <Text className="text-lg font-bold mb-2">Articles</Text>
          {order.items && order.items.length > 0 ? (
            renderOrderItems(order.items)
          ) : (
            <Text className="text-gray-500 italic">Aucun article trouvé</Text>
          )}
        </View>
        
        {/* Order totals section */}
        <View className="bg-white p-4 mt-2">
          <Text className="text-lg font-bold mb-2">Totaux</Text>
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-600">Sous-total</Text>
            <Text className="font-medium">{formatCurrency(parseFloat(order.subtotal || '0'))}</Text>
          </View>
          {order.tax && (
            <View className="flex-row justify-between py-1">
              <Text className="text-gray-600">Taxes</Text>
              <Text className="font-medium">{formatCurrency(parseFloat(order.tax))}</Text>
            </View>
          )}
          {order.deliveryFee && (
            <View className="flex-row justify-between py-1">
              <Text className="text-gray-600">Frais de livraison</Text>
              <Text className="font-medium">{formatCurrency(parseFloat(order.deliveryFee))}</Text>
            </View>
          )}
          <View className="flex-row justify-between py-1 mt-2 border-t border-gray-200 pt-2">
            <Text className="text-gray-800 font-bold">Total</Text>
            <Text className="text-primary font-bold text-lg">{formatCurrency(parseFloat(order.total))}</Text>
          </View>
        </View>
        
        {/* Notes section */}
        {order.notes && (
          <View className="bg-white p-4 mt-2">
            <Text className="text-lg font-bold mb-2">Notes</Text>
            <Text className="text-gray-800">{order.notes}</Text>
          </View>
        )}
        
        {/* Address section */}
        {order.Address && (
          <View className="bg-white p-4 mt-2 mb-4">
            <Text className="text-lg font-bold mb-2">Adresse de livraison</Text>
            {/* <Text className="text-gray-800">{order.Address?.contactName}</Text> */}
     
            <Text className="text-gray-600 mt-1">
              {order.Address?.addressName}, {order.Address?.sector}, {order.Address?.city}
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Status update section - Only show if there are possible next statuses */}
      {nextStatuses.length > 0 && (
        <View className="bg-white p-4 border-t border-gray-200">
          <Text className="text-lg font-bold mb-2">Mettre à jour le statut</Text>
          
          <View className="flex-row mb-4">
            {nextStatuses.map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
                className={`mr-2 px-4 py-2 rounded-lg ${
                  selectedStatus === status ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <Text 
                  className={`${
                    selectedStatus === status ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {getStatusLabel(status)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Button
            title="Mettre à jour"
            onPress={handleStatusUpdate}
            loading={isUpdating}
            disabled={selectedStatus === order.status || isUpdating}
            fullWidth
          />
        </View>
      )}
    </View>
  );
}

// Add formatters utility if not already present
