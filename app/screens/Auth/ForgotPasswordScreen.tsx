import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { AuthStackParamList } from '../../navigation/types';
import { useForgotPasswordMutation } from '../../store/api/authApi';

type ForgotPasswordNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email non valide');
      return;
    }

    try {
      const response = await forgotPassword({ email }).unwrap();
      setSuccess(response.message || 'Email envoyé avec succès. Vérifiez votre boîte de réception.');
      setError('');
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Impossible d\'envoyer l\'email. Veuillez vérifier votre adresse.');
      setSuccess('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView contentContainerClassName="flex-grow">
        <View className="flex-1 p-6 bg-white justify-center">
          <View className="items-center mb-8">
            <Image
              source={require('../../assets/images/forgot-password.png')}
              className="w-32 h-32"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-gray-800 mt-4">Mot de passe oublié</Text>
            <Text className="text-base text-gray-600 mt-2 text-center">
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe
            </Text>
          </View>
          
          <Input
            label="Email"
            placeholder="Entrez votre adresse email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
              setSuccess('');
            }}
            keyboardType="email-address"
            error={error}
          />
          
          {success ? (
            <View className="bg-green-100 p-3 rounded-md mb-4">
              <Text className="text-green-800">{success}</Text>
            </View>
          ) : null}
          
          <Button
            title="Envoyer le lien de réinitialisation"
            onPress={handleResetPassword}
            loading={isLoading}
            fullWidth
          />
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="mt-6"
          >
            <Text className="text-primary text-center">Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;