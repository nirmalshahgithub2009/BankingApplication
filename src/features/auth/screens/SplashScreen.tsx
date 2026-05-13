/**
 * Splash Screen
 * Loading indicator shown during app initialization
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Banking App</Text>
      <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  spinner: {
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
  },
});

export default SplashScreen;
