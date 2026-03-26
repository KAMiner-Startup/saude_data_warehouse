"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Lock, User, Eye, EyeOff, ShieldCheck, BarChart3, Settings, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

export default function LoginAdministrativoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/portal-administrativo/dashboard")
    }, 800)
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Fundo administrativo */}
      <Image
        src="/images/admin-bg.jpg"
        alt="Secretaria Municipal de Saúde"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Overlay gradiente violeta */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, rgba(46,16,101,0.84) 0%, rgba(88,28,135,0.70) 35%, rgba(126,34,206,0.40) 60%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      {/* Botão voltar */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-white text-[13px] font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Trocar perfil
      </Link>

      {/* Conteúdo principal */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">

        {/* Lado esquerdo: identidade */}
        <div className="flex-1 text-white max-w-xl">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)",
                boxShadow: "0 4px 20px rgba(126,34,206,0.50)",
              }}
            >
              <LayoutDashboard className="w-5 h-5 text-white" strokeWidth={1.25} />
            </div>
            <span className="text-base font-semibold tracking-tight text-white/90">
              Saúde Búzios
            </span>
          </div>

          {/* Headline */}
          <div className="mb-8">
            <p className="text-white/70 text-[12px] font-semibold uppercase tracking-[0.18em] mb-3">
              Gestão e Administração
            </p>
            <h1
              className="font-bold text-white leading-[1.15] tracking-tight mb-4"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                textShadow: "0 2px 16px rgba(0,0,0,0.35)",
              }}
            >
              Portal de Gestão Municipal
            </h1>
            <p className="text-white/75 text-sm leading-relaxed max-w-xs">
              Visualize indicadores, acesse relatórios e gerencie os recursos da rede municipal de saúde.
            </p>
          </div>

          {/* Diferenciais */}
          <div className="flex flex-col gap-3 mt-9">
            {[
              { Icon: ShieldCheck, label: "Acesso seguro e auditado (LGPD)" },
              { Icon: BarChart3, label: "Indicadores e relatórios gerenciais" },
              { Icon: Settings, label: "Gestão da rede de serviços de saúde" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <Icon className="w-3.5 h-3.5 text-white/80" strokeWidth={1.25} />
                </div>
                <span className="text-white/70 text-[13px]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card de login */}
        <div
          className="w-full max-w-[380px] rounded-[24px] p-8 shrink-0"
          style={{
            background: "rgba(255,255,255,0.11)",
            backdropFilter: "blur(48px)",
            WebkitBackdropFilter: "blur(48px)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <div className="mb-7">
            <h2 className="text-[1.25rem] font-bold text-white tracking-tight mb-1 leading-tight">
              Bem-vindo de volta
            </h2>
            <p className="text-white/80 text-[13px]">
              Insira suas credenciais para acessar o portal de gestão
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-white/90 text-[12px] font-semibold uppercase tracking-widest">
                Usuário
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/65" strokeWidth={1.25} />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  className="pl-10 rounded-xl h-11 text-white placeholder:text-white/50 focus-visible:ring-white/25 focus-visible:ring-2"
                  style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", color: "white" }}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/90 text-[12px] font-semibold uppercase tracking-widest">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/65" strokeWidth={1.25} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  className="pl-10 pr-11 rounded-xl h-11 placeholder:text-white/55 focus-visible:ring-white/25 focus-visible:ring-2"
                  style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", color: "white" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/45 hover:text-white/80 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.25} /> : <Eye className="h-4 w-4" strokeWidth={1.25} />}
                </button>
              </div>
            </div>

            <div className="text-right -mt-1">
              <button type="button" className="text-[12px] text-white/75 hover:text-white transition-colors cursor-pointer underline underline-offset-2">
                Esqueci minha senha
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-full font-bold text-sm tracking-widest cursor-pointer transition-opacity disabled:opacity-70 mt-1 mb-2"
              style={{
                background: "linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)",
                boxShadow: "0 4px 20px rgba(126,34,206,0.50)",
                border: "none",
                color: "white",
              }}
            >
              {isLoading ? "ENTRANDO..." : "ENTRAR"}
            </Button>
          </form>

          <p className="text-center text-[11px] text-white/60 leading-relaxed">
            Acesso restrito a profissionais autorizados.
            <br />
            Desenvolvido pela KAminer &copy; 2026
          </p>
        </div>
      </div>
    </main>
  )
}
