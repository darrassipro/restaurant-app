// app/(manager)/orders.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGetRestaurantOrdersQuery } from '../../store/api/orderApi';
import { ORDER_STATUS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Define Order type for better type safety
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface OrderItem {
  id: number;
  dishId: number;
  quantity: number;
  dishPrice: string;
}

interface Order {
  id: number;
  orderNumber: string;
  total: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  User?: User;
  items?: OrderItem[];
}

// Define OrderStatus type for type safety
type OrderStatusKey = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export default function OrdersScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<OrderStatusKey | null>(null);
  
  const { data: ordersData, isLoading, refetch } = useGetRestaurantOrdersQuery();
  const orders: Order[] = ordersData?.data || [];

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = searchQuery === '' || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.User && 
        (`${order.User.firstName} ${order.User.lastName}`).toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const navigateToOrderDetails = (orderId: number): void => {
    router.push({
      pathname: '/order-details/[id]',
      params: { id: orderId }
    } as never);
  };

  const renderStatusBadge = (status: OrderStatusKey): React.ReactElement => {
    // Type assertion to ensure we're accessing valid keys
    const statusConfig = ORDER_STATUS[status];
    const color = statusConfig?.color || '#666';
    
    return (
      <View 
        style={{ backgroundColor: `${color}20` }}
        className="px-3 py-1 rounded-full"
      >
        <Text style={{ color }} className="text-xs font-medium">
          {statusConfig?.label || status}
        </Text>
      </View>
    );
  };

  const renderStatusFilter = (): React.ReactElement => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mb-4"
    >
      <TouchableOpacity
        onPress={() => setStatusFilter(null)}
        className={`px-4 py-2 rounded-full mr-2 ${
          statusFilter === null ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      >
        <Text className={`${statusFilter === null ? 'text-white' : 'text-gray-700'}`}>
          Tous
        </Text>
      </TouchableOpacity>
      
      {(Object.keys(ORDER_STATUS) as OrderStatusKey[]).map((status) => (
        <TouchableOpacity
          key={status}
          onPress={() => setStatusFilter(status)}
          className={`px-4 py-2 rounded-full mr-2 ${
            statusFilter === status 
              ? 'bg-primary' 
              : 'bg-gray-200'
          }`}
        >
          <Text className={`${
            statusFilter === status ? 'text-white' : 'text-gray-700'
          }`}>
            {ORDER_STATUS[status].label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Commandes
        </Text>
        
        {/* Search bar */}
        <View className="flex-row items-center bg-white rounded-lg mb-4 px-3 shadow-sm">
          <Feather name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 py-3 px-2"
            placeholder="Rechercher par numéro de commande ou client"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        {/* Status filters */}
        {renderStatusFilter()}
      </View>
      
      {/* Orders list */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF5733" />
        </View>
      ) : filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToOrderDetails(item.id)}
              className="bg-white mx-4 my-2 rounded-lg shadow-sm p-4"
            >
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Text className="font-bold text-gray-800 mr-2">
                    #{item.orderNumber}
                  </Text>
                  {renderStatusBadge(item.status)}
                </View>
                <Text className="font-bold text-primary">
                  {formatCurrency(item.total)}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600">
                  {item.items?.length || 0} article{item.items?.length !== 1 ? 's' : ''}
                </Text>
                <Text className="text-gray-600">
                  {formatDate(item.createdAt)}
                </Text>
              </View>
              
              {item.User && (
                <View className="flex-row items-center">
                  <Feather name="user" size={14} color="#666" />
                  <Text className="text-gray-700 ml-1">
                    {item.User.firstName} {item.User.lastName}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Feather name="inbox" size={60} color="#ccc" />
          <Text className="text-lg text-gray-500 mt-4">
            Aucune commande trouvée
          </Text>
        </View>
      )}
    </View>
  );
}