import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// User interface
interface User {
  id: number;
  username: string;
}

// Auth context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

// Login data type
type LoginData = {
  username: string;
  password: string;
};

// Register data type
type RegisterData = {
  username: string;
  password: string;
};

// Create auth context
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Get current user
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Giriş zamanı xəta baş verdi");
      }
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Uğurlu giriş",
        description: "Admin panelinə daxil oldunuz",
      });
      window.location.href = "/adminndutedxozu";
    },
    onError: (error: Error) => {
      toast({
        title: "Giriş uğursuz oldu",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Qeydiyyat zamanı xəta baş verdi");
      }
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Uğurlu qeydiyyat",
        description: "Yeni admin hesabı yaradıldı",
      });
      window.location.href = "/adminndutedxozu";
    },
    onError: (error: Error) => {
      toast({
        title: "Qeydiyyat uğursuz oldu",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Çıxış zamanı xəta baş verdi");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Çıxış edildi",
        description: "Admin paneldən çıxış edildi",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Çıxış uğursuz oldu",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}