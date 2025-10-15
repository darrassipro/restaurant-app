// app/(admin)/users/index.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import UserTable from '../../../components/Admin/UserTable';
import { useDeleteUserMutation, useGetUsersQuery } from '../../../store/api/userApi';
import { User } from '../../../types/auth';

export default function UsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  
  const { data: usersData, isLoading, refetch } = useGetUsersQuery({});
  const [deleteUser] = useDeleteUserMutation();

  const users: User[] = usersData?.data?.users || [];

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' ||
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleEditUser = (userId: number) => {
    router.push({
      pathname: '/users/[id]',
      params: { id: userId }
    } as never);
  };

  const handleDeleteUser = async (userId: number) => {
    Alert.alert(
      'Supprimer l\'utilisateur',
      'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(userId).unwrap();
              Alert.alert('Succès', 'Utilisateur supprimé avec succès');
              refetch();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer l\'utilisateur');
            }
          }
        }
      ]
    );
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

      {/* Users table */}
      <UserTable
        users={filteredUsers}
        isLoading={isLoading}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onRefresh={refetch}
      />
    </View>
  );
}