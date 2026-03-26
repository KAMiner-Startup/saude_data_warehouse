"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  CalendarDays,
  Users,
  Search,
  Plus,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Phone,
  MapPin,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const APS = "oklch(0.55 0.18 160)"

interface ACS {
  id: string
  nome: string
  telefone: string
  ubs: string
  microarea: string
  totalPacientes: number
  visitasSemana: number
  visitasRealizadas: number
  visitasNaoRealizadas: number
  desempenho: number
  tendencia: "up" | "down" | "stable"
  status: "ativo" | "afastado"
}

const agentes: ACS[] = [
  {
    id: "acs1",
    nome: "João Carlos Ferreira",
    telefone: "(22) 99812-3456",
    ubs: "UBS Central",
    microarea: "Microárea 01",
    totalPacientes: 48,
    visitasSemana: 5,
    visitasRealizadas: 3,
    visitasNaoRealizadas: 1,
    desempenho: 88,
    tendencia: "up",
    status: "ativo",
  },
  {
    id: "acs2",
    nome: "Fernanda Lima Santos",
    telefone: "(22) 99834-7891",
    ubs: "UBS Central",
    microarea: "Microárea 02",
    totalPacientes: 52,
    visitasSemana: 5,
    visitasRealizadas: 2,
    visitasNaoRealizadas: 0,
    desempenho: 76,
    tendencia: "stable",
    status: "ativo",
  },
  {
    id: "acs3",
    nome: "Carla Souza Andrade",
    telefone: "(22) 99856-2341",
    ubs: "UBS Central",
    microarea: "Microárea 03",
    totalPacientes: 45,
    visitasSemana: 4,
    visitasRealizadas: 2,
    visitasNaoRealizadas: 1,
    desempenho: 62,
    tendencia: "down",
    status: "ativo",
  },
  {
    id: "acs4",
    nome: "Roberto Meira Costa",
    telefone: "(22) 99878-9012",
    ubs: "UBS Norte",
    microarea: "Microárea 04",
    totalPacientes: 41,
    visitasSemana: 3,
    visitasRealizadas: 3,
    visitasNaoRealizadas: 0,
    desempenho: 95,
    tendencia: "up",
    status: "ativo",
  },
  {
    id: "acs5",
    nome: "Simone Ramos Pereira",
    telefone: "(22) 99890-4523",
    ubs: "UBS Norte",
    microarea: "Microárea 05",
    totalPacientes: 39,
    visitasSemana: 2,
    visitasRealizadas: 0,
    visitasNaoRealizadas: 2,
    desempenho: 45,
    tendencia: "down",
    status: "afastado",
  },
]

const tendenciaConfig = {
  up: { icon: TrendingUp, cor: "text-green-600" },
  down: { icon: TrendingDown, cor: "text-red-600" },
  stable: { icon: Minus, cor: "text-muted-foreground" },
}

const ubsGrupos = [...new Set(agentes.map(a => a.ubs))]

