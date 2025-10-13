import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { CustomerStackParamList } from '../../navigation/types';
import { useCreateAddressMutation, useGetAddressByIdQuery, useUpdateAddressMutation } from '../../store/api/addressApi';

type AddEditAddressScreenRouteProp = RouteProp<CustomerStackParamList, 'AddEditAddress'>;

const AddEditAddressScreen = () => {
  const route = useRoute<AddEditAddressScreenRouteProp>();
  const navigation = useNavigation();
  
  const { addressId } = route.params || {};
  const isEditMode = !!addressId;
  
  const [formData, setFormData] = useState({
    city: '',
    sector: '',
    addressName: '',
    latitude: '',
    longitude: '',
    isDefault: false,
    deliveryInstructions: '',
    contactName: '',
    contactPhone: '',
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { data: addressData, isLoading: isLoadingAddress } = useGetAddressByIdQuery(addressId || 0, {
    skip: !isEditMode,
  });
  
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  
  const isLoading = isLoadingAddress || isCreating || isUpdating;

  useEffect(() => {
    if (isEditMode && addressData) {
      setFormData({
        city: addressData.city || '',
        sector: addressData.sector || '',
        addressName: addressData.addressName || '',
        latitude: addressData.latitude || '',
        longitude: addressData.longitude || '',
        isDefault: addressData.isDefault || false,
        deliveryInstructions: addressData.deliveryInstructions || '',
        contactName: addressData.contactName || '',
        contactPhone: addressData.contactPhone || '',
      });
    }
  }, [addressData, isEditMode]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }
    
    if (!formData.sector.trim()) {
      newErrors.sector = 'Le secteur est requis';
    }
    
    if (!formData.addressName.trim()) {
      newErrors.addressName = "L'adresse est requise";
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Le nom de contact est requis';
    }
    
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Le téléphone de contact est requis';
    } else if (!/^\+?\d{10,15}$/.test(formData.contactPhone.replace(/\s/g, ''))) {
      newErrors.contactPhone = 'Format de téléphone invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      if (isEditMode && addressId) {
        await updateAddress({ id: addressId, address: formData }).unwrap();
        Alert.alert('Succès', 'Adresse mise à jour avec succès');
      } else {
        await createAddress(formData).unwrap();
        Alert.alert('Succès', 'Adresse ajoutée avec succès');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Address save error:', error);
      Alert.alert('Erreur', "Une erreur est survenue lors de l'enregistrement de l'adresse");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          {isLoadingAddress ? (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#FF5733" />
            </View>
          ) : (
            <>
              <Input
                label="Ville *"
                placeholder="Ex: Casablanca"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                error={errors.city}
              />
              
              <Input
                label="Secteur/Quartier *"
                placeholder="Ex: Maarif"
                value={formData.sector}
                onChangeText={(value) => handleInputChange('sector', value)}
                error={errors.sector}
              />
              
              <Input
                label="Adresse détaillée *"
                placeholder="Ex: 123 Rue Mohammed V, Apt 5"
                value={formData.addressName}
                onChangeText={(value) => handleInputChange('addressName', value)}
                error={errors.addressName}
              />
              
              <Input
                label="Nom de contact *"
                placeholder="Nom et prénom"
                value={formData.contactName}
                onChangeText={(value) => handleInputChange('contactName', value)}
                error={errors.contactName}
              />
              
              <Input
                label="Téléphone de contact *"
                placeholder="+212600000000"
                value={formData.contactPhone}
                onChangeText={(value) => handleInputChange('contactPhone', value)}
                keyboardType="phone-pad"
                error={errors.contactPhone}
              />
              
              <Input
                label="Instructions de livraison"
                placeholder="Ex: Sonner à l'interphone 302, 3ème étage"
                value={formData.deliveryInstructions}
                onChangeText={(value) => handleInputChange('deliveryInstructions', value)}
                multiline
                numberOfLines={3}
              />
              
              <View className="flex-row items-center mt-2 mb-6">
                <TouchableOpacity
                  onPress={() => handleInputChange('isDefault', !formData.isDefault)}
                  className="flex-row items-center"
                >
                  <View className={`w-6 h-6 rounded border-2 mr-2 items-center justify-center ${
                    formData.isDefault ? 'border-primary bg-primary' : 'border-gray-400'
                  }`}>
                    {formData.isDefault && (
                      <Text className="text-white font-bold">✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
                <Text className="text-gray-700">Définir comme adresse par défaut</Text>
              </View>
              
              <Button
                title={isEditMode ? "Mettre à jour l'adresse" : "Ajouter l'adresse"}
                onPress={handleSubmit}
                loading={isCreating || isUpdating}
                fullWidth
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddEditAddressScreen;