"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Activity, Search, Filter, Eye, Building2, HeartPulse,
  MoreVertical, Clock, AlertCircle
} from "lucide-react"
import Link from "next/link"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"

type StatusAlerta = "pendente" | "em_andamento" | "respondido" | "encerrado"
type TipoMovimentacao = "alta" | "internacao" | "evasao" | "obito" | "resultado_critico"

interface AlertaRede {
  id: string
  paciente: string
  cpf: string
  tipoMovimentacao: TipoMovimentacao
  dataMovimentacao: string
  unidadeHospitalar: string
  unidadeAPS: string
  status: StatusAlerta
  tempoDecorrido: string
  responsavelAPS?: string
}

const statusConfig: Record<StatusAlerta, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-destructive/10 text-destructive" },
  em_andamento: { label: "Em andamento", className: "bg-primary/10 text-primary" },
  respondido: { label: "Respondido", className: "bg-emerald-100 text-emerald-700" },
  encerrado: { label: "Encerrado", className: "bg-muted text-muted-foreground" },
}

const tipoConfig: Record<TipoMovimentacao, { label: string; className: string }> = {
  alta: { label: "Alta hospitalar", className: "bg-emerald-50 text-emerald-700" },
  internacao: { label: "Internação", className: "bg-primary/10 text-primary" },
  evasao: { label: "Evasão", className: "bg-orange-50 text-orange-700" },
  obito: { label: "Óbito", className: "bg-destructive/10 text-destructive" },
  resultado_critico: { label: "Resultado crítico", className: "bg-amber-50 text-amber-700" },
}

const MOCK_REDE: AlertaRede[] = [
  { id: "1", paciente: "Maria Silva Santos", cpf: "123.456.789-00", tipoMovimentacao: "alta", dataMovimentacao: "04/03/2026", unidadeHospitalar: "Hospital Municipal de Búzios", unidadeAPS: "UBS Centro", status: "pendente", tempoDecorrido: "2h" },
  { id: "2", paciente: "José Oliveira Costa", cpf: "456.789.123-11", tipoMovimentacao: "internacao", dataMovimentacao: "03/03/2026", unidadeHospitalar: "Hospital Municipal de Búzios", unidadeAPS: "UBS Manguinhos", status: "em_andamento", tempoDecorrido: "5h", responsavelAPS: "Dra. Fernanda" },
  { id: "3", paciente: "Ana Carolina Pereira", cpf: "789.123.456-22", tipoMovimentacao: "resultado_critico", dataMovimentacao: "02/03/2026", unidadeHospitalar: "Hospital Municipal de Búzios", unidadeAPS: "UBS Geribá", status: "respondido", tempoDecorrido: "1d", responsavelAPS: "Dr. João Silva" },
  { id: "4", paciente: "Carlos Eduardo Lima", cpf: "321.654.987-33", tipoMovimentacao: "alta", dataMovimentacao: "01/03/2026", unidadeHospitalar: "Hospital Regional", unidadeAPS: "UBS Ferradura", status: "pendente", tempoDecorrido: "2d" },
  { id: "5", paciente: "Mariana Souza Rodrigues", cpf: "654.987.321-44", tipoMovimentacao: "obito", dataMovimentacao: "28/02/2026", unidadeHospitalar: "Hospital Municipal de Búzios", unidadeAPS: "UBS Armação", status: "encerrado", tempoDecorrido: "5d", responsavelAPS: "Dra. Paula" },
  { id: "6", paciente: "Ricardo Alves Neto", cpf: "111.222.333-44", tipoMovimentacao: "evasao", dataMovimentacao: "05/03/2026", unidadeHospitalar: "Hospital Municipal de Búzios", unidadeAPS: "UBS Centro", status: "pendente", tempoDecorrido: "30min" },
  { id: "7", paciente: "Luísa Mendes Costa", cpf: "555.666.777-88", tipoMovimentacao: "internacao", dataMovimentacao: "05/03/2026", unidadeHospitalar: "Hospital Regional", unidadeAPS: "UBS Geribá", status: "pendente", tempoDecorrido: "1h" },
]

type AbaAtiva = "todos" | "pendente" | "em_andamento" | "respondido" | "encerrado"

