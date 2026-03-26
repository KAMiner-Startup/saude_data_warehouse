"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Share2,
  MoreHorizontal,
  User,
  Copy,
  Check,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

const APS = "oklch(0.55 0.18 160)"

type StatusVisita = "agendada" | "realizada" | "nao_realizada" | "reagendada"
type MotivoVisita = "pos_alta" | "gestante" | "cronico" | "rotina" | "urgencia"

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

const visitas: Visita[] = [
  { id: "v1", paciente: "Maria das Graças Ferreira", pacienteId: "1", acs: "João Carlos", data: "2026-03-11", horario: "08:00", motivo: "pos_alta", status: "agendada", endereco: "Rua das Flores, 45" },
  { id: "v2", paciente: "Ana Lúcia Barbosa", pacienteId: "2", acs: "Fernanda Lima", data: "2026-03-11", horario: "09:30", motivo: "gestante", status: "agendada", endereco: "Av. Central, 120" },
  { id: "v3", paciente: "José Augusto Correia", pacienteId: "3", acs: "João Carlos", data: "2026-03-11", horario: "14:00", motivo: "cronico", status: "realizada", endereco: "Rua do Sol, 78" },
  { id: "v4", paciente: "Rosana Melo Santos", pacienteId: "4", acs: "Carla Souza", data: "2026-03-12", horario: "08:30", motivo: "urgencia", status: "agendada", endereco: "Rua das Pedras, 33" },
  { id: "v5", paciente: "Francisco Nunes Lima", pacienteId: "5", acs: "Fernanda Lima", data: "2026-03-12", horario: "10:00", motivo: "pos_alta", status: "agendada", endereco: "Travessa Boa Vista, 15" },
  { id: "v6", paciente: "Célia Regina Moura", pacienteId: "7", acs: "João Carlos", data: "2026-03-10", horario: "09:00", motivo: "gestante", status: "nao_realizada", endereco: "Rua da Paz, 88" },
  { id: "v7", paciente: "Antônio Gomes", pacienteId: "8", acs: "Carla Souza", data: "2026-03-10", horario: "10:30", motivo: "cronico", status: "realizada", endereco: "Av. das Acácias, 200" },
  { id: "v8", paciente: "Rita de Cássia", pacienteId: "12", acs: "Fernanda Lima", data: "2026-03-13", horario: "08:00", motivo: "cronico", status: "agendada", endereco: "Rua Nova, 56" },
  { id: "v9", paciente: "Severino Ramos", pacienteId: "9", acs: "Carla Souza", data: "2026-03-13", horario: "14:30", motivo: "pos_alta", status: "agendada", endereco: "Rua do Campo, 91" },
  { id: "v10", paciente: "Patrícia Souza", pacienteId: "11", acs: "Carla Souza", data: "2026-03-14", horario: "09:00", motivo: "gestante", status: "agendada", endereco: "Rua do Mar, 14" },
]

const diasSemana = [
  { data: "2026-03-09", label: "Seg", numero: "09" },
  { data: "2026-03-10", label: "Ter", numero: "10" },
  { data: "2026-03-11", label: "Qua", numero: "11" },
  { data: "2026-03-12", label: "Qui", numero: "12" },
  { data: "2026-03-13", label: "Sex", numero: "13" },
  { data: "2026-03-14", label: "Sáb", numero: "14" },
  { data: "2026-03-15", label: "Dom", numero: "15" },
]

const statusConfig: Record<StatusVisita, { label: string; cor: string; icon: React.ElementType }> = {
  agendada: { label: "Agendada", cor: "bg-blue-100 text-blue-700", icon: Clock },
  realizada: { label: "Realizada", cor: "bg-green-100 text-green-700", icon: CheckCircle2 },
  nao_realizada: { label: "Não realizada", cor: "bg-red-100 text-red-700", icon: AlertTriangle },
  reagendada: { label: "Reagendada", cor: "bg-amber-100 text-amber-700", icon: CalendarDays },
}

const motivoConfig: Record<MotivoVisita, { label: string; cor: string }> = {
  pos_alta: { label: "Pós-alta", cor: "text-red-600" },
  gestante: { label: "Gestante", cor: "text-pink-600" },
  cronico: { label: "Crônico", cor: "text-amber-600" },
  rotina: { label: "Rotina", cor: "text-muted-foreground" },
  urgencia: { label: "Urgência", cor: "text-orange-600" },
}

const agentes = ["Todos os agentes", "João Carlos", "Fernanda Lima", "Carla Souza"]

