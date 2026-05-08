/**
 * Home Screen
 * Main dashboard showing account overview and recent transactions
 */

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTabsScreenProps } from '@navigation/types';

type HomeScreenProps = AppTabsScreenProps<'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const mockBalance = 45250.0;
  const mockTransactions = [
    { id: '1', description: 'Starbucks', amount: -5.5, date: 'Today' },
    { id: '2', description: 'Salary Deposit', amount: 3500.0, date: 'Yesterday' },
    { id: '3', description: 'Netflix Subscription', amount: -15.99, date: '2 days ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.name}>John Doe</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>${mockBalance.toFixed(2)}</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Request</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TransactionDetails', { transactionId: '1' })}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {mockTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() =>
                navigation.navigate('TransactionDetails', { transactionId: transaction.id })
              }
            >
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDesc}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.amount < 0 ? styles.amountNegative : styles.amountPositive,
                ]}
              >
                {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  seeAll: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountNegative: {
    color: '#FF3B30',
  },
  amountPositive: {
    color: '#34C759',
  },
});

export default HomeScreen;
