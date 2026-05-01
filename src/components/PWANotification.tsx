import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";

export const PWANotification = () => {
  const { needRefresh, offlineReady, canInstall, updateServiceWorker, installApp } = usePWA();
  const [hideInstall, setHideInstall] = useState(false);

  if (!needRefresh && !offlineReady && (!canInstall || hideInstall)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {canInstall && !hideInstall && (
        <Card className="w-80 shadow-lg border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Download className="h-4 w-4" />
              Instalar App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Instale o Sonar no seu dispositivo para acesso rápido
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={installApp} className="flex-1">
                Instalar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setHideInstall(true)}>
                Depois
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {needRefresh && (
        <Card className="w-80 shadow-lg border-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Nova Versão Disponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Uma nova versão do app está disponível
            </p>
            <Button size="sm" onClick={updateServiceWorker} className="w-full">
              Atualizar Agora
            </Button>
          </CardContent>
        </Card>
      )}

      {offlineReady && (
        <Card className="w-80 shadow-lg border-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              Pronto para Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              O app está pronto para uso offline
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 