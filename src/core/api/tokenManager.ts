export type TokenPair = {
  accessToken: string | null;
  refreshToken: string | null;
};

const tokenState: TokenPair = {
  accessToken: null,
  refreshToken: null,
};

export const getAccessToken = (): string | null => tokenState.accessToken;
export const getRefreshToken = (): string | null => tokenState.refreshToken;

export const setTokens = (tokens: TokenPair): void => {
  tokenState.accessToken = tokens.accessToken;
  tokenState.refreshToken = tokens.refreshToken;
};

export const clearTokens = (): void => {
  tokenState.accessToken = null;
  tokenState.refreshToken = null;
};

export const hasValidAccessToken = (): boolean => Boolean(tokenState.accessToken);
