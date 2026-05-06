/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  console.log('Safe area insets:', safeAreaInsets);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Banking app to start</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    backgroundColor: 'yellow',
    width: 100,
    margin: 100,
    color: 'black', // Explicitly set text color
    fontSize: 16, // Set readable font size
    padding: 10, // Add padding for better visibility
  },
});

export default App;
