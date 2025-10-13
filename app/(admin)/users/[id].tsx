// app/(admin)/users/[id].tsx
import { Picker } from '@react-native-picker/picker';
import { User } from '../../../types/auth';

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, View } from 'react-native';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import {
    useCreateUserMutation,
    useGetUserByIdQuery,
    useUpdateUserMutation
} from '../../../store/api/userApi';

export default function UserFormScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = id !== 'new';
  const userId = isEditing && typeof id === 'string' ? parseInt(id) : 0;
  
const [formData, setFormData] = useState<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: User['role'];   
  password: string;
  confirmPassword: string;
  isActive: boolean;
}>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'customer',
  password: '',
  confirmPassword: '',
  isActive: true,
});
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(userId, {
    skip: !isEditing,
  });
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  
  useEffect(() => {
    if (isEditing && userData?.data?.user) {
      const user = userData.data.user;
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'customer',
        password: '',
        confirmPassword: '',
        isActive: user.isActive || true
      });
    }
  }, [userData, isEditing]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Téléphone requis';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide';
    }
    
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Mot de passe requis';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Le mot de passe doit avoir au moins 8 caractères';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      if (isEditing) {
        const { password, confirmPassword, ...updateData } = formData;
        await updateUser({ 
          id: userId, 
          updates: updateData 
        }).unwrap();
        Alert.alert('Succès', 'Utilisateur mis à jour avec succès');
      } else {
        await createUser(formData).unwrap();
        Alert.alert('Succès', 'Utilisateur créé avec succès');
      }
      router.back();
    } catch (error) {
      console.error('User save error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  if (isEditing && isLoadingUser) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            {isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </Text>
          
          <Input
            label="Prénom *"
            placeholder="Entrez le prénom"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
            error={errors.firstName}
          />
          
          <Input
            label="Nom *"
            placeholder="Entrez le nom"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
            error={errors.lastName}
          />
          
          <Input
            label="Email *"
            placeholder="exemple@email.com"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            error={errors.email}
            disabled={isEditing} // Email can't be changed after creation
          />
          
          <Input
            label="Téléphone *"
            placeholder="+212600000000"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
            error={errors.phone}
          />
          
          <View className="mb-4">
            <Text className="text-gray-700 mb-1 font-medium">Rôle *</Text>
            <View className="border border-gray-300 rounded-md p-2">
              <Picker
                selectedValue={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <Picker.Item label="Client" value="customer" />
                <Picker.Item label="Chef" value="chef" />
                <Picker.Item label="Manager" value="manager" />
                <Picker.Item label="Administrateur" value="admin" />
              </Picker>
            </View>
          </View>
          
          {!isEditing && (
            <>
              <Input
                label="Mot de passe *"
                placeholder="Au moins 8 caractères"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                error={errors.password}
              />
              
              <Input
                label="Confirmer le mot de passe *"
                placeholder="Confirmez le mot de passe"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
                error={errors.confirmPassword}
              />
            </>
          )}
          
          {isEditing && (
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-700 font-medium">Utilisateur actif</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#FF5733" }}
                thumbColor="#f4f3f4"
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleInputChange('isActive', value)}
                value={formData.isActive}
              />
            </View>
          )}
          
          <Button
            title={isEditing ? "Mettre à jour" : "Créer l'utilisateur"}
            onPress={handleSubmit}
            loading={isCreating || isUpdating}
            fullWidth
            className="mt-4"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}