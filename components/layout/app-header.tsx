"use client"

import { Bell, LogOut, User, Settings, Building2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AppHeaderProps {
  nomeUsuario?: string
  perfilUsuario?: string
  alertasPendentes?: number
}

export function AppHeader({
  nomeUsuario = "Douglas Nascimento",
  perfilUsuario = "Profissional Hospitalar",
  alertasPendentes = 0,
}: AppHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <header className="flex shrink-0 items-center gap-4 px-4 md:px-6 py-4 w-full z-50 bg-white">
      {/* Logo e Nome */}
      <div className="flex items-center gap-3">
        <Link href="/portal-hospitalar/dashboard" className="flex items-center gap-2.5">
          {/* Logo com gradiente identidade */}
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{
              background: "var(--gradient-brand)",
              boxShadow: "0 4px 12px oklch(0.38 0.19 264 / 0.30)"
            }}
          >
            <Building2 className="w-4 h-4 text-white" strokeWidth={1.25} />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold leading-tight tracking-tight" style={{ color: "#0f172a" }}>
              Saúde Búzios
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight">Sistema de Apoio à Folha de Rosto</span>
          </div>
        </Link>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted/80 cursor-pointer">
              <Bell className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.25} />
              {alertasPendentes > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-bold px-1">
                  {alertasPendentes > 9 ? "9+" : alertasPendentes}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificações</span>
              {alertasPendentes > 0 && (
                <span className="text-xs text-muted-foreground">{alertasPendentes} novos</span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/portal-hospitalar/movimentacoes" className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="font-medium text-sm">Alta hospitalar</span>
                  </div>
                  <span className="text-xs text-muted-foreground pl-4">Maria Silva Santos - há 2 horas</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/portal-hospitalar/movimentacoes" className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="font-medium text-sm">Internação urgência</span>
                  </div>
                  <span className="text-xs text-muted-foreground pl-4">José Oliveira Costa - há 5 horas</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/portal-hospitalar/movimentacoes" className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium text-sm">Resultado crítico</span>
                  </div>
                  <span className="text-xs text-muted-foreground pl-4">Ana Carolina Pereira - há 1 dia</span>
                </Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer justify-center">
              <Link href="/portal-hospitalar/movimentacoes" className="text-primary text-sm font-medium">
                Ver todas as movimentações
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Menu do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2.5 px-2 rounded-full hover:bg-muted/80 cursor-pointer">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: "1.5px solid oklch(0.38 0.19 264 / 0.2)" }}>
                <Image
                  src={import.meta.env.BASE_URL + 'images/avatar-usuario-3.png'}
                  alt="Foto de perfil"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold leading-none text-foreground">{nomeUsuario}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{perfilUsuario}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{nomeUsuario}</span>
                <span className="text-xs font-normal text-muted-foreground">{perfilUsuario}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
