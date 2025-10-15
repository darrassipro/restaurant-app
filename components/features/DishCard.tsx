// components/features/DishCard.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

interface DishCardProps {
  id: number;
  name: string;
  description?: string;
  image: string;
  price: string;
  rating?: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  horizontal?: boolean;
  onPress?: () => void;
  restaurantId: number;
  categoryId: number;
  nameAr: string;
}

const DishCard = ({
  id,
  name,
  description,
  image,
  price,
  rating,
  isPopular = false,
  isVegetarian = false,
  isSpicy = false,
  horizontal = false,
  onPress,
  restaurantId,
  categoryId,
  nameAr,
}: DishCardProps) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        dish: {
          id,
          nameFr: name,
          nameAr,
          price: price.replace(' MAD', ''),
          image: [image],
          restaurantId,
          categoryId,
        },
        quantity: 1,
      })
    );
  };

  if (horizontal) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-row bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <Image
          source={{ uri: image || 'https://via.placeholder.com/150' }}
          className="w-24 h-24"
          resizeMode="cover"
        />
        <View className="flex-1 p-3">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="font-medium text-lg">{name}</Text>
              {description && (
                <Text className="text-gray-600 text-sm" numberOfLines={2}>
                  {description}
                </Text>
              )}
            </View>
            <Text className="font-bold text-primary">{price}</Text>
          </View>
          
          <View className="flex-row justify-between items-center mt-auto pt-2">
            <View className="flex-row">
              {isVegetarian && (
                <View className="bg-green-100 px-2 py-1 rounded mr-1">
                  <Text className="text-green-800 text-xs">Végé</Text>
                </View>
              )}
              {isSpicy && (
                <View className="bg-red-100 px-2 py-1 rounded mr-1">
                  <Text className="text-red-800 text-xs">Épicé</Text>
                </View>
              )}
              {isPopular && (
                <View className="bg-yellow-100 px-2 py-1 rounded">
                  <Text className="text-yellow-800 text-xs">Populaire</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity
              onPress={handleAddToCart}
              className="bg-primary w-8 h-8 rounded-full items-center justify-center"
            >
              <Feather name="plus" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg shadow-sm overflow-hidden w-40"
    >
      <View className="relative">
        <Image
          source={{ uri: image || 'https://via.placeholder.com/150' }}
          className="w-full h-32"
          resizeMode="cover"
        />
        {isPopular && (
          <View className="absolute top-2 left-2 bg-yellow-500 px-2 py-1 rounded-md">
            <Text className="text-white text-xs font-medium">Populaire</Text>
          </View>
        )}
      </View>
      
      <View className="p-3">
        <Text className="font-medium text-base" numberOfLines={1}>
          {name}
        </Text>
        
        <View className="flex-row items-center mt-1">
          {rating && (
            <View className="flex-row items-center mr-2">
              <Feather name="star" size={12} color="#FFD700" />
              <Text className="text-xs ml-1">{rating}</Text>
            </View>
          )}
          {/* Changed from "leaf" to "circle" with green color to represent vegetarian */}
          {isVegetarian && <Feather name="circle" size={12} color="green" />}
          {isSpicy && <Feather name="thermometer" size={12} color="red" />}
        </View>
        
        <View className="flex-row justify-between items-center mt-2">
          <Text className="font-bold text-primary">{price}</Text>
          <TouchableOpacity
            onPress={handleAddToCart}
            className="bg-primary w-7 h-7 rounded-full items-center justify-center"
          >
            <Feather name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DishCard;