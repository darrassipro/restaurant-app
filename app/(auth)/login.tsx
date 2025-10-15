// app/(auth)/login.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useLoginMutation } from '../../store/api/authApi';
import { setOtpVerification, setUser } from '../../store/slices/authSlice';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({}); 
  const [login, { isLoading }] = useLoginMutation();

  const validateForm = () => {
    const newErrors: { identifier?: string; password?: string } = {};
    
    if (!identifier) {
      newErrors.identifier = identifierType === 'email' 
        ? 'Veuillez entrer votre email' 
        : 'Veuillez entrer votre numéro de téléphone';
    }
    
    if (!password) {
      newErrors.password = 'Veuillez entrer votre mot de passe';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const loginData = identifierType === 'email'
        ? { email: identifier, password }
        : { phone: identifier, password };

      const response = await login(loginData).unwrap();

      if (response.requiresOTP) {
        dispatch(
          setOtpVerification({
            isRequired: true,
            identifier: response.identifier || identifier,
            type: 'login',
          })
        );
        router.push('/(auth)/otp-verification');
      } else if (response.user) {
        // Login successful
        dispatch(setUser(response.user));
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        identifier: 'Email/téléphone ou mot de passe incorrect',
      });
    }
  };

  const handleRegisterPress = () => {
    router.push('/(auth)/register');
  };

  const handleForgotPasswordPress = () => {
    router.push('/(auth)/forgot-password');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 bg-white justify-center">
          <View className="items-center mb-8">
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 128, height: 128 }}
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-primary mt-4">Le Gourmet</Text>
            <Text className="text-base text-gray-600 mt-1">Authentification</Text>
          </View>

          <View className="mb-6">
            <View className="flex-row mb-2">
              <TouchableOpacity
                onPress={() => setIdentifierType('email')}
                className={`flex-1 py-3 ${
                  identifierType === 'email'
                    ? 'border-b-2 border-primary'
                    : 'border-b-2 border-gray-300'
                }`}
              >
                <Text
                  className={`text-center ${
                    identifierType === 'email'
                      ? 'text-primary font-bold'
                      : 'text-gray-500'
                  }`}
                >
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIdentifierType('phone')}
                className={`flex-1 py-3 ${
                  identifierType === 'phone'
                    ? 'border-b-2 border-primary'
                    : 'border-b-2 border-gray-300'
                }`}
              >
                <Text
                  className={`text-center ${
                    identifierType === 'phone'
                      ? 'text-primary font-bold'
                      : 'text-gray-500'
                  }`}
                >
                  Téléphone
                </Text>
              </TouchableOpacity>
            </View>

            <Input
              label={identifierType === 'email' ? 'Email' : 'Numéro de téléphone'}
              placeholder={
                identifierType === 'email' ? 'exemple@email.com' : '+212600000000'
              }
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType={identifierType === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
              error={errors.identifier}
            />

            <Input
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />
          </View>

          <Button
            title="Se connecter"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
          />

          <TouchableOpacity
            onPress={handleForgotPasswordPress}
            className="mt-4"
          >
            <Text className="text-primary text-center">Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Pas encore de compte ?</Text>
            <TouchableOpacity
              onPress={handleRegisterPress}
              className="ml-1"
            >
              <Text className="text-primary font-semibold">S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}