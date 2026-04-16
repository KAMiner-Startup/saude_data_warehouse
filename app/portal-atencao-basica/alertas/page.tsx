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
  Hospital,
  Activity,
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

type TipoAlerta =
  | "alta"
  | "internacao"
  | "evasao"
  | "obito"
  | "descompensado"
  | "ausencia_exame"
  | "ausencia_consulta"
  | "indicador_diabetes"
  | "indicador_has"

type CategoriaAlerta = "evento_hospitalar" | "indicador_cronico"

type AbaAtiva = "pendentes" | "em_acompanhamento" | "finalizados" | "todos"
type FiltroCategoria = CategoriaAlerta | "todas"

interface Alerta {
  id: string
  paciente: string
  cpf: string
  cns: string
  tipo: TipoAlerta
  categoria: CategoriaAlerta
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
const APS_BG = "oklch(0.55 0.18 160 / 0.10)"

const tipoConfig: Record<TipoAlerta, { label: string; className: string }> = {
  alta:               { label: "Alta hospitalar",       className: "bg-emerald-50 text-emerald-700" },
  internacao:         { label: "Internacao",            className: "bg-destructive/10 text-destructive" },
  evasao:             { label: "Evasao",                className: "bg-orange-50 text-orange-700" },
  obito:              { label: "Obito",                 className: "bg-slate-100 text-slate-600" },
  descompensado:      { label: "Paciente descompensado", className: "bg-red-100 text-red-700" },
  ausencia_exame:     { label: "Exame nao realizado",   className: "bg-amber-50 text-amber-700" },
  ausencia_consulta:  { label: "Consulta em atraso",    className: "bg-orange-50 text-orange-700" },
  indicador_diabetes: { label: "Alerta - Diabetes",     className: "bg-violet-50 text-violet-700" },
  indicador_has:      { label: "Alerta - Hipertensao",  className: "bg-blue-50 text-blue-700" },
}

const categoriaConfig: Record<CategoriaAlerta, {
  label: string
  descricao: string
  icon: React.ElementType
  bg: string
  text: string
  ringColor: string
}> = {
  evento_hospitalar: {
    label: "Eventos hospitalares",
    descricao: "Altas, internacoes e eventos na rede hospitalar",
    icon: Hospital,
    bg: "bg-red-50",
    text: "text-red-700",
    ringColor: "oklch(0.63 0.22 22)",
  },
  indicador_cronico: {
    label: "Indicadores e cronicas",
    descricao: "Alertas por ausencia de exames, consultas e descompensacao",
    icon: Activity,
    bg: "bg-violet-50",
    text: "text-violet-700",
    ringColor: "oklch(0.49 0.22 277)",
  },
}

const statusConfig: Record<StatusAlerta, { label: string; className: string }> = {
  novo:              { label: "Novo",               className: "bg-destructive/10 text-destructive" },
  visualizado:       { label: "Visualizado",        className: "bg-muted text-muted-foreground" },
  em_acompanhamento: { label: "Em acompanhamento",  className: "" },
  concluido:         { label: "Concluido",          className: "bg-emerald-50 text-emerald-700" },
}

const MOCK_ALERTAS: Alerta[] = [
  // Eventos hospitalares
  {
    id: "1",
    paciente: "Maria Silva Santos",
    cpf: "123.456.789-00",
    cns: "898 0012 3456 7890",
    tipo: "alta",
    categoria: "evento_hospitalar",
    descricao: "Paciente recebeu alta apos internacao por descompensacao de diabetes. Necessita acompanhamento glicemico urgente.",
    dataAlerta: "04/03/2026",
    unidadeOrigem: "Hospital Municipal de Buzios",
    status: "novo",
  },
  {
    id: "2",
    paciente: "Jose Oliveira Costa",
    cpf: "456.789.123-11",
    cns: "702 0034 5678 1234",
    tipo: "internacao",
    categoria: "evento_hospitalar",
    descricao: "Paciente internado por insuficiencia cardiaca descompensada.",
    dataAlerta: "03/03/2026",
    unidadeOrigem: "Hospital Municipal de Buzios",
    status: "visualizado",
  },
  {
    id: "3",
    paciente: "Ana Carolina Pereira",
    cpf: "789.123.456-22",
    cns: "123 0056 7890 5678",
    tipo: "alta",
    categoria: "evento_hospitalar",
    descricao: "Alta pos-procedimento oncologico. Retorno ambulatorial em 15 dias.",
    dataAlerta: "02/03/2026",
    unidadeOrigem: "Hospital Municipal de Buzios",
    status: "em_acompanhamento",
    responsavel: "Dra. Ana Ferreira",
    dataAcompanhamento: "06/03/2026",
    observacaoAcompanhamento: "Paciente estavel. Consulta agendada para 20/03.",
  },
  {
    id: "4",
    paciente: "Carlos Eduardo Lima",
    cpf: "321.654.987-33",
    cns: "456 0078 1234 9012",
    tipo: "evasao",
    categoria: "evento_hospitalar",
    descricao: "Paciente evadiu antes da alta medica. Familia notificada.",
    dataAlerta: "01/03/2026",
    unidadeOrigem: "Hospital Municipal de Buzios",
    status: "novo",
  },
  {
    id: "5",
    paciente: "Mariana Souza Rodrigues",
    cpf: "654.987.321-44",
    cns: "789 0090 5678 3456",
    tipo: "obito",
    categoria: "evento_hospitalar",
    descricao: "Obito hospitalar. Familia necessita de suporte da equipe de saude.",
    dataAlerta: "28/02/2026",
    unidadeOrigem: "Hospital Municipal de Buzios",
    status: "concluido",
    responsavel: "Dra. Ana Ferreira",
    dataAcompanhamento: "02/03/2026",
    observacaoAcompanhamento: "Familia recebeu suporte e orientacoes.",
  },
  // Indicadores e cronicas
  {
    id: "6",
    paciente: "Antonio Gomes",
    cpf: "369.147.258-88",
    cns: "789 0044 5566 7788",
    tipo: "ausencia_exame",
    categoria: "indicador_cronico",
    descricao: "Paciente diabetico sem hemoglobina glicada (HbA1c) ha mais de 6 meses. Ultimo exame: 10/08/2025.",
    dataAlerta: "05/03/2026",
    unidadeOrigem: "UBS Central",
    status: "novo",
  },
  {
    id: "7",
    paciente: "Rosana Melo Santos",
    cpf: "192.774.050-33",
    cns: "456 0078 1234 9012",
    tipo: "descompensado",
    categoria: "indicador_cronico",
    descricao: "Paciente hipertensa com PA 180/110 mmHg registrada na ultima visita. Medicacao atual pode ser insuficiente.",
    dataAlerta: "04/03/2026",
    unidadeOrigem: "UBS Central",
    status: "novo",
  },
  {
    id: "8",
    paciente: "Jose Augusto Correia",
    cpf: "511.023.770-88",
    cns: "123 0056 7890 5678",
    tipo: "indicador_diabetes",
    categoria: "indicador_cronico",
    descricao: "Paciente com diabetes tipo 2 sem consulta de acompanhamento ha 4 meses. Risco de descompensacao.",
    dataAlerta: "03/03/2026",
    unidadeOrigem: "UBS Central",
    status: "em_acompanhamento",
    responsavel: "Dr. Andre Tavares",
    dataAcompanhamento: "05/03/2026",
    observacaoAcompanhamento: "Consulta agendada para 12/03. Orientacoes sobre dieta repassadas por telefone.",
  },
  {
    id: "9",
    paciente: "Severino Ramos",
    cpf: "982.011.440-22",
    cns: "321 0099 8877 6655",
    tipo: "ausencia_consulta",
    categoria: "indicador_cronico",
    descricao: "Paciente hipertenso sem consulta medica ha 5 meses. Ultima consulta: 01/10/2025.",
    dataAlerta: "02/03/2026",
    unidadeOrigem: "UBS Norte",
    status: "novo",
  },
  {
    id: "10",
    paciente: "Neide Aparecida Santos",
    cpf: "543.210.987-44",
    cns: "654 0011 2255 3388",
    tipo: "indicador_has",
    categoria: "indicador_cronico",
    descricao: "Paciente hipertensa sem aferimento de PA registrado nos ultimos 3 meses. Necessita visita domiciliar.",
    dataAlerta: "01/03/2026",
    unidadeOrigem: "UBS Norte",
    status: "novo",
  },
]

const TIPOS_ACOMPANHAMENTO = [
  "Visita domiciliar",
  "Consulta presencial",
  "Contato telefonico",
  "Atendimento de urgencia",
  "Orientacao a familia",
]

// Modal de Registro de Acompanhamento
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
        <div
          className="flex items-start justify-between p-6 pb-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: APS_BG }}>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              >
                <option value="">Selecione...</option>
                {TIPOS_ACOMPANHAMENTO.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
            </div>
          </div>

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

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              Profissional responsavel
            </label>
            <Input
              value={profissional}
              onChange={(e) => setProfissional(e.target.value)}
              placeholder="Nome do profissional"
              className="rounded-xl text-[13px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              Observacoes
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Descreva o acompanhamento realizado, condicao do paciente, orientacoes fornecidas..."
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2"
            />
          </div>

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

// Card individual de alerta
function CardAlerta({
  alerta,
  onRegistrarAcompanhamento,
}: {
  alerta: Alerta
  onRegistrarAcompanhamento: (alerta: Alerta) => void
}) {
  const catCfg = categoriaConfig[alerta.categoria]

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
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = APS_COLOR)}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "")}
            >
              {alerta.paciente}
            </Link>
            <span
              className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold", statusConfig[alerta.status].className)}
              style={alerta.status === "em_acompanhamento" ? { background: APS_BG, color: APS_COLOR } : {}}
            >
              {statusConfig[alerta.status].label}
            </span>
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium", tipoConfig[alerta.tipo].className)}>
              {tipoConfig[alerta.tipo].label}
            </span>
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium", catCfg.bg, catCfg.text)}>
              {alerta.categoria === "evento_hospitalar" ? "Hospitalar" : "Cronica"}
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
              Responsavel: <span className="font-semibold text-foreground">{alerta.responsavel}</span>
              {alerta.dataAcompanhamento && (
                <span className="ml-2 text-muted-foreground">- Acomp. em {alerta.dataAcompanhamento}</span>
              )}
            </p>
          )}

          {alerta.observacaoAcompanhamento && (
            <div
              className="mt-2 px-3 py-2 rounded-lg text-[12px] text-muted-foreground leading-relaxed"
              style={{ background: "oklch(0.55 0.18 160 / 0.05)", border: "1px solid oklch(0.55 0.18 160 / 0.12)" }}
            >
              <span className="font-semibold" style={{ color: APS_COLOR }}>Observacao: </span>
              {alerta.observacaoAcompanhamento}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl border-border text-[13px]">
                Acoes
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
                Marcar como concluido
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

// Pagina principal
export default function AlertasApsPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("pendentes")
  const [filtroCategoria, setFiltroCategoria] = useState<FiltroCategoria>("todas")
  const [busca, setBusca] = useState("")
  const [alertaParaAcompanhar, setAlertaParaAcompanhar] = useState<Alerta | null>(null)

  const alertasFiltradosPorAba = MOCK_ALERTAS.filter((a) => {
    if (abaAtiva === "pendentes")         return a.status === "novo" || a.status === "visualizado"
    if (abaAtiva === "em_acompanhamento") return a.status === "em_acompanhamento"
    if (abaAtiva === "finalizados")       return a.status === "concluido"
    return true
  })

  const alertasExibidos = alertasFiltradosPorAba.filter((a) => {
    const matchCategoria = filtroCategoria === "todas" || a.categoria === filtroCategoria
    const matchBusca =
      busca === "" ||
      a.paciente.toLowerCase().includes(busca.toLowerCase()) ||
      a.cpf.includes(busca)
    return matchCategoria && matchBusca
  })

  const contadores = {
    pendentes:          MOCK_ALERTAS.filter((a) => a.status === "novo" || a.status === "visualizado").length,
    em_acompanhamento:  MOCK_ALERTAS.filter((a) => a.status === "em_acompanhamento").length,
    finalizados:        MOCK_ALERTAS.filter((a) => a.status === "concluido").length,
    todos:              MOCK_ALERTAS.length,
  }

  const contadoresCategoria = {
    evento_hospitalar: MOCK_ALERTAS.filter((a) => a.categoria === "evento_hospitalar" && a.status !== "concluido").length,
    indicador_cronico: MOCK_ALERTAS.filter((a) => a.categoria === "indicador_cronico" && a.status !== "concluido").length,
  }

  const abas: { id: AbaAtiva; label: string; count: number }[] = [
    { id: "pendentes",          label: "Pendentes",          count: contadores.pendentes },
    { id: "em_acompanhamento",  label: "Em acompanhamento",  count: contadores.em_acompanhamento },
    { id: "finalizados",        label: "Finalizados",        count: contadores.finalizados },
    { id: "todos",              label: "Todos",              count: contadores.todos },
  ]

  return (
    <>
      {alertaParaAcompanhar && (
        <ModalAcompanhamento
          alerta={alertaParaAcompanhar}
          onClose={() => setAlertaParaAcompanhar(null)}
          onSalvar={(registro) => {
            console.log("[mock] Acompanhamento registrado:", registro)
            setAlertaParaAcompanhar(null)
          }}
        />
      )}

      <div className="p-4 md:p-6 space-y-6">
        {/* Cabecalho */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: APS_COLOR }}>
            Monitoramento
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Alertas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Alertas sobre pacientes da sua unidade - eventos hospitalares e indicadores de saude
          </p>
        </div>

        {/* Cards de resumo por categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["evento_hospitalar", "indicador_cronico"] as CategoriaAlerta[]).map((cat) => {
            const cfg = categoriaConfig[cat]
            const Icon = cfg.icon
            const count = contadoresCategoria[cat]
            const ativo = filtroCategoria === cat

            return (
              <Card
                key={cat}
                className={cn(
                  "rounded-[20px] border-none cursor-pointer transition-all",
                  ativo ? "ring-2" : ""
                )}
                style={{
                  boxShadow: "var(--shadow-soft)",
                  ...(ativo ? { ringColor: cfg.ringColor } : {}),
                }}
                onClick={() => setFiltroCategoria(ativo ? "todas" : cat)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {cfg.label}
                      </p>
                      <p className="text-3xl font-bold mt-2 text-foreground">{count}</p>
                      <p className="text-[12px] text-muted-foreground mt-1">{cfg.descricao}</p>
                    </div>
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", cfg.bg)}>
                      <Icon className={cn("w-4 h-4", cfg.text)} strokeWidth={1.5} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Abas de navegacao */}
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
                  abaAtiva === aba.id ? "text-white" : "bg-muted text-muted-foreground"
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
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: APS_BG }}>
                    <Bell className="w-3.5 h-3.5" style={{ color: APS_COLOR }} strokeWidth={1.25} />
                  </div>
                  {filtroCategoria === "todas"
                    ? abas.find((a) => a.id === abaAtiva)?.label
                    : `${abas.find((a) => a.id === abaAtiva)?.label} - ${categoriaConfig[filtroCategoria].label}`}
                </CardTitle>
                <CardDescription className="text-[13px] mt-1">
                  {alertasExibidos.length} alerta(s) encontrado(s)
                  {filtroCategoria !== "todas" && (
                    <button
                      onClick={() => setFiltroCategoria("todas")}
                      className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
                      style={{ color: APS_COLOR }}
                    >
                      <X className="w-3 h-3" />
                      Limpar filtro
                    </button>
                  )}
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
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
