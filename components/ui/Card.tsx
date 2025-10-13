import { styled } from 'nativewind';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const Card = ({
  title,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...rest
}: CardProps) => {
  return (
    <View
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      {...rest}
    >
      {title && (
        <View className={`p-4 border-b border-gray-200 ${headerClassName}`}>
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
        </View>
      )}
      <View className={`p-4 ${bodyClassName}`}>{children}</View>
      {footer && (
        <View className={`p-4 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </View>
      )}
    </View>
  );
};

export default styled(Card);