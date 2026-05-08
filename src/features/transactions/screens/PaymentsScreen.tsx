/**
 * Payments Screen
 * View and manage payments
 */

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTabsScreenProps } from '@navigation/types';

type PaymentsScreenProps = AppTabsScreenProps<'Payments'>;

const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ navigation }) => {
  const mockPayments = [
    {
      id: '1',
      recipient: 'Utility Company',
      amount: 150.0,
      date: 'Jan 15, 2024',
      status: 'Completed',
    },
    { id: '2', recipient: 'John Smith', amount: 250.0, date: 'Jan 14, 2024', status: 'Pending' },
    {
      id: '3',
      recipient: 'Restaurant XYZ',
      amount: 45.5,
      date: 'Jan 13, 2024',
      status: 'Completed',
    },
  ];

  const handleNewPayment = () => {
    navigation.navigate('PaymentForm');
  };

  const renderPayment = ({ item }: { item: (typeof mockPayments)[0] }) => (
    <TouchableOpacity style={styles.paymentCard}>
      <View style={styles.paymentInfo}>
        <Text style={styles.recipient}>{item.recipient}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.paymentDetails}>
        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'Completed' ? styles.statusCompleted : styles.statusPending,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Payments</Text>
          <TouchableOpacity style={styles.newPaymentButton} onPress={handleNewPayment}>
            <Text style={styles.newPaymentText}>+ New Payment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statAmount}>$445.50</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={styles.statAmount}>$250.00</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Payments</Text>

        <FlatList
          data={mockPayments}
          renderItem={renderPayment}
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
  newPaymentButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  newPaymentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  statAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentInfo: {
    flex: 1,
  },
  recipient: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  paymentDetails: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default PaymentsScreen;