export default function AgentesPage() {
  const [busca, setBusca] = useState("")
  const [ubsFiltro, setUbsFiltro] = useState("todas")
  const [modalAcs, setModalAcs] = useState(false)
  const [agenteDetalhe, setAgenteDetalhe] = useState<ACS | null>(null)

  const agentesFiltrados = agentes.filter(a => {
    const matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.microarea.toLowerCase().includes(busca.toLowerCase())
    const matchUbs = ubsFiltro === "todas" || a.ubs === ubsFiltro
    return matchBusca && matchUbs
  })

  const totalPacientes = agentes.reduce((acc, a) => acc + a.totalPacientes, 0)
  const desempenhoMedio = Math.round(agentes.reduce((acc, a) => acc + a.desempenho, 0) / agentes.length)
  const agentesAtivos = agentes.filter(a => a.status === "ativo").length

  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="p-4 md:p-6 space-y-6">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: APS }}>Gestão</p>
            <h1 className="text-2xl font-semibold text-foreground">Agentes Comunitários de Saúde</h1>
            <p className="text-sm text-muted-foreground mt-1">Equipes vinculadas às unidades de saúde</p>
          </div>
          <Button size="sm" className="gap-2 rounded-xl text-[13px] self-start md:self-auto"
            style={{ background: APS }} onClick={() => setModalAcs(true)}>
            <Plus className="w-3.5 h-3.5" /> Cadastrar agente
          </Button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Agentes ativos</p>
              <p className="text-3xl font-bold mt-2 text-foreground">{agentesAtivos}</p>
              <p className="text-[12px] text-muted-foreground mt-1">de {agentes.length} cadastrados</p>
            </CardContent>
          </Card>
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Total de pacientes</p>
              <p className="text-3xl font-bold mt-2 text-foreground">{totalPacientes}</p>
              <p className="text-[12px] text-muted-foreground mt-1">acompanhados</p>
            </CardContent>
          </Card>
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Desempenho médio</p>
              <p className="text-3xl font-bold mt-2 text-foreground">{desempenhoMedio}<span className="text-base font-medium text-muted-foreground">%</span></p>
              <p className="text-[12px] text-muted-foreground mt-1">de visitas realizadas</p>
            </CardContent>
          </Card>
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Não realizadas</p>
              <p className="text-3xl font-bold mt-2 text-red-600">
                {agentes.reduce((acc, a) => acc + a.visitasNaoRealizadas, 0)}
              </p>
              <p className="text-[12px] text-muted-foreground mt-1">esta semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              placeholder="Buscar agente ou microárea..."
              className="pl-9 rounded-xl"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setUbsFiltro("todas")}
              className={cn("px-3 py-1.5 rounded-xl text-[13px] font-medium border transition-colors",
                ubsFiltro === "todas" ? "text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground")}
              style={ubsFiltro === "todas" ? { background: APS } : {}}
            >
              Todas as UBS
            </button>
            {ubsGrupos.map(ubs => (
              <button
                key={ubs}
                onClick={() => setUbsFiltro(ubs)}
                className={cn("px-3 py-1.5 rounded-xl text-[13px] font-medium border transition-colors",
                  ubsFiltro === ubs ? "text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground")}
                style={ubsFiltro === ubs ? { background: APS } : {}}
              >
                {ubs}
              </button>
            ))}
          </div>
        </div>

        {/* Agrupado por UBS */}
        {ubsGrupos.filter(ubs => ubsFiltro === "todas" || ubsFiltro === ubs).map(ubs => {
          const acsUbs = agentesFiltrados.filter(a => a.ubs === ubs)
          if (acsUbs.length === 0) return null
          return (
            <div key={ubs}>
              <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {ubs}
              </h2>
              <div className="space-y-3">
                {acsUbs.map((acs) => {
                  const Tendencia = tendenciaConfig[acs.tendencia].icon
                  const pct = Math.round((acs.visitasRealizadas / Math.max(acs.visitasSemana, 1)) * 100)
                  return (
                    <Card key={acs.id} className="rounded-[20px] border-none hover:shadow-md transition-shadow cursor-pointer"
                      style={{ boxShadow: "var(--shadow-soft)" }}
                      onClick={() => setAgenteDetalhe(acs)}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: acs.status === "afastado" ? "#94a3b8" : APS }}>
                            {acs.nome.split(" ").slice(0, 2).map(n => n[0]).join("")}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[14px] font-semibold text-foreground">{acs.nome}</p>
                              {acs.status === "afastado" && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  Afastado
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                              <span className="text-[12px] text-muted-foreground">{acs.microarea}</span>
                              <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3 h-3" strokeWidth={1.5} /> {acs.telefone}
                              </span>
                              <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" strokeWidth={1.5} /> {acs.totalPacientes} pacientes
                              </span>
                            </div>

                            {/* Progresso visitas */}
                            <div className="mt-3 flex items-center gap-3">
                              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full transition-all"
                                  style={{ width: `${pct}%`, background: acs.desempenho >= 80 ? "#16a34a" : acs.desempenho >= 60 ? APS : "#dc2626" }} />
                              </div>
                              <span className="text-[11px] font-medium text-muted-foreground flex-shrink-0">
                                {acs.visitasRealizadas}/{acs.visitasSemana} visitas
                              </span>
                            </div>
                          </div>

                          {/* Desempenho */}
                          <div className="text-right flex-shrink-0 hidden sm:block">
                            <div className="flex items-center gap-1 justify-end">
                              <Tendencia className={cn("w-3.5 h-3.5", tendenciaConfig[acs.tendencia].cor)} strokeWidth={1.5} />
                              <p className={cn("text-lg font-bold", acs.desempenho >= 80 ? "text-green-600" : acs.desempenho >= 60 ? "text-foreground" : "text-red-600")}>
                                {acs.desempenho}%
                              </p>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">desempenho</p>
                            {acs.visitasNaoRealizadas > 0 && (
                              <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center justify-end gap-1">
                                <AlertTriangle className="w-3 h-3" strokeWidth={1.5} />
                                {acs.visitasNaoRealizadas} não realizada{acs.visitasNaoRealizadas > 1 ? "s" : ""}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg" asChild>
                              <Link href="/portal-atencao-basica/visitas">
                                <CalendarDays className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg">
                                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-[13px]">Editar agente</DropdownMenuItem>
                                <DropdownMenuItem className="text-[13px]">Ver pacientes</DropdownMenuItem>
                                <DropdownMenuItem className="text-[13px]">Alocar visita</DropdownMenuItem>
                                <DropdownMenuItem className="text-[13px] text-destructive">Inativar</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Cadastrar ACS */}
      <Dialog open={modalAcs} onOpenChange={setModalAcs}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{"Novo Agente Comunitário"}</DialogTitle>
            <DialogDescription>Preencha os dados do agente comunitário de saúde.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Nome completo</label>
              <Input placeholder="Nome do agente" className="mt-1.5 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Telefone</label>
                <Input placeholder="(22) 99999-9999" className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Microárea</label>
                <Input placeholder="Ex: Microárea 01" className="mt-1.5 rounded-xl" />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">UBS vinculada</label>
              <select className="mt-1.5 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none">
                {ubsGrupos.map(ubs => <option key={ubs}>{ubs}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setModalAcs(false)}>Cancelar</Button>
            <Button className="rounded-xl" style={{ background: APS }} onClick={() => setModalAcs(false)}>Cadastrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
