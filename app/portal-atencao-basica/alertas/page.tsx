"use client"

import { useState } from "react"
import {
  Bell,
  Eye,
  UserCheck,
  CheckCircle,
  Search,
  ClipboardList,
  Calendar,
  MessageSquare,
  X,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { cn } from "@/lib/utils"

type StatusAlerta = "novo" | "visualizado" | "em_acompanhamento" | "concluido"
type TipoAlerta = "alta" | "internacao" | "evasao" | "obito"
type AbaAtiva = "pendentes" | "em_acompanhamento" | "finalizados" | "todos"

interface Alerta {
  id: string
  paciente: string
  cpf: string
  cns: string
  tipo: TipoAlerta
  descricao: string
  dataAlerta: string
  unidadeOrigem: string
  status: StatusAlerta
  responsavel?: string
  dataAcompanhamento?: string
  observacaoAcompanhamento?: string
}

interface RegistroAcompanhamento {
  data: string
  tipo: string
  observacao: string
  profissional: string
}

const APS_COLOR = "oklch(0.55 0.18 160)"

const tipoConfig: Record<TipoAlerta, { label: string; className: string }> = {
  alta:       { label: "Alta hospitalar", className: "bg-emerald-50 text-emerald-700" },
  internacao: { label: "Internação",      className: "bg-destructive/10 text-destructive" },
  evasao:     { label: "Evasão",          className: "bg-orange-50 text-orange-700" },
  obito:      { label: "Óbito",           className: "bg-slate-100 text-slate-600" },
}

const statusConfig: Record<StatusAlerta, { label: string; className: string }> = {
  novo:              { label: "Novo",               className: "bg-destructive/10 text-destructive" },
  visualizado:       { label: "Visualizado",        className: "bg-muted text-muted-foreground" },
  em_acompanhamento: { label: "Em acompanhamento",  className: "" },
  concluido:         { label: "Concluído",          className: "bg-emerald-50 text-emerald-700" },
}

const MOCK_ALERTAS: Alerta[] = [
  {
    id: "1",
    paciente: "Maria Silva Santos",
    cpf: "123.456.789-00",
    cns: "898 0012 3456 7890",
    tipo: "alta",
    descricao: "Paciente recebeu alta após internação por descompensação de diabetes. Necessita acompanhamento glicêmico.",
    dataAlerta: "04/03/2026",
    unidadeOrigem: "Hospital Municipal de Búzios",
    status: "novo",
  },
  {
    id: "2",
    paciente: "José Oliveira Costa",
    cpf: "456.789.123-11",
    cns: "702 0034 5678 1234",
    tipo: "internacao",
    descricao: "Paciente internado por insuficiência cardíaca descompensada.",
    dataAlerta: "03/03/2026",
    unidadeOrigem: "Hospital Municipal de Búzios",
    status: "visualizado",
  },
  {
    id: "3",
    paciente: "Ana Carolina Pereira",
    cpf: "789.123.456-22",
    cns: "123 0056 7890 5678",
    tipo: "alta",
    descricao: "Alta pós-procedimento oncológico. Retorno ambulatorial em 15 dias.",
    dataAlerta: "02/03/2026",
    unidadeOrigem: "Hospital Municipal de Búzios",
    status: "em_acompanhamento",
    responsavel: "Dra. Ana Ferreira",
    dataAcompanhamento: "06/03/2026",
    observacaoAcompanhamento: "Paciente estável. Consulta agendada para 20/03.",
  },
  {
    id: "4",
    paciente: "Carlos Eduardo Lima",
    cpf: "321.654.987-33",
    cns: "456 0078 1234 9012",
    tipo: "evasao",
    descricao: "Paciente evadiu antes da alta médica. Família notificada.",
    dataAlerta: "01/03/2026",
    unidadeOrigem: "Hospital Municipal de Búzios",
    status: "novo",
  },
  {
    id: "5",
    paciente: "Mariana Souza Rodrigues",
    cpf: "654.987.321-44",
    cns: "789 0090 5678 3456",
    tipo: "obito",
    descricao: "Óbito hospitalar. Família necessita de suporte da equipe de saúde.",
    dataAlerta: "28/02/2026",
    unidadeOrigem: "Hospital Municipal de Búzios",
    status: "concluido",
    responsavel: "Dra. Ana Ferreira",
    dataAcompanhamento: "02/03/2026",
    observacaoAcompanhamento: "Família recebeu suporte e orientações.",
  },
]

const TIPOS_ACOMPANHAMENTO = [
  "Visita domiciliar",
  "Consulta presencial",
  "Contato telefônico",
  "Atendimento de urgência",
  "Orientação à família",
]

// ─── Modal de Registro de Acompanhamento (RF-APS-08) ───────────────────────
function ModalAcompanhamento({
  alerta,
  onClose,
  onSalvar,
}: {
  alerta: Alerta
  onClose: () => void
  onSalvar: (registro: RegistroAcompanhamento) => void
}) {
  const [tipo, setTipo] = useState("")
  const [data, setData] = useState("")
  const [observacao, setObservacao] = useState("")
  const [profissional, setProfissional] = useState("Dra. Ana Ferreira")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tipo || !data) return
    onSalvar({ tipo, data, observacao, profissional })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg bg-background rounded-[24px] shadow-2xl overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between p-6 pb-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}
            >
              <ClipboardList className="w-4 h-4" style={{ color: APS_COLOR }} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Registrar Acompanhamento</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">{alerta.paciente}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Contexto do alerta */}
        <div className="px-6 py-3" style={{ background: "oklch(0.55 0.18 160 / 0.04)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold", tipoConfig[alerta.tipo].className)}>
              {tipoConfig[alerta.tipo].label}
            </span>
            <span className="text-[12px] text-muted-foreground">{alerta.dataAlerta}</span>
            <span className="text-[12px] text-muted-foreground">&middot; {alerta.unidadeOrigem}</span>
          </div>
          <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">{alerta.descricao}</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de acompanhamento */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-foreground">
              Tipo de acompanhamento <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
                className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] pr-9 text-foreground focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: APS_COLOR } as React.CSSProperties}
              >
                <option value="">Selecione...</option>
                {TIPOS_ACOMPANHAMENTO.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
            </div>
          </div>

          {/* Data */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              Data do acompanhamento <span className="text-destructive">*</span>
            </label>
            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
              className="rounded-xl text-[13px]"
            />
          </div>

          {/* Profissional responsável */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              Profissional responsável
            </label>
            <Input
              value={profissional}
              onChange={(e) => setProfissional(e.target.value)}
              placeholder="Nome do profissional"
              className="rounded-xl text-[13px]"
            />
          </div>

          {/* Observações */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              Observações
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Descreva o acompanhamento realizado, condição do paciente, orientações fornecidas..."
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2"
            />
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full text-[13px]"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-full text-[13px] text-white font-semibold"
              style={{ background: APS_COLOR }}
            >
              Registrar acompanhamento
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Card individual de alerta ──────────────────────────────────────────────
function CardAlerta({
  alerta,
  onRegistrarAcompanhamento,
}: {
  alerta: Alerta
  onRegistrarAcompanhamento: (alerta: Alerta) => void
}) {
  return (
    <div
      className="p-4 rounded-xl bg-card hover:bg-muted/30 transition-all duration-150"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/portal-atencao-basica/paciente/${alerta.id}`}
              className="font-semibold text-sm text-foreground hover:underline"
              style={{}}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = APS_COLOR)}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "")}
            >
              {alerta.paciente}
            </Link>
            <span
              className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold", statusConfig[alerta.status].className)}
              style={alerta.status === "em_acompanhamento" ? { background: "oklch(0.55 0.18 160 / 0.10)", color: APS_COLOR } : {}}
            >
              {statusConfig[alerta.status].label}
            </span>
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium", tipoConfig[alerta.tipo].className)}>
              {tipoConfig[alerta.tipo].label}
            </span>
          </div>

          <p className="text-[12px] text-muted-foreground">
            CPF: {alerta.cpf} &middot; CNS: {alerta.cns}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[13px]">
            <span className="text-muted-foreground tabular-nums">{alerta.dataAlerta}</span>
            <span className="text-muted-foreground">Origem: {alerta.unidadeOrigem}</span>
          </div>

          <p className="text-[13px] text-muted-foreground leading-relaxed">{alerta.descricao}</p>

          {alerta.responsavel && (
            <p className="text-[12px] text-muted-foreground">
              Responsável: <span className="font-semibold text-foreground">{alerta.responsavel}</span>
              {alerta.dataAcompanhamento && (
                <span className="ml-2 text-muted-foreground">· Acomp. em {alerta.dataAcompanhamento}</span>
              )}
            </p>
          )}

          {alerta.observacaoAcompanhamento && (
            <div
              className="mt-2 px-3 py-2 rounded-lg text-[12px] text-muted-foreground leading-relaxed"
              style={{ background: "oklch(0.55 0.18 160 / 0.05)", border: "1px solid oklch(0.55 0.18 160 / 0.12)" }}
            >
              <span className="font-semibold" style={{ color: APS_COLOR }}>Observação: </span>
              {alerta.observacaoAcompanhamento}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl border-border text-[13px]">
                Ações
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem className="text-[13px]">
                <Eye className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Marcar como visualizado
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-[13px]"
                onClick={() => onRegistrarAcompanhamento(alerta)}
              >
                <ClipboardList className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Registrar acompanhamento
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[13px]">
                <CheckCircle className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Marcar como concluído
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="default"
            size="sm"
            className="rounded-xl text-[13px] text-white"
            style={{ background: APS_COLOR }}
            asChild
          >
            <Link href={`/portal-atencao-basica/paciente/${alerta.id}`}>Ver paciente</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ───────────────────────────────────────────────────────
export default function AlertasApsPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("pendentes")
  const [busca, setBusca] = useState("")
  const [alertaParaAcompanhar, setAlertaParaAcompanhar] = useState<Alerta | null>(null)

  const alertasFiltradosPorAba = MOCK_ALERTAS.filter((a) => {
    if (abaAtiva === "pendentes")       return a.status === "novo" || a.status === "visualizado"
    if (abaAtiva === "em_acompanhamento") return a.status === "em_acompanhamento"
    if (abaAtiva === "finalizados")     return a.status === "concluido"
    return true
  })

  const alertasExibidos = alertasFiltradosPorAba.filter((a) =>
    busca === "" ||
    a.paciente.toLowerCase().includes(busca.toLowerCase()) ||
    a.cpf.includes(busca)
  )

  const contadores = {
    pendentes:          MOCK_ALERTAS.filter((a) => a.status === "novo" || a.status === "visualizado").length,
    em_acompanhamento:  MOCK_ALERTAS.filter((a) => a.status === "em_acompanhamento").length,
    finalizados:        MOCK_ALERTAS.filter((a) => a.status === "concluido").length,
    todos:              MOCK_ALERTAS.length,
  }

  const abas: { id: AbaAtiva; label: string; count: number }[] = [
    { id: "pendentes",         label: "Pendentes",         count: contadores.pendentes },
    { id: "em_acompanhamento", label: "Em acompanhamento", count: contadores.em_acompanhamento },
    { id: "finalizados",       label: "Finalizados",       count: contadores.finalizados },
    { id: "todos",             label: "Todos",             count: contadores.todos },
  ]

  return (
    <>
      {/* Modal RF-APS-08 */}
      {alertaParaAcompanhar && (
        <ModalAcompanhamento
          alerta={alertaParaAcompanhar}
          onClose={() => setAlertaParaAcompanhar(null)}
          onSalvar={(registro) => {
            console.log("[v0] Acompanhamento registrado:", registro)
            setAlertaParaAcompanhar(null)
          }}
        />
      )}

      <div className="p-4 md:p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            Alertas
          </h1>
          <p className="text-sm text-muted-foreground">
            Alertas hospitalares sobre pacientes da sua carteira
          </p>
        </div>

        {/* Abas de navegação */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 w-fit">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer",
                abaAtiva === aba.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {aba.label}
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold",
                  abaAtiva === aba.id
                    ? "text-white"
                    : "bg-muted text-muted-foreground"
                )}
                style={abaAtiva === aba.id ? { background: APS_COLOR } : {}}
              >
                {aba.count}
              </span>
            </button>
          ))}
        </div>

        {/* Lista */}
        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}
                  >
                    <Bell className="w-3.5 h-3.5" style={{ color: APS_COLOR }} strokeWidth={1.25} />
                  </div>
                  {abas.find((a) => a.id === abaAtiva)?.label}
                </CardTitle>
                <CardDescription className="text-[13px] mt-1">
                  {alertasExibidos.length} alerta(s) encontrado(s)
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <Input
                  placeholder="Buscar por nome ou CPF..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9 h-9 rounded-xl text-[13px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertasExibidos.map((alerta) => (
                <CardAlerta
                  key={alerta.id}
                  alerta={alerta}
                  onRegistrarAcompanhamento={setAlertaParaAcompanhar}
                />
              ))}
              {alertasExibidos.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" strokeWidth={1} />
                  <p className="text-sm">Nenhum alerta encontrado.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
