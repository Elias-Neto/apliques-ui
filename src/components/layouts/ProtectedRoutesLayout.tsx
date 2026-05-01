import { Routes, Route } from "react-router-dom"
import { MainMenu } from "@/components/layouts/MainMenu"
import { useMenu } from "@/hooks/use-menu"
import { cn } from "@/lib/utils"
import Pessoas from "@/features/pessoa/pages/Pessoas"
import Settings from "@/features/permission-group/pages/Settings"
import Home from "@/features/home/pages/Home"
import NotFound from "@/components/layouts/NotFound"

export const ProtectedRoutesLayout = () => {
  const { isCollapsed } = useMenu()

  return (
    <div className="flex min-h-screen">
      <MainMenu />
      <main
        className={cn(
          "flex-1 overflow-auto transition-all duration-300",
          isCollapsed ? "lg:ml-[63px]" : "lg:ml-64",
        )}
      >
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/configuracoes/permissionamento" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
