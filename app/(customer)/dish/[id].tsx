// app/(customer)/dish/[id].tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useGetDishByIdQuery } from '../../../store/api/dishApi';
import { addToCart } from '../../../store/slices/cartSlice';

export default function DishDetailsScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  
  const dishId = typeof id === 'string' ? parseInt(id) : 0;
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { data: dish, isLoading } = useGetDishByIdQuery(dishId);

  const handleQuantityChange = (value: number) => {
    if (quantity + value > 0) {
      setQuantity(quantity + value);
    }
  };

  const handleAddToCart = () => {
    if (!dish) return;
    
    dispatch(
      addToCart({
        dish: {
          id: dish.id,
          nameFr: dish.nameFr,
          price: dish.price,
          image: dish.image,
          restaurantId: dish.restaurantId,
          categoryId: dish.categoryId,
        },
        quantity,
      })
    );
    
    router.back();
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  if (!dish) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Plat non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Image Gallery */}
      <View className="relative w-full h-64">
        <Image
          source={{ uri: dish.image[selectedImageIndex] || 'https://via.placeholder.com/400' }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Image Pagination */}
        {dish.image.length > 1 && (
          <View className="absolute bottom-4 w-full flex-row justify-center">
            {dish.image.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                className={`w-2 h-2 rounded-full mx-1 ${
                  selectedImageIndex === index ? 'bg-primary' : 'bg-white/70'
                }`}
              />
            ))}
          </View>
        )}
        
        {/* Badges */}
        <View className="absolute top-4 left-4 flex-row">
          {dish.isVegetarian && (
            <View className="bg-green-500 px-2 py-1 rounded-md mr-2">
              <Text className="text-white text-xs font-medium">Végétarien</Text>
            </View>
          )}
          {dish.isSpicy && (
            <View className="bg-red-500 px-2 py-1 rounded-md mr-2">
              <Text className="text-white text-xs font-medium">Épicé</Text>
            </View>
          )}
          {dish.isPopular && (
            <View className="bg-yellow-500 px-2 py-1 rounded-md">
              <Text className="text-white text-xs font-medium">Populaire</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Rest of your component... */}
    </ScrollView>
  );
}