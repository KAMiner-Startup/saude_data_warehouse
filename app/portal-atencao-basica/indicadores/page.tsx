"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Baby,
  Pill,
  Activity,
  AlertTriangle,
  Heart,
  Brain,
  ChevronRight,
  Users,
  TrendingDown,
  TrendingUp,
  Minus,
  Plus,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

const APS = "oklch(0.55 0.18 160)"

type AbaIndicador = "todos" | "prioritarios" | "fora_prazo"

interface Indicador {
  id: string
  nome: string
  grupo: string
  descricao: string
  total: number
  cobertura: number
  metaMes: number
  foraPrazo: number
  tendencia: "up" | "down" | "stable"
  icon: React.ElementType
  cor: string
  corBg: string
  pacientes: { id: string; nome: string; diasAtraso: number; acs: string }[]
}

const indicadores: Indicador[] = [
  {
    id: "gestantes",
    nome: "Acompanhamento de Gestantes",
    grupo: "Prioritário",
    descricao: "Visita domiciliar mensal obrigatória",
    total: 12,
    cobertura: 67,
    metaMes: 100,
    foraPrazo: 4,
    tendencia: "up",
    icon: Baby,
    cor: "#db2777",
    corBg: "bg-pink-50",
    pacientes: [
      { id: "2", nome: "Ana Lúcia Barbosa", diasAtraso: 38, acs: "Fernanda Lima" },
      { id: "7", nome: "Célia Regina Moura", diasAtraso: 32, acs: "João Carlos" },
      { id: "11", nome: "Patrícia Souza", diasAtraso: 12, acs: "Carla Souza" },
      { id: "15", nome: "Mariane Costa", diasAtraso: 8, acs: "Fernanda Lima" },
    ],
  },
  {
    id: "diabetes",
    nome: "Diabéticos — Acompanhamento Trimestral",
    grupo: "Prioritário",
    descricao: "Consulta ou visita a cada 90 dias",
    total: 34,
    cobertura: 82,
    metaMes: 90,
    foraPrazo: 6,
    tendencia: "stable",
    icon: Pill,
    cor: "#d97706",
    corBg: "bg-amber-50",
    pacientes: [
      { id: "3", nome: "José Augusto Correia", diasAtraso: 35, acs: "João Carlos" },
      { id: "8", nome: "Antônio Gomes", diasAtraso: 28, acs: "Carla Souza" },
      { id: "12", nome: "Rita de Cássia", diasAtraso: 22, acs: "Fernanda Lima" },
      { id: "16", nome: "Benedito Alves", diasAtraso: 15, acs: "João Carlos" },
      { id: "18", nome: "Elza Ferreira", diasAtraso: 10, acs: "Carla Souza" },
      { id: "20", nome: "Orlando Neves", diasAtraso: 5, acs: "Fernanda Lima" },
    ],
  },
  {
    id: "pos_alta",
    nome: "Pós-Alta Hospitalar",
    grupo: "Prioritário",
    descricao: "Visita domiciliar em até 7 dias após alta",
    total: 8,
    cobertura: 50,
    metaMes: 100,
    foraPrazo: 4,
    tendencia: "down",
    icon: Activity,
    cor: "#dc2626",
    corBg: "bg-red-50",
    pacientes: [
      { id: "1", nome: "Maria das Graças Ferreira", diasAtraso: 3, acs: "João Carlos" },
      { id: "5", nome: "Francisco Nunes Lima", diasAtraso: 4, acs: "Fernanda Lima" },
      { id: "9", nome: "Severino Ramos", diasAtraso: 6, acs: "Carla Souza" },
      { id: "13", nome: "Conceição Pereira", diasAtraso: 2, acs: "João Carlos" },
    ],
  },
  {
    id: "hipertensao",
    nome: "Hipertensos — Acompanhamento Semestral",
    grupo: "Crônico",
    descricao: "Consulta ou visita a cada 180 dias",
    total: 58,
    cobertura: 91,
    metaMes: 90,
    foraPrazo: 5,
    tendencia: "up",
    icon: Heart,
    cor: "#7c3aed",
    corBg: "bg-violet-50",
    pacientes: [
      { id: "4", nome: "Rosana Melo Santos", diasAtraso: 12, acs: "Carla Souza" },
      { id: "6", nome: "João Batista Neto", diasAtraso: 8, acs: "Fernanda Lima" },
      { id: "10", nome: "Neide Aparecida", diasAtraso: 6, acs: "João Carlos" },
      { id: "14", nome: "Valter Hugo", diasAtraso: 3, acs: "Carla Souza" },
      { id: "17", nome: "Sueli Gonçalves", diasAtraso: 2, acs: "Fernanda Lima" },
    ],
  },
  {
    id: "saude_mental",
    nome: "Saúde Mental — Monitoramento Mensal",
    grupo: "Especializado",
    descricao: "Acompanhamento mensal de pacientes em vulnerabilidade",
    total: 18,
    cobertura: 72,
    metaMes: 85,
    foraPrazo: 5,
    tendencia: "stable",
    icon: Brain,
    cor: "#0891b2",
    corBg: "bg-cyan-50",
    pacientes: [
      { id: "19", nome: "Luciana Barros", diasAtraso: 20, acs: "João Carlos" },
      { id: "21", nome: "Marcos Pinheiro", diasAtraso: 14, acs: "Fernanda Lima" },
      { id: "22", nome: "Débora Lima", diasAtraso: 10, acs: "Carla Souza" },
      { id: "23", nome: "Gilberto Cunha", diasAtraso: 5, acs: "João Carlos" },
      { id: "24", nome: "Nilza Carvalho", diasAtraso: 2, acs: "Fernanda Lima" },
    ],
  },
  {
    id: "reinternacoes",
    nome: "Múltiplas Internações",
    grupo: "Vigilância",
    descricao: "Pacientes com 2+ internações em 30 dias",
    total: 5,
    cobertura: 40,
    metaMes: 100,
    foraPrazo: 3,
    tendencia: "down",
    icon: AlertTriangle,
    cor: "#ea580c",
    corBg: "bg-orange-50",
    pacientes: [
      { id: "4", nome: "Rosana Melo Santos", diasAtraso: 5, acs: "Carla Souza" },
      { id: "25", nome: "Isaura Santos", diasAtraso: 3, acs: "João Carlos" },
      { id: "26", nome: "Edmilson Freitas", diasAtraso: 1, acs: "Fernanda Lima" },
    ],
  },
]

