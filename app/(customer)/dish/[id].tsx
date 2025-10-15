// app/(customer)/dish/[id].tsx
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button';
import { useGetDishByIdQuery } from '../../../store/api/dishApi';
import { addToCart } from '../../../store/slices/cartSlice';
import { Dish } from '../../../types/dish';
import { formatCurrency } from '../../../utils/formatters';


export default function DishDetailsScreen() {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  
  // Parse id from params
  const dishId = typeof params.id === 'string' ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { data: dishData, isLoading } = useGetDishByIdQuery(dishId);
  const dish: Dish | undefined = dishData;

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
          nameAr: dish.nameAr,
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
      
      {/* Dish Information */}
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <Text className="text-2xl font-bold text-gray-800">{dish.nameFr}</Text>
          <Text className="text-xl font-bold text-primary">{formatCurrency(dish.price)}</Text>
        </View>
        
        {dish.originalPrice && (
          <Text className="text-gray-500 line-through">
            {formatCurrency(dish.originalPrice)}
          </Text>
        )}
        
        {/* Rating & Orders */}
        <View className="flex-row items-center mt-2">
          {dish.averageRating && (
            <View className="flex-row items-center mr-4">
              <Feather name="star" size={16} color="#FFD700" />
              <Text className="ml-1">{dish.averageRating}</Text>
            </View>
          )}
          {dish.totalOrders !== undefined && (
            <View className="flex-row items-center">
              <Feather name="shopping-bag" size={16} color="#666" />
              <Text className="ml-1">{dish.totalOrders} commandes</Text>
            </View>
          )}
        </View>
        
        {/* Description */}
        {dish.descriptionFr && (
          <View className="mt-4">
            <Text className="text-gray-700">{dish.descriptionFr}</Text>
          </View>
        )}
        
        {/* Additional Information */}
        <View className="mt-4 flex-row">
          {dish.preparationTime !== undefined && (
            <View className="flex-row items-center mr-4">
              <Feather name="clock" size={16} color="#666" />
              <Text className="ml-1">{dish.preparationTime} min</Text>
            </View>
          )}
          {dish.calories !== undefined && (
            <View className="flex-row items-center">
              <Feather name="activity" size={16} color="#666" />
              <Text className="ml-1">{dish.calories} cal</Text>
            </View>
          )}
        </View>
        
        {/* Ingredients */}
        {dish.ingredients && dish.ingredients.length > 0 && (
          <View className="mt-4">
            <Text className="text-lg font-medium mb-2">Ingrédients</Text>
            <View className="flex-row flex-wrap">
              {dish.ingredients.map((ingredient, index) => (
                <View 
                  key={index} 
                  className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <Text className="text-gray-700">{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Allergens */}
        {dish.allergens && dish.allergens.length > 0 && (
          <View className="mt-4">
            <Text className="text-lg font-medium mb-2">Allergènes</Text>
            <View className="flex-row flex-wrap">
              {dish.allergens.map((allergen, index) => (
                <View 
                  key={index} 
                  className="bg-red-100 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <Text className="text-red-700">{allergen}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Quantity and Add to Cart */}
        <View className="mt-6 bg-gray-100 p-4 rounded-lg">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-medium">Quantité</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => handleQuantityChange(-1)}
                className="bg-gray-300 w-8 h-8 rounded-full items-center justify-center"
              >
                <Feather name="minus" size={20} color="#333" />
              </TouchableOpacity>
              
              <Text className="mx-4 text-lg font-bold">{quantity}</Text>
              
              <TouchableOpacity
                onPress={() => handleQuantityChange(1)}
                className="bg-gray-300 w-8 h-8 rounded-full items-center justify-center"
              >
                <Feather name="plus" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-lg font-medium">Total</Text>
            <Text className="text-xl font-bold text-primary">
              {formatCurrency(parseFloat(dish.price) * quantity)}
            </Text>
          </View>
          
          <Button
            title="Ajouter au panier"
            onPress={handleAddToCart}
            icon={<Feather name="shopping-cart" size={20} color="#FFF" />}
            className="mt-4"
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}