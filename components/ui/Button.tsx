import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
  className?: string;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  rounded = false,
  className = '',
}: ButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white';
      case 'secondary':
        return 'bg-secondary text-white';
      case 'outline':
        return 'bg-transparent border border-primary text-primary';
      case 'danger':
        return 'bg-error text-white';
      case 'success':
        return 'bg-success text-white';
      default:
        return 'bg-primary text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1';
      case 'md':
        return 'px-4 py-2';
      case 'lg':
        return 'px-6 py-3';
      default:
        return 'px-4 py-2';
    }
  };

  const baseStyles = `flex flex-row items-center justify-center ${
    rounded ? 'rounded-full' : 'rounded-md'
  } ${fullWidth ? 'w-full' : ''} ${getSizeStyles()} ${
    disabled || loading ? 'opacity-60' : ''
  }`;

  const textStyles = `font-medium ${variant === 'outline' ? 'text-primary' : 'text-white'} text-center`;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyles} ${getVariantStyles()} ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#FF5733' : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;