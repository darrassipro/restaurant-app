// app/(customer)/order-success.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, Image, ScrollView, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import { useGetOrderByIdQuery } from '../../store/api/orderApi';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams();
  const orderId = typeof params.orderId === 'string' ? parseInt(params.orderId) : 0;
  const orderNumber = params.orderNumber as string;

  const { data: orderData } = useGetOrderByIdQuery(orderId);
  const order = orderData?.data;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.push('/(customer)/home' as never);
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleViewOrder = () => {
    router.push({ pathname: '/order-details/[id]', params: { id: orderId } } as never);
  };

  const handleContinueShopping = () => {
    router.push('/(customer)/home' as never);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 items-center">
        <Image
          source={require('../../assets/images/order-success.png')}
          style={{ width: 160, height: 160 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-green-600 mt-4">Commande Confirmée!</Text>
        <Text className="text-gray-600 text-center mt-2 mb-6">
          Votre commande a été placée avec succès et sera préparée sous peu.
        </Text>

        <View className="w-full bg-gray-100 rounded-lg p-4 mb-6">
          <Text className="text-lg font-bold text-center text-primary mb-2">
            Commande #{orderNumber}
          </Text>
          {order && (
            <>
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-600">Date:</Text>
                <Text className="font-medium">{formatDate(order.createdAt)}</Text>
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-600">Statut:</Text>
                <View className="bg-yellow-100 px-2 py-1 rounded">
                  <Text className="text-yellow-800">{order.status}</Text>
                </View>
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-600">Paiement:</Text>
                <Text className="font-medium">À la livraison</Text>
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-600">Total:</Text>
                <Text className="font-bold">{formatCurrency(order.total)}</Text>
              </View>
              {order.estimatedDelivery && (
                <View className="flex-row justify-between mt-2">
                  <Text className="text-gray-600">Livraison estimée:</Text>
                  <Text className="font-medium">{formatDate(order.estimatedDelivery)}</Text>
                </View>
              )}
              <View className="border-t border-gray-300 my-3" />
              <View className="mt-2">
                <Text className="text-gray-600">Adresse de livraison:</Text>
                <Text className="font-medium mt-1">{order.Address?.addressName}</Text>
                <Text className="text-gray-700">
                  {order.Address?.sector}, {order.Address?.city}
                </Text>
              </View>
            </>
          )}
        </View>

        <Button
          title="Voir les détails de la commande"
          onPress={handleViewOrder}
          variant="outline"
          fullWidth
          className="mb-3"
        />
        <Button title="Continuer les achats" onPress={handleContinueShopping} fullWidth />
      </View>
    </ScrollView>
  );
}
