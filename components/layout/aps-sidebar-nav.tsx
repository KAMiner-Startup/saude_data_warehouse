"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Bell,
  Users,
  UserCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  CalendarDays,
  UserCog,
  Building2,
  Clock,
  ClipboardList,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ApsSidebarNavProps {
  collapsed: boolean
  onToggle: () => void
}

const menuPrincipal = [
  {
    title: "Dashboard",
    url: "/portal-atencao-basica/dashboard",
    icon: LayoutDashboard,
  },
]

const menuAlertas = [
  {
    title: "Alertas Pendentes",
    url: "/portal-atencao-basica/alertas",
    icon: Bell,
    badge: 2,
  },
  {
    title: "Em Acompanhamento",
    url: "/portal-atencao-basica/alertas?aba=em_acompanhamento",
    icon: UserCheck,
  },
  {
    title: "Finalizados",
    url: "/portal-atencao-basica/alertas?aba=finalizados",
    icon: CheckCircle,
  },
]

const menuPacientes = [
  {
    title: "Pacientes",
    url: "/portal-atencao-basica/pacientes",
    icon: Users,
  },
  {
    title: "Atendidos recentemente",
    url: "/portal-atencao-basica/pacientes-atendidos",
    icon: Clock,
  },
]

const menuIndicadores = [
  {
    title: "Alertas",
    url: "/portal-atencao-basica/indicadores",
    icon: BarChart2,
  },
]

const menuVisitas = [
  {
    title: "Visitas Domiciliares",
    url: "/portal-atencao-basica/visitas",
    icon: CalendarDays,
  },
]

const menuEquipe = [
  {
    title: "Reuniao de equipe",
    url: "/portal-atencao-basica/reuniao-equipe",
    icon: ClipboardList,
  },
]

const menuGestao = [
  {
    title: "Agentes de Saúde",
    url: "/portal-atencao-basica/agentes",
    icon: UserCog,
  }
]

// Cor APS: oklch(0.55 0.18 160) — verde
const APS_COLOR = "oklch(0.55 0.18 160)"

export function ApsSidebarNav({ collapsed, onToggle }: ApsSidebarNavProps) {
  const pathname = usePathname()

  const isActive = (url: string) => pathname === url

  const NavItem = ({ item }: { item: { title: string; url: string; icon: React.ElementType; badge?: number } }) => {
    const Icon = item.icon
    const active = isActive(item.url)

    const content = (
      <Link
        href={item.url}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150",
          active
            ? "font-semibold"
            : "text-muted-foreground font-medium hover:bg-muted/70 hover:text-foreground",
          collapsed && "justify-center"
        )}
        style={active ? { background: "oklch(0.55 0.18 160 / 0.10)", color: APS_COLOR } : {}}
      >
        <Icon
          className={cn(
            "shrink-0 transition-colors",
            collapsed ? "h-5 w-5" : "h-4 w-4",
            !active && "text-muted-foreground group-hover:text-foreground"
          )}
          style={active ? { color: APS_COLOR } : {}}
          strokeWidth={1.25}
        />

        {!collapsed && <span className="truncate">{item.title}</span>}

        {!collapsed && item.badge && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-destructive-foreground">
            {item.badge}
          </span>
        )}
        {collapsed && item.badge && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
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

  const SectionLabel = ({ children }: { children: React.ReactNode }) => {
    if (collapsed) return null
    return (
      <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {children}
      </p>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex flex-col bg-white transition-all duration-300 ease-in-out",
          collapsed ? "w-[80px]" : "w-60"
        )}
      >
        {/* Botão flutuante de toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3.5 top-25 z-50 h-7 w-7 rounded-full bg-card cursor-pointer transition-all duration-200 hover:text-white flex items-center justify-center"
          style={{
            boxShadow: "var(--shadow-float)",
            border: "1px solid oklch(0.92 0.006 247)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = APS_COLOR)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "")}
          aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          )}
        </button>

        {/* Conteúdo do menu */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {/* Principal */}
          <div>
            <SectionLabel>Principal</SectionLabel>
            <div className="space-y-0.5">
              {menuPrincipal.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div className="mx-2 h-px bg-border" />

          {/* Alertas */}
          <div>
            <SectionLabel>Alertas</SectionLabel>
            <div className="space-y-0.5">
              {menuAlertas.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div className="mx-2 h-px bg-border" />

          {/* Monitoramento */}
          <div>
            <SectionLabel>Monitoramento</SectionLabel>
            <div className="space-y-0.5">
              {menuIndicadores.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
              {menuPacientes.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div className="mx-2 h-px bg-border" />

          {/* Visitas */}
          <div>
            <SectionLabel>Visitas</SectionLabel>
            <div className="space-y-0.5">
              {menuVisitas.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div className="mx-2 h-px bg-border" />

          {/* Equipe */}
          <div>
            <SectionLabel>Equipe</SectionLabel>
            <div className="space-y-0.5">
              {menuEquipe.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div className="mx-2 h-px bg-border" />

          {/* Gestão */}
          <div>
            <SectionLabel>Gestão</SectionLabel>
            <div className="space-y-0.5">
              {menuGestao.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Versão */}
        <div className="px-3 py-3">
          {!collapsed && (
            <p className="text-[11px] text-muted-foreground/60 text-center">v1.0.0</p>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
