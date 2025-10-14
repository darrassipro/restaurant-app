// app/screens/Customer/EditProfileScreen.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useChangePasswordMutation, useUpdateProfileMutation } from '../../../store/api/authApi';
import { selectUser } from '../../../store/slices/authSlice';

export default function EditProfileScreen() {
  const user = useSelector(selectUser);
  
  const [isPasswordSection, setIsPasswordSection] = useState(false);
  
  // Profile data
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  
  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const validateProfileForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Le mot de passe actuel est requis';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Le mot de passe doit avoir au moins 8 caractères';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfileForm()) return;
    
    try {
      await updateProfile(formData).unwrap();
      Alert.alert('Succès', 'Profil mis à jour avec succès');
      router.back();
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du profil');
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    
    try {
      await changePassword(passwordData).unwrap();
      Alert.alert('Succès', 'Mot de passe modifié avec succès');
      router.back();
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert('Erreur', 'Mot de passe actuel incorrect ou autre erreur');
    }
  };

  const handleInputChange = (section: 'profile' | 'password', field: string, value: string) => {
    if (section === 'profile') {
      setFormData({
        ...formData,
        [field]: value,
      });
    } else {
      setPasswordData({
        ...passwordData,
        [field]: value,
      });
    }
    
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
          {/* Tab Selector */}
          <View className="flex-row mb-6">
            <TouchableOpacity
              onPress={() => setIsPasswordSection(false)}
              className={`flex-1 py-3 ${
                !isPasswordSection ? 'border-b-2 border-primary' : 'border-b-2 border-gray-300'
              }`}
            >
              <Text
                className={`text-center ${
                  !isPasswordSection ? 'text-primary font-bold' : 'text-gray-500'
                }`}
              >
                Informations personnelles
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setIsPasswordSection(true)}
              className={`flex-1 py-3 ${
                isPasswordSection ? 'border-b-2 border-primary' : 'border-b-2 border-gray-300'
              }`}
            >
              <Text
                className={`text-center ${
                  isPasswordSection ? 'text-primary font-bold' : 'text-gray-500'
                }`}
              >
                Changer le mot de passe
              </Text>
            </TouchableOpacity>
          </View>
          
          {!isPasswordSection ? (
            /* Profile Section */
            <>
              <Input
                label="Prénom"
                placeholder="Entrez votre prénom"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('profile', 'firstName', value)}
                error={errors.firstName}
              />
              
              <Input
                label="Nom"
                placeholder="Entrez votre nom"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('profile', 'lastName', value)}
                error={errors.lastName}
              />
              
              <Input
                label="Email"
                value={user?.email || ''}
                disabled={true}
              />
              
              <Input
                label="Téléphone"
                placeholder="+212600000000"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('profile', 'phone', value)}
                keyboardType="phone-pad"
                error={errors.phone}
              />
              
              <Button
                title="Mettre à jour le profil"
                onPress={handleUpdateProfile}
                loading={isUpdatingProfile}
                fullWidth
                className="mt-4"
              />
            </>
          ) : (
            /* Password Section */
            <>
              <Input
                label="Mot de passe actuel"
                placeholder="Entrez votre mot de passe actuel"
                value={passwordData.currentPassword}
                onChangeText={(value) => handleInputChange('password', 'currentPassword', value)}
                secureTextEntry
                error={errors.currentPassword}
              />
              
              <Input
                label="Nouveau mot de passe"
                placeholder="Au moins 8 caractères"
                value={passwordData.newPassword}
                onChangeText={(value) => handleInputChange('password', 'newPassword', value)}
                secureTextEntry
                error={errors.newPassword}
              />
              
              <Input
                label="Confirmer le nouveau mot de passe"
                placeholder="Confirmez votre nouveau mot de passe"
                value={passwordData.confirmPassword}
                onChangeText={(value) => handleInputChange('password', 'confirmPassword', value)}
                secureTextEntry
                error={errors.confirmPassword}
              />
              
              <Button
                title="Changer le mot de passe"
                onPress={handleChangePassword}
                loading={isChangingPassword}
                fullWidth
                className="mt-4"
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}