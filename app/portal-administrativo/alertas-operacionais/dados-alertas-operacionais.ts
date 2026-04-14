import { AlertTriangle, FileX, UserX } from "lucide-react"

// ── Tipos ────────────────────────────────────────────────────────────────────

export type CategoriaAlertaOp = "inconsistencia_status" | "pendencia_registro" | "dados_incompletos"
export type PrioridadeAlertaOp = "critica" | "alta" | "media"
export type StatusAlertaOp = "pendente" | "em_analise" | "resolvido"

export interface AlertaOperacional {
  id: string
  pacienteId: string
  paciente: string
  cpf: string
  categoria: CategoriaAlertaOp
  descricao: string
  prioridade: PrioridadeAlertaOp
  unidade: string
  dataDeteccao: string
  status: StatusAlertaOp
}

// ── Configuracoes visuais ────────────────────────────────────────────────────

export const categoriaConfig: Record<CategoriaAlertaOp, { label: string; icon: React.ElementType; bg: string; text: string }> = {
  inconsistencia_status: { label: "Inconsistencia de status", icon: AlertTriangle, bg: "bg-red-50", text: "text-red-700" },
  pendencia_registro:    { label: "Pendencia de registro",    icon: FileX,          bg: "bg-orange-50", text: "text-orange-700" },
  dados_incompletos:     { label: "Dados incompletos",        icon: UserX,          bg: "bg-amber-50", text: "text-amber-700" },
}

export const prioridadeConfig: Record<PrioridadeAlertaOp, { label: string; dot: string; ordem: number }> = {
  critica: { label: "Critica", dot: "bg-red-500",    ordem: 0 },
  alta:    { label: "Alta",    dot: "bg-orange-500",  ordem: 1 },
  media:   { label: "Media",   dot: "bg-yellow-500",  ordem: 2 },
}

export const statusAlertaOpConfig: Record<StatusAlertaOp, { label: string; className: string }> = {
  pendente:   { label: "Pendente",   className: "bg-destructive/10 text-destructive" },
  em_analise: { label: "Em analise", className: "bg-primary/10 text-primary" },
  resolvido:  { label: "Resolvido",  className: "bg-emerald-100 text-emerald-700" },
}

// ── Dados mockados ───────────────────────────────────────────────────────────

export const MOCK_ALERTAS_OPERACIONAIS: AlertaOperacional[] = [
  {
    id: "op-1",
    pacienteId: "1",
    paciente: "Maria Silva Santos",
    cpf: "123.456.789-00",
    categoria: "inconsistencia_status",
    descricao: "Paciente consta como internada no sistema, mas alta foi realizada em 15/02/2026",
    prioridade: "critica",
    unidade: "Hospital Municipal de Buzios",
    dataDeteccao: "05/03/2026",
    status: "pendente",
  },
  {
    id: "op-2",
    pacienteId: "2",
    paciente: "Jose Oliveira Costa",
    cpf: "456.789.123-11",
    categoria: "pendencia_registro",
    descricao: "Alta hospitalar de 28/02/2026 sem registro de prescricao de alta e orientacoes",
    prioridade: "alta",
    unidade: "Hospital Municipal de Buzios",
    dataDeteccao: "04/03/2026",
    status: "pendente",
  },
  {
    id: "op-3",
    pacienteId: "4",
    paciente: "Carlos Eduardo Lima",
    cpf: "321.654.987-33",
    categoria: "dados_incompletos",
    descricao: "Sessao de quimioterapia de 25/02 sem registro de medicamentos administrados",
    prioridade: "alta",
    unidade: "Hospital Regional",
    dataDeteccao: "03/03/2026",
    status: "em_analise",
  },
  {
    id: "op-4",
    pacienteId: "3",
    paciente: "Ana Carolina Pereira",
    cpf: "789.123.456-22",
    categoria: "pendencia_registro",
    descricao: "Ultrassom obstetrico de 20/02 sem laudo anexado ao prontuario",
    prioridade: "media",
    unidade: "Hospital Municipal de Buzios",
    dataDeteccao: "02/03/2026",
    status: "pendente",
  },
  {
    id: "op-5",
    pacienteId: "6",
    paciente: "Jose Maria da Silva",
    cpf: "111.222.333-44",
    categoria: "dados_incompletos",
    descricao: "Consulta de 10/02 sem CID registrado e sem encaminhamento formalizado",
    prioridade: "media",
    unidade: "UBS Centro",
    dataDeteccao: "01/03/2026",
    status: "resolvido",
  },
  {
    id: "op-6",
    pacienteId: "5",
    paciente: "Mariana Souza Rodrigues",
    cpf: "654.987.321-44",
    categoria: "inconsistencia_status",
    descricao: "Paciente marcada como 'em atendimento' na UPA desde 15/01, mas ja recebeu alta",
    prioridade: "critica",
    unidade: "UPA Buzios",
    dataDeteccao: "28/02/2026",
    status: "pendente",
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function ordenarPorPrioridade(alertas: AlertaOperacional[]) {
  return [...alertas].sort((a, b) => prioridadeConfig[a.prioridade].ordem - prioridadeConfig[b.prioridade].ordem)
}

export function contarPorCategoria(alertas: AlertaOperacional[]) {
  const naoResolvidos = alertas.filter((a) => a.status !== "resolvido")
  return {
    total: naoResolvidos.length,
    inconsistencia_status: naoResolvidos.filter((a) => a.categoria === "inconsistencia_status").length,
    pendencia_registro: naoResolvidos.filter((a) => a.categoria === "pendencia_registro").length,
    dados_incompletos: naoResolvidos.filter((a) => a.categoria === "dados_incompletos").length,
  }
}
