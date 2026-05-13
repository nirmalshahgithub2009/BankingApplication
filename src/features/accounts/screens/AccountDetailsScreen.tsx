/**
 * Account Details Screen
 * Detailed view of a specific account
 */

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppStackScreenProps } from '@navigation/types';

type AccountDetailsScreenProps = AppStackScreenProps<'AccountDetails'>;

const AccountDetailsScreen: React.FC<AccountDetailsScreenProps> = ({ route, navigation }) => {
  const { accountId } = route.params;

  const mockAccountData = {
    accountId: accountId,
    accountName: 'Checking Account',
    balance: 25000.0,
    accountNumber: '****5678',
    routingNumber: '121000248',
    accountType: 'Checking',
    openDate: 'Jan 1, 2020',
  };

  const transactions = [
    { id: '1', description: 'ATM Withdrawal', amount: -100, date: 'Today' },
    { id: '2', description: 'Direct Deposit', amount: 3500, date: 'Yesterday' },
    { id: '3', description: 'Transfer to Savings', amount: -500, date: 'Jan 13' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.accountName}>{mockAccountData.accountName}</Text>
          <Text style={styles.balance}>${mockAccountData.balance.toFixed(2)}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Account Number</Text>
              <Text style={styles.detailValue}>{mockAccountData.accountNumber}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Account Type</Text>
              <Text style={styles.detailValue}>{mockAccountData.accountType}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Routing Number</Text>
              <Text style={styles.detailValue}>{mockAccountData.routingNumber}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Opened</Text>
              <Text style={styles.detailValue}>{mockAccountData.openDate}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Transfer Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Download Statement</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionRow}>
              <View>
                <Text style={styles.transDesc}>{transaction.description}</Text>
                <Text style={styles.transDate}>{transaction.date}</Text>
              </View>
              <Text
                style={[
                  styles.transAmount,
                  transaction.amount < 0 ? styles.amountNegative : styles.amountPositive,
                ]}
              >
                {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  transDesc: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  transDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transAmount: {
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

export default AccountDetailsScreen;
