// app/screens/Auth/OtpVerificationScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button';
import {
    useResendOtpMutation, // Assuming this exists
    useResetPasswordOtpMutation,
    useVerifyLoginOtpMutation, // Fixed mutation name
    useVerifyRegistrationOtpMutation
} from '../../../store/api/authApi';
import { setOtpVerification, setUser } from '../../../store/slices/authSlice'; // Fixed import

export default function OtpVerificationScreen() {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  
  // Extract parameters with types
  const identifier = params.identifier as string;
  const verificationType = (params.type as string) || 'login';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // Fix TextInput refs typing
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);
  const [resendTimeout, setResendTimeout] = useState(60);
  
  // Use the correct mutation hooks based on verification type
  const [verifyLoginOtp] = useVerifyLoginOtpMutation();
  const [verifyRegistrationOtp] = useVerifyRegistrationOtpMutation(); // Assuming this exists
  const [resetPasswordOtp] = useResetPasswordOtpMutation(); // Assuming this exists
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Determine which verify function to use based on type
  const getVerifyFunction = () => {
    switch (verificationType) {
      case 'login':
        return verifyLoginOtp;
      case 'register':
        return verifyRegistrationOtp;
      case 'reset-password':
        return resetPasswordOtp;
      default:
        return verifyLoginOtp;
    }
  };

  const isVerifying = false; // Replace with actual loading state based on selected mutation

  // Handle OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (resendTimeout > 0) {
      interval = setInterval(() => {
        setResendTimeout(prevTimeout => prevTimeout - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimeout]);

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Code invalide', 'Veuillez entrer un code OTP à 6 chiffres');
      return;
    }
    
    try {
      const verifyFunction = getVerifyFunction();
      
      // For login OTP, use the email property
      const payload = verificationType === 'login' 
        ? { email: identifier, otp: otpString }
        : { identifier, otp: otpString, type: verificationType };
      
      const response = await verifyFunction(payload).unwrap();
      
      if (response.user) {
        dispatch(setUser(response.user));
        // Clear OTP verification state by setting isRequired to false
        dispatch(
          setOtpVerification({
            isRequired: false,
            identifier: '',
            type: undefined,
          })
        );
        
        if (verificationType === 'register') {
          Alert.alert('Succès', 'Votre compte a été activé avec succès');
        }
      } else if (verificationType === 'reset-password') {
        router.push({
          pathname: '/reset-password',
          params: { token: response.resetToken }
        } as never);
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert('Erreur', error.data?.message || 'Code OTP incorrect ou expiré');
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({
        identifier,
        type: verificationType,
      }).unwrap();
      
      setResendTimeout(60);
      Alert.alert('Succès', 'Un nouveau code OTP a été envoyé');
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer un nouveau code OTP');
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    if (isNaN(Number(text))) return;
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Auto focus to next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace when current is empty
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <View className="items-center mb-8">
        <Image
          source={require('../../../assets/images/otp-verification.png')}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mt-4">Vérification du code</Text>
        <Text className="text-gray-600 text-center mt-2">
          Nous avons envoyé un code OTP à{'\n'}{identifier}
        </Text>
      </View>
      
      <View className="flex-row justify-between mb-6">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            // Fix ref typing issue
            ref={(el) => { inputRefs.current[index] = el }}
            className="bg-gray-100 rounded-lg text-center text-xl font-bold h-14 w-14"
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
      
      <Button
        title="Vérifier"
        onPress={handleVerify}
        loading={isVerifying}
        disabled={otp.join('').length !== 6 || isVerifying}
        fullWidth
      />
      
      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600">Vous n'avez pas reçu de code ? </Text>
        {resendTimeout > 0 ? (
          <Text className="text-gray-500">Réessayer dans {resendTimeout}s</Text>
        ) : (
          <TouchableOpacity
            onPress={handleResend}
            disabled={isResending}
          >
            <Text className="text-primary font-semibold">Renvoyer le code</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity
        onPress={() => router.back()}
        className="mt-6 self-center"
      >
        <Text className="text-gray-600">Retour</Text>
      </TouchableOpacity>
    </View>
  );
}