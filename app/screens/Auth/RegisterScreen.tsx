import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { AuthStackParamList } from '../../navigation/types';
import { useRegisterMutation } from '../../store/api/authApi';
import { setOtpVerification, setUser } from '../../store/slices/authSlice';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useDispatch();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [register, { isLoading }] = useRegisterMutation();

  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Nom requis';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email non valide';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Téléphone requis';
    } else if (!/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Téléphone non valide';
    }
    
    if (!password) {
      newErrors.password = 'Mot de passe requis';
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit avoir au moins 8 caractères';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      const userData = {
        firstName,
        lastName,
        email,
        phone,
        password,
        role: 'customer' as const,
      };
      
      const response = await register(userData).unwrap();
      
      if (response.requiresOTP) {
        // Store user data for completing registration after OTP verification
        dispatch(
          setOtpVerification({
            isRequired: true,
            identifier: response.identifier || email,
            userData,
            type: 'registration',
          })
        );
        
        navigation.navigate('OtpVerification', {
          identifier: response.identifier || email,
          userData,
          type: 'registration',
        });
      } else {
        // Registration successful without OTP
        dispatch(setUser(response.user));
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        email: 'Cet email est déjà utilisé',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="p-6">
          <View className="items-center mb-6">
            <Image
              source={require('../../assets/images/logo.png')}
              className="w-24 h-24"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-primary mt-2">Créer un compte</Text>
          </View>
          
          <View className="mb-4">
            <Input
              label="Prénom"
              placeholder="Entrez votre prénom"
              value={firstName}
              onChangeText={setFirstName}
              error={errors.firstName}
            />
            
            <Input
              label="Nom"
              placeholder="Entrez votre nom"
              value={lastName}
              onChangeText={setLastName}
              error={errors.lastName}
            />
            
            <Input
              label="Email"
              placeholder="exemple@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
            />
            
            <Input
              label="Téléphone"
              placeholder="+212600000000"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={errors.phone}
            />
            
            <Input
              label="Mot de passe"
              placeholder="Au moins 8 caractères"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />
            
            <Input
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={errors.confirmPassword}
            />
          </View>
          
          <Button
            title="S'inscrire"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
          />
          
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Déjà inscrit ?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              className="ml-1"
            >
              <Text className="text-primary font-semibold">Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;