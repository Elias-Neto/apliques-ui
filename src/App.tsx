import { Toaster } from "@/components/ui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/layouts/ScrollToTop";
import { ProtectedRoute } from "@/components/layouts/ProtectedRoute";
import { ProtectedRoutesLayout } from "@/components/layouts/ProtectedRoutesLayout";
import { UserProvider } from "@/contexts/UserContext";
import { PWANotification } from "@/components/layouts/PWANotification";
import Landing from "@/features/landing/pages/Landing";
import LandingPage from "@/features/landing/pages/LandingPage";
import Login from "@/features/auth/pages/Login";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <UserProvider>
              <ProtectedRoute>
                <ProtectedRoutesLayout />
              </ProtectedRoute>
            </UserProvider>
          }
        />
      </Routes>
    </BrowserRouter>
    <PWANotification />
  </QueryClientProvider>
  )
}

export default App;
