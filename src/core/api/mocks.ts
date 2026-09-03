/**
 * Mock API responses for development and testing
 * This file provides local mock data without requiring external HTTP calls
 */

export interface MockResponse<T> {
  status: number;
  data: T;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AccountSummary {
  id: string;
  name: string;
  currency: string;
  balance: number;
  lastActivity: string;
}

export interface TransactionItem {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

/**
 * Mock data storage
 */
export const mockData = {
  login: (): MockResponse<LoginResponse> => ({
    status: 200,
    data: {
      accessToken: 'mock_access_token_12345',
      refreshToken: 'mock_refresh_token_abcde',
      user: {
        id: 'user_001',
        name: 'John Doe',
        email: 'john@bankapp.com',
      },
    },
  }),

  accounts: (): MockResponse<AccountSummary[]> => ({
    status: 200,
    data: [
      {
        id: 'acc_001',
        name: 'Checking Account',
        currency: 'USD',
        balance: 5250.75,
        lastActivity: '2024-05-18T14:30:00Z',
      },
      {
        id: 'acc_002',
        name: 'Savings Account',
        currency: 'USD',
        balance: 25000.0,
        lastActivity: '2024-05-10T09:15:00Z',
      },
      {
        id: 'acc_003',
        name: 'Business Account',
        currency: 'USD',
        balance: 45750.25,
        lastActivity: '2024-05-19T11:45:00Z',
      },
    ],
  }),

  accountDetails: (accountId: string): MockResponse<AccountSummary> => ({
    status: 200,
    data: {
      id: accountId,
      name: 'Checking Account',
      currency: 'USD',
      balance: 5250.75,
      lastActivity: '2024-05-18T14:30:00Z',
    },
  }),

  transactions: (accountId: string): MockResponse<TransactionItem[]> => ({
    status: 200,
    data: [
      {
        id: 'txn_001',
        type: 'debit',
        amount: 150.0,
        description: 'Grocery Store',
        date: '2024-05-19T10:00:00Z',
        status: 'completed',
      },
      {
        id: 'txn_002',
        type: 'credit',
        amount: 500.0,
        description: 'Salary Deposit',
        date: '2024-05-18T09:00:00Z',
        status: 'completed',
      },
      {
        id: 'txn_003',
        type: 'debit',
        amount: 50.0,
        description: 'Online Service',
        date: '2024-05-17T15:30:00Z',
        status: 'completed',
      },
      {
        id: 'txn_004',
        type: 'debit',
        amount: 200.0,
        description: 'Bill Payment',
        date: '2024-05-16T12:00:00Z',
        status: 'pending',
      },
    ],
  }),

  transferFunds: (): MockResponse<{ transactionId: string; status: string }> => ({
    status: 200,
    data: {
      transactionId: 'txn_transfer_001',
      status: 'success',
    },
  }),

  profile: (): MockResponse<{
    id: string;
    name: string;
    email: string;
    phone: string;
    lastLogin: string;
  }> => ({
    status: 200,
    data: {
      id: 'user_001',
      name: 'John Doe',
      email: 'john@bankapp.com',
      phone: '+1-555-0123',
      lastLogin: '2024-05-19T10:00:00Z',
    },
  }),
};
