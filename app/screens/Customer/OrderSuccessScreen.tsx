import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import Button from '../../components/UI/Button';
import { CustomerStackParamList } from '../../navigation/types';
import { useGetOrderByIdQuery } from '../../store/api/orderApi';
import { formatDate } from '../../utils/formatters';

type OrderSuccessScreenRouteProp = RouteProp<CustomerStackParamList, 'OrderSuccess'>;
type OrderSuccessScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'OrderSuccess'>;

const OrderSuccessScreen = () => {
  const route = useRoute<OrderSuccessScreenRouteProp>();
  const navigation = useNavigation<OrderSuccessScreenNavigationProp>();
  const { orderId, orderNumber } = route.params;
  
  const { data: orderData } = useGetOrderByIdQuery(orderId);
  const order = orderData?.data;
  
  // Prevent going back to checkout
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
        navigation.navigate('HomeTab');
      }
    });
    
    return () => {
      navigation.removeListener('beforeRemove', () => {});
    };
  }, [navigation]);

  const handleViewOrder = () => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const handleContinueShopping = () => {
    navigation.navigate('HomeTab');
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 items-center">
        <Image
          source={require('../../assets/images/order-success.png')}
          className="w-40 h-40"
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
                <Text className="font-bold">{order.total} MAD</Text>
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
                <Text className="text-gray-700">{order.Address?.sector}, {order.Address?.city}</Text>
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
        
        <Button
          title="Continuer les achats"
          onPress={handleContinueShopping}
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

export default OrderSuccessScreen;