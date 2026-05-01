import { MainMenu } from "./MainMenu";
import { ProtectedRoute } from "./ProtectedRoute";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <MainMenu />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}; 