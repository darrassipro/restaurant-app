import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
  inputClassName?: string;
}

const Input = ({
  label,
  placeholder,
  value,
  autoCapitalize,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  className = '',
  inputClassName = '',
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <View className={`mb-4 ${className}`}>
      {label && <Text className="text-gray-700 mb-1 font-medium">{label}</Text>}
      <View className="relative flex-row items-center">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          className={`border rounded-md px-3 py-2 w-full bg-white ${
            disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'
          } ${error ? 'border-error' : 'border-gray-300'} ${inputClassName}`}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute right-2"
          >
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-error text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default Input;
