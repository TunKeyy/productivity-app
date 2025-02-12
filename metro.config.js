// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

// Suppress deprecation warnings
process.noDeprecation = true;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add resolver for environment variables
config.resolver = {
  ...config.resolver,
  sourceExts: [
    ...config.resolver.sourceExts,
    'cjs',
    'mjs',
    'env'
  ],
};

// Configure module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config; 