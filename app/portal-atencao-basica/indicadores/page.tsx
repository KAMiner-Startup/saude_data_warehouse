"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Baby, Pill, Activity, AlertTriangle, Heart, Brain, ChevronRight, Users,
  TrendingDown, TrendingUp, Minus, Plus, Info, MapPin, FlaskConical, Bell,
  ShieldCheck, ShieldAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from "recharts"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

const APS = "oklch(0.55 0.18 160)"

type AbaIndicador = "todos" | "prioritarios" | "fora_prazo"

interface Indicador {
  id: string
  nome: string
  grupo: string
  descricao: string
  fonte: string                    // RF-FE-08.02
  total: number
  cobertura: number
  metaMes: number
  foraPrazo: number
  tendencia: "up" | "down" | "stable"
  icon: React.ElementType
  cor: string
  corBg: string
  controlados?: number             // RF-FE-08.05
  descontrolados?: number          // RF-FE-08.05
  examesVencidos?: number          // RF-FE-08.04
  historico: { mes: string; valor: number; meta: number }[]  // RF-FE-08.11
  pacientes: { id: string; nome: string; diasAtraso: number; acs: string }[]
}

const indicadores: Indicador[] = [
  {
    id: "gestantes",
    nome: "Acompanhamento de Gestantes",
    grupo: "Prioritário",
    descricao: "Visita domiciliar mensal obrigatória",
    fonte: "PHPN — Ministério da Saúde",
    total: 12,
    cobertura: 67,
    metaMes: 100,
    foraPrazo: 4,
    tendencia: "up",
    icon: Baby,
    cor: "#db2777",
    corBg: "bg-pink-50",
    historico: [
      { mes: "Out", valor: 50, meta: 100 },
      { mes: "Nov", valor: 55, meta: 100 },
      { mes: "Dez", valor: 58, meta: 100 },
      { mes: "Jan", valor: 62, meta: 100 },
      { mes: "Fev", valor: 65, meta: 100 },
      { mes: "Mar", valor: 67, meta: 100 },
    ],
    pacientes: [
      { id: "2",  nome: "Ana Lúcia Barbosa",   diasAtraso: 38, acs: "Fernanda Lima" },
      { id: "7",  nome: "Célia Regina Moura",  diasAtraso: 32, acs: "João Carlos" },
      { id: "11", nome: "Patrícia Souza",       diasAtraso: 12, acs: "Carla Souza" },
      { id: "15", nome: "Mariane Costa",        diasAtraso: 8,  acs: "Fernanda Lima" },
    ],
  },
  {
    id: "diabetes",
    nome: "Diabéticos — Acompanhamento Trimestral",
    grupo: "Prioritário",
    descricao: "Consulta ou visita a cada 90 dias",
    fonte: "LINHAS DE CUIDADO — Ministério da Saúde (2013)",
    total: 34,
    cobertura: 82,
    metaMes: 90,
    foraPrazo: 6,
    tendencia: "stable",
    icon: Pill,
    cor: "#d97706",
    corBg: "bg-amber-50",
    controlados: 22,               // RF-FE-08.05
    descontrolados: 12,            // RF-FE-08.05
    examesVencidos: 9,             // RF-FE-08.04
    historico: [
      { mes: "Out", valor: 78, meta: 90 },
      { mes: "Nov", valor: 80, meta: 90 },
      { mes: "Dez", valor: 79, meta: 90 },
      { mes: "Jan", valor: 81, meta: 90 },
      { mes: "Fev", valor: 83, meta: 90 },
      { mes: "Mar", valor: 82, meta: 90 },
    ],
    pacientes: [
      { id: "3",  nome: "José Augusto Correia", diasAtraso: 35, acs: "João Carlos" },
      { id: "8",  nome: "Antônio Gomes",         diasAtraso: 28, acs: "Carla Souza" },
      { id: "12", nome: "Rita de Cássia",         diasAtraso: 22, acs: "Fernanda Lima" },
      { id: "16", nome: "Benedito Alves",          diasAtraso: 15, acs: "João Carlos" },
      { id: "18", nome: "Elza Ferreira",            diasAtraso: 10, acs: "Carla Souza" },
      { id: "20", nome: "Orlando Neves",            diasAtraso: 5,  acs: "Fernanda Lima" },
    ],
  },
  {
    id: "hemoglobina_glicada",
    nome: "Hemoglobina Glicada — Diabéticos",
    grupo: "Exame Periódico",
    descricao: "Exame semestral obrigatório para diabéticos em acompanhamento",
    fonte: "Diretriz SBD / LINHAS DE CUIDADO — Ministério da Saúde",
    total: 34,
    cobertura: 62,
    metaMes: 85,
    foraPrazo: 13,
    tendencia: "down",
    icon: FlaskConical,
    cor: "#0284c7",
    corBg: "bg-sky-50",
    examesVencidos: 13,            // RF-FE-08.04
    historico: [
      { mes: "Out", valor: 70, meta: 85 },
      { mes: "Nov", valor: 68, meta: 85 },
      { mes: "Dez", valor: 66, meta: 85 },
      { mes: "Jan", valor: 65, meta: 85 },
      { mes: "Fev", valor: 63, meta: 85 },
      { mes: "Mar", valor: 62, meta: 85 },
    ],
    pacientes: [
      { id: "3",  nome: "José Augusto Correia", diasAtraso: 210, acs: "João Carlos" },
      { id: "8",  nome: "Antônio Gomes",         diasAtraso: 195, acs: "Carla Souza" },
      { id: "12", nome: "Rita de Cássia",         diasAtraso: 180, acs: "Fernanda Lima" },
      { id: "16", nome: "Benedito Alves",          diasAtraso: 160, acs: "João Carlos" },
      { id: "18", nome: "Elza Ferreira",            diasAtraso: 140, acs: "Carla Souza" },
    ],
  },
  {
    id: "pos_alta",
    nome: "Pós-Alta Hospitalar",
    grupo: "Prioritário",
    descricao: "Visita domiciliar em até 7 dias após alta",
    fonte: "Nota Técnica DAB — Ministério da Saúde",
    total: 8,
    cobertura: 50,
    metaMes: 100,
    foraPrazo: 4,
    tendencia: "down",
    icon: Activity,
    cor: "#dc2626",
    corBg: "bg-red-50",
    historico: [
      { mes: "Out", valor: 75, meta: 100 },
      { mes: "Nov", valor: 70, meta: 100 },
      { mes: "Dez", valor: 63, meta: 100 },
      { mes: "Jan", valor: 58, meta: 100 },
      { mes: "Fev", valor: 55, meta: 100 },
      { mes: "Mar", valor: 50, meta: 100 },
    ],
    pacientes: [
      { id: "1",  nome: "Maria das Graças Ferreira", diasAtraso: 3, acs: "João Carlos" },
      { id: "5",  nome: "Francisco Nunes Lima",       diasAtraso: 4, acs: "Fernanda Lima" },
      { id: "9",  nome: "Severino Ramos",               diasAtraso: 6, acs: "Carla Souza" },
      { id: "13", nome: "Conceição Pereira",            diasAtraso: 2, acs: "João Carlos" },
    ],
  },
  {
    id: "hipertensao",
    nome: "Hipertensos — Acompanhamento Semestral",
    grupo: "Crônico",
    descricao: "Consulta ou visita a cada 180 dias",
    fonte: "LINHAS DE CUIDADO — Ministério da Saúde (2013)",
    total: 58,
    cobertura: 91,
    metaMes: 90,
    foraPrazo: 5,
    tendencia: "up",
    icon: Heart,
    cor: "#7c3aed",
    corBg: "bg-violet-50",
    controlados: 46,               // RF-FE-08.05
    descontrolados: 12,            // RF-FE-08.05
    historico: [
      { mes: "Out", valor: 83, meta: 90 },
      { mes: "Nov", valor: 85, meta: 90 },
      { mes: "Dez", valor: 86, meta: 90 },
      { mes: "Jan", valor: 88, meta: 90 },
      { mes: "Fev", valor: 90, meta: 90 },
      { mes: "Mar", valor: 91, meta: 90 },
    ],
    pacientes: [
      { id: "4",  nome: "Rosana Melo Santos", diasAtraso: 12, acs: "Carla Souza" },
      { id: "6",  nome: "João Batista Neto",   diasAtraso: 8,  acs: "Fernanda Lima" },
      { id: "10", nome: "Neide Aparecida",      diasAtraso: 6,  acs: "João Carlos" },
      { id: "14", nome: "Valter Hugo",           diasAtraso: 3,  acs: "Carla Souza" },
      { id: "17", nome: "Sueli Gonçalves",       diasAtraso: 2,  acs: "Fernanda Lima" },
    ],
  },
  {
    id: "saude_mental",
    nome: "Saúde Mental — Monitoramento Mensal",
    grupo: "Especializado",
    descricao: "Acompanhamento mensal de pacientes em vulnerabilidade",
    fonte: "Rede de Atenção Psicossocial (RAPS) — Ministério da Saúde",
    total: 18,
    cobertura: 72,
    metaMes: 85,
    foraPrazo: 5,
    tendencia: "stable",
    icon: Brain,
    cor: "#0891b2",
    corBg: "bg-cyan-50",
    historico: [
      { mes: "Out", valor: 70, meta: 85 },
      { mes: "Nov", valor: 71, meta: 85 },
      { mes: "Dez", valor: 73, meta: 85 },
      { mes: "Jan", valor: 72, meta: 85 },
      { mes: "Fev", valor: 71, meta: 85 },
      { mes: "Mar", valor: 72, meta: 85 },
    ],
    pacientes: [
      { id: "19", nome: "Luciana Barros",   diasAtraso: 20, acs: "João Carlos" },
      { id: "21", nome: "Marcos Pinheiro",  diasAtraso: 14, acs: "Fernanda Lima" },
      { id: "22", nome: "Débora Lima",      diasAtraso: 10, acs: "Carla Souza" },
      { id: "23", nome: "Gilberto Cunha",   diasAtraso: 5,  acs: "João Carlos" },
      { id: "24", nome: "Nilza Carvalho",   diasAtraso: 2,  acs: "Fernanda Lima" },
    ],
  },
  {
    id: "reinternacoes",
    nome: "Múltiplas Internações",
    grupo: "Vigilância",
    descricao: "Pacientes com 2+ internações em 30 dias",
    fonte: "Programa Nacional de Segurança do Paciente — Ministério da Saúde",
    total: 5,
    cobertura: 40,
    metaMes: 100,
    foraPrazo: 3,
    tendencia: "down",
    icon: AlertTriangle,
    cor: "#ea580c",
    corBg: "bg-orange-50",
    historico: [
      { mes: "Out", valor: 80, meta: 100 },
      { mes: "Nov", valor: 70, meta: 100 },
      { mes: "Dez", valor: 60, meta: 100 },
      { mes: "Jan", valor: 55, meta: 100 },
      { mes: "Fev", valor: 45, meta: 100 },
      { mes: "Mar", valor: 40, meta: 100 },
    ],
    pacientes: [
      { id: "4",  nome: "Rosana Melo Santos", diasAtraso: 5, acs: "Carla Souza" },
      { id: "25", nome: "Isaura Santos",        diasAtraso: 3, acs: "João Carlos" },
      { id: "26", nome: "Edmilson Freitas",     diasAtraso: 1, acs: "Fernanda Lima" },
    ],
  },
]

