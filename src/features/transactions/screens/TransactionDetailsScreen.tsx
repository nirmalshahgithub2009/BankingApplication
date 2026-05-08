/**
 * Transaction Details Screen
 * Detailed view of a specific transaction
 */

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppStackScreenProps } from '@navigation/types';

type TransactionDetailsScreenProps = AppStackScreenProps<'TransactionDetails'>;

const TransactionDetailsScreen: React.FC<TransactionDetailsScreenProps> = ({ route }) => {
  const { transactionId } = route.params;

  const mockTransaction = {
    id: transactionId,
    merchant: 'Starbucks Coffee',
    category: 'Dining & Restaurants',
    amount: -5.5,
    date: 'January 15, 2024',
    time: '2:30 PM',
    status: 'Completed',
    reference: 'TXN-' + transactionId,
    location: '123 Main St, San Francisco, CA',
    cardUsed: '••••5678',
    description: 'Coffee Purchase',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Transaction Header */}
        <View style={styles.headerCard}>
          <View style={styles.merchantInfo}>
            <View style={styles.merchantIcon}>
              <Text style={styles.merchantEmoji}>☕</Text>
            </View>
            <View style={styles.merchantDetails}>
              <Text style={styles.merchantName}>{mockTransaction.merchant}</Text>
              <Text style={styles.category}>{mockTransaction.category}</Text>
            </View>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.amountCard}>
          <Text
            style={[
              styles.amount,
              mockTransaction.amount < 0 ? styles.amountNegative : styles.amountPositive,
            ]}
          >
            {mockTransaction.amount < 0 ? '-' : '+'}${Math.abs(mockTransaction.amount).toFixed(2)}
          </Text>
          <Text style={styles.status}>{mockTransaction.status}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {mockTransaction.date} at {mockTransaction.time}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{mockTransaction.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reference Number</Text>
            <Text style={styles.detailValue}>{mockTransaction.reference}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Card Used</Text>
            <Text style={styles.detailValue}>{mockTransaction.cardUsed}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{mockTransaction.description}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Download Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
              Report Issue
            </Text>
          </TouchableOpacity>
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
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  merchantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  merchantIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  merchantEmoji: {
    fontSize: 30,
  },
  merchantDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amountNegative: {
    color: '#FF3B30',
  },
  amountPositive: {
    color: '#34C759',
  },
  status: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  detailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  detailRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: '#007AFF',
  },
});

export default TransactionDetailsScreen;
