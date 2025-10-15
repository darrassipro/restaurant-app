// components/features/AddressSelector.tsx
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useGetAddressesQuery } from '../../store/api/addressApi';
import { Address } from '../../types/restaurant';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface AddressSelectorProps {
  selectedAddressId: number | null;
  onSelectAddress: (address: Address) => void;
}

const AddressSelector = ({ selectedAddressId, onSelectAddress }: AddressSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const { data: addresses, isLoading } = useGetAddressesQuery();

  const selectedAddress = addresses?.find(address => address.id === selectedAddressId);

  const handleAddNewAddress = () => {
    setModalVisible(false);
    router.push('/add-edit-address' as never);
  };

  const handleSelectAddress = (address: Address) => {
    onSelectAddress(address);
    setModalVisible(false);
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">Adresse de livraison</Text>
      
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="border border-gray-300 rounded-md p-3"
      >
        {selectedAddress ? (
          <View>
            <View className="flex-row justify-between">
              <Text className="font-medium">{selectedAddress.contactName}</Text>
              {selectedAddress.isDefault && (
                <View className="bg-blue-100 rounded-md px-2 py-1">
                  <Text className="text-blue-800 text-xs">Par défaut</Text>
                </View>
              )}
            </View>
            <Text className="text-gray-600 mt-1">{selectedAddress.addressName}</Text>
            <Text className="text-gray-600">{selectedAddress.sector}, {selectedAddress.city}</Text>
            <Text className="text-gray-600">{selectedAddress.contactPhone}</Text>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-500">Sélectionnez une adresse de livraison</Text>
            <Feather name="chevron-down" size={20} color="#666" />
          </View>
        )}
      </TouchableOpacity>
      
      <Modal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Sélectionnez une adresse"
      >
        <View className="min-h-[200px]">
          {isLoading ? (
            <View className="justify-center items-center p-4">
              <ActivityIndicator size="large" color="#FF5733" />
            </View>
          ) : addresses && addresses.length > 0 ? (
            <ScrollView className="max-h-[300px]">
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  onPress={() => handleSelectAddress(address)}
                  className={`p-3 mb-2 rounded-md ${
                    selectedAddressId === address.id
                      ? 'bg-primary/10 border border-primary'
                      : 'bg-gray-100'
                  }`}
                >
                  <View className="flex-row justify-between">
                    <Text className="font-medium">{address.contactName}</Text>
                    {address.isDefault && (
                      <View className="bg-blue-100 rounded-md px-2 py-1">
                        <Text className="text-blue-800 text-xs">Par défaut</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-600 mt-1">{address.addressName}</Text>
                  <Text className="text-gray-600">{address.sector}, {address.city}</Text>
                  <Text className="text-gray-600">{address.contactPhone}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View className="justify-center items-center p-4">
              <Text className="text-gray-500 mb-4">Aucune adresse trouvée</Text>
            </View>
          )}
          
          <Button
            title="Ajouter une nouvelle adresse"
            onPress={handleAddNewAddress}
            icon={<Feather name="plus" size={18} color="#fff" />}
            fullWidth
            className="mt-4"
          />
        </View>
      </Modal>
    </View>
  );
};

export default AddressSelector;