export default function VisitasPage() {
  const [diaSelecionado, setDiaSelecionado] = useState("2026-03-11")
  const [filtroAcs, setFiltroAcs] = useState("Todos os agentes")
  const [modalPlanejar, setModalPlanejar] = useState(false)
  const [modalCompartilhar, setModalCompartilhar] = useState<string | null>(null)
  const [linkCopiado, setLinkCopiado] = useState(false)

  const hoje = "2026-03-11"

  const visitasDia = visitas.filter(
    (v) => v.data === diaSelecionado && (filtroAcs === "Todos os agentes" || v.acs === filtroAcs)
  )

  const naoRealizadas = visitas.filter(
    (v) => v.status === "nao_realizada" && (filtroAcs === "Todos os agentes" || v.acs === filtroAcs)
  )

  const handleCopiarLink = (acs: string) => {
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-6 space-y-6">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: APS }}>
              Planejamento
            </p>
            <h1 className="text-2xl font-semibold text-foreground">Visitas Domiciliares</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Semana de 09 a 15 de março de 2026
            </p>
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
                {agentes.map((a) => (
                  <DropdownMenuItem key={a} onClick={() => setFiltroAcs(a)}
                    className={cn("text-[13px]", filtroAcs === a && "font-semibold")}>
                    {a}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              className="gap-2 rounded-xl text-[13px]"
              style={{ background: APS }}
              onClick={() => setModalPlanejar(true)}
            >
              <Plus className="w-3.5 h-3.5" /> Planejar visita
            </Button>
          </div>
        </div>

        {/* Alertas de visitas não realizadas */}
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
          {/* Calendário semanal */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[13px] font-semibold">Semana atual</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {diasSemana.map((dia) => {
                    const qtd = visitas.filter(v => v.data === dia.data).length
                    const isHoje = dia.data === hoje
                    const isSelecionado = dia.data === diaSelecionado
                    return (
                      <button
                        key={dia.data}
                        onClick={() => setDiaSelecionado(dia.data)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all",
                          isSelecionado ? "text-white" : isHoje ? "bg-muted" : "hover:bg-muted/50"
                        )}
                        style={isSelecionado ? { background: APS } : {}}
                      >
                        <span className="text-[10px] font-semibold opacity-70">{dia.label}</span>
                        <span className="text-[14px] font-bold">{dia.numero}</span>
                        {qtd > 0 && (
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isSelecionado ? "bg-white/70" : "bg-[var(--aps)]"
                          )} style={!isSelecionado ? { backgroundColor: APS } : {}} />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Resumo por ACS */}
                <div className="space-y-2 mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Visitas por agente</p>
                  {agentes.slice(1).map((acs) => {
                    const total = visitas.filter(v => v.acs === acs).length
                    const realizadas = visitas.filter(v => v.acs === acs && v.status === "realizada").length
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
                              <div className="h-full rounded-full" style={{ width: `${(realizadas / total) * 100}%`, background: APS }} />
                            </div>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">{realizadas}/{total}</span>
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

          {/* Lista de visitas do dia */}
          <Card className="lg:col-span-2 rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {diasSemana.find(d => d.data === diaSelecionado)?.label},{" "}
                {diasSemana.find(d => d.data === diaSelecionado)?.numero} de março
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
                  <Button variant="ghost" size="sm" className="mt-3 text-[13px] gap-1" style={{ color: APS }}
                    onClick={() => setModalPlanejar(true)}>
                    <Plus className="w-3.5 h-3.5" /> Planejar visita
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {visitasDia.map((v) => {
                    const st = statusConfig[v.status]
                    const StIcon = st.icon
                    const mot = motivoConfig[v.motivo]
                    return (
                      <div key={v.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all group">
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
                              <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-[13px]">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Marcar como realizada
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[13px]">
                                <AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Registrar não realizada
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[13px]">
                                <CalendarDays className="w-4 h-4 mr-2 text-amber-500" /> Reagendar
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

      {/* Modal: Planejar visita */}
      <Dialog open={modalPlanejar} onOpenChange={setModalPlanejar}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Planejar Visita Domiciliar</DialogTitle>
            <DialogDescription>Agende uma visita domiciliar para um paciente da carteira.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Paciente</label>
              <Input placeholder="Nome, CPF ou CNS do paciente" className="mt-1.5 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Data</label>
                <Input type="date" defaultValue="2026-03-11" className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Horário</label>
                <Input type="time" defaultValue="08:00" className="mt-1.5 rounded-xl" />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Agente de saúde</label>
              <select className="mt-1.5 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--aps)]">
                {agentes.slice(1).map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Motivo</label>
              <select className="mt-1.5 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--aps)]">
                <option value="rotina">Rotina</option>
                <option value="pos_alta">Pós-alta hospitalar</option>
                <option value="gestante">Acompanhamento de gestante</option>
                <option value="cronico">Paciente crônico</option>
                <option value="urgencia">Urgência</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setModalPlanejar(false)}>Cancelar</Button>
            <Button className="rounded-xl" style={{ background: APS }} onClick={() => setModalPlanejar(false)}>
              Salvar visita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Compartilhar cronograma */}
      <Dialog open={!!modalCompartilhar} onOpenChange={() => setModalCompartilhar(null)}>
        <DialogContent className="max-w-6xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Compartilhar cronograma</DialogTitle>
            <DialogDescription>Gere um link para que o agente visualize seu cronograma de visitas.</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-[13px] text-muted-foreground">
              Envie este link para <span className="font-semibold text-foreground">{modalCompartilhar}</span> acessar o cronograma de visitas da semana.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
              <p className="text-[12px] text-muted-foreground flex-1 truncate font-mono">
                https://saude.buzios.rj.gov.br/visitas/cronograma?acs=joao-carlos&semana=09
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 rounded-lg flex-shrink-0"
                onClick={() => handleCopiarLink(modalCompartilhar || "")}
              >
                {linkCopiado ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button className="rounded-xl w-full gap-2" style={{ background: APS }}
              onClick={() => handleCopiarLink(modalCompartilhar || "")}>
              <Share2 className="w-3.5 h-3.5" />
              {linkCopiado ? "Link copiado!" : "Copiar link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
