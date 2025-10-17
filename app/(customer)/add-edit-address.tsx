import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useCreateAddressMutation, useGetAddressByIdQuery, useUpdateAddressMutation } from '../../store/api/addressApi';
import { Address } from '../../types/address';

export default function AddEditAddressScreen() {
  const params = useLocalSearchParams();
  const addressId = params.addressId ? parseInt(params.addressId as string) : undefined;
  const isEditMode = !!addressId;

  const [formData, setFormData] = useState<Partial<Address>>({
    city: '',
    sector: '',
    addressName: '',
    latitude: '',    // keep as string to satisfy TS
    longitude: '',   // keep as string to satisfy TS
    isDefault: false,
    deliveryInstructions: '',
    contactName: '',
    contactPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: addressData, isLoading: isLoadingAddress } = useGetAddressByIdQuery(addressId || 0, {
    skip: !isEditMode,
  });

  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  useEffect(() => {
    if (isEditMode && addressData) {
      setFormData({
        city: addressData.city || '',
        sector: addressData.sector || '',
        addressName: addressData.addressName || '',
        latitude: addressData.latitude !== undefined && addressData.latitude !== null ? String(addressData.latitude) : '', // as string
        longitude: addressData.longitude !== undefined && addressData.longitude !== null ? String(addressData.longitude) : '', // as string
        isDefault: addressData.isDefault || false,
        deliveryInstructions: addressData.deliveryInstructions || '',
        contactName: addressData.contactName || '',
        contactPhone: addressData.contactPhone || '',
      });
    }
  }, [addressData, isEditMode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.city?.trim()) newErrors.city = 'La ville est requise';
    if (!formData.sector?.trim()) newErrors.sector = 'Le secteur est requis';
    if (!formData.addressName?.trim()) newErrors.addressName = "L'adresse est requise";
    if (!formData.contactName?.trim()) newErrors.contactName = 'Le nom de contact est requis';
    if (!formData.contactPhone?.trim()) {
      newErrors.contactPhone = 'Le téléphone de contact est requis';
    } else if (!/^\+?\d{10,15}$/.test((formData.contactPhone || '').replace(/\s/g, ''))) {
      newErrors.contactPhone = 'Format de téléphone invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Clean and convert lat/long: send numbers (parseFloat) or undefined (so backend can handle null)
      const cleanedData: any = {
        city: formData.city,
        sector: formData.sector,
        addressName: formData.addressName,
        isDefault: !!formData.isDefault,
        deliveryInstructions: formData.deliveryInstructions,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
      };

      if (typeof formData.latitude === 'string' && formData.latitude.trim() !== '') {
        const lat = parseFloat(formData.latitude);
        if (!isNaN(lat)) cleanedData.latitude = lat;
      }
      if (typeof formData.longitude === 'string' && formData.longitude.trim() !== '') {
        const lng = parseFloat(formData.longitude);
        if (!isNaN(lng)) cleanedData.longitude = lng;
      }

      // If no lat/lng provided, they remain undefined (DB allows null)
      if (isEditMode && addressId) {
        await updateAddress({ id: addressId, address: cleanedData }).unwrap();
        Alert.alert('Succès', 'Adresse mise à jour avec succès');
      } else {
        await createAddress(cleanedData).unwrap();
        Alert.alert('Succès', 'Adresse ajoutée avec succès');
      }
      router.back();
    } catch (err: any) {
      console.error('Address submit error:', err);
      // RTK Query returns error.data when server responded with JSON; show it if present
      const serverMsg = err?.data?.message || err?.data || err?.error || 'Une erreur est survenue';
      // If validation details exist, show them too
      const details = err?.data?.details ? JSON.stringify(err.data.details) : null;
      Alert.alert('Erreur', details ? `${serverMsg}\n${details}` : String(serverMsg));
    }
  };

  const handleInputChange = (field: keyof Address, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
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
            label="Latitude"
            placeholder="33.5423"
            value={formData.latitude as string}
            onChangeText={(value) => handleInputChange('latitude', value)}
            keyboardType="numeric"
          />
          <Input
            label="Longitude"
            placeholder="-7.5898"
            value={formData.longitude as string}
            onChangeText={(value) => handleInputChange('longitude', value)}
            keyboardType="numeric"
          />
          <Input
            label="Instructions de livraison"
            placeholder="Ex: Sonner à l'interphone 302"
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
              <View
                className={`w-6 h-6 rounded border-2 mr-2 items-center justify-center ${
                  formData.isDefault ? 'border-primary bg-primary' : 'border-gray-400'
                }`}
              >
                {formData.isDefault && <Text className="text-white font-bold">✓</Text>}
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}