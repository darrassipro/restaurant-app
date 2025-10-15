import { Feather } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../../types/auth';
import { ROLES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEditUser: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
  onRefresh: () => void;
}

const UserTable = ({ users, isLoading, onEditUser, onDeleteUser, onRefresh }: UserTableProps) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return { bg: '#FEE2E2', text: '#B91C1C' }; // Red
      case 'manager':
        return { bg: '#E0E7FF', text: '#4F46E5' }; // Indigo
      case 'chef':
        return { bg: '#FEF3C7', text: '#D97706' }; // Amber
      case 'customer':
      default:
        return { bg: '#ECFDF5', text: '#047857' }; // Green
    }
  };

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const roleColor = getRoleColor(item.role);
        
        return (
          <View className="bg-white mx-4 my-2 rounded-lg shadow-sm p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-lg">
                {item.firstName} {item.lastName}
              </Text>
              
              <View 
                style={{ backgroundColor: roleColor.bg }}
                className="px-3 py-1 rounded-full"
              >
                <Text 
                  style={{ color: roleColor.text }}
                  className="text-xs font-medium"
                >
                  {ROLES[item.role as keyof typeof ROLES] || item.role}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Feather name="mail" size={14} color="#666" />
              <Text className="text-gray-600 ml-1">{item.email}</Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Feather name="phone" size={14} color="#666" />
              <Text className="text-gray-600 ml-1">{item.phone}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 text-sm">
                Créé le {formatDate(item.createdAt)}
              </Text>
              
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => onEditUser(item.id)}
                  className="p-2 mr-1"
                >
                  <Feather name="edit" size={18} color="#2196F3" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => onDeleteUser(item.id)}
                  className="p-2"
                >
                  <Feather name="trash-2" size={18} color="#FF5733" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }}
      refreshing={isLoading}
      onRefresh={onRefresh}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center p-10">
          <Feather name="users" size={40} color="#ccc" />
          <Text className="text-gray-500 mt-2 text-center">
            Aucun utilisateur trouvé
          </Text>
        </View>
      }
    />
  );
};

export default UserTable;