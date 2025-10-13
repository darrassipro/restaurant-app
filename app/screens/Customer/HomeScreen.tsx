import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { useGetRestaurantQuery } from '../../store/api/restaurantApi';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';
import { CustomerStackParamList } from '../../navigation/types';
import Card from '../../components/UI/Card';
import DishCard from '../../components/features/DishCard';
import { formatCurrency } from '../../utils/formatters';
import { useGetDishesQuery } from '../../store/api/dishApi';

type HomeScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    data: restaurantData,
    isLoading: isLoadingRestaurant,
    refetch: refetchRestaurant
  } = useGetRestaurantQuery();
  
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    refetch: refetchCategories
  } = useGetCategoriesQuery();
  
  const {
    data: dishesData,
    isLoading: isLoadingDishes,
    refetch: refetchDishes
  } = useGetDishesQuery({ page: 1, limit: 10 });

  // Popular dishes filter
  const popularDishes = dishesData?.data?.filter(dish => dish.isPopular) || [];
  
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchRestaurant(), refetchCategories(), refetchDishes()]);
    setRefreshing(false);
  }, [refetchRestaurant, refetchCategories, refetchDishes]);

  const navigateToCategory = (categoryId: number) => {
    navigation.navigate('Menu', { screen: 'Menu', params: { categoryId } });
  };

  const navigateToDish = (dishId: number) => {
    navigation.navigate('DishDetails', { dishId });
  };

  const restaurant = restaurantData?.data;
  const categories = categoriesData?.data || [];

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Restaurant Banner */}
      {restaurant && (
        <View className="w-full h-40 relative">
          <Image
            source={{ uri: restaurant.banner || 'https://via.placeholder.com/800x400' }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30 flex justify-end p-4">
            <View className="flex-row items-center">
              <Image
                source={{ uri: restaurant.logo || 'https://via.placeholder.com/100x100' }}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
              <View className="ml-3">
                <Text className="text-white text-2xl font-bold">{restaurant.name}</Text>
                <View className="flex-row items-center">
                  <Feather name="map-pin" size={14} color="white" />
                  <Text className="text-white ml-1">{restaurant.Address?.city}, {restaurant.Address?.sector}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      <View className="p-4">
        {/* Categories Horizontal Scroll */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3">Catégories</Text>
          {isLoadingCategories ? (
            <Text className="text-gray-500">Chargement des catégories...</Text>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="overflow-visible"
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => navigateToCategory(category.id)}
                  className="mr-4"
                >
                  <Card className="w-24 h-24 items-center justify-center">
                    <Text className="text-2xl mb-1">{category.icon}</Text>
                    <Text className="text-sm text-center">{category.nameFr}</Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Popular Dishes */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3">Plats populaires</Text>
          {isLoadingDishes ? (
            <Text className="text-gray-500">Chargement des plats...</Text>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="overflow-visible"
            >
              {popularDishes.map((dish) => (
                <TouchableOpacity
                  key={dish.id}
                  onPress={() => navigateToDish(dish.id)}
                  className="mr-4"
                >
                  <DishCard
                    id={dish.id}
                    name={dish.nameFr}
                    image={dish.image[0]}
                    price={formatCurrency(dish.price)}
                    rating={dish.averageRating}
                    isPopular={dish.isPopular}
                    isVegetarian={dish.isVegetarian}
                    isSpicy={dish.isSpicy}
                  />
                </TouchableOpacity>
              ))}
              {popularDishes.length === 0 && (
                <Text className="text-gray-500">Aucun plat populaire disponible pour le moment.</Text>
              )}
            </ScrollView>
          )}
        </View>

        {/* Restaurant Info */}
        {restaurant && (
          <Card className="mb-6">
            <Text className="text-lg font-bold mb-2">À propos du restaurant</Text>
            <Text className="text-gray-700 mb-3">{restaurant.description}</Text>
            
            <View className="flex-row items-center mb-2">
              <Feather name="phone" size={16} color="#666" />
              <Text className="text-gray-700 ml-2">{restaurant.phone}</Text>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Feather name="mail" size={16} color="#666" />
              <Text className="text-gray-700 ml-2">{restaurant.email}</Text>
            </View>
            
            <View className="border-t border-gray-200 mt-3 pt-3">
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-gray-500">Commande minimum</Text>
                  <Text className="font-bold">{formatCurrency(restaurant.minimumOrder)}</Text>
                </View>
                <View>
                  <Text className="text-gray-500">Frais de livraison</Text>
                  <Text className="font-bold">{formatCurrency(restaurant.deliveryFee)}</Text>
                </View>
              </View>
            </View>
          </Card>
        )}
      </View>