import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/toast/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useUser } from "@/contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuth();
  const { isLoading: userLoading, error } = useUser();

  useEffect(() => {
    if (!authLoading && !checkAuth()) {
      toast({
        title: "Acesso negado",
        description: "Você precisa fazer login para acessar esta página.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [authLoading, checkAuth, navigate, toast]);

  // Se há erro ao carregar dados do usuário, redireciona para login
  useEffect(() => {
    if (error && !userLoading) {
      toast({
        title: "Erro de autenticação",
        description: "Sua sessão expirou. Faça login novamente.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [error, userLoading, navigate, toast]);

  if (authLoading || userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}; 