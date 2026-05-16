import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  UserCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  User,
  CreditCard,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useMenu } from "@/hooks/use-menu";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useUser } from "@/contexts/UserContext";
import { MenuItem, MenuSection } from "./components";
import { MainMenuProps } from "./types";
import { Permission } from "@/types/enums";
import { domainSections } from "@/config/nav";

export function MainMenu({ className }: MainMenuProps) {
  const { isOpen, setIsOpen, isCollapsed, setIsCollapsed } = useMenu();
  const location = useLocation();
  const { isAtTop } = useScrollDirection();
  const { isLoading, user } = useUser();
  const { logout } = useAuth();

  const permissions: string[] = user?.permissions ?? [];
  const canSeeMinhaMensalidade = permissions.includes(Permission.BillingMeShow);
  const canSeeBillingAdmin = permissions.includes(Permission.BillingAdminList);
  const canSeeTenantsAdmin = permissions.includes(Permission.TenantAdminList);

  // Fechar o menu quando mudar de página
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  return (
    <>
      {/* Header mobile */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 h-14 bg-white border-b z-50 lg:hidden transition-all duration-300 flex items-center",
          !isOpen && isAtTop ? "translate-y-[-100%]" : "translate-y-0"
        )}
      >
        {/* Linha verde no topo */}
        <div className="absolute inset-x-0 -top-[1px] h-1 bg-emerald-500" />

        <button
          className="h-14 w-14 flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-lg">
          BOOTSTRAP
        </Link>
      </div>

      {/* Overlay para fechar o menu no mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu lateral */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-card border-r z-50 transition-all duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        <nav
          className={cn(
            "h-full flex flex-col",
            "bg-white"
          )}
        >
          {/* Botão de fechar no mobile */}
          <div className="lg:hidden">
            <div className="h-14 flex items-center px-4 border-b relative">
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <Link to="/" className="font-semibold text-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                BOOTSTRAP
              </Link>
            </div>
          </div>

          {/* Botão toggle desktop */}
          <div
            className={cn(
              "absolute -right-3 top-3 hidden lg:flex",
              "w-6 h-6 items-center justify-center z-10"
            )}
          >
            <div className="absolute -left-1.5 bg-card border-r h-6 w-6 rounded-full">
              <div
                className="h-full w-full flex items-center justify-center cursor-pointer"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ?
                  <ChevronRight className="h-5 w-5 text-emerald-500" /> :
                  <ChevronLeft className="h-5 w-5 text-emerald-500" />
                }
              </div>
            </div>
          </div>

          {/* Cabeçalho Desktop */}
          <div className="bg-white h-14 items-center justify-center border-b hidden lg:flex">
            {!isCollapsed && (
              <Link to="/" className="font-semibold text-lg text-foreground">
                BOOTSTRAP
              </Link>
            )}
          </div>

          {/* Conteúdo do Menu */}
          <div className="flex flex-col h-full">
            {/* Conteúdo principal */}
            <div className="p-4 space-y-6 flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <MenuSection title="Início" isCollapsed={isCollapsed}>
                    <MenuItem href="/home" icon={<User className="h-full w-full" />} isCollapsed={isCollapsed}>
                      Painel
                    </MenuItem>
                  </MenuSection>

                  {domainSections.map(section => (
                    <MenuSection key={section.label} title={section.label} isCollapsed={isCollapsed}>
                      {section.items.map(item => (
                        <MenuItem
                          key={item.href}
                          href={item.href}
                          icon={<item.icon className="h-full w-full" />}
                          isCollapsed={isCollapsed}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </MenuSection>
                  ))}

                  <MenuSection title="Minha Conta" isCollapsed={isCollapsed}>
                    <MenuItem href="/minha-conta/meus-dados" icon={<User className="h-full w-full" />} isCollapsed={isCollapsed}>
                      Meus dados
                    </MenuItem>
                    {canSeeMinhaMensalidade && (
                      <MenuItem href="/minha-mensalidade" icon={<CreditCard className="h-full w-full" />} isCollapsed={isCollapsed}>
                        Minha mensalidade
                      </MenuItem>
                    )}
                  </MenuSection>

                  {(canSeeTenantsAdmin || canSeeBillingAdmin) && (
                    <MenuSection title="Plataforma" isCollapsed={isCollapsed}>
                      {canSeeTenantsAdmin && (
                        <MenuItem href="/admin/tenants" icon={<Users className="h-full w-full" />} isCollapsed={isCollapsed}>
                          Tenants
                        </MenuItem>
                      )}
                      {canSeeBillingAdmin && (
                        <MenuItem href="/admin/billing" icon={<LayoutDashboard className="h-full w-full" />} isCollapsed={isCollapsed}>
                          Billing
                        </MenuItem>
                      )}
                    </MenuSection>
                  )}
                </>
              )}
            </div>

            {/* Minha Empresa (fixo no rodapé) */}
            <div className="border-t">
              <div className="p-4">
                <MenuSection title="Minha Empresa" isCollapsed={isCollapsed}>
                  <MenuItem href="/configuracoes/permissionamento" icon={<Settings className="h-full w-full" />} isCollapsed={isCollapsed}>
                    Permissões
                  </MenuItem>
                  <MenuItem href="/pessoas" icon={<UserCheck className="h-full w-full" />} isCollapsed={isCollapsed}>
                    Pessoas
                  </MenuItem>
                </MenuSection>
              </div>
            </div>

            {/* Botão Sair fixo no final */}
            <div className="p-4 pt-4">
              <MenuItem
                href="#"
                icon={<LogOut className="h-full w-full" />}
                isCollapsed={isCollapsed}
                onClick={logout}
              >
                Sair
              </MenuItem>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
