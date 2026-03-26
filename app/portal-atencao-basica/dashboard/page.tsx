"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BuscaPaciente } from "@/components/busca-paciente"
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  BarChart2,
  UserCheck,
  ArrowRight,
  Baby,
  Activity,
  Pill,
  Clock,
  ChevronRight,
  TrendingUp,
  Users,
} from "lucide-react"

const APS = "oklch(0.55 0.18 160)"

const pacientesPrioritarios = [
  {
    id: "1",
    nome: "Maria das Graças Ferreira",
    motivo: "Pós-alta hospitalar",
    motivoTipo: "pos_alta",
    acs: "João Carlos",
    prazo: "Hoje",
    prazoUrgente: true,
  },
  {
    id: "2",
    nome: "Ana Lúcia Barbosa",
    motivo: "Gestante — visita mensal atrasada",
    motivoTipo: "gestante",
    acs: "Fernanda Lima",
    prazo: "Amanhã",
    prazoUrgente: true,
  },
  {
    id: "3",
    nome: "José Augusto Correia",
    motivo: "Diabético — sem visita há 35 dias",
    motivoTipo: "cronico",
    acs: "João Carlos",
    prazo: "Esta semana",
    prazoUrgente: false,
  },
  {
    id: "4",
    nome: "Rosana Melo Santos",
    motivo: "2 internações em 7 dias",
    motivoTipo: "multiplas_internacoes",
    acs: "Carla Souza",
    prazo: "Esta semana",
    prazoUrgente: false,
  },
  {
    id: "5",
    nome: "Francisco Nunes Lima",
    motivo: "Pós-alta hospitalar",
    motivoTipo: "pos_alta",
    acs: "Fernanda Lima",
    prazo: "Esta semana",
    prazoUrgente: false,
  },
]

const alertasSemResposta = [
  {
    id: "a1",
    paciente: "Maria das Graças Ferreira",
    tipo: "Alta Hospitalar",
    diasPendente: 3,
  },
  {
    id: "a2",
    paciente: "Francisco Nunes Lima",
    tipo: "Alta Hospitalar",
    diasPendente: 4,
  },
]

type MotivoTipo = "pos_alta" | "gestante" | "cronico" | "multiplas_internacoes"

const motivoConfig: Record<MotivoTipo, { label: string; bg: string; textColor: string; icon: React.ElementType; iconColor: string }> = {
  pos_alta: { label: "Pós-alta", bg: "bg-red-50", textColor: "text-red-700", icon: Activity, iconColor: "#dc2626" },
  gestante: { label: "Gestante", bg: "bg-pink-50", textColor: "text-pink-700", icon: Baby, iconColor: "#db2777" },
  cronico: { label: "Crônico", bg: "bg-amber-50", textColor: "text-amber-700", icon: Pill, iconColor: "#d97706" },
  multiplas_internacoes: { label: "Reinternação", bg: "bg-orange-50", textColor: "text-orange-700", icon: AlertTriangle, iconColor: "#ea580c" },
}

const acessoRapido = [
  { label: "Indicadores de saúde", href: "/portal-atencao-basica/indicadores", icon: BarChart2 },
  { label: "Planejar visitas", href: "/portal-atencao-basica/visitas", icon: CalendarDays },
  { label: "Agentes de saúde", href: "/portal-atencao-basica/agentes", icon: UserCheck },
  { label: "Carteira de pacientes", href: "/portal-atencao-basica/pacientes", icon: Users },
]

