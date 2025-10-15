// app/screens/Customer/CheckoutScreen.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AddressSelector from '../../../components/features/AddressSelector';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useCreateOrderMutation } from '../../../store/api/orderApi';
import { useGetRestaurantQuery } from '../../../store/api/restaurantApi';
import {
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectDeliveryFee,
  selectGrandTotal,
  selectTaxAmount,
  setDeliveryFee,
} from '../../../store/slices/cartSlice';
import { formatCurrency } from '../../../utils/formatters';

export default function CheckoutScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const deliveryFee = useSelector(selectDeliveryFee);
  const taxAmount = useSelector(selectTaxAmount);
  const grandTotal = useSelector(selectGrandTotal);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');

  const { data: restaurantData } = useGetRestaurantQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  // Set delivery fee when restaurant data is loaded
  useEffect(() => {
    if (restaurantData?.deliveryFee) {
      dispatch(setDeliveryFee(parseFloat(restaurantData.deliveryFee)));
    }
  }, [restaurantData, dispatch]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      Alert.alert('Adresse requise', 'Veuillez sélectionner une adresse de livraison');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Panier vide', 'Votre panier est vide');
      return;
    }

    // Check minimum order if restaurant data exists
    if (restaurantData?.minimumOrder && subtotal < parseFloat(restaurantData.minimumOrder)) {
      Alert.alert(
        'Commande minimum non atteinte',
        `Le montant minimum de commande est de ${formatCurrency(restaurantData.minimumOrder)}.`
      );
      return;
    }

    try {
      const orderData = {
        items: cartItems.map(item => ({
          dishId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddressId: selectedAddressId,
        notes: notes.trim(),
      };

      const response = await createOrder(orderData).unwrap();

      dispatch(clearCart());
      router.push({
        pathname: '/order-success',
        params: {
          orderId: response.data.id,
          orderNumber: response.data.orderNumber,
        },
      } as never);
    } catch (error: any) {
      console.error('Order creation error:', error);
      Alert.alert(
        'Erreur',
        error?.data?.message || 'Une erreur est survenue lors de la création de votre commande. Veuillez réessayer.'
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Delivery Address */}
          <AddressSelector
            selectedAddressId={selectedAddressId}
            onSelectAddress={(address) => setSelectedAddressId(address.id ?? null)}
          />

          {/* Order Items */}
          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <Text className="text-lg font-bold mb-3">Votre commande</Text>
            {cartItems.map((item) => (
              <View
                key={item.id}
                className="flex-row justify-between items-center py-2 border-b border-gray-100"
              >
                <View className="flex-row items-center">
                  <Text className="text-gray-800 font-medium">{item.quantity} x</Text>
                  <Text className="ml-2">{item.dish.nameFr}</Text>
                </View>
                <Text className="font-medium">
                  {formatCurrency(parseFloat(item.dish.price) * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          {/* Payment Method */}
          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <Text className="text-lg font-bold mb-3">Mode de paiement</Text>
            <TouchableOpacity
              className="flex-row items-center justify-between p-3 bg-gray-100 rounded-md"
              onPress={() => setPaymentMethod('cod')}
            >
              <View className="flex-row items-center">
                <Feather name="dollar-sign" size={20} color="#333" />
                <Text className="text-gray-800 ml-2">Paiement à la livraison</Text>
              </View>
              <View
                className={`w-6 h-6 rounded-full border-2 ${
                  paymentMethod === 'cod' ? 'border-primary' : 'border-gray-400'
                } items-center justify-center`}
              >
                {paymentMethod === 'cod' && <View className="w-3 h-3 rounded-full bg-primary" />}
              </View>
            </TouchableOpacity>
          </View>

          {/* Order Notes */}
          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <Text className="text-lg font-bold mb-3">Notes de commande</Text>
            <Input
              placeholder="Instructions spéciales pour la livraison"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Order Summary */}
          <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <Text className="text-lg font-bold mb-3">Récapitulatif</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Sous-total</Text>
              <Text className="font-medium">{formatCurrency(subtotal)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Frais de livraison</Text>
              <Text className="font-medium">{formatCurrency(deliveryFee)}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">TVA</Text>
              <Text className="font-medium">{formatCurrency(taxAmount)}</Text>
            </View>
            <View className="border-t border-gray-200 my-2" />
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg font-bold text-primary">{formatCurrency(grandTotal)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View className="bg-white p-4 border-t border-gray-200">
        <Button
          title={isLoading ? 'Traitement...' : 'Commander'}
          onPress={handlePlaceOrder}
          loading={isLoading}
          disabled={isLoading || !selectedAddressId || cartItems.length === 0}
          icon={!isLoading && <Feather name="check-circle" size={20} color="#FFF" />}
          fullWidth
        />
      </View>
    </View>
  );
}