module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'], // Ensure Expo preset is included
      plugins: [
        ['module:react-native-dotenv', {
          moduleName: '@env',
          path: '.env',
        }]
      ],
    };
  };
  