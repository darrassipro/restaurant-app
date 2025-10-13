// app/screens/Customer/CartScreen.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import { useGetRestaurantQuery } from '../../../store/api/restaurantApi';
import {
    clearCart,
    removeFromCart,
    selectCartItems,
    selectCartTotal,
    selectDeliveryFee,
    selectGrandTotal,
    selectTaxAmount,
    updateQuantity
} from '../../../store/slices/cartSlice';
import { formatCurrency } from '../../../utils/formatters';

export default function CartScreen() {
  const dispatch = useDispatch();
  
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const deliveryFee = useSelector(selectDeliveryFee);
  const taxAmount = useSelector(selectTaxAmount);
  const grandTotal = useSelector(selectGrandTotal);
  
  const { data: restaurantData } = useGetRestaurantQuery();
  const restaurant = restaurantData?.data;

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity <= 0) {
      // Confirm deletion
      Alert.alert(
        "Supprimer l'article",
        "Voulez-vous supprimer cet article de votre panier ?",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          { 
            text: "Supprimer", 
            onPress: () => dispatch(removeFromCart(id)),
            style: "destructive"
          }
        ]
      );
      return;
    }
    
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    Alert.alert(
      "Vider le panier",
      "Êtes-vous sûr de vouloir vider votre panier ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Vider", 
          onPress: () => dispatch(clearCart()),
          style: "destructive"
        }
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Panier vide", "Ajoutez des articles à votre panier avant de passer commande.");
      return;
    }
    
    if (restaurant && subtotal < parseFloat(restaurant.minimumOrder)) {
      Alert.alert(
        "Commande minimum non atteinte",
        `Le montant minimum de commande est de ${formatCurrency(restaurant.minimumOrder)}.`
      );
      return;
    }
    
    router.push('/(customer)/checkout' as never);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Cart Items */}
      {cartItems.length > 0 ? (
        <>
          <ScrollView className="flex-1">
            <View className="p-4">
              {cartItems.map((item) => (
                <View
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm mb-4 p-3 flex-row"
                >
                  <Image
                    source={{ uri: item.dish.image[0] || 'https://via.placeholder.com/100' }}
                    className="w-20 h-20 rounded-md"
                    resizeMode="cover"
                  />
                  
                  <View className="flex-1 ml-3">
                    <Text className="text-lg font-medium">{item.dish.nameFr}</Text>
                    <Text className="text-primary font-bold">{formatCurrency(item.dish.price)}</Text>
                    
                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-center">
                        <TouchableOpacity
                          onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                        >
                          <Feather name="minus" size={18} color="#333" />
                        </TouchableOpacity>
                        
                        <Text className="mx-3 text-base font-medium">{item.quantity}</Text>
                        
                        <TouchableOpacity
                          onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                        >
                          <Feather name="plus" size={18} color="#333" />
                        </TouchableOpacity>
                      </View>
                      
                      <TouchableOpacity
                        onPress={() => dispatch(removeFromCart(item.id))}
                        className="p-2"
                      >
                        <Feather name="trash-2" size={20} color="#FF5733" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              
              {restaurant && subtotal < parseFloat(restaurant.minimumOrder) && (
                <View className="bg-yellow-100 p-3 rounded-md mb-4">
                  <Text className="text-yellow-800">
                    Commande minimum : {formatCurrency(restaurant.minimumOrder)}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
          
          {/* Order Summary */}
          <View className="bg-white p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleClearCart}
              className="flex-row justify-center items-center mb-3"
            >
              <Feather name="trash" size={16} color="#FF5733" />
              <Text className="text-primary ml-1">Vider le panier</Text>
            </TouchableOpacity>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Sous-total</Text>
              <Text className="font-medium">{formatCurrency(subtotal)}</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Frais de livraison</Text>
              <Text className="font-medium">{formatCurrency(deliveryFee)}</Text>
            </View>
            
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-600">TVA</Text>
              <Text className="font-medium">{formatCurrency(taxAmount)}</Text>
            </View>
            
            <View className="flex-row justify-between mb-4">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg font-bold text-primary">{formatCurrency(grandTotal)}</Text>
            </View>
            
            <Button
              title="Commander"
              onPress={handleCheckout}
              icon={<Feather name="check-circle" size={20} color="#FFF" />}
              fullWidth
            />
          </View>
        </>
      ) : (
        <View className="flex-1 justify-center items-center p-6">
          <Feather name="shopping-cart" size={80} color="#ccc" />
          <Text className="text-xl font-medium text-gray-800 mt-4">Votre panier est vide</Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">
            Explorez notre menu et ajoutez des plats délicieux à votre panier
          </Text>
          <Button
            title="Voir le menu"
            onPress={() => router.push('/(customer)/menu' as never)}
            variant="primary"
          />
        </View>
      )}
    </View>
  );
}