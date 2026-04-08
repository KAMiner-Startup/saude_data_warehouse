"use client"

import { LogOut, User, Settings, ClipboardList } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface RecepcaoHeaderProps {
  nomeUsuario?: string
  perfilUsuario?: string
}

export function RecepcaoHeader({
  nomeUsuario = "Recepcionista",
  perfilUsuario = "Recepção",
}: RecepcaoHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <header className="flex shrink-0 items-center gap-4 px-4 md:px-6 py-4 w-full z-50 bg-white">
      {/* Logo e Nome */}
      <div className="flex items-center gap-3">
        <Link href="/portal-recepcao/dashboard" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
              boxShadow: "0 4px 12px oklch(0.62 0.15 50 / 0.30)",
            }}
          >
            <ClipboardList className="w-4 h-4 text-white" strokeWidth={1.25} />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold leading-tight tracking-tight" style={{ color: "#0f172a" }}>
              Saúde Búzios
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight">Portal de Recepção</span>
          </div>
        </Link>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Menu do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2.5 px-2 rounded-full hover:bg-muted/80 cursor-pointer">
              <div
                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: `1.5px solid oklch(0.62 0.15 50 / 0.2)` }}
              >
                <Image
                  src={import.meta.env.BASE_URL + 'images/avatar-usuario-2.png'}
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
