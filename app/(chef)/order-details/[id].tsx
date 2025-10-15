// app/(chef)/order-details/[id].tsx - Create directory first
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../components/ui/Button';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '../../../store/api/orderApi';
import { Order, OrderItem, OrderStatusType } from '../../../types/order';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function ChefOrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const orderId = typeof id === 'string' ? parseInt(id) : 0;

  const [selectedStatus, setSelectedStatus] = useState<OrderStatusType | null>(null);

  const { data: orderData, isLoading, error, refetch } = useGetOrderByIdQuery(orderId);
  const order: Order | undefined = orderData?.data;

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

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

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order?.status) return;

    try {
      await updateOrderStatus({ id: orderId, newStatus: selectedStatus }).unwrap();
      Alert.alert('Succès', `Statut de la commande mis à jour`);
      refetch();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const getStatusLabel = (status: OrderStatusType): string => {
    const labels: Record<OrderStatusType, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      preparing: 'En préparation',
      ready: 'Prête',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };
    return labels[status];
  };

  const getStatusColor = (status: OrderStatusType): string => {
    const colors: Record<OrderStatusType, string> = {
      pending: '#FFA500',
      confirmed: '#3498DB',
      preparing: '#F39C12',
      ready: '#27AE60',
      delivered: '#2ECC71',
      cancelled: '#E74C3C',
    };
    return colors[status];
  };

  const renderOrderItems = (items: OrderItem[]) => {
    return items.map((item) => (
      <View key={item.id} className="flex-row py-4 border-b border-gray-200">
        {item.Dish?.image && item.Dish.image.length > 0 ? (
          <Image source={{ uri: item.Dish.image[0] }} className="w-16 h-16 rounded-lg" />
        ) : (
          <View className="w-16 h-16 bg-gray-200 rounded-lg items-center justify-center">
            <Feather name="image" size={24} color="#999" />
          </View>
        )}
        <View className="flex-1 ml-3">
          <Text className="text-lg font-medium">{item.dishNameFr}</Text>
          <Text className="text-gray-500">Quantité: {item.quantity}</Text>
          <Text className="text-primary font-medium">{formatCurrency(parseFloat(item.dishPrice))}</Text>
        </View>
      </View>
    ));
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
        <Text className="mt-2 text-gray-600">Chargement de la commande...</Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Feather name="alert-circle" size={60} color="#FF5733" />
        <Text className="text-lg font-medium text-gray-700 mt-4">Erreur de chargement</Text>
        <TouchableOpacity onPress={() => refetch()} className="bg-primary px-4 py-2 rounded-lg mt-4">
          <Text className="text-white">Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const nextStatuses = getNextPossibleStatuses(order.status);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
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
        </View>

        <View className="bg-white p-4 mt-2">
          <Text className="text-lg font-bold mb-2">Articles</Text>
          {order.items && order.items.length > 0 ? (
            renderOrderItems(order.items)
          ) : (
            <Text className="text-gray-500 italic">Aucun article trouvé</Text>
          )}
        </View>

        <View className="bg-white p-4 mt-2 mb-4">
          <Text className="text-lg font-bold mb-2">Total</Text>
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-800 font-bold">Total</Text>
            <Text className="text-primary font-bold text-lg">{formatCurrency(parseFloat(order.total))}</Text>
          </View>
        </View>
      </ScrollView>

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
                <Text className={`${selectedStatus === status ? 'text-white' : 'text-gray-800'}`}>
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