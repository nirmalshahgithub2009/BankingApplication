export type TokenPair = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
};

const tokenState: TokenPair = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

export const getAccessToken = (): string | null => tokenState.accessToken;
export const getRefreshToken = (): string | null => tokenState.refreshToken;

export const setTokens = (
  tokens: Pick<TokenPair, 'accessToken' | 'refreshToken'> & {
    expiresAt?: number | null;
  }
): void => {
  tokenState.accessToken = tokens.accessToken;
  tokenState.refreshToken = tokens.refreshToken;
  tokenState.expiresAt = tokens.expiresAt ?? tokenState.expiresAt;
};

export const saveTokens = async (tokens: {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}): Promise<void> => {
  tokenState.accessToken = tokens.accessToken;
  tokenState.refreshToken = tokens.refreshToken;
  tokenState.expiresAt = tokens.expiresIn ? Date.now() + tokens.expiresIn * 1000 : null;
};

export const updateAccessToken = async (accessToken: string, expiresIn?: number): Promise<void> => {
  tokenState.accessToken = accessToken;
  tokenState.expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : tokenState.expiresAt;
};

export const clearTokens = (): void => {
  tokenState.accessToken = null;
  tokenState.refreshToken = null;
  tokenState.expiresAt = null;
};

export const hasTokens = async (): Promise<boolean> => {
  return Boolean(tokenState.accessToken && tokenState.refreshToken);
};

export const isTokenExpired = async (): Promise<boolean> => {
  if (!tokenState.expiresAt) {
    return false;
  }

  return Date.now() >= tokenState.expiresAt;
};

export const hasValidAccessToken = (): boolean => {
  if (!tokenState.accessToken) {
    return false;
  }

  if (tokenState.expiresAt && Date.now() >= tokenState.expiresAt) {
    return false;
  }

  return true;
};

export const TokenManager = {
  getAccessToken,
  getRefreshToken,
  setTokens,
  saveTokens,
  updateAccessToken,
  clearTokens,
  hasTokens,
  isTokenExpired,
  hasValidAccessToken,
};