const tendenciaConfig = {
  up:     { icon: TrendingUp,   cor: "text-green-600", label: "Melhorando" },
  down:   { icon: TrendingDown, cor: "text-red-600",   label: "Piorando"   },
  stable: { icon: Minus,        cor: "text-muted-foreground", label: "Estável" },
}

// ─── Tooltip personalizado para recharts ───────────────────────────────────
function TooltipCustom({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2 shadow-lg text-[12px]">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}%</span>
        </p>
      ))}
    </div>
  )
}

// ─── Seção de gráfico de visão geral (RF-FE-08.07) ────────────────────────
function GraficoVisaoGeral({ dados }: { dados: Indicador[] }) {
  const chartData = dados.map((ind) => ({
    nome: ind.nome.split(" — ")[0].split(" — ")[0].replace("Acompanhamento de ", "").replace(" — Acompanhamento Trimestral", "").replace(" — Acompanhamento Semestral", "").replace(" — Monitoramento Mensal", ""),
    cobertura: ind.cobertura,
    meta: ind.metaMes,
  }))

  return (
    <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-semibold text-foreground">
          Cobertura vs Meta — Todos os Alertas
        </CardTitle>
        <CardDescription className="text-[12px]">
          Comparativo de cobertura atual com a meta mensal por indicador
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="nome"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<TooltipCustom />} />
            <Bar dataKey="cobertura" name="Cobertura" fill="oklch(0.55 0.18 160)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="meta"      name="Meta"      fill="oklch(0.55 0.18 160 / 0.20)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 justify-center mt-2">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "oklch(0.55 0.18 160)" }} />
            Cobertura atual
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "oklch(0.55 0.18 160 / 0.30)" }} />
            Meta mensal
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Gráfico de histórico dentro do card expandido (RF-FE-08.11) ──────────
function GraficoHistorico({ historico, cor }: { historico: Indicador["historico"]; cor: string }) {
  return (
    <div className="mt-3">
      <p className="text-[12px] font-semibold text-muted-foreground mb-2">Evolução dos últimos 6 meses</p>
      <ResponsiveContainer width="100%" height={130}>
        <AreaChart data={historico} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${cor.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={cor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={cor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<TooltipCustom />} />
          <Area
            type="monotone"
            dataKey="meta"
            name="Meta"
            stroke="var(--border)"
            strokeDasharray="4 2"
            strokeWidth={1.5}
            fill="none"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="valor"
            name="Cobertura"
            stroke={cor}
            strokeWidth={2}
            fill={`url(#grad-${cor.replace(/[^a-z0-9]/gi, "")})`}
            dot={{ fill: cor, strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: cor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Bloco de controle clínico (RF-FE-08.05) ──────────────────────────────
function BlocoControleClinico({ ind }: { ind: Indicador }) {
  if (ind.controlados === undefined || ind.descontrolados === undefined) return null
  const total = ind.controlados + ind.descontrolados
  const pctControlados = Math.round((ind.controlados / total) * 100)

  return (
    <div className="mt-3 p-3 rounded-xl border border-border bg-background space-y-2">
      <p className="text-[12px] font-semibold text-foreground">Controle clínico da condição</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-green-600" strokeWidth={1.5} />
          <span className="text-[12px] font-bold text-green-700">{ind.controlados}</span>
          <span className="text-[11px] text-muted-foreground">controlados</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-red-600" strokeWidth={1.5} />
          <span className="text-[12px] font-bold text-red-700">{ind.descontrolados}</span>
          <span className="text-[11px] text-muted-foreground">descontrolados</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden flex">
        <div className="h-full rounded-l-full bg-green-500 transition-all" style={{ width: `${pctControlados}%` }} />
        <div className="h-full rounded-r-full bg-red-400 transition-all" style={{ width: `${100 - pctControlados}%` }} />
      </div>
      <p className="text-[11px] text-muted-foreground">{pctControlados}% dos pacientes com a condição controlada</p>
    </div>
  )
}

// ─── Alerta de exames vencidos (RF-FE-08.04) ──────────────────────────────
function AlertaExamesVencidos({ ind }: { ind: Indicador }) {
  if (!ind.examesVencidos) return null
  return (
    <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-100">
      <FlaskConical className="w-4 h-4 text-sky-600 flex-shrink-0" strokeWidth={1.5} />
      <p className="text-[12px] text-sky-700">
        <span className="font-bold">{ind.examesVencidos}</span> paciente(s) com exame periódico vencido ou nunca realizado
      </p>
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────
export default function IndicadoresPage() {
  const [aba, setAba] = useState<AbaIndicador>("todos")
  const [expandido, setExpandido] = useState<string | null>(null)

  const indicadoresFiltrados = indicadores.filter((ind) => {
    if (aba === "prioritarios") return ind.grupo === "Prioritário"
    if (aba === "fora_prazo")   return ind.cobertura < ind.metaMes
    return true
  })

  const totalForaPrazo  = indicadores.reduce((acc, i) => acc + i.foraPrazo, 0)
  const coberturaMedia  = Math.round(indicadores.reduce((acc, i) => acc + i.cobertura, 0) / indicadores.length)

  // RF-FE-08.10 — gerar alerta a partir do indicador
  function gerarAlerta(nomePaciente: string, nomeIndicador: string) {
    toast.success("Alerta gerado com sucesso", {
      description: `${nomePaciente} — ${nomeIndicador}`,
    })
  }

  function gerarAlertasEmMassa(ind: Indicador) {
    toast.success(`${ind.foraPrazo} alerta(s) gerado(s)`, {
      description: `Todos os pacientes fora do prazo em "${ind.nome}" foram notificados.`,
    })
  }

  return (
    <>
      <Toaster position="bottom-right" />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6">

          {/* Cabeçalho — RF-FE-08.13 (unidade) + RF-FE-08.02 (fonte oficial) */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5" style={{ color: APS }} strokeWidth={1.5} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: APS }}>
                  UBS Central de Búzios — Monitoramento
                </p>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Alertas Assistenciais</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitoramento de cobertura e acompanhamento por grupo prioritário
              </p>
            </div>
            {/* Selo de conformidade ministerial */}
            <div
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl self-start flex-shrink-0"
              style={{ background: "oklch(0.55 0.18 160 / 0.08)", border: "1px solid oklch(0.55 0.18 160 / 0.20)" }}
            >
              <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: APS }} strokeWidth={1.5} />
              <span className="text-[11px] font-semibold" style={{ color: APS }}>
                Critérios definidos pelo Ministério da Saúde
              </span>
            </div>
          </div>

          {/* Resumo executivo */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Alertas ativos</p>
                <p className="text-3xl font-bold mt-2 text-foreground">{indicadores.length}</p>
              </CardContent>
            </Card>
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Cobertura média</p>
                <p className="text-3xl font-bold mt-2 text-foreground">
                  {coberturaMedia}<span className="text-base font-medium text-muted-foreground">%</span>
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Pacientes fora do prazo</p>
                <p className="text-3xl font-bold mt-2 text-red-600">{totalForaPrazo}</p>
              </CardContent>
            </Card>
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Metas cumpridas</p>
                <p className="text-3xl font-bold mt-2 text-foreground">
                  {indicadores.filter(i => i.cobertura >= i.metaMes).length}
                  <span className="text-base font-medium text-muted-foreground">/{indicadores.length}</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de visão geral — RF-FE-08.07 */}
          <GraficoVisaoGeral dados={indicadores} />

          {/* Abas */}
          <div className="flex gap-2 border-b border-border pb-0">
            {(["todos", "prioritarios", "fora_prazo"] as AbaIndicador[]).map((a) => {
              const labels: Record<AbaIndicador, string> = {
                todos:       "Todos os alertas",
                prioritarios: "Grupos prioritários",
                fora_prazo:  "Fora da meta",
              }
              return (
                <button
                  key={a}
                  onClick={() => setAba(a)}
                  className={cn(
                    "px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-px",
                    aba === a
                      ? "border-[var(--aps)] text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                  style={aba === a ? { borderColor: APS } : {}}
                >
                  {labels[a]}
                  {a === "fora_prazo" && (
                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-700">
                      {indicadores.filter(i => i.cobertura < i.metaMes).length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Lista de indicadores */}
          <div className="space-y-3">
            {indicadoresFiltrados.map((ind) => {
              const Icon      = ind.icon
              const Tendencia = tendenciaConfig[ind.tendencia].icon
              const isExpanded  = expandido === ind.id
              const metaCumprida = ind.cobertura >= ind.metaMes

              return (
                <Card key={ind.id} className="rounded-[20px] border-none overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>

                  {/* Cabeçalho do card */}
                  <button
                    className="w-full text-left p-5 hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandido(isExpanded ? null : ind.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ind.corBg}`}>
                        <Icon className="w-5 h-5" style={{ color: ind.cor }} strokeWidth={1.5} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[14px] font-semibold text-foreground">{ind.nome}</p>
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                            style={{ background: `${ind.cor}18`, color: ind.cor }}
                          >
                            {ind.grupo}
                          </span>
                        </div>
                        {/* Fonte oficial — RF-FE-08.02 */}
                        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Info className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
                          {ind.descricao}
                          <span className="text-muted-foreground/60 mx-1">·</span>
                          <span className="text-[10px]">{ind.fonte}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        {/* Cobertura */}
                        <div className="text-right hidden sm:block">
                          <p className="text-[11px] text-muted-foreground">Cobertura</p>
                          <p className={cn("text-lg font-bold", metaCumprida ? "text-green-600" : "text-red-600")}>
                            {ind.cobertura}%
                          </p>
                          <p className="text-[10px] text-muted-foreground">meta: {ind.metaMes}%</p>
                        </div>

                        {/* Fora do prazo */}
                        <div className="text-right hidden md:block">
                          <p className="text-[11px] text-muted-foreground">Fora do prazo</p>
                          <p className="text-lg font-bold text-red-600">{ind.foraPrazo}</p>
                          <p className="text-[10px] text-muted-foreground">de {ind.total} pac.</p>
                        </div>

                        {/* Tendência — RF-FE-08.11 */}
                        <div className={cn("flex items-center gap-1 text-[12px] font-medium hidden lg:flex", tendenciaConfig[ind.tendencia].cor)}>
                          <Tendencia className="w-4 h-4" strokeWidth={1.5} />
                          {tendenciaConfig[ind.tendencia].label}
                        </div>

                        <ChevronRight className={cn("w-5 h-5 text-muted-foreground/50 transition-transform", isExpanded && "rotate-90")} />
                      </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${ind.cobertura}%`, background: metaCumprida ? "#16a34a" : ind.cor }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground flex-shrink-0">
                        {Math.round((ind.cobertura / 100) * ind.total)}/{ind.total} acompanhados
                      </span>
                    </div>
                  </button>

                  {/* Painel expandido */}
                  {isExpanded && (
                    <div className="border-t border-border px-5 py-4 bg-muted/20 space-y-4">

                      {/* Controle clínico — RF-FE-08.05 */}
                      <BlocoControleClinico ind={ind} />

                      {/* Exames vencidos — RF-FE-08.04 */}
                      <AlertaExamesVencidos ind={ind} />

                      {/* Histórico / evolução — RF-FE-08.11 */}
                      <GraficoHistorico historico={ind.historico} cor={ind.cor} />

                      {/* Pacientes fora do prazo — RF-FE-08.08 / RF-FE-08.09 */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[13px] font-semibold text-foreground flex items-center gap-2">
                            <Users className="w-4 h-4" style={{ color: APS }} strokeWidth={1.5} />
                            Pacientes fora do prazo — {ind.foraPrazo} identificados
                          </p>
                          <div className="flex items-center gap-2">
                            {/* RF-FE-08.10 — Gerar alertas em massa */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[12px] rounded-xl gap-1"
                              style={{ borderColor: "oklch(0.59 0.20 25 / 0.40)", color: "#dc2626" }}
                              onClick={() => gerarAlertasEmMassa(ind)}
                            >
                              <Bell className="w-3.5 h-3.5" />
                              Gerar alertas ({ind.foraPrazo})
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[12px] rounded-xl gap-1"
                              style={{ borderColor: `${APS}40`, color: APS }}
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Planejar visitas
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {ind.pacientes.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-background border border-border"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Link
                                  href={`/portal-atencao-basica/paciente/${p.id}`}
                                  className="text-[13px] font-semibold text-foreground hover:underline truncate"
                                  style={{}}
                                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = APS)}
                                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "")}
                                >
                                  {p.nome}
                                </Link>
                                <span className="text-[12px] text-muted-foreground flex-shrink-0">ACS: {p.acs}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={cn(
                                  "text-[12px] font-semibold px-2 py-1 rounded-lg",
                                  p.diasAtraso >= 30 ? "bg-red-100 text-red-700"
                                  : p.diasAtraso >= 14 ? "bg-amber-100 text-amber-700"
                                  : "bg-orange-100 text-orange-700"
                                )}>
                                  {p.diasAtraso}d em atraso
                                </span>
                                {/* RF-FE-08.10 — Gerar alerta individual */}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 rounded-lg text-[11px] text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                  onClick={() => gerarAlerta(p.nome, ind.nome)}
                                  title="Gerar alerta para este paciente"
                                >
                                  <Bell className="w-3.5 h-3.5" />
                                </Button>
                                <Link href={`/portal-atencao-basica/paciente/${p.id}`}>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

        </div>
      </main>
    </>
  )
}
