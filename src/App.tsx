import { Toaster } from "@/components/ui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainMenu } from "./components/MainMenu";
import { ScrollToTop } from "./components/ScrollToTop";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserProvider } from "./contexts/UserContext";
import Pessoas from "./pages/Pessoas";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Home from "./pages/home/Home";
import Landing from "./pages/Landing";
import LandingPage from "./pages/LandingPage";
import { PWANotification } from "./components/PWANotification";
import AccountCreate from "./pages/accountCreate/AccountCreate";
import Login from "./pages/login/Login";
import { useMenu } from "./hooks/use-menu";
import { cn } from "./lib/utils";

// Criar o QueryClient fora do componente para evitar recriações
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});

const ProtectedRoutesLayout = () => {
  const { isCollapsed } = useMenu();

  return (
    <div className="flex min-h-screen">
      <MainMenu />
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        isCollapsed ? "lg:ml-[63px]" : "lg:ml-64"
      )}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/configuracoes/permissionamento" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/criar-conta" element={<AccountCreate />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={
            <UserProvider>
              <ProtectedRoute>
                <ProtectedRoutesLayout />
              </ProtectedRoute>
            </UserProvider>
          } />
        </Routes>
      </BrowserRouter>
      <PWANotification />
  </QueryClientProvider>
);

export default App;
