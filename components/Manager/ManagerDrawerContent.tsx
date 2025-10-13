import { Feather } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { selectUser } from '../../store/slices/authSlice';

export const ManagerDrawerContent = (props) => {
  const user = useSelector(selectUser);
  const { logout } = useAuth();

  return (
    <View className="flex-1">
      <DrawerContentScrollView {...props}>
        <View className="p-4 bg-primary">
          <View className="flex-row items-center mb-3">
            <View className="w-16 h-16 bg-white rounded-full items-center justify-center">
              <Text className="text-primary text-xl font-bold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Text>
            </View>
            <View className="ml-3">
              <Text className="text-white text-lg font-bold">{user?.firstName} {user?.lastName}</Text>
              <Text className="text-white opacity-80">Manager</Text>
            </View>
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity 
          className="flex-row items-center py-3"
          onPress={logout}
        >
          <Feather name="log-out" size={22} color="#FF5733" />
          <Text className="text-red-500 ml-3 font-medium">Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};