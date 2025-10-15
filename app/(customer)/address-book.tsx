// app/(customer)/address-book.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/ui/Button';
import { useDeleteAddressMutation, useGetAddressesQuery } from '../../store/api/addressApi';
import { Address } from '../../types/address';

export default function AddressBookScreen() {
  const { data: addresses, isLoading, refetch } = useGetAddressesQuery();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  const handleEditAddress = (addressId: number) => {
    router.push({ pathname: '/add-edit-address', params: { addressId } } as never);
  };

  const handleAddAddress = () => {
    router.push('/add-edit-address' as never);
  };

  const handleDeleteAddress = async (addressId: number, isDefault: boolean) => {
    if (isDefault) {
      Alert.alert(
        "Impossible de supprimer",
        "Vous ne pouvez pas supprimer une adresse par défaut.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Supprimer l'adresse",
      "Êtes-vous sûr de vouloir supprimer cette adresse ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAddress(addressId).unwrap();
              refetch();
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer l'adresse");
            }
          }
        }
      ]
    );
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <View className="bg-white p-4 mx-4 my-2 rounded-lg shadow-sm">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="font-bold text-lg">{item.contactName}</Text>
            {item.isDefault && (
              <View className="bg-blue-100 px-2 py-1 rounded-md ml-2">
                <Text className="text-blue-800 text-xs">Par défaut</Text>
              </View>
            )}
          </View>
          <Text className="text-gray-700 mt-1">{item.addressName}</Text>
          <Text className="text-gray-700">{item.sector}, {item.city}</Text>
          <Text className="text-gray-700 mt-1">{item.contactPhone}</Text>
          {item.deliveryInstructions && (
            <View className="mt-2">
              <Text className="text-gray-600">Instructions:</Text>
              <Text className="text-gray-700">{item.deliveryInstructions}</Text>
            </View>
          )}
        </View>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => handleEditAddress(item.id || 0)}
            className="p-2 mr-1"
          >
            <Feather name="edit" size={20} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteAddress(item.id || 0, item.isDefault || false)}
            className="p-2"
          >
            <Feather name="trash-2" size={20} color="#FF5733" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF5733" />
        </View>
      ) : addresses && addresses.length > 0 ? (
        <FlatList
          data={addresses}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          renderItem={renderAddressItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshing={isLoading || isDeleting}
          onRefresh={refetch}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-6">
          <Feather name="map-pin" size={60} color="#ccc" />
          <Text className="text-xl font-medium text-gray-700 mt-4">
            Aucune adresse enregistrée
          </Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">
            Ajoutez une adresse de livraison pour faciliter vos commandes
          </Text>
        </View>
      )}
      <View className="p-4">
        <Button
          title="Ajouter une nouvelle adresse"
          onPress={handleAddAddress}
          icon={<Feather name="plus" size={20} color="#FFF" />}
          fullWidth
        />
      </View>
    </View>
  );
}