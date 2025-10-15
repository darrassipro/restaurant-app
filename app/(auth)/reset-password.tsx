// app/(auth)/reset-password.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useResetPasswordMutation } from '../../store/api/authApi';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const token = (params.token as string) || '';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Le mot de passe doit avoir au moins 8 caractères';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!token) {
      Alert.alert('Erreur', 'Token de réinitialisation manquant');
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword,
      }).unwrap();

      Alert.alert(
        'Succès',
        'Votre mot de passe a été réinitialisé avec succès',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Reset password error:', error);
      Alert.alert(
        'Erreur',
        error.data?.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe'
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'newPassword') {
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white p-6 justify-center">
          <View className="items-center mb-8">
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-gray-800 mt-4">
              Nouveau mot de passe
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Entrez votre nouveau mot de passe
            </Text>
          </View>

          <Input
            label="Nouveau mot de passe"
            placeholder="Au moins 8 caractères"
            value={newPassword}
            onChangeText={(value) => handleInputChange('newPassword', value)}
            secureTextEntry
            error={errors.newPassword}
          />

          <Input
            label="Confirmer le mot de passe"
            placeholder="Confirmez votre nouveau mot de passe"
            value={confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <Button
            title="Réinitialiser le mot de passe"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            className="mt-6"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}