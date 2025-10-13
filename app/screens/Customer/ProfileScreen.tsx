import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { CustomerStackParamList } from '../../navigation/types';
import { selectUser } from '../../store/slices/authSlice';

type ProfileScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const user = useSelector(selectUser);
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Déconnexion",
          onPress: logout,
          style: "destructive"
        }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Header */}
      <View className="bg-primary p-6 items-center">
        <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-3">
          <Text className="text-primary text-3xl font-bold">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Text>
        </View>
        <Text className="text-white text-xl font-bold">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text className="text-white opacity-80">{user?.email}</Text>
      </View>

      {/* Menu Items */}
      <View className="p-4">
        <View className="bg-white rounded-lg shadow-sm overflow-hidden">
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <Feather name="user" size={22} color="#FF5733" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Modifier le profil</Text>
              <Text className="text-gray-500 text-sm">Modifier vos informations personnelles</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('AddressBook')}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <Feather name="map-pin" size={22} color="#FF5733" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Adresses</Text>
              <Text className="text-gray-500 text-sm">Gérer vos adresses de livraison</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('OrderHistory')}
            className="flex-row items-center p-4"
          >
            <Feather name="shopping-bag" size={22} color="#FF5733" />
            <View className="ml-3 flex-1">
              <Text className="font-medium text-gray-800">Commandes</Text>
              <Text className="text-gray-500 text-sm">Voir l'historique de vos commandes</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>
        </View>
        
        <View className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center p-4"
          >
            <Feather name="log-out" size={22} color="#FF5733" />
            <Text className="ml-3 font-medium text-gray-800">Déconnexion</Text>
          </TouchableOpacity>
        </View>
        
        {/* App Info */}
        <View className="items-center mt-6">
          <Text className="text-gray-500">Le Gourmet - Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;