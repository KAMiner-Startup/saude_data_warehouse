"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Activity,
  Users,
  Building2,
  HeartPulse,
  Settings,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  ScrollText,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const menuPrincipal = [
  { title: "Dashboard", url: "/portal-administrativo/dashboard", icon: LayoutDashboard },
]

const menuMonitoramento = [
  { title: "Monitoramento", url: "/portal-administrativo/monitoramento", icon: Activity, badge: 7 },
]

const menuGestao = [
  { title: "Usuários", url: "/portal-administrativo/usuarios", icon: Users },
  { title: "Unidades Hospitalares", url: "/portal-administrativo/unidades-hospitalares", icon: Building2 },
  { title: "Unidades de APS", url: "/portal-administrativo/unidades-aps", icon: HeartPulse },
]

const menuConfig = [
  { title: "Configuração de Alertas", url: "/portal-administrativo/configuracoes/alertas", icon: Bell, exact: true },
  { title: "Parâmetros Gerais", url: "/portal-administrativo/configuracoes", icon: Settings, exact: true },
]

const menuRelatorios = [
  { title: "Relatórios", url: "/portal-administrativo/relatorios", icon: FileText },
  { title: "Log de Auditoria", url: "/portal-administrativo/auditoria", icon: ScrollText },
]

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"

interface MenuItem {
  title: string
  url: string
  icon: React.ElementType
  badge?: number
  exact?: boolean
}

interface NavItemProps {
  item: MenuItem
  collapsed: boolean
  pathname: string
}

function NavItem({ item, collapsed, pathname }: NavItemProps) {
  // Se exact=true, só ativa se o pathname for exatamente igual
  const isActive = item.exact
    ? pathname === item.url
    : pathname === item.url || pathname.startsWith(item.url + "/")

  const Icon = item.icon

  const content = (
    <Link
      href={item.url}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
        isActive
          ? "font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        collapsed && "justify-center px-2"
      )}
      style={isActive ? { color: ADMIN_COLOR, background: ADMIN_BG } : {}}
    >
      <Icon
        className="w-4 h-4 flex-shrink-0 transition-colors"
        style={isActive ? { color: ADMIN_COLOR } : {}}
        strokeWidth={1.25}
      />
      {!collapsed && <span className="truncate">{item.title}</span>}
      {!collapsed && item.badge !== undefined && (
        <span
          className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
          style={{ background: ADMIN_COLOR }}
        >
          {item.badge}
        </span>
      )}
      {collapsed && item.badge !== undefined && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative w-full flex justify-center">{content}</div>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          <p>{item.title}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed: boolean }) {
  if (collapsed) return <div className="h-px bg-border my-2 mx-2" />
  return (
    <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
      {children}
    </p>
  )
}

interface AdminSidebarNavProps {
  collapsed: boolean
  onToggle: () => void
}

export function AdminSidebarNav({ collapsed, onToggle }: AdminSidebarNavProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex flex-col bg-white transition-all duration-300 ease-in-out",
          collapsed ? "w-[80px]" : "w-60"
        )}
      >
        {/* Botão flutuante de toggle — padrão igual aos demais portais */}
        <button
          onClick={onToggle}
          className="absolute -right-3.5 top-25 z-50 h-7 w-7 rounded-full bg-card cursor-pointer transition-all duration-200 hover:text-white flex items-center justify-center"
          style={{
            boxShadow: "var(--shadow-float)",
            border: "1px solid oklch(0.92 0.006 247)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = ADMIN_COLOR)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "")}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          )}
        </button>

        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div>
            <SectionLabel collapsed={collapsed}>Principal</SectionLabel>
            <div className="space-y-0.5">
              {menuPrincipal.map((item) => <NavItem key={item.url} item={item} collapsed={collapsed} pathname={pathname} />)}
            </div>
          </div>

          <div className="mx-2 h-px bg-border" />

          <div>
            <SectionLabel collapsed={collapsed}>Monitoramento</SectionLabel>
            <div className="space-y-0.5">
              {menuMonitoramento.map((item) => <NavItem key={item.url} item={item} collapsed={collapsed} pathname={pathname} />)}
            </div>
          </div>

          <div className="mx-2 h-px bg-border" />

          <div>
            <SectionLabel collapsed={collapsed}>Gestão</SectionLabel>
            <div className="space-y-0.5">
              {menuGestao.map((item) => <NavItem key={item.url} item={item} collapsed={collapsed} pathname={pathname} />)}
            </div>
          </div>

          <div className="mx-2 h-px bg-border" />

          <div>
            <SectionLabel collapsed={collapsed}>Relatórios</SectionLabel>
            <div className="space-y-0.5">
              {menuRelatorios.map((item) => <NavItem key={item.url} item={item} collapsed={collapsed} pathname={pathname} />)}
            </div>
          </div>

          <div className="mx-2 h-px bg-border" />

          <div>
            <SectionLabel collapsed={collapsed}>Configurações</SectionLabel>
            <div className="space-y-0.5">
              {menuConfig.map((item) => <NavItem key={item.url} item={item} collapsed={collapsed} pathname={pathname} />)}
            </div>
          </div>
        </nav>

        <div className="px-3 py-3">
          {!collapsed && (
            <p className="text-[11px] text-muted-foreground/60 text-center">v1.0.0</p>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
