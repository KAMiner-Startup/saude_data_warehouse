"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, LogOut, User, Settings, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"

interface AdminHeaderProps {
  nomeUsuario?: string
  perfilUsuario?: string
  alertasPendentes?: number
}

export function AdminHeader({
  nomeUsuario = "Valdir Cabral",
  perfilUsuario = "Gestor Administrativo",
  alertasPendentes = 0,
}: AdminHeaderProps) {
  const router = useRouter()
  const [notifOpen, setNotifOpen] = useState(false)

  const iniciais = nomeUsuario
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-border flex-shrink-0" style={{ boxShadow: "0 1px 0 var(--border)" }}>
      {/* Breadcrumb / título */}
      <div className="flex items-center gap-2">
        <Link href="/portal-administrativo/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <LayoutDashboard className="w-4 h-4" style={{ color: ADMIN_COLOR }} strokeWidth={1.5} />
          <span className="text-[13px] font-semibold" style={{ color: ADMIN_COLOR }}>Portal Administrativo</span>
        </Link>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2">
        {/* Notificações */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-xl">
              <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              {alertasPendentes > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                  style={{ background: ADMIN_COLOR }}
                >
                  {alertasPendentes}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificações</span>
              {alertasPendentes > 0 && (
                <span className="text-xs text-muted-foreground">{alertasPendentes} novas</span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/portal-administrativo/monitoramento" className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="font-medium text-sm">5 alertas sem resposta da APS</span>
                  </div>
                  <span className="text-xs text-muted-foreground pl-4">há 1 hora</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/portal-administrativo/usuarios" className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: ADMIN_COLOR }} />
                    <span className="font-medium text-sm">Novo usuário aguardando aprovação</span>
                  </div>
                  <span className="text-xs text-muted-foreground pl-4">há 3 horas</span>
                </Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer justify-center">
              <Link href="/portal-administrativo/monitoramento" className="text-sm font-medium" style={{ color: ADMIN_COLOR }}>
                Ver monitoramento completo
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Perfil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-8 px-2 rounded-xl hover:bg-muted/60">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/images/avatar-usuario-3.png" alt={nomeUsuario} className="object-cover" />
                <AvatarFallback className="text-[10px] font-bold text-white" style={{ background: ADMIN_COLOR }}>
                  {iniciais}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-[12px] font-semibold text-foreground leading-none">{nomeUsuario}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{perfilUsuario}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl">
            <DropdownMenuLabel className="font-normal flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/images/avatar-usuario-3.png" alt={nomeUsuario} className="object-cover" />
                <AvatarFallback className="text-[11px] font-bold text-white" style={{ background: ADMIN_COLOR }}>
                  {iniciais}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{nomeUsuario}</p>
                <p className="text-xs text-muted-foreground">{perfilUsuario}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-[13px]">
              <User className="mr-2 h-4 w-4" strokeWidth={1.5} /> Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer text-[13px]">
              <Link href="/portal-administrativo/configuracoes">
                <Settings className="mr-2 h-4 w-4" strokeWidth={1.5} /> Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive text-[13px]"
              onClick={() => router.push("/")}
            >
              <LogOut className="mr-2 h-4 w-4" strokeWidth={1.5} /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
