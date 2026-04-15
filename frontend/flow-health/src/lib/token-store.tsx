import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { tokens as staticTokens, type Token } from '@/lib/demo-data';
import { subscribeToTokens, addToken as fsAddToken, updateToken as fsUpdateToken } from '@/lib/firestore';

interface TokenStore {
  tokens: Token[];
  loading: boolean;
  addToken: (token: Token) => Promise<void>;
  updateToken: (id: string, updates: Partial<Token>) => Promise<void>;
  refreshTokens: () => void;
}

const TokenContext = createContext<TokenStore | null>(null);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time Firestore token updates
  useEffect(() => {
    const unsubscribe = subscribeToTokens((data) => {
      if (data.length > 0) {
        setTokens(data as Token[]);
      } else {
        // Use static demo tokens if Firestore is empty
        setTokens(staticTokens);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addToken = useCallback(async (token: Token) => {
    // Optimistically add to local state immediately
    setTokens(prev => [token, ...prev]);
    try {
      await fsAddToken(token);
    } catch (err) {
      console.error('Failed to save token to Firestore:', err);
      // Keep in local state even if Firestore fails
    }
  }, []);

  const updateToken = useCallback(async (id: string, updates: Partial<Token>) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    try {
      await fsUpdateToken(id, updates);
    } catch (err) {
      console.error('Failed to update token in Firestore:', err);
    }
  }, []);

  const refreshTokens = useCallback(() => {
    // With Firestore subscriptions, this is a no-op — updates come automatically
    console.log('Firestore subscription is live; no manual refresh needed.');
  }, []);

  return (
    <TokenContext.Provider value={{ tokens, loading, addToken, updateToken, refreshTokens }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokenStore(): TokenStore {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error('useTokenStore must be used within a TokenProvider');
  return ctx;
}
