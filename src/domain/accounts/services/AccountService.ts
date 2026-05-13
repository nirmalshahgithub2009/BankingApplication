import { apiClient } from '@core/api/client';

export type AccountSummary = {
  id: string;
  name: string;
  currency: string;
  balance: number;
  lastActivity: string;
};

export type AccountDetails = AccountSummary & {
  iban: string;
  branch: string;
  availableBalance: number;
  accountType: string;
};

export const AccountService = {
  getAccounts: async (): Promise<AccountSummary[]> => {
    return apiClient.get<AccountSummary[]>('/accounts');
  },

  getAccountDetails: async (accountId: string): Promise<AccountDetails> => {
    return apiClient.get<AccountDetails>(`/accounts/${accountId}`);
  },

  createAccount: async (payload: { name: string; currency: string }): Promise<AccountDetails> => {
    return apiClient.post<AccountDetails>('/accounts', payload);
  },
};
