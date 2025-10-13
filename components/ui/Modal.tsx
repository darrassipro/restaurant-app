import { Feather } from '@expo/vector-icons';
import { styled } from 'nativewind';
import React, { useEffect } from 'react';
import { Animated, Modal as RNModal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  className?: string;
  contentClassName?: string;
  height?: 'auto' | 'full';
}

const Modal = ({
  isVisible,
  onClose,
  title,
  children,
  footerContent,
  animationType = 'fade',
  className = '',
  contentClassName = '',
  height = 'auto',
}: ModalProps) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, fadeAnim]);

  return (
    <RNModal
      visible={isVisible}
      transparent={true}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <Animated.View
              className={`bg-white rounded-2xl shadow-xl w-11/12 ${
                height === 'full' ? 'max-h-[90%]' : 'max-h-[80%]'
              } ${className}`}
              style={{ opacity: fadeAnim }}
            >
              {title && (
                <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                  <Text className="text-xl font-bold text-gray-800">{title}</Text>
                  <TouchableOpacity onPress={onClose}>
                    <Feather name="x" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
              <View className={`p-4 ${contentClassName}`}>{children}</View>
              {footerContent && (
                <View className="p-4 border-t border-gray-200">{footerContent}</View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export default styled(Modal);