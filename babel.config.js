module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@app': './src/app',
          '@core': './src/core',
          '@domain': './src/domain',
          '@features': './src/features',
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@store': './src/store',
          '@types': './src/types',
        },
      },
    ],
  ],
};
