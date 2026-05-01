import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useRef } from "react";
import { getMe, MeResponse } from "@/services/me/me";

interface UserContextType {
  user: MeResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchUser = async () => {
    if (hasFetched.current) {
      return;
    }
    
    try {
      hasFetched.current = true;
      setIsLoading(true);
      setError(null);
      const userData = await getMe();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    hasFetched.current = false;
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isLoading,
    error,
    refetch
  }), [user, isLoading, error]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}; 