export default function MonitoramentoPage() {
  const [aba, setAba] = useState<AbaAtiva>("todos")
  const [busca, setBusca] = useState("")
  const [filtroUBS, setFiltroUBS] = useState("todas")
  const [filtroHospital, setFiltroHospital] = useState("todos")

  const alertasFiltrados = MOCK_REDE.filter((a) => {
    const matchAba = aba === "todos" || a.status === aba
    const matchBusca = !busca || a.paciente.toLowerCase().includes(busca.toLowerCase()) || a.cpf.includes(busca)
    const matchUBS = filtroUBS === "todas" || a.unidadeAPS === filtroUBS
    const matchHospital = filtroHospital === "todos" || a.unidadeHospitalar === filtroHospital
    return matchAba && matchBusca && matchUBS && matchHospital
  })

  const contadores = {
    todos: MOCK_REDE.length,
    pendente: MOCK_REDE.filter(a => a.status === "pendente").length,
    em_andamento: MOCK_REDE.filter(a => a.status === "em_andamento").length,
    respondido: MOCK_REDE.filter(a => a.status === "respondido").length,
    encerrado: MOCK_REDE.filter(a => a.status === "encerrado").length,
  }

  const abas: { id: AbaAtiva; label: string }[] = [
    { id: "todos", label: `Todos (${contadores.todos})` },
    { id: "pendente", label: `Pendentes (${contadores.pendente})` },
    { id: "em_andamento", label: `Em andamento (${contadores.em_andamento})` },
    { id: "respondido", label: `Respondidos (${contadores.respondido})` },
    { id: "encerrado", label: `Encerrados (${contadores.encerrado})` },
  ]

  const ubsList = Array.from(new Set(MOCK_REDE.map(a => a.unidadeAPS)))
  const hospitaisList = Array.from(new Set(MOCK_REDE.map(a => a.unidadeHospitalar)))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          Monitoramento da Rede
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão consolidada de todos os alertas e movimentações da rede municipal
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pendentes", valor: contadores.pendente, cor: "oklch(0.54 0.22 27)", fundo: "oklch(0.54 0.22 27 / 0.08)", icon: AlertCircle },
          { label: "Em andamento", valor: contadores.em_andamento, cor: "oklch(0.38 0.19 264)", fundo: "oklch(0.38 0.19 264 / 0.08)", icon: Clock },
          { label: "Respondidos", valor: contadores.respondido, cor: "oklch(0.55 0.18 160)", fundo: "oklch(0.55 0.18 160 / 0.08)", icon: Activity },
          { label: "Total no período", valor: contadores.todos, cor: ADMIN_COLOR, fundo: ADMIN_BG, icon: Activity },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className="rounded-[20px] border-none overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                    <p className="text-3xl font-bold tracking-tight text-foreground mt-1">{kpi.valor}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.fundo }}>
                    <Icon className="h-5 w-5" style={{ color: kpi.cor }} strokeWidth={1.5} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filtros */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <Input
                placeholder="Buscar por nome ou CPF..."
                className="pl-9 rounded-xl border-border text-[13px]"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <select
              className="h-9 px-3 rounded-xl border border-border text-[13px] bg-background text-foreground"
              value={filtroUBS}
              onChange={(e) => setFiltroUBS(e.target.value)}
            >
              <option value="todas">Todas as UBS</option>
              {ubsList.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <select
              className="h-9 px-3 rounded-xl border border-border text-[13px] bg-background text-foreground"
              value={filtroHospital}
              onChange={(e) => setFiltroHospital(e.target.value)}
            >
              <option value="todos">Todos os hospitais</option>
              {hospitaisList.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Abas */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader className="pb-0">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {abas.map((a) => (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all ${
                  aba === a.id
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                style={aba === a.id ? { background: ADMIN_COLOR } : {}}
              >
                {a.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {alertasFiltrados.map((alerta) => (
              <div key={alerta.id} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{alerta.paciente}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${tipoConfig[alerta.tipoMovimentacao].className}`}>
                        {tipoConfig[alerta.tipoMovimentacao].label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${statusConfig[alerta.status].className}`}>
                        {statusConfig[alerta.status].label}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground">CPF: {alerta.cpf}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[12px]">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Building2 className="w-3 h-3" strokeWidth={1.5} /> {alerta.unidadeHospitalar}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <HeartPulse className="w-3 h-3" strokeWidth={1.5} /> {alerta.unidadeAPS}
                      </span>
                      <span className="text-muted-foreground tabular-nums">{alerta.dataMovimentacao}</span>
                      {alerta.responsavelAPS && (
                        <span className="text-muted-foreground">Resp.: <span className="font-medium text-foreground">{alerta.responsavelAPS}</span></span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-muted-foreground tabular-nums flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={1.5} /> {alerta.tempoDecorrido}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                          <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="text-[13px]">
                          <Eye className="mr-2 h-4 w-4" strokeWidth={1.5} /> Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-[13px]">Cobrar resposta da UBS</DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px]">Encerrar alerta</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
            {alertasFiltrados.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">Nenhum alerta encontrado com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
