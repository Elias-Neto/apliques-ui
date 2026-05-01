import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há um token no localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Se houver token, redirecionar para /home
      navigate("/home");
      return;
    }

    // Remove scroll do body quando a landing page está ativa
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.minHeight = '100vh';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    
    return () => {
      // Restaura o scroll quando sair da landing page
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.minHeight = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, [navigate]);

  return (
    <div 
      className="landing-page h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden" 
      style={{ 
        minHeight: '100vh',
        maxHeight: '100vh',
        height: '100vh'
      }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8 p-8">
          <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
            SONAR
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
            Feito para você comerciante ter o controle da sua confecção
          </p>
          <Button 
            size="lg" 
            className="px-8 py-3 text-lg font-semibold"
            onClick={() => navigate("/criar-conta")}
          >
            Criar Conta
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center pb-8">
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Caso já tenha uma conta,
          </p>
          <Button 
            variant="outline"
            size="lg" 
            className="px-8 py-3 text-lg font-semibold"
            onClick={() => navigate("/login")}
          >
            Entre na sua conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing; 