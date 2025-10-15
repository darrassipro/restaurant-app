// app/(auth)/otp-verification.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/ui/Button';
import {
    useResendOtpMutation,
    useResetPasswordOtpMutation,
    useVerifyLoginOtpMutation,
    useVerifyRegistrationOtpMutation,
} from '../../store/api/authApi';
import { setOtpVerification } from '../../store/slices/authSlice';

export default function OtpVerificationScreen() {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();

  const identifier = params.identifier as string;
  const verificationType = (params.type as string) || 'login';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);
  const [resendTimeout, setResendTimeout] = useState(60);

  const [verifyLoginOtp, { isLoading: isVerifyingLogin }] = useVerifyLoginOtpMutation();
  const [verifyRegistrationOtp, { isLoading: isVerifyingRegistration }] =
    useVerifyRegistrationOtpMutation();
  const [resetPasswordOtp, { isLoading: isVerifyingReset }] =
    useResetPasswordOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const isVerifying = isVerifyingLogin || isVerifyingRegistration || isVerifyingReset;

  useEffect(() => {
    let interval: number | null = null;
    if (resendTimeout > 0) {
      interval = setInterval(() => {
        setResendTimeout((prevTimeout) => prevTimeout - 1);
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
      let response;

      switch (verificationType) {
        case 'login':
          response = await verifyLoginOtp({
            identifier,
            password: '', // Password was already verified
            otp: otpString,
          }).unwrap();
          break;
        case 'register':
          response = await verifyRegistrationOtp({
            identifier,
            otp: otpString,
          }).unwrap();
          break;
        case 'reset-password':
          response = await resetPasswordOtp({
            identifier,
            otp: otpString,
          }).unwrap();
          break;
      }

      // Clear OTP verification state
      dispatch(
        setOtpVerification({
          isRequired: false,
          identifier: '',
          type: undefined,
        })
      );

      if (verificationType === 'register') {
        Alert.alert('Succès', 'Votre compte a été activé avec succès');
        router.replace('/(auth)/login');
      } else if (verificationType === 'reset-password') {
        router.push('/(auth)/reset-password');
      } else {
        // Login successful - user will be redirected automatically
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
      Alert.alert('Erreur', "Impossible d'envoyer un nouveau code OTP");
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
          source={require('../../assets/images/logo.png')}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mt-4">
          Vérification du code
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Nous avons envoyé un code OTP à {'\n'}
          {identifier}
        </Text>
      </View>

      <View className="flex-row justify-between mb-6">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
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
          <TouchableOpacity onPress={handleResend} disabled={isResending}>
            <Text className="text-primary font-semibold">Renvoyer le code</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={() => router.back()} className="mt-6 self-center">
        <Text className="text-gray-600">Retour</Text>
      </TouchableOpacity>
    </View>
  );
}