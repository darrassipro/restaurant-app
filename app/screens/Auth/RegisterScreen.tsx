// app/screens/Auth/RegisterScreen.tsx
import { RegisterRequest } from '@/types/auth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useRegisterMutation } from '../../../store/api/authApi';
import { setOtpVerification } from '../../../store/slices/authSlice';



export default function RegisterScreen() {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [register, { isLoading }] = useRegisterMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
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
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit avoir au moins 8 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      // Fix: include role field to satisfy RegisterRequest type
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'customer' // Default role is customer
      } as RegisterRequest).unwrap();
      
      if (response.requiresOTP) {
        dispatch(
          setOtpVerification({
            isRequired: true,
            identifier: response.identifier || formData.email,
            type: 'register',
          })
        );
        
        router.push({
          pathname: '/otp-verification',
          params: { 
            identifier: response.identifier || formData.email,
            type: 'register'
          }
        } as never);
      } else {
        Alert.alert('Inscription réussie', 'Votre compte a été créé avec succès.');
        router.push('/login' as never);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.data?.message) {
        Alert.alert('Erreur d\'inscription', error.data.message);
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    if (field in errors) {
      const updatedErrors = { ...errors };
      delete updatedErrors[field];
      setErrors(updatedErrors);
    }
  };

  // Rest of the component remains the same
  return (
    // Component JSX...
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="p-6">
          <View className="items-center mb-6">
            <Image
              source={require('../../../assets/images/logo.png')}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-primary mt-2">Créer un compte</Text>
          </View>
          
          <View className="space-y-4">
            <Input
              label="Prénom"
              placeholder="Entrez votre prénom"
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              error={errors.firstName}
            />
            
            <Input
              label="Nom"
              placeholder="Entrez votre nom"
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              error={errors.lastName}
            />
            
            <Input
              label="Email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            
            <Input
              label="Téléphone"
              placeholder="+212600000000"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              error={errors.phone}
            />
            
            <Input
              label="Mot de passe"
              placeholder="Au moins 8 caractères"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              error={errors.password}
            />
            
            <Input
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre mot de passe"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry
              error={errors.confirmPassword}
            />
          </View>
          
          <Button
            title="S'inscrire"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            className="mt-6"
          />
          
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Vous avez déjà un compte ?</Text>
            <TouchableOpacity
              onPress={() => router.push('/login' as never)}
              className="ml-1"
            >
              <Text className="text-primary font-semibold">Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}