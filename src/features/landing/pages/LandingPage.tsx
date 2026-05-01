import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Calculator, Smartphone, TrendingUp, FileText, MessageCircle, ClipboardList, Settings } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Construindo Minha Contribuição
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed max-w-3xl mx-auto">
              Para o negócio que meu pai construiu e que foi fonte de renda durante toda minha vida e da minha família
            </p>
          </div>
          
          <div className="pt-8 space-y-4">
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              O SONAR é mais que um sistema de gestão. É uma homenagem ao trabalho de uma vida inteira, 
              transformando a forma como você gerencia sua confecção com tecnologia moderna e intuitiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold"
                onClick={() => navigate("/criar-conta")}
              >
                Começar Agora
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="px-8 py-6 text-lg font-semibold"
                onClick={() => navigate("/login")}
              >
                Já tenho uma conta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Family Legacy Section with Images */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Uma História de Trabalho e Dedicação
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                O SONAR nasceu da vontade de honrar o trabalho árduo de uma vida inteira, 
                transformando a tradição em tecnologia que gera resultados.
              </p>
            </div>

            {/* Image Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div 
                className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedImage("/family-1.jpeg")}
              >
                <img 
                  src="/family-1.jpeg" 
                  alt="Momentos de trabalho e dedicação familiar" 
                  className="w-full h-full object-cover aspect-[3/4]"
                />
              </div>
              
              <div 
                className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedImage("/family-2.jpeg")}
              >
                <img 
                  src="/family-2.jpeg" 
                  alt="Construindo sonhos juntos" 
                  className="w-full h-full object-cover aspect-[3/4]"
                />
              </div>
              
              <div 
                className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedImage("/family-4.jpeg")}
              >
                <img 
                  src="/family-4.jpeg" 
                  alt="História familiar" 
                  className="w-full h-full object-cover aspect-[3/4]"
                />
              </div>
              
              <div 
                className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedImage("/family-3.jpeg")}
              >
                <img 
                  src="/family-3.jpeg" 
                  alt="Legado de gerações" 
                  className="w-full h-full object-cover aspect-[3/4]"
                />
              </div>
            </div>

            <div className="text-center max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 italic leading-relaxed">
                "Este sistema é minha contribuição para o negócio que sustentou minha família e 
                continua sendo a base do nosso sustento. Tecnologia criada com respeito pela tradição."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Transformando Tradição em Inovação
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Deixe os cadernos e talões de lado. Gerencie seu negócio na palma da mão, 
              com precisão e agilidade como nunca antes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Sistema de Gerenciamento de Bancadas */}
            <Card className="border-2 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calculator className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Sistema de Gerenciamento de Bancadas</CardTitle>
                </div>
                <CardDescription className="text-base font-medium text-gray-600">
                  Substitua o caderno por tecnologia inteligente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Cálculo Automático de Rendimento</p>
                      <p className="text-sm text-gray-600">Custo por peça e peças por quilo calculados automaticamente</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Na Palma da Mão</p>
                      <p className="text-sm text-gray-600">Acesse de qualquer lugar, a qualquer momento</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Envio para WhatsApp</p>
                      <p className="text-sm text-gray-600">Compartilhe informações rapidamente com sua equipe</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sistema de Preços */}
            <Card className="border-2 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Sistema de Preços</CardTitle>
                </div>
                <CardDescription className="text-base font-medium text-gray-600">
                  Precisão e controle total sobre sua margem de lucro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-green-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Cálculos Automáticos</p>
                      <p className="text-sm text-gray-600">Soma de custos e margem de lucro calculadas instantaneamente</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-green-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Margem de Lucro Clara</p>
                      <p className="text-sm text-gray-600">Visualize exatamente quanto está ganhando em cada venda</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-green-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Integração com Pedidos</p>
                      <p className="text-sm text-gray-600">Preços sincronizados automaticamente com o sistema de pedidos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sistema de Pedidos */}
            <Card className="border-2 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ClipboardList className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Sistema de Pedidos</CardTitle>
                </div>
                <CardDescription className="text-base font-medium text-gray-600">
                  Diga adeus aos talões de notinha
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-purple-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Cálculos Automáticos</p>
                      <p className="text-sm text-gray-600">Total de peças e valor em R$ calculados na hora</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-purple-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Controle de Margem</p>
                      <p className="text-sm text-gray-600">Negocie com confiança sabendo sua margem em tempo real</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-purple-600 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Envio para WhatsApp</p>
                      <p className="text-sm text-gray-600">Compartilhe pedidos diretamente com seus clientes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Smartphone className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Acesso em Qualquer Lugar</h3>
                  <p className="text-gray-600">
                    Gerencie sua confecção de onde estiver. No escritório, na produção ou em casa, 
                    todas as informações estão na palma da sua mão.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Integração com WhatsApp</h3>
                  <p className="text-gray-600">
                    Envie informações, pedidos e relatórios diretamente pelo WhatsApp, 
                    mantendo a comunicação rápida e eficiente com sua equipe e clientes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Fim dos Cadernos e Talões</h3>
                  <p className="text-gray-600">
                    Elimine a necessidade de cadernos, talões de notinha e planilhas complexas. 
                    Tudo organizado e acessível em um só lugar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 rounded-lg">
                  <Settings className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cálculos Automatizados</h3>
                  <p className="text-gray-600">
                    Reduza erros e ganhe tempo com cálculos automáticos de rendimento, custos, 
                    preços e margens de lucro. Mais precisão, menos trabalho manual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-0 text-white">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-3xl md:text-4xl font-bold">
                Pronto para Modernizar Seu Negócio?
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Junte-se à nova geração de gestão de confecções. Tecnologia que honra o trabalho de uma vida inteira.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                variant="secondary"
                className="px-8 py-6 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => navigate("/criar-conta")}
              >
                Criar Conta Grátis
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-lg font-semibold border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white"
                onClick={() => navigate("/login")}
              >
                Entrar na Minha Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-black/95 border-none [&>button]:text-white [&>button]:hover:text-white [&>button]:hover:bg-white/20 [&>button]:top-6 [&>button]:right-6 [&>button]:z-20">
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={selectedImage} 
                alt="Imagem ampliada" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            SONAR - Gestão Inteligente para Sua Confecção
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Construído com dedicação para transformar a gestão do seu negócio
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

