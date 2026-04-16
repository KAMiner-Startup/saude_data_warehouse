"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CalendarDays, Plus, ChevronLeft, ChevronRight, CheckCircle2, Clock,
  AlertTriangle, MapPin, Share2, MoreHorizontal, User, Copy, Check,
  Filter, Bell, FlaskConical, Heart, Pill, Baby, ShieldAlert, Trash2,
  UserCheck, ChevronRight as Next, ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

const APS = "oklch(0.55 0.18 160)"

// ─── Tipos ────────────────────────────────────────────────────────────────────
type StatusVisita  = "agendada" | "realizada" | "nao_realizada" | "reagendada"
type MotivoVisita  = "pos_alta" | "gestante" | "cronico" | "rotina" | "urgencia"
type Prioridade    = "alta" | "media" | "baixa"

interface Visita {
  id: string
  paciente: string
  pacienteId: string
  acs: string
  data: string
  horario: string
  motivo: MotivoVisita
  status: StatusVisita
  endereco: string
}

// RF-FE-10.04/05/12/13 — paciente sugerido com base em indicadores e alertas
interface PacienteSugerido {
  id: string
  nome: string
  acs: string
  motivo: MotivoVisita
  motivoTexto: string          // RF-FE-10.07
  prioridade: Prioridade       // RF-FE-10.05
  indicadoresFora?: string[]   // RF-FE-10.12
  alertaAtivo?: boolean        // RF-FE-10.13
  endereco: string
}

// ─── Dados mockados ────────────────────────────────────────────────────────────
const VISITAS_INICIAIS: Visita[] = [
  { id: "v1",  paciente: "Maria das Graças Ferreira", pacienteId: "1",  acs: "João Carlos",  data: "2026-03-11", horario: "08:00", motivo: "pos_alta", status: "agendada",      endereco: "Rua das Flores, 45"     },
  { id: "v2",  paciente: "Ana Lúcia Barbosa",          pacienteId: "2",  acs: "Fernanda Lima", data: "2026-03-11", horario: "09:30", motivo: "gestante", status: "agendada",      endereco: "Av. Central, 120"       },
  { id: "v3",  paciente: "José Augusto Correia",       pacienteId: "3",  acs: "João Carlos",  data: "2026-03-11", horario: "14:00", motivo: "cronico",  status: "realizada",     endereco: "Rua do Sol, 78"         },
  { id: "v4",  paciente: "Rosana Melo Santos",          pacienteId: "4",  acs: "Carla Souza",  data: "2026-03-12", horario: "08:30", motivo: "urgencia", status: "agendada",      endereco: "Rua das Pedras, 33"     },
  { id: "v5",  paciente: "Francisco Nunes Lima",        pacienteId: "5",  acs: "Fernanda Lima", data: "2026-03-12", horario: "10:00", motivo: "pos_alta", status: "agendada",      endereco: "Travessa Boa Vista, 15" },
  { id: "v6",  paciente: "Célia Regina Moura",          pacienteId: "7",  acs: "João Carlos",  data: "2026-03-10", horario: "09:00", motivo: "gestante", status: "nao_realizada", endereco: "Rua da Paz, 88"         },
  { id: "v7",  paciente: "Antônio Gomes",               pacienteId: "8",  acs: "Carla Souza",  data: "2026-03-10", horario: "10:30", motivo: "cronico",  status: "realizada",     endereco: "Av. das Acácias, 200"   },
  { id: "v8",  paciente: "Rita de Cássia",              pacienteId: "12", acs: "Fernanda Lima", data: "2026-03-13", horario: "08:00", motivo: "cronico",  status: "agendada",      endereco: "Rua Nova, 56"           },
  { id: "v9",  paciente: "Severino Ramos",              pacienteId: "9",  acs: "Carla Souza",  data: "2026-03-13", horario: "14:30", motivo: "pos_alta", status: "agendada",      endereco: "Rua do Campo, 91"       },
  { id: "v10", paciente: "Patrícia Souza",              pacienteId: "11", acs: "Carla Souza",  data: "2026-03-14", horario: "09:00", motivo: "gestante", status: "agendada",      endereco: "Rua do Mar, 14"         },
]

// RF-FE-10.04/05/12/13/14 — sugestões derivadas de indicadores e alertas
const PACIENTES_SUGERIDOS: PacienteSugerido[] = [
  {
    id: "1", nome: "Maria das Graças Ferreira", acs: "João Carlos",
    motivo: "pos_alta", motivoTexto: "Pós-alta hospitalar — 3 dias sem visita",
    prioridade: "alta", alertaAtivo: true, endereco: "Rua das Flores, 45",
  },
  {
    id: "2", nome: "Ana Lúcia Barbosa", acs: "Fernanda Lima",
    motivo: "gestante", motivoTexto: "Gestante — visita mensal atrasada 38 dias",
    prioridade: "alta", indicadoresFora: ["Acompanhamento de Gestantes"], endereco: "Av. Central, 120",
  },
  {
    id: "3", nome: "José Augusto Correia", acs: "João Carlos",
    motivo: "cronico", motivoTexto: "Diabético descontrolado — hemoglobina glicada vencida (210 dias)",
    prioridade: "alta", indicadoresFora: ["Diabéticos", "Hemoglobina Glicada"], endereco: "Rua do Sol, 78",
  },
  {
    id: "4", nome: "Rosana Melo Santos", acs: "Carla Souza",
    motivo: "urgencia", motivoTexto: "Hipertensa descontrolada — 2 internações recentes",
    prioridade: "alta", alertaAtivo: true, indicadoresFora: ["Múltiplas Internações"], endereco: "Rua das Pedras, 33",
  },
  {
    id: "5", nome: "Francisco Nunes Lima", acs: "Fernanda Lima",
    motivo: "pos_alta", motivoTexto: "Pós-alta hospitalar — 4 dias sem visita",
    prioridade: "alta", alertaAtivo: true, endereco: "Travessa Boa Vista, 15",
  },
  {
    id: "7", nome: "Célia Regina Moura", acs: "João Carlos",
    motivo: "gestante", motivoTexto: "Gestante — visita mensal atrasada 32 dias",
    prioridade: "media", indicadoresFora: ["Acompanhamento de Gestantes"], endereco: "Rua da Paz, 88",
  },
  {
    id: "8", nome: "Antônio Gomes", acs: "Carla Souza",
    motivo: "cronico", motivoTexto: "Diabético — hemoglobina glicada vencida (195 dias)",
    prioridade: "media", indicadoresFora: ["Hemoglobina Glicada"], endereco: "Av. das Acácias, 200",
  },
  {
    id: "13", nome: "Conceição Pereira", acs: "João Carlos",
    motivo: "pos_alta", motivoTexto: "Pós-alta hospitalar — 2 dias sem visita",
    prioridade: "media", alertaAtivo: true, endereco: "Rua das Mangueiras, 7",
  },
  {
    id: "19", nome: "Luciana Barros", acs: "João Carlos",
    motivo: "rotina", motivoTexto: "Saúde mental — monitoramento mensal atrasado 20 dias",
    prioridade: "media", indicadoresFora: ["Saúde Mental"], endereco: "Rua do Pinho, 33",
  },
  {
    id: "24", nome: "Nilza Carvalho", acs: "Fernanda Lima",
    motivo: "rotina", motivoTexto: "Saúde mental — monitoramento mensal atrasado 2 dias",
    prioridade: "baixa", indicadoresFora: ["Saúde Mental"], endereco: "Rua das Brisas, 10",
  },
]

const AGENTES = ["Todos os agentes", "João Carlos", "Fernanda Lima", "Carla Souza"]

// ─── Configurações de exibição ────────────────────────────────────────────────
const statusConfig: Record<StatusVisita, { label: string; cor: string; icon: React.ElementType }> = {
  agendada:      { label: "Agendada",       cor: "bg-blue-100 text-blue-700",   icon: Clock         },
  realizada:     { label: "Realizada",      cor: "bg-green-100 text-green-700", icon: CheckCircle2  },
  nao_realizada: { label: "Não realizada",  cor: "bg-red-100 text-red-700",     icon: AlertTriangle },
  reagendada:    { label: "Reagendada",     cor: "bg-amber-100 text-amber-700", icon: CalendarDays  },
}

const motivoConfig: Record<MotivoVisita, { label: string; cor: string }> = {
  pos_alta: { label: "Pós-alta",   cor: "text-red-600"             },
  gestante: { label: "Gestante",   cor: "text-pink-600"            },
  cronico:  { label: "Crônico",    cor: "text-amber-600"           },
  rotina:   { label: "Rotina",     cor: "text-muted-foreground"    },
  urgencia: { label: "Urgência",   cor: "text-orange-600"          },
}

const prioridadeConfig: Record<Prioridade, { label: string; cor: string; bg: string }> = {
  alta:  { label: "Alta",  cor: "#dc2626", bg: "bg-red-50"     },
  media: { label: "Média", cor: "#d97706", bg: "bg-amber-50"   },
  baixa: { label: "Baixa", cor: "#16a34a", bg: "bg-emerald-50" },
}

// ─── Helpers de data ──────────────────────────────────────────────────────────
const BASE_SEGUNDA = new Date("2026-03-09T00:00:00")

function getSemanaDias(offset: number) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(BASE_SEGUNDA)
    d.setDate(d.getDate() + offset * 7 + i)
    const iso = d.toISOString().split("T")[0]
    const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"]
    return {
      data: iso,
      label: ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"][i],
      numero: String(d.getDate()).padStart(2, "0"),
      mes: meses[d.getMonth()],
    }
  })
}

function formatarPeriodoSemana(dias: ReturnType<typeof getSemanaDias>) {
  const ini = dias[0]
  const fim = dias[6]
  return `${parseInt(ini.numero)} a ${parseInt(fim.numero)} de ${fim.mes.charAt(0).toUpperCase() + fim.mes.slice(1)} de ${BASE_SEGUNDA.getFullYear() + Math.floor((BASE_SEGUNDA.getDate() + 7 * 0) / 365)}`
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function VisitasPage() {
  // RF-FE-10.03 — semana navegável
  const [semanaOffset,      setSemanaOffset]      = useState(0)
  const [diaSelecionado,    setDiaSelecionado]    = useState("2026-03-11")
  const [filtroAcs,         setFiltroAcs]         = useState("Todos os agentes")

  // RF-FE-10.08/09 — lista mutável de visitas
  const [visitasState,      setVisitasState]      = useState<Visita[]>(VISITAS_INICIAIS)

  // Modal de planejamento em etapas
  const [modalAberto,       setModalAberto]       = useState(false)
  const [etapa,             setEtapa]             = useState<1 | 2 | 3>(1)

  // RF-FE-10.02/03 — configuração do planejamento
  const [planAcs,           setPlanAcs]           = useState("João Carlos")
  const [planDataInicio,    setPlanDataInicio]    = useState("2026-03-11")
  const [planDataFim,       setPlanDataFim]       = useState("2026-03-15")

  // RF-FE-10.04/08 — pacientes selecionados para o plano
  const [pacientesSel,      setPacientesSel]      = useState<Record<string, string>>({}) // id → data visita

  // Modal compartilhar
  const [modalCompartilhar, setModalCompartilhar] = useState<string | null>(null)
  const [linkCopiado,       setLinkCopiado]       = useState(false)

  const hoje        = "2026-03-11"
  const diasSemana  = useMemo(() => getSemanaDias(semanaOffset), [semanaOffset])
  const labelSemana = formatarPeriodoSemana(diasSemana)

  // RF-FE-10.03 — navegar semana
  function navegarSemana(dir: 1 | -1) {
    setSemanaOffset(o => o + dir)
    setDiaSelecionado(getSemanaDias(semanaOffset + dir)[0].data)
  }

  const visitasDia = visitasState.filter(
    v => v.data === diaSelecionado && (filtroAcs === "Todos os agentes" || v.acs === filtroAcs)
  )
  const naoRealizadas = visitasState.filter(
    v => v.status === "nao_realizada" && (filtroAcs === "Todos os agentes" || v.acs === filtroAcs)
  )

  // RF-FE-10.08 — remover visita
  function removerVisita(id: string) {
    setVisitasState(prev => prev.filter(v => v.id !== id))
    toast.success("Visita removida do planejamento")
  }

  // RF-FE-10.04/05 — sugestões filtradas por ACS e ordenadas por prioridade
  const sugestoesFiltradas = useMemo(() => {
    const ordem: Record<Prioridade, number> = { alta: 0, media: 1, baixa: 2 }
    return PACIENTES_SUGERIDOS
      .filter(p => planAcs === "Todos os agentes" || p.acs === planAcs)
      .sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade])
  }, [planAcs])

  // RF-FE-10.09 — confirmar planejamento
  function confirmarPlanejamento() {
    const novasVisitas: Visita[] = Object.entries(pacientesSel).map(([pid, data], i) => {
      const sug = PACIENTES_SUGERIDOS.find(p => p.id === pid)!
      return {
        id:         `v${Date.now()}-${i}`,
        paciente:   sug.nome,
        pacienteId: sug.id,
        acs:        sug.acs,
        data,
        horario:    "08:00",
        motivo:     sug.motivo,
        status:     "agendada",
        endereco:   sug.endereco,
      }
    })
    setVisitasState(prev => [...prev, ...novasVisitas])
    toast.success(`${novasVisitas.length} visita(s) adicionada(s) ao planejamento`, {
      description: `Agente: ${planAcs} · ${planDataInicio} a ${planDataFim}`,
    })
    fecharModal()
  }

  function abrirModal() {
    setEtapa(1)
    setPlanAcs("João Carlos")
    setPlanDataInicio("2026-03-11")
    setPlanDataFim("2026-03-15")
    setPacientesSel({})
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setEtapa(1)
    setPacientesSel({})
  }

  function togglePaciente(id: string) {
    setPacientesSel(prev => {
      if (prev[id] !== undefined) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: planDataInicio }
    })
  }

  const totalSelecionados = Object.keys(pacientesSel).length

  return (
    <>
      <Toaster position="bottom-right" />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6">

          {/* Cabeçalho */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: APS }}>
                Planejamento
              </p>
              <h1 className="text-2xl font-semibold text-foreground">Visitas Domiciliares</h1>
              <p className="text-sm text-muted-foreground mt-1">{labelSemana}</p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl text-[13px]">
                    <Filter className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {filtroAcs === "Todos os agentes" ? "Todos" : filtroAcs}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {AGENTES.map(a => (
                    <DropdownMenuItem key={a} onClick={() => setFiltroAcs(a)}
                      className={cn("text-[13px]", filtroAcs === a && "font-semibold")}>
                      {a}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="gap-2 rounded-xl text-[13px]"
                style={{ background: APS }} onClick={abrirModal}>
                <Plus className="w-3.5 h-3.5" /> Planejar semana
              </Button>
            </div>
          </div>

          {/* Alerta de visitas não realizadas */}
          {naoRealizadas.length > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-[13px] font-semibold text-red-800">
                  {naoRealizadas.length} visita{naoRealizadas.length > 1 ? "s" : ""} não realizada{naoRealizadas.length > 1 ? "s" : ""}
                </p>
                <p className="text-[12px] text-red-600 mt-0.5">
                  {naoRealizadas.map(v => v.paciente).join(", ")} — pacientes prioritários sem contato.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Calendário semanal — RF-FE-10.03 navegável */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[13px] font-semibold">
                      {diasSemana[0].numero}/{diasSemana[0].mes} – {diasSemana[6].numero}/{diasSemana[6].mes}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg"
                        onClick={() => navegarSemana(-1)}>
                        <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg"
                        onClick={() => navegarSemana(1)}>
                        <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Dias da semana */}
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {diasSemana.map((dia) => {
                      const qtd         = visitasState.filter(v => v.data === dia.data).length
                      const isHoje      = dia.data === hoje
                      const isSelecionado = dia.data === diaSelecionado
                      return (
                        <button key={dia.data} onClick={() => setDiaSelecionado(dia.data)}
                          className={cn(
                            "flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all",
                            isSelecionado ? "text-white" : isHoje ? "bg-muted" : "hover:bg-muted/50"
                          )}
                          style={isSelecionado ? { background: APS } : {}}>
                          <span className="text-[10px] font-semibold opacity-70">{dia.label}</span>
                          <span className="text-[14px] font-bold">{dia.numero}</span>
                          {qtd > 0 && (
                            <span className={cn("w-1.5 h-1.5 rounded-full",
                              isSelecionado ? "bg-white/70" : "")}
                              style={!isSelecionado ? { backgroundColor: APS } : {}} />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Resumo por ACS — RF-FE-10.11 */}
                  <div className="space-y-2 mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Visitas por agente
                    </p>
                    {AGENTES.slice(1).map(acs => {
                      const total     = visitasState.filter(v => v.acs === acs).length
                      const realizadas = visitasState.filter(v => v.acs === acs && v.status === "realizada").length
                      return (
                        <div key={acs} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                            style={{ background: APS }}>
                            {acs.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-foreground truncate">{acs}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full transition-all"
                                  style={{ width: total > 0 ? `${(realizadas / total) * 100}%` : "0%", background: APS }} />
                              </div>
                              <span className="text-[10px] text-muted-foreground flex-shrink-0">
                                {realizadas}/{total}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="w-6 h-6 rounded-lg flex-shrink-0"
                            onClick={() => setModalCompartilhar(acs)}>
                            <Share2 className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de visitas do dia — RF-FE-10.06/07/08 */}
            <Card className="lg:col-span-2 rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  {diasSemana.find(d => d.data === diaSelecionado)?.label},{" "}
                  {diasSemana.find(d => d.data === diaSelecionado)?.numero} de {diasSemana.find(d => d.data === diaSelecionado)?.mes}
                </CardTitle>
                <CardDescription className="text-[13px]">
                  {visitasDia.length} visita{visitasDia.length !== 1 ? "s" : ""} planejada{visitasDia.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {visitasDia.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <CalendarDays className="w-10 h-10 mb-3 opacity-30" strokeWidth={1} />
                    <p className="text-[13px] font-medium">Nenhuma visita neste dia</p>
                    <Button variant="ghost" size="sm" className="mt-3 text-[13px] gap-1"
                      style={{ color: APS }} onClick={abrirModal}>
                      <Plus className="w-3.5 h-3.5" /> Planejar semana
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {visitasDia.map(v => {
                      const st     = statusConfig[v.status]
                      const StIcon = st.icon
                      const mot    = motivoConfig[v.motivo]
                      return (
                        <div key={v.id}
                          className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all group">
                          <div className="text-center flex-shrink-0 w-12">
                            <p className="text-[13px] font-bold text-foreground">{v.horario}</p>
                          </div>
                          <div className="w-px h-10 bg-border flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-foreground truncate">{v.paciente}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className={cn("text-[11px] font-medium", mot.cor)}>{mot.label}</span>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                                <User className="w-3 h-3" strokeWidth={1.5} /> {v.acs}
                              </span>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" strokeWidth={1.5} /> {v.endereco}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold", st.cor)}>
                              <StIcon className="w-3 h-3" strokeWidth={1.5} />
                              {st.label}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"
                                  className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-[13px]"
                                  onClick={() => setVisitasState(prev => prev.map(x => x.id === v.id ? { ...x, status: "realizada" } : x))}>
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" strokeWidth={1.5} /> Marcar como realizada
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-[13px]"
                                  onClick={() => setVisitasState(prev => prev.map(x => x.id === v.id ? { ...x, status: "nao_realizada" } : x))}>
                                  <AlertTriangle className="w-4 h-4 mr-2 text-red-500" strokeWidth={1.5} /> Registrar não realizada
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-[13px]"
                                  onClick={() => setVisitasState(prev => prev.map(x => x.id === v.id ? { ...x, status: "reagendada" } : x))}>
                                  <CalendarDays className="w-4 h-4 mr-2 text-amber-500" strokeWidth={1.5} /> Reagendar
                                </DropdownMenuItem>
                                {/* RF-FE-10.08 — remover visita */}
                                <DropdownMenuItem className="text-[13px] text-red-600"
                                  onClick={() => removerVisita(v.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" strokeWidth={1.5} /> Remover do planejamento
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* ─── Modal de planejamento em 3 etapas ─────────────────────────────────── */}
      <Dialog open={modalAberto} onOpenChange={fecharModal}>
        <DialogContent className="max-w-2xl rounded-2xl">

          {/* Indicador de etapas */}
          <div className="flex items-center gap-2 mb-1">
            {([1, 2, 3] as const).map(n => (
              <div key={n} className="flex items-center gap-2">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all",
                  etapa >= n ? "text-white" : "bg-muted text-muted-foreground"
                )}
                  style={etapa >= n ? { background: APS } : {}}>
                  {etapa > n ? <Check className="w-3 h-3" /> : n}
                </div>
                {n < 3 && <div className={cn("h-px w-8 transition-all", etapa > n ? "" : "bg-muted")}
                  style={etapa > n ? { background: APS } : {}} />}
              </div>
            ))}
            <span className="ml-2 text-[11px] text-muted-foreground">
              {etapa === 1 && "Configurar"}
              {etapa === 2 && "Revisar pacientes"}
              {etapa === 3 && "Confirmar"}
            </span>
          </div>

          {/* ── Etapa 1: Configurar agente e período — RF-FE-10.02/10.03 ── */}
          {etapa === 1 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-semibold">Planejar Semana de Visitas</DialogTitle>
                <DialogDescription>Selecione o agente e o período para gerar a lista sugerida.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                {/* RF-FE-10.02 — seleção de agente */}
                <div>
                  <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Agente Comunitário de Saúde
                  </label>
                  <select
                    value={planAcs}
                    onChange={e => setPlanAcs(e.target.value)}
                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[13px] text-foreground focus:outline-none focus:ring-2"
                  >
                    {AGENTES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                {/* RF-FE-10.03 — período */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Data início
                    </label>
                    <Input type="date" value={planDataInicio}
                      onChange={e => setPlanDataInicio(e.target.value)}
                      className="mt-1.5 rounded-xl text-[13px]" />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Data fim
                    </label>
                    <Input type="date" value={planDataFim}
                      onChange={e => setPlanDataFim(e.target.value)}
                      className="mt-1.5 rounded-xl text-[13px]" />
                  </div>
                </div>
                <div className="p-3 rounded-xl text-[12px]"
                  style={{ background: "oklch(0.55 0.18 160 / 0.06)", border: "1px solid oklch(0.55 0.18 160 / 0.15)" }}>
                  <p style={{ color: APS }} className="font-semibold mb-0.5">
                    {sugestoesFiltradas.length} paciente(s) com necessidade de visita identificados
                  </p>
                  <p className="text-muted-foreground">
                    Sugestões baseadas em indicadores assistenciais e alertas hospitalares ativos.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-xl" onClick={fecharModal}>Cancelar</Button>
                <Button className="rounded-xl gap-1.5" style={{ background: APS }}
                  onClick={() => { setPacientesSel({}); setEtapa(2) }}>
                  Ver pacientes sugeridos <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </DialogFooter>
            </>
          )}

          {/* ── Etapa 2: Revisar sugestões — RF-FE-10.04/05/07/08/12/13/14 ── */}
          {etapa === 2 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-semibold">Pacientes Sugeridos para Visita</DialogTitle>
                <DialogDescription>
                  Agente: <strong>{planAcs}</strong> · {planDataInicio} a {planDataFim} · Selecione os pacientes e defina a data de cada visita.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 py-1">
                {sugestoesFiltradas.map(p => {
                  const prio      = prioridadeConfig[p.prioridade]
                  const selecionado = pacientesSel[p.id] !== undefined
                  return (
                    <div key={p.id}
                      className={cn(
                        "p-3 rounded-xl border transition-all",
                        selecionado
                          ? "border-[var(--aps)] bg-[oklch(0.55_0.18_160_/_0.05)]"
                          : "border-border bg-card hover:bg-muted/30"
                      )}
                      style={selecionado ? { borderColor: APS } : {}}>
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => togglePaciente(p.id)}
                          className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                            selecionado ? "border-[var(--aps)] text-white" : "border-border"
                          )}
                          style={selecionado ? { background: APS, borderColor: APS } : {}}>
                          {selecionado && <Check className="w-3 h-3" strokeWidth={2.5} />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[13px] font-semibold text-foreground">{p.nome}</p>
                            {/* RF-FE-10.05 — prioridade */}
                            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", prio.bg)}
                              style={{ color: prio.cor }}>
                              {prio.label}
                            </span>
                            {/* RF-FE-10.13 — alerta ativo */}
                            {p.alertaAtivo && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded-md">
                                <Bell className="w-3 h-3" strokeWidth={1.5} /> Alerta ativo
                              </span>
                            )}
                          </div>
                          {/* RF-FE-10.07 — motivo */}
                          <p className="text-[12px] text-muted-foreground mt-0.5">{p.motivoTexto}</p>
                          {/* RF-FE-10.12 — indicadores */}
                          {(p.indicadoresFora?.length ?? 0) > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.indicadoresFora!.map(ind => (
                                <span key={ind} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700">
                                  {ind}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 mt-1">
                            <User className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                            <span className="text-[11px] text-muted-foreground">{p.acs}</span>
                          </div>
                        </div>

                        {/* Data da visita */}
                        {selecionado && (
                          <div className="flex-shrink-0">
                            <Input
                              type="date"
                              value={pacientesSel[p.id]}
                              onChange={e => setPacientesSel(prev => ({ ...prev, [p.id]: e.target.value }))}
                              className="h-8 text-[12px] rounded-lg w-36"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-between pt-1">
                <p className="text-[12px] text-muted-foreground">
                  {totalSelecionados} paciente(s) selecionado(s)
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl" onClick={() => setEtapa(1)}>
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Voltar
                  </Button>
                  <Button className="rounded-xl gap-1.5" style={{ background: APS }}
                    disabled={totalSelecionados === 0}
                    onClick={() => setEtapa(3)}>
                    Revisar planejamento <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ── Etapa 3: Confirmar — RF-FE-10.09/10/15 ── */}
          {etapa === 3 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-semibold">Confirmar Planejamento</DialogTitle>
                <DialogDescription>
                  Revise o plano antes de salvar. As visitas serão adicionadas ao calendário do agente.
                </DialogDescription>
              </DialogHeader>
              {/* RF-FE-10.15 — visualização clara do planejamento */}
              <div className="space-y-3 py-2">
                <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-muted/40 text-[12px]">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <UserCheck className="w-3.5 h-3.5" style={{ color: APS }} strokeWidth={1.5} />
                    {planAcs}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarDays className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {planDataInicio} a {planDataFim}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold" style={{ color: APS }}>
                    {totalSelecionados} visita(s) planejada(s)
                  </span>
                </div>
                <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                  {Object.entries(pacientesSel).map(([pid, data]) => {
                    const sug = PACIENTES_SUGERIDOS.find(p => p.id === pid)!
                    const mot = motivoConfig[sug.motivo]
                    return (
                      <div key={pid} className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-card">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-foreground truncate">{sug.nome}</p>
                          <p className={cn("text-[11px] font-medium", mot.cor)}>{mot.label}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[12px] font-semibold text-foreground">{data}</p>
                          <p className="text-[11px] text-muted-foreground">{sug.acs}</p>
                        </div>
                        {/* RF-FE-10.08 — remover da lista antes de confirmar */}
                        <button
                          onClick={() => setPacientesSel(prev => { const n = { ...prev }; delete n[pid]; return n })}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-xl" onClick={() => setEtapa(2)}>
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Voltar
                </Button>
                <Button className="rounded-xl gap-1.5" style={{ background: APS }}
                  disabled={totalSelecionados === 0}
                  onClick={confirmarPlanejamento}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmar planejamento
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal: Compartilhar cronograma */}
      <Dialog open={!!modalCompartilhar} onOpenChange={() => setModalCompartilhar(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Compartilhar cronograma</DialogTitle>
            <DialogDescription>
              Gere um link para que o agente visualize seu cronograma de visitas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-[13px] text-muted-foreground">
              Envie este link para <span className="font-semibold text-foreground">{modalCompartilhar}</span> acessar o cronograma da semana.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
              <p className="text-[12px] text-muted-foreground flex-1 truncate font-mono">
                https://saude.buzios.rj.gov.br/visitas/cronograma?acs={modalCompartilhar?.toLowerCase().replace(" ", "-")}&semana={diasSemana[0].data}
              </p>
              <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg flex-shrink-0"
                onClick={() => { setLinkCopiado(true); setTimeout(() => setLinkCopiado(false), 2000) }}>
                {linkCopiado ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button className="rounded-xl w-full gap-2" style={{ background: APS }}
              onClick={() => { setLinkCopiado(true); setTimeout(() => setLinkCopiado(false), 2000) }}>
              <Share2 className="w-3.5 h-3.5" />
              {linkCopiado ? "Link copiado!" : "Copiar link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
