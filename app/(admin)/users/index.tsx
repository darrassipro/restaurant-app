// app/(admin)/users/index.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGetUsersQuery } from '../../../store/api/userApi';
import { User } from '../../../types/auth';

// Define User type for better type safety


export default function UsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  
  const { data: usersData, isLoading, refetch } = useGetUsersQuery({});
const users: User[] = usersData?.data?.users || [];


  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const navigateToUserDetails = (userId: number) => {
    router.push({
      pathname: '/users/[id]',
      params: { id: userId }
    } as never);
  };

  // Predefined role badge styles to avoid dynamic class generation
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return { bg: 'bg-red-100', text: 'text-red-800' };
      case 'manager':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'chef':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      default:
        return { bg: 'bg-green-100', text: 'text-green-800' };
    }
  };

  const renderRoleFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="flex-row mb-4"
    >
      <TouchableOpacity
        onPress={() => setRoleFilter(null)}
        className={roleFilter === null ? 'bg-primary px-4 py-2 rounded-full mr-2' : 'bg-gray-200 px-4 py-2 rounded-full mr-2'}
      >
        <Text className={roleFilter === null ? 'text-white' : 'text-gray-700'}>
          Tous
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => setRoleFilter('admin')}
        className={roleFilter === 'admin' ? 'bg-primary px-4 py-2 rounded-full mr-2' : 'bg-gray-200 px-4 py-2 rounded-full mr-2'}
      >
        <Text className={roleFilter === 'admin' ? 'text-white' : 'text-gray-700'}>
          Admin
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => setRoleFilter('manager')}
        className={roleFilter === 'manager' ? 'bg-primary px-4 py-2 rounded-full mr-2' : 'bg-gray-200 px-4 py-2 rounded-full mr-2'}
      >
        <Text className={roleFilter === 'manager' ? 'text-white' : 'text-gray-700'}>
          Manager
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => setRoleFilter('chef')}
        className={roleFilter === 'chef' ? 'bg-primary px-4 py-2 rounded-full mr-2' : 'bg-gray-200 px-4 py-2 rounded-full mr-2'}
      >
        <Text className={roleFilter === 'chef' ? 'text-white' : 'text-gray-700'}>
          Chef
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => setRoleFilter('customer')}
        className={roleFilter === 'customer' ? 'bg-primary px-4 py-2 rounded-full mr-2' : 'bg-gray-200 px-4 py-2 rounded-full mr-2'}
      >
        <Text className={roleFilter === 'customer' ? 'text-white' : 'text-gray-700'}>
          Customer
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderUserItem = ({ item }: { item: User }) => {
    const roleBadgeStyle = getRoleBadgeStyle(item.role);
    
    return (
      <TouchableOpacity
        onPress={() => navigateToUserDetails(item.id)}
        className="bg-white p-4 rounded-lg shadow-sm mb-3"
      >
        <View className="flex-row justify-between">
          <View>
            <Text className="font-bold text-lg">{item.firstName} {item.lastName}</Text>
            <Text className="text-gray-600">{item.email}</Text>
            <Text className="text-gray-600">{item.phone}</Text>
          </View>
          <View>
            <View className={`px-2 py-1 rounded ${roleBadgeStyle.bg}`}>
              <Text className={`text-xs font-medium ${roleBadgeStyle.text}`}>
                {item.role.toUpperCase()}
              </Text>
            </View>
            {item.isActive ? (
              <Text className="text-sm mt-1 text-green-600">Actif</Text>
            ) : (
              <Text className="text-sm mt-1 text-red-600">Inactif</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold mb-4">Gestion des utilisateurs</Text>
      
      {/* Search bar */}
      <View className="flex-row items-center bg-white rounded-lg mb-4 px-3 shadow-sm">
        <Feather name="search" size={20} color="#666" />
        <TextInput
          className="flex-1 py-3 px-2"
          placeholder="Rechercher un utilisateur"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Role filters */}
      {renderRoleFilter()}
      
      {/* Add new user button */}
      <TouchableOpacity
        onPress={() => router.push('/users/new' as never)}
        className="bg-primary py-3 px-4 rounded-lg flex-row justify-center items-center mb-4"
      >
        <Feather name="user-plus" size={20} color="#FFF" />
        <Text className="text-white font-medium ml-2">Ajouter un utilisateur</Text>
      </TouchableOpacity>
      
      {/* Users list */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF5733" />
        </View>
      ) : filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Feather name="users" size={60} color="#ccc" />
          <Text className="text-lg text-gray-500 mt-4">
            Aucun utilisateur trouvé
          </Text>
        </View>
      )}
    </View>
  );
}