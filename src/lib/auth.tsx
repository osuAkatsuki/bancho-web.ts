import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { api } from "@/lib/api/client";
import { setAuthToken } from "@/lib/api/http";
import type { Player } from "@/lib/api/types";

const TOKEN_STORAGE_KEY = "bancho-web.session-token";

interface AuthContextValue {
  /** the signed-in player, or null when logged out */
  player: Player | null;
  /** true while the persisted session is being restored on page load */
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (args: {
    username: string;
    email: string;
    password: string;
    captchaToken: string | null;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persistToken(token: string | null) {
  setAuthToken(token);
  if (token === null) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } else {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // restore the persisted session on page load
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token === null) {
      setIsLoading(false);
      return;
    }

    setAuthToken(token);
    api
      .fetchCurrentSession()
      .then((envelope) => setPlayer(envelope.data))
      .catch(() => persistToken(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const session = await api.createSession({ username, password });
    persistToken(session.data.token);
    const current = await api.fetchCurrentSession();
    setPlayer(current.data);
  }, []);

  const register = useCallback(
    async (args: {
      username: string;
      email: string;
      password: string;
      captchaToken: string | null;
    }) => {
      await api.registerAccount(args);
      await login(args.username, args.password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    await api.deleteCurrentSession().catch(() => undefined);
    persistToken(null);
    setPlayer(null);
  }, []);

  const value = useMemo(
    () => ({ player, isLoading, login, register, logout }),
    [player, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
