import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTenant } from "@/features/auth/services/tenants";
import { createSession } from "@/features/auth/services/sessions";
import { useToast } from "@/hooks/toast/use-toast";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { TypeCreateTenantPayload } from "@/features/auth/types/tenant";
import { Eye, EyeOff } from "lucide-react";

type TenantForm = {
  companyName: string;
  companyCnpj: string;
  ownerName: string;
  ownerPhone: string;
  ownerCpf: string;
  ownerPassword: string;
};

export default function AccountCreate() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tenant, setTenant] = useState<TenantForm>({
    companyName: "",
    companyCnpj: "",
    ownerName: "",
    ownerPhone: "",
    ownerCpf: "",
    ownerPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para formatar CNPJ
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleChange = (field: keyof TenantForm, value: string) => {
    let formattedValue = value;
    
    // Aplicar formatação específica para cada campo
    if (field === 'ownerPhone') {
      formattedValue = formatPhone(value);
    } else if (field === 'ownerCpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'companyCnpj') {
      formattedValue = formatCNPJ(value);
    }
    
    setTenant(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const resetForm = () => {
    setTenant({
      companyName: "",
      companyCnpj: "",
      ownerName: "",
      ownerPhone: "",
      ownerCpf: "",
      ownerPassword: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload: TypeCreateTenantPayload = {
        company: {
          name: tenant.companyName,
          cnpj: tenant.companyCnpj,
        },
        owner: {
          name: tenant.ownerName,
          phone: tenant.ownerPhone,
          cpf: tenant.ownerCpf,
          password: tenant.ownerPassword,
        },
      };
      
      await createTenant(payload);
      
      // Após criar a conta, faz login automático
      const sessionPayload = {
        cpf: tenant.ownerCpf,
        password: tenant.ownerPassword,
      };
      
      try {
        const session = await createSession(sessionPayload);
        console.log("Sessão criada:", session);
        
        // Usar o hook useAuth para fazer login
        login(session.token);
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Sua conta foi criada e você foi logado automaticamente.",
          variant: "default",
        });
        
        resetForm();
        
        // Redireciona para /home
        navigate("/home");
      } catch (sessionError) {
        console.error("Erro ao criar sessão:", sessionError);
        toast({
          title: "Erro ao fazer login",
          description: "Conta criada, mas não foi possível fazer login automático.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erro ao criar conta",
        description: "Tente novamente. Verifique se todos os dados estão corretos.",
        variant: "destructive",
      });
      console.error("Erro ao criar tenant:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Criar Conta</h1>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da empresa</Label>
            <Input
              id="companyName"
              type="text"
              value={tenant.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Nome da sua empresa"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyCnpj">CNPJ da empresa</Label>
            <Input
              id="companyCnpj"
              type="text"
              value={tenant.companyCnpj}
              onChange={(e) => handleChange("companyCnpj", e.target.value)}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Nome do proprietário</Label>
            <Input
              id="ownerName"
              type="text"
              value={tenant.ownerName}
              onChange={(e) => handleChange("ownerName", e.target.value)}
              placeholder="Seu nome completo"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerPhone">Telefone</Label>
            <Input
              id="ownerPhone"
              type="tel"
              value={tenant.ownerPhone}
              onChange={(e) => handleChange("ownerPhone", e.target.value)}
              placeholder="(00) 00000-0000"
              maxLength={15}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerCpf">CPF</Label>
            <Input
              id="ownerCpf"
              type="text"
              value={tenant.ownerCpf}
              onChange={(e) => handleChange("ownerCpf", e.target.value)}
              placeholder="000.000.000-00"
              maxLength={14}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerPassword">Senha</Label>
            <div className="relative">
              <Input
                id="ownerPassword"
                type={showPassword ? "text" : "password"}
                value={tenant.ownerPassword}
                onChange={(e) => handleChange("ownerPassword", e.target.value)}
                placeholder="Digite sua senha"
                required
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>

        <div className="text-center">
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Fazer login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
} 