export default function DashboardApsPage() {
  const visitasRealizadas = 5
  const totalVisitasSemana = 12
  const cobertura = Math.round((visitasRealizadas / totalVisitasSemana) * 100)

  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="p-4 md:p-6 space-y-6">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: APS }}>
              UBS Central — Búzios
            </p>
            <h1 className="text-2xl font-semibold text-foreground">Painel da Atenção Básica</h1>
            <p className="text-sm text-muted-foreground mt-1">Semana de 09 a 15 de março de 2026</p>
          </div>
          <div className="w-full md:w-80">
            <BuscaPaciente basePath="/portal-atencao-basica" />
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Visitas */}
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Visitas na semana</p>
                  <p className="text-3xl font-bold mt-2 text-foreground">
                    {visitasRealizadas}
                    <span className="text-base font-medium text-muted-foreground">/{totalVisitasSemana}</span>
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-1">{cobertura}% realizadas</p>
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                  <CalendarDays className="w-4 h-4" style={{ color: APS }} strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${cobertura}%`, background: APS }} />
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Alertas pendentes</p>
                  <p className="text-3xl font-bold mt-2 text-foreground">2</p>
                  <p className="text-[12px] text-muted-foreground mt-1">Sem resposta</p>
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50">
                  <Bell className="w-4 h-4 text-red-500" strokeWidth={1.5} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Indicadores fora do prazo */}
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Fora do indicador</p>
                  <p className="text-3xl font-bold mt-2 text-foreground">4</p>
                  <p className="text-[12px] text-muted-foreground mt-1">Pacientes afetados</p>
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-50">
                  <BarChart2 className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cobertura mensal */}
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Cobertura mensal</p>
                  <p className="text-3xl font-bold mt-2 text-foreground">78<span className="text-base font-medium text-muted-foreground">%</span></p>
                  <p className="text-[12px] mt-1 flex items-center gap-1" style={{ color: APS }}>
                    <TrendingUp className="w-3 h-3" strokeWidth={1.5} /> +4% vs mês anterior
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                  <UserCheck className="w-4 h-4" style={{ color: APS }} strokeWidth={1.5} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Pacientes prioritários para visita */}
          <Card className="lg:col-span-2 rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                      <AlertTriangle className="w-3.5 h-3.5" style={{ color: APS }} strokeWidth={1.5} />
                    </div>
                    Prioritários para Visita
                  </CardTitle>
                  <CardDescription className="text-[13px] mt-1">
                    Pacientes que requerem visita domiciliar esta semana
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-[13px] gap-1 flex-shrink-0" style={{ color: APS }}>
                  <Link href="/portal-atencao-basica/visitas">
                    Ver agenda <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {pacientesPrioritarios.map((p) => {
                  const cfg = motivoConfig[p.motivoTipo as MotivoTipo]
                  const Icon = cfg.icon
                  return (
                    <Link
                      key={p.id}
                      href={`/portal-atencao-basica/paciente/${p.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40 hover:border-border/80 transition-all group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                        <Icon className="w-4 h-4" style={{ color: cfg.iconColor }} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground group-hover:text-[--aps] truncate transition-colors" style={{}}>
                          {p.nome}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${cfg.bg} ${cfg.textColor}`}>
                            {cfg.label}
                          </span>
                          <span className="text-[12px] text-muted-foreground truncate">ACS: {p.acs}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className={`text-[12px] font-semibold ${p.prazoUrgente ? "text-red-600" : "text-muted-foreground"}`}>
                          {p.prazo}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Painel lateral */}
          <div className="space-y-4">
            {/* Alertas sem resposta */}
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-[13px] font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-500" strokeWidth={1.5} />
                  Alertas sem resposta
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {alertasSemResposta.map((a) => (
                  <Link
                    key={a.id}
                    href="/portal-atencao-basica/alertas"
                    className="block p-3 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100/70 transition-colors"
                  >
                    <p className="text-[13px] font-semibold text-red-800 truncate">{a.paciente}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-red-600">{a.tipo}</span>
                      <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                        <Clock className="w-3 h-3" strokeWidth={1.5} /> {a.diasPendente}d sem resposta
                      </span>
                    </div>
                  </Link>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-[13px]" style={{ color: APS }} asChild>
                  <Link href="/portal-atencao-basica/alertas">
                    Ver todos os alertas <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Acesso rápido */}
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-[13px] font-semibold">Acesso Rápido</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-0.5">
                {acessoRapido.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: APS }} strokeWidth={1.5} />
                      <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                        {item.label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                    </Link>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
