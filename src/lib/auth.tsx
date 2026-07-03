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
import type { Player } from "@/lib/api/types";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // the session lives in an http-only cookie, so restoring it on page
  // load is just asking the api who we are
  useEffect(() => {
    api
      .fetchCurrentSession()
      .then((envelope) => setPlayer(envelope.data))
      .catch(() => setPlayer(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const session = await api.createSession({ username, password });
    setPlayer(session.data);
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
