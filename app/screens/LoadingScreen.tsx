import { styled } from 'nativewind';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const LoadingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#FF5733" />
      <Text className="mt-4 text-gray-600 text-lg">Chargement...</Text>
    </View>
  );
};

export default styled(LoadingScreen);