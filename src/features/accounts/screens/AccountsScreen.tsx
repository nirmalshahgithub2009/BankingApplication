/**
 * Accounts Screen
 * List of user's bank accounts
 */

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTabsScreenProps } from '@navigation/types';

type AccountsScreenProps = AppTabsScreenProps<'Accounts'>;

const AccountsScreen: React.FC<AccountsScreenProps> = ({ navigation }) => {
  const mockAccounts = [
    { id: '1', name: 'Checking', type: 'Primary', balance: 25000.0 },
    { id: '2', name: 'Savings', type: 'Secondary', balance: 50000.0 },
    { id: '3', name: 'Business', type: 'Business', balance: 15500.0 },
  ];

  const handleAccountPress = (accountId: string) => {
    navigation.navigate('AccountDetails', { accountId });
  };

  const renderAccount = ({ item }: { item: (typeof mockAccounts)[0] }) => (
    <TouchableOpacity style={styles.accountCard} onPress={() => handleAccountPress(item.id)}>
      <View style={styles.accountHeader}>
        <Text style={styles.accountName}>{item.name}</Text>
        <Text style={styles.accountType}>{item.type}</Text>
      </View>
      <Text style={styles.accountBalance}>${item.balance.toFixed(2)}</Text>
      <Text style={styles.accountId}>Account ID: {item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>My Accounts</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Account</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={mockAccounts}
          renderItem={renderAccount}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  accountType: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  accountBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  accountId: {
    fontSize: 12,
    color: '#999',
  },
});

export default AccountsScreen;
