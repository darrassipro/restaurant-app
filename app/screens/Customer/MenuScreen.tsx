import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import DishCard from '../../components/features/DishCard';
import { CustomerStackParamList } from '../../navigation/types';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';
import { useGetDishesByCategoryQuery } from '../../store/api/dishApi';
import { formatCurrency } from '../../utils/formatters';

type MenuScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Menu'>;

const MenuScreen = () => {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const route = useRoute();
  // Get categoryId if passed as parameter
  const initialCategoryId = route.params?.categoryId;
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialCategoryId || null);
  
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const { data: dishes, isLoading: isLoadingDishes } = useGetDishesByCategoryQuery(
    selectedCategoryId || 0,
    { skip: !selectedCategoryId }
  );

  // Set initial category if not set and categories are loaded
  useEffect(() => {
    if (!selectedCategoryId && categoriesData?.data?.length > 0) {
      setSelectedCategoryId(categoriesData.data[0].id);
    }
  }, [categoriesData, selectedCategoryId]);

  const navigateToDish = (dishId: number) => {
    navigation.navigate('DishDetails', { dishId });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategoryId(item.id)}
      className={`px-4 py-3 mr-2 rounded-full ${
        selectedCategoryId === item.id ? 'bg-primary' : 'bg-gray-200'
      }`}
    >
      <Text
        className={`${
          selectedCategoryId === item.id ? 'text-white font-medium' : 'text-gray-700'
        }`}
      >
        {item.nameFr}
      </Text>
    </TouchableOpacity>
  );

  const renderDishItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigateToDish(item.id)}
      className="mb-4"
    >
      <DishCard
        id={item.id}
        name={item.nameFr}
        description={item.descriptionFr}
        image={item.image[0]}
        price={formatCurrency(item.price)}
        rating={item.averageRating}
        isPopular={item.isPopular}
        isVegetarian={item.isVegetarian}
        isSpicy={item.isSpicy}
        horizontal={true}
      />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Categories Horizontal List */}
      <View className="bg-white pt-2 pb-3 shadow-sm">
        {isLoadingCategories ? (
          <View className="p-4 items-center">
            <ActivityIndicator color="#FF5733" />
          </View>
        ) : (
          <FlatList
            data={categoriesData?.data || []}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4"
          />
        )}
      </View>

      {/* Dishes List */}
      <View className="flex-1 p-4">
        {isLoadingDishes ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FF5733" />
          </View>
        ) : dishes?.length > 0 ? (
          <FlatList
            data={dishes}
            renderItem={renderDishItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Feather name="info" size={50} color="#ccc" />
            <Text className="text-gray-400 mt-2 text-lg">
              Aucun plat disponible dans cette catégorie
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MenuScreen;