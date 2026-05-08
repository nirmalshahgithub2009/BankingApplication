/**
 * Payment Form Screen
 * Form to create a new payment
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppStackScreenProps } from '@navigation/types';

type PaymentFormScreenProps = AppStackScreenProps<'PaymentForm'>;

const PaymentFormScreen: React.FC<PaymentFormScreenProps> = ({ navigation }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!recipient || !amount || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual payment API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert('Success', 'Payment created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Payment</Text>

            {/* Recipient Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Recipient Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter recipient name"
                placeholderTextColor="#999"
                value={recipient}
                onChangeText={setRecipient}
                editable={!isLoading}
              />
            </View>

            {/* Amount Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Description Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter payment description"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
                editable={!isLoading}
              />
            </View>

            {/* Preview */}
            {amount && (
              <View style={styles.previewCard}>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Amount to Send:</Text>
                  <Text style={styles.previewAmount}>${parseFloat(amount || '0').toFixed(2)}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Fee:</Text>
                  <Text style={styles.previewAmount}>$0.00</Text>
                </View>
                <View style={styles.previewDivider} />
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabelBold}>Total:</Text>
                  <Text style={[styles.previewAmount, styles.previewAmountBold]}>
                    ${parseFloat(amount || '0').toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Create Payment</Text>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Payment Information</Text>
            <Text style={styles.infoText}>
              • Payments are processed within 1-2 business days{'\n'}• No fees for payments to other
              BankApp users{'\n'}• All transactions are secure and encrypted
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#F9F9F9',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    paddingLeft: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  previewCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 13,
    color: '#666',
  },
  previewLabelBold: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  previewAmount: {
    fontSize: 13,
    color: '#666',
  },
  previewAmountBold: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});

export default PaymentFormScreen;
