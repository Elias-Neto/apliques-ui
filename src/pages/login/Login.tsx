import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSession } from "@/services/sessions/sessions";
import { useToast } from "@/hooks/toast/use-toast";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatCpf = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 11);

    if (digitsOnly.length <= 3) return digitsOnly;

    if (digitsOnly.length <= 6)
      return digitsOnly.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");

    if (digitsOnly.length <= 9)
      return digitsOnly.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");

    return digitsOnly.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{1,2}).*$/,
      "$1.$2.$3-$4",
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cpf || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await createSession({ cpf, password });
      
      // Usar o hook useAuth para fazer login
      login(response.token);
      
      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso!",
      });

      // Redirecionar para a página home
      navigate("/home");
    } catch (error) {
      toast({
        title: "Erro",
        description: "CPF ou senha incorretos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Entre na sua conta
            </h1>
            <p className="text-gray-600">
              Digite suas credenciais para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <button
                onClick={() => navigate("/criar-conta")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 