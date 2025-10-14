// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // For Tailwind 3.3 with NativeWind 4.2.1
      ['nativewind/babel', { tailwindConfig: './tailwind.config.js' }],
      'expo-router/babel',
      'react-native-reanimated/plugin',
    ]
  };
};