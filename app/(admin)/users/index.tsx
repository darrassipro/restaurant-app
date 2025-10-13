// app/(admin)/users/index.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import UserTable from '../../../components/Admin/UserTable';
import Button from '../../../components/ui/Button';
import { useDeleteUserMutation, useGetUsersQuery } from '../../../store/api/userApi';
import { ROLES } from '../../../utils/constants';

export default function UsersScreen() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  
  const { data: usersData, isLoading, refetch } = useGetUsersQuery({
    page,
    limit: 20,
  });
  
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  
  const users = usersData?.data?.users || [];
  const pagination = usersData?.data?.pagination;

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    router.push('/admin/users/new');
  };

  const handleEditUser = (userId: number) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleDeleteUser = (userId: number) => {
    Alert.alert(
      "Supprimer l'utilisateur",
      "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.",
      [
        { 
          text: "Annuler", 
          style: "cancel" 
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(userId).unwrap();
              refetch();
            } catch (error) {
              console.error('Delete user error:', error);
              Alert.alert("Erreur", "Une erreur est survenue lors de la suppression de l'utilisateur");
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
      className="mb-4"
    >
      <TouchableOpacity
        onPress={() => setRoleFilter(null)}
        className={`px-4 py-2 rounded-full mr-2 ${
          roleFilter === null ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      >
        <Text className={`${roleFilter === null ? 'text-white' : 'text-gray-700'}`}>
          Tous
        </Text>
      </TouchableOpacity>
      
      {Object.entries(ROLES).map(([role, label]) => (
        <TouchableOpacity
          key={role}
          onPress={() => setRoleFilter(role)}
          className={`px-4 py-2 rounded-full mr-2 ${
            roleFilter === role 
              ? 'bg-primary' 
              : 'bg-gray-200'
          }`}
        >
          <Text className={`${
            roleFilter === role ? 'text-white' : 'text-gray-700'
          }`}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">
            Utilisateurs
          </Text>
          
          <Button
            title="Ajouter"
            onPress={handleAddUser}
            icon={<Feather name="plus" size={18} color="#fff" />}
            size="sm"
          />
        </View>
        
        {/* Search bar */}
        <View className="flex-row items-center bg-white rounded-lg mb-4 px-3 shadow-sm">
          <Feather name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 py-3 px-2"
            placeholder="Rechercher par nom ou email"
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
      </View>
      
      {/* Users table */}
      <UserTable 
        users={filteredUsers}
        isLoading={isLoading || isDeleting}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onRefresh={refetch}
      />
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <View className="flex-row justify-center items-center py-4">
          <TouchableOpacity
            onPress={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`mx-2 ${page === 1 ? 'opacity-50' : ''}`}
          >
            <Feather name="chevron-left" size={24} color="#666" />
          </TouchableOpacity>
          
          <Text>Page {page} sur {pagination.totalPages}</Text>
          
          <TouchableOpacity
            onPress={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page === pagination.totalPages}
            className={`mx-2 ${page === pagination.totalPages ? 'opacity-50' : ''}`}
          >
            <Feather name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}