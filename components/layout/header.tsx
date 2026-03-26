"use client"

import { Bell, Building2, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  nomeUsuario?: string
  perfilUsuario?: string
  alertasPendentes?: number
}

export function Header({ 
  nomeUsuario = "Usuário", 
  perfilUsuario = "Profissional Hospitalar",
  alertasPendentes = 0 
}: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Logo e Nome */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground hidden sm:block">Saúde Búzios</span>
        </div>

        {/* Ações e Menu do Usuário */}
        <div className="flex items-center gap-2">
          {/* Notificações */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {alertasPendentes > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
                {alertasPendentes > 9 ? "9+" : alertasPendentes}
              </span>
            )}
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-none">{nomeUsuario}</p>
                  <p className="text-xs text-muted-foreground">{perfilUsuario}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
