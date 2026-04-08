"use client"

import Link from "next/link"
import Image from "next/image"
import { Building2, HeartPulse, LayoutDashboard, ClipboardList, ArrowRight } from "lucide-react"

const perfis = [
  {
    id: "hospitalar",
    titulo: "Portal Hospitalar",
    subtitulo: "Unidade de Internação",
    descricao:
      "Acesso para profissionais de saúde do ambiente hospitalar. Gerencie movimentações, folhas de rosto e comunicações assistenciais.",
    icone: Building2,
    cor: "oklch(0.38 0.19 264)",
    corFundo: "oklch(0.38 0.19 264 / 0.08)",
    corBorda: "oklch(0.38 0.19 264 / 0.18)",
    href: "/login/hospitalar",
    tag: "Médicos, Enfermeiros, Técnicos",
  },
  {
    id: "aps",
    titulo: "Atenção Primária",
    subtitulo: "Unidade Básica de Saúde",
    descricao:
      "Acesso para equipes das Unidades Básicas de Saúde. Acompanhe os pacientes referenciados e registre comunicações com a rede hospitalar.",
    icone: HeartPulse,
    cor: "oklch(0.55 0.18 160)",
    corFundo: "oklch(0.55 0.18 160 / 0.08)",
    corBorda: "oklch(0.55 0.18 160 / 0.18)",
    href: "/login/aps",
    tag: "Agentes, Médicos de Família, ACS",
  },
  {
    id: "administrativo",
    titulo: "Gestão e Administração",
    subtitulo: "Secretaria Municipal de Saúde",
    descricao:
      "Acesso para gestores e equipes administrativas. Visualize indicadores, relatórios e gerencie os recursos da rede de saúde.",
    icone: LayoutDashboard,
    cor: "oklch(0.50 0.14 280)",
    corFundo: "oklch(0.50 0.14 280 / 0.08)",
    corBorda: "oklch(0.50 0.14 280 / 0.18)",
    href: "/login/administrativo",
    tag: "Gestores, Coordenadores, Secretaria",
  },
  {
    id: "recepcao",
    titulo: "Portal de Recepção",
    subtitulo: "Recepção e Atendimento",
    descricao:
      "Acesso para recepcionistas. Gerencie o fluxo de chegada de pacientes e o atendimento administrativo da unidade.",
    icone: ClipboardList,
    cor: "oklch(0.62 0.15 50)",
    corFundo: "oklch(0.62 0.15 50 / 0.08)",
    corBorda: "oklch(0.62 0.15 50 / 0.18)",
    href: "/login/recepcao",
    tag: "Recepcionistas",
  },
]

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Fundo hospitalar */}
      <Image
        src={import.meta.env.BASE_URL + 'images/hospital-bg.jpg'}
        alt="Hospital Saúde Búzios"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Overlay — azul escuro moderado, coerente com as páginas de login */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(160deg, rgba(0,18,76,0.72) 0%, rgba(0,47,140,0.60) 60%, rgba(0,71,187,0.45) 100%)",
        }}
      />

      <div className="relative z-20 w-full max-w-6xl px-4 sm:px-8 md:px-12 py-10 md:py-16 flex flex-col items-center gap-10 md:gap-14">
        {/* Cabeçalho */}
        <div className="text-center flex flex-col items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}
          >
            <HeartPulse className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">
            Prefeitura Municipal de Búzios
          </p>
          <h1 className="text-white font-bold text-2xl md:text-3xl tracking-tight text-balance">
            Saúde Búzios
          </h1>
          <p className="text-white/70 text-sm max-w-sm text-center leading-relaxed">
            Selecione o portal de acesso correspondente ao seu perfil de atuação na rede municipal de saúde.
          </p>
        </div>

        {/* Cards de perfil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
          {perfis.map((perfil) => {
            const Icone = perfil.icone
            return (
              <Link
                key={perfil.id}
                href={perfil.href}
                className="group relative flex flex-col gap-6 p-7 sm:p-8 rounded-[24px] transition-all duration-300 cursor-pointer"
                style={{
                  background: "oklch(1 0 0 / 0.75)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: `1px solid ${perfil.corBorda}`,
                  boxShadow: "0 4px 24px oklch(0.38 0.19 264 / 0.08)",
                }}
              >
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `${perfil.corFundo}` }}
                />

                {/* Ícone */}
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: perfil.corFundo, border: `1px solid ${perfil.corBorda}` }}
                >
                  <Icone className="w-6 h-6" style={{ color: perfil.cor }} strokeWidth={1.5} />
                </div>

                {/* Texto */}
                <div className="relative flex flex-col gap-2 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: perfil.cor }}>
                    {perfil.subtitulo}
                  </p>
                  <h2 className="text-foreground font-bold text-[17px] leading-tight">
                    {perfil.titulo}
                  </h2>
                  <p className="text-muted-foreground text-[13px] leading-relaxed mt-0.5">
                    {perfil.descricao}
                  </p>
                </div>

                {/* Tag e seta */}
                <div className="relative flex items-center justify-between mt-auto">
                  <span
                    className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{ background: perfil.corFundo, color: perfil.cor }}
                  >
                    {perfil.tag}
                  </span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                    style={{ background: perfil.corFundo, border: `1px solid ${perfil.corBorda}` }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: perfil.cor }} strokeWidth={2} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Rodapé */}
        <p className="text-white/45 text-[11px] text-center">
          Secretaria Municipal de Saúde de Búzios &middot; Sistema desenvolvido pela KAminer &middot; 2026
        </p>
      </div>
    </main>
  )
}