const tendenciaConfig = {
  up: { icon: TrendingUp, cor: "text-green-600", label: "Melhorando" },
  down: { icon: TrendingDown, cor: "text-red-600", label: "Piorando" },
  stable: { icon: Minus, cor: "text-muted-foreground", label: "Estável" },
}

export default function IndicadoresPage() {
  const [aba, setAba] = useState<AbaIndicador>("todos")
  const [expandido, setExpandido] = useState<string | null>(null)

  const indicadoresFiltrados = indicadores.filter((ind) => {
    if (aba === "prioritarios") return ind.grupo === "Prioritário"
    if (aba === "fora_prazo") return ind.cobertura < ind.metaMes
    return true
  })

  const totalForaPrazo = indicadores.reduce((acc, i) => acc + i.foraPrazo, 0)
  const coberturaMedia = Math.round(indicadores.reduce((acc, i) => acc + i.cobertura, 0) / indicadores.length)

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-6 space-y-6">

        {/* Cabeçalho */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: APS }}>
            Monitoramento
          </p>
          <h1 className="text-2xl font-semibold text-foreground">Indicadores Assistenciais</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoramento de cobertura e acompanhamento por grupo prioritário
          </p>
        </div>

        {/* Resumo executivo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Indicadores ativos</p>
              <p className="text-3xl font-bold mt-2 text-foreground">{indicadores.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Cobertura média</p>
              <p className="text-3xl font-bold mt-2 text-foreground">{coberturaMedia}<span className="text-base font-medium text-muted-foreground">%</span></p>
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

        {/* Abas */}
        <div className="flex gap-2 border-b border-border pb-0">
          {(["todos", "prioritarios", "fora_prazo"] as AbaIndicador[]).map((a) => {
            const labels: Record<AbaIndicador, string> = {
              todos: "Todos os indicadores",
              prioritarios: "Grupos prioritários",
              fora_prazo: "Fora da meta",
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
            const Icon = ind.icon
            const Tendencia = tendenciaConfig[ind.tendencia].icon
            const isExpanded = expandido === ind.id
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
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                          style={{ background: `${ind.cor}18`, color: ind.cor }}>
                          {ind.grupo}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Info className="w-3 h-3" strokeWidth={1.5} /> {ind.descricao}
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

                      {/* Tendência */}
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

                {/* Pacientes fora do prazo (expansível) */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-4 bg-muted/20">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[13px] font-semibold text-foreground flex items-center gap-2">
                        <Users className="w-4 h-4" style={{ color: APS }} strokeWidth={1.5} />
                        Pacientes fora do prazo — {ind.foraPrazo} identificados
                      </p>
                      <Button size="sm" variant="outline" className="text-[12px] rounded-xl gap-1" style={{ borderColor: `${APS}40`, color: APS }}>
                        <Plus className="w-3.5 h-3.5" />
                        Planejar visitas
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {ind.pacientes.map((p) => (
                        <Link
                          key={p.id}
                          href={`/portal-atencao-basica/paciente/${p.id}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:bg-muted/40 hover:border-border/80 transition-all group"
                        >
                          <div>
                            <p className="text-[13px] font-semibold text-foreground group-hover:text-[--aps] transition-colors">{p.nome}</p>
                            <p className="text-[12px] text-muted-foreground">ACS: {p.acs}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-[12px] font-semibold px-2 py-1 rounded-lg",
                              p.diasAtraso >= 30 ? "bg-red-100 text-red-700" :
                                p.diasAtraso >= 14 ? "bg-amber-100 text-amber-700" :
                                  "bg-orange-100 text-orange-700"
                            )}>
                              {p.diasAtraso}d em atraso
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
