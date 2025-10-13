import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { AuthStackParamList } from '../../navigation/types';
import {
    useCompleteRegistrationMutation,
    useResendOtpMutation,
    useVerifyLoginOtpMutation
} from '../../store/api/authApi';
import { setUser } from '../../store/slices/authSlice';

type OtpVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OtpVerification'>;
type OtpVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;

const OtpVerificationScreen = () => {
  const navigation = useNavigation<OtpVerificationScreenNavigationProp>();
  const route = useRoute<OtpVerificationScreenRouteProp>();
  const dispatch = useDispatch();
  
  const { identifier, userData, type } = route.params;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [completeRegistration, { isLoading: isLoadingRegistration }] = useCompleteRegistrationMutation();
  const [verifyLoginOtp, { isLoading: isLoadingLogin }] = useVerifyLoginOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    // Countdown for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError('Veuillez entrer le code à 6 chiffres');
      return;
    }

    try {
      let response;
      
      if (type === 'registration') {
        response = await completeRegistration({
          identifier,
          otp,
          userData,
        }).unwrap();
      } else if (type === 'login') {
        response = await verifyLoginOtp({
          identifier,
          otp,
          password: userData?.password || '',
        }).unwrap();
      }
      
      // Success - store user data
      if (response?.user) {
        dispatch(setUser(response.user));
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Code incorrect. Veuillez réessayer.');
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({
        identifier,
        type,
      }).unwrap();
      
      setCountdown(60);
      setCanResend(false);
      setError('');
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Impossible de renvoyer le code. Veuillez réessayer.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1 p-6 bg-white justify-center">
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-800">Vérification</Text>
          <Text className="text-gray-600 text-center mt-2">
            {`Nous avons envoyé un code à ${identifier}`}
          </Text>
        </View>
        
        <Input
          label="Code de vérification"
          placeholder="Entrez le code à 6 chiffres"
          value={otp}
          onChangeText={(text) => {
            setOtp(text);
            setError('');
          }}
          keyboardType="number-pad"
          error={error}
        />
        
        <Button
          title="Vérifier"
          onPress={handleVerifyOtp}
          loading={isLoadingRegistration || isLoadingLogin}
          fullWidth
        />
        
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Vous n'avez pas reçu le code ?</Text>
          {canResend ? (
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={isResending}
            >
              <Text className="text-primary font-semibold ml-1">Renvoyer</Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-gray-400 ml-1">{`Réessayer dans ${countdown}s`}</Text>
          )}
        </View>
        
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4"
        >
          <Text className="text-primary text-center">Retour</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpVerificationScreen;