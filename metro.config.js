// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// For Tailwind 3.3 compatibility
module.exports = withNativeWind(config, {
  input: './global.css',
  configPath: './tailwind.config.js', 
});