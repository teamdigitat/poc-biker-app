let tokenCache: string | null = null;

export const setAuthTokenCache = (token: string | null) => {
   tokenCache = token;
};

export const getAuthTokenCache = () => tokenCache;
