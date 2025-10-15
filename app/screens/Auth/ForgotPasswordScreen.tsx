// app/screens/Auth/ForgotPasswordScreen.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useForgotPasswordMutation } from '../../../store/api/authApi';
import { setOtpVerification } from '../../../store/slices/authSlice';

export default function ForgotPasswordScreen() {
  const dispatch = useDispatch();
  
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState<string | null>(null);
  
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const validateForm = (): boolean => {
    if (!identifier.trim()) {
      setError(identifierType === 'email' ? 'Email requis' : 'Numéro de téléphone requis');
      return false;
    }
    
    if (identifierType === 'email' && !/\S+@\S+\.\S+/.test(identifier)) {
      setError('Format d\'email invalide');
      return false;
    }
    
    if (identifierType === 'phone' && !/^\+?\d{10,15}$/.test(identifier.replace(/\s/g, ''))) {
      setError('Format de téléphone invalide');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const response = await forgotPassword({
        email: identifierType === 'email' ? identifier : undefined,
      }).unwrap();
      
      dispatch(
        setOtpVerification({
          isRequired: true,
          identifier,
          type: 'password_reset',
        })
      );
      
      router.push({
        pathname: '/otp-verification',
        params: { 
          identifier, 
          type: 'reset-password' 
        }
      } as never);
      
    } catch (error: any) {
      console.error('Forgot password error:', error);
      Alert.alert('Erreur', error.data?.message || 'Cet utilisateur n\'existe pas');
    }
  };

  const toggleIdentifierType = () => {
    setIdentifierType(identifierType === 'email' ? 'phone' : 'email');
    setIdentifier('');
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1 bg-white p-6 justify-center">
        <View className="items-center mb-8">
          <Image
            source={require('../../../assets/images/forgot-password.png')}
            style={{ width: 180, height: 180 }}
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-gray-800 mt-4">Mot de passe oublié</Text>
          <Text className="text-gray-600 text-center mt-2">
            Entrez votre {identifierType === 'email' ? 'email' : 'téléphone'} pour recevoir un code de réinitialisation
          </Text>
        </View>
        
        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={() => setIdentifierType('email')}
            className={`flex-1 py-3 ${
              identifierType === 'email' ? 'border-b-2 border-primary' : 'border-b-2 border-gray-300'
            }`}
          >
            <Text
              className={`text-center ${
                identifierType === 'email' ? 'text-primary font-bold' : 'text-gray-500'
              }`}
            >
              Email
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setIdentifierType('phone')}
            className={`flex-1 py-3 ${
              identifierType === 'phone' ? 'border-b-2 border-primary' : 'border-b-2 border-gray-300'
            }`}
          >
            <Text
              className={`text-center ${
                identifierType === 'phone' ? 'text-primary font-bold' : 'text-gray-500'
              }`}
            >
              Téléphone
            </Text>
          </TouchableOpacity>
        </View>
        
        <Input
          label={identifierType === 'email' ? 'Email' : 'Numéro de téléphone'}
          placeholder={identifierType === 'email' ? 'exemple@email.com' : '+212600000000'}
          value={identifier}
          onChangeText={setIdentifier}
          keyboardType={identifierType === 'email' ? 'email-address' : 'phone-pad'}
          autoCapitalize={identifierType === 'email' ? 'none' : 'sentences'}
            error={error ?? undefined}

        />
        
        <Button
          title="Envoyer le code"
          onPress={handleSubmit}
          loading={isLoading}
          fullWidth
          className="mt-6"
        />
        
        <TouchableOpacity
          onPress={() => router.push('/login' as never)}
          className="mt-6 self-center"
        >
          <Text className="text-gray-600">Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}