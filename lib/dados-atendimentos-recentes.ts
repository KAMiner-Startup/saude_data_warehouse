import {
  Stethoscope,
  RefreshCcw,
  FlaskConical,
  Ambulance,
  BedDouble,
  LogOut,
  Syringe,
  type LucideIcon,
} from "lucide-react"

export type StatusAtendimento =
  | "atendido"
  | "em_atendimento"
  | "aguardando"
  | "nao_compareceu"

export type TipoAtendimento =
  | "consulta"
  | "retorno"
  | "exame"
  | "emergencia"
  | "internacao"
  | "alta"
  | "procedimento"

export type ContextoAtendimento = "hospitalar" | "aps"

export interface AtendimentoRecente {
  id: string
  pacienteId: string
  paciente: string
  cpf: string
  idade: number
  dataAtendimento: string
  horaAtendimento: string
  tipo: TipoAtendimento
  status: StatusAtendimento
  unidade: string
  equipe: string
  profissional: string
  contexto: ContextoAtendimento
  motivo?: string
  cid?: string
  faltasUltimos90Dias: number
  proximoAgendamento?: string
}

export const tipoAtendimentoConfig: Record<
  TipoAtendimento,
  { label: string; icon: LucideIcon; bg: string; text: string }
> = {
  consulta:     { label: "Consulta",     icon: Stethoscope,   bg: "bg-blue-50",    text: "text-blue-700" },
  retorno:      { label: "Retorno",      icon: RefreshCcw,    bg: "bg-cyan-50",    text: "text-cyan-700" },
  exame:        { label: "Exame",        icon: FlaskConical,  bg: "bg-violet-50",  text: "text-violet-700" },
  emergencia:   { label: "Emergencia",   icon: Ambulance,     bg: "bg-red-50",     text: "text-red-700" },
  internacao:   { label: "Internacao",   icon: BedDouble,     bg: "bg-orange-50",  text: "text-orange-700" },
  alta:         { label: "Alta",         icon: LogOut,        bg: "bg-emerald-50", text: "text-emerald-700" },
  procedimento: { label: "Procedimento", icon: Syringe,       bg: "bg-amber-50",   text: "text-amber-700" },
}

export const statusAtendimentoConfig: Record<
  StatusAtendimento,
  { label: string; className: string; dot: string }
> = {
  atendido:       { label: "Atendido",       className: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  em_atendimento: { label: "Em atendimento", className: "bg-blue-100 text-blue-700",       dot: "bg-blue-500" },
  aguardando:     { label: "Aguardando",     className: "bg-amber-100 text-amber-700",     dot: "bg-amber-500" },
  nao_compareceu: { label: "Nao compareceu", className: "bg-red-100 text-red-700",         dot: "bg-red-500" },
}

export const MOCK_ATENDIMENTOS_RECENTES: AtendimentoRecente[] = [
  {
    id: "at-1",
    pacienteId: "1",
    paciente: "Maria Silva Santos",
    cpf: "123.456.789-00",
    idade: 58,
    dataAtendimento: "05/03/2026",
    horaAtendimento: "14:32",
    tipo: "internacao",
    status: "em_atendimento",
    unidade: "Hospital Municipal de Buzios",
    equipe: "Clinica Medica - Ala B",
    profissional: "Dr. Ricardo Mendes",
    contexto: "hospitalar",
    motivo: "Descompensacao de insuficiencia cardiaca",
    cid: "I50.0",
    faltasUltimos90Dias: 0,
  },
  {
    id: "at-2",
    pacienteId: "2",
    paciente: "Jose Oliveira Costa",
    cpf: "456.789.123-11",
    idade: 67,
    dataAtendimento: "05/03/2026",
    horaAtendimento: "11:15",
    tipo: "alta",
    status: "atendido",
    unidade: "Hospital Municipal de Buzios",
    equipe: "Cardiologia",
    profissional: "Dra. Helena Faria",
    contexto: "hospitalar",
    motivo: "Alta hospitalar pos IAM",
    cid: "I21.9",
    faltasUltimos90Dias: 0,
    proximoAgendamento: "12/03/2026",
  },
  {
    id: "at-3",
    pacienteId: "3",
    paciente: "Ana Carolina Pereira",
    cpf: "789.123.456-22",
    idade: 28,
    dataAtendimento: "04/03/2026",
    horaAtendimento: "16:45",
    tipo: "consulta",
    status: "atendido",
    unidade: "UBS Central",
    equipe: "Equipe 001 - ESF Centro",
    profissional: "Dra. Beatriz Nunes",
    contexto: "aps",
    motivo: "Pre-natal - 26 semanas",
    cid: "Z34.0",
    faltasUltimos90Dias: 0,
    proximoAgendamento: "18/03/2026",
  },
  {
    id: "at-4",
    pacienteId: "4",
    paciente: "Carlos Eduardo Lima",
    cpf: "321.654.987-33",
    idade: 45,
    dataAtendimento: "04/03/2026",
    horaAtendimento: "10:20",
    tipo: "procedimento",
    status: "atendido",
    unidade: "Hospital Regional",
    equipe: "Oncologia",
    profissional: "Dr. Paulo Vieira",
    contexto: "hospitalar",
    motivo: "Sessao de quimioterapia",
    cid: "C50.9",
    faltasUltimos90Dias: 1,
    proximoAgendamento: "11/03/2026",
  },
  {
    id: "at-5",
    pacienteId: "5",
    paciente: "Mariana Souza Rodrigues",
    cpf: "654.987.321-44",
    idade: 34,
    dataAtendimento: "03/03/2026",
    horaAtendimento: "09:00",
    tipo: "retorno",
    status: "nao_compareceu",
    unidade: "UBS Central",
    equipe: "Equipe 002 - ESF Norte",
    profissional: "Dr. Andre Tavares",
    contexto: "aps",
    motivo: "Retorno hipertensao",
    cid: "I10",
    faltasUltimos90Dias: 3,
  },
  {
    id: "at-6",
    pacienteId: "6",
    paciente: "Jose Maria da Silva",
    cpf: "111.222.333-44",
    idade: 72,
    dataAtendimento: "03/03/2026",
    horaAtendimento: "08:30",
    tipo: "consulta",
    status: "atendido",
    unidade: "UBS Central",
    equipe: "Equipe 001 - ESF Centro",
    profissional: "Dra. Beatriz Nunes",
    contexto: "aps",
    motivo: "Acompanhamento diabetes tipo 2",
    cid: "E11.9",
    faltasUltimos90Dias: 0,
    proximoAgendamento: "31/03/2026",
  },
  {
    id: "at-7",
    pacienteId: "7",
    paciente: "Fernanda Rocha Almeida",
    cpf: "222.333.444-55",
    idade: 41,
    dataAtendimento: "02/03/2026",
    horaAtendimento: "15:10",
    tipo: "exame",
    status: "nao_compareceu",
    unidade: "Hospital Municipal de Buzios",
    equipe: "Radiologia",
    profissional: "Equipe de imagem",
    contexto: "hospitalar",
    motivo: "Ultrassom abdominal total",
    cid: "R10.4",
    faltasUltimos90Dias: 2,
  },
  {
    id: "at-8",
    pacienteId: "8",
    paciente: "Roberto Alves Pereira",
    cpf: "333.444.555-66",
    idade: 55,
    dataAtendimento: "02/03/2026",
    horaAtendimento: "13:40",
    tipo: "emergencia",
    status: "atendido",
    unidade: "UPA Buzios",
    equipe: "Pronto Socorro",
    profissional: "Dr. Lucas Martins",
    contexto: "hospitalar",
    motivo: "Dor toracica - descartada causa cardiaca",
    cid: "R07.4",
    faltasUltimos90Dias: 0,
  },
  {
    id: "at-9",
    pacienteId: "9",
    paciente: "Patricia Lopes Cardoso",
    cpf: "444.555.666-77",
    idade: 30,
    dataAtendimento: "05/03/2026",
    horaAtendimento: "09:30",
    tipo: "consulta",
    status: "aguardando",
    unidade: "UBS Central",
    equipe: "Equipe 001 - ESF Centro",
    profissional: "Dra. Beatriz Nunes",
    contexto: "aps",
    motivo: "Queixa de cefaleia recorrente",
    faltasUltimos90Dias: 0,
  },
  {
    id: "at-10",
    pacienteId: "10",
    paciente: "Antonio Gomes",
    cpf: "369.147.258-88",
    idade: 67,
    dataAtendimento: "01/03/2026",
    horaAtendimento: "10:00",
    tipo: "consulta",
    status: "nao_compareceu",
    unidade: "UBS Central",
    equipe: "Equipe 002 - ESF Norte",
    profissional: "Dr. Andre Tavares",
    contexto: "aps",
    motivo: "Avaliacao diabetes descompensada",
    cid: "E11.9",
    faltasUltimos90Dias: 4,
  },
]

export function filtrarPorContexto(
  atendimentos: AtendimentoRecente[],
  contexto: ContextoAtendimento
) {
  return atendimentos.filter((a) => a.contexto === contexto)
}

export function ordenarPorDataHora(atendimentos: AtendimentoRecente[]) {
  return [...atendimentos].sort((a, b) => {
    const [da, ma, ya] = a.dataAtendimento.split("/").map(Number)
    const [db, mb, yb] = b.dataAtendimento.split("/").map(Number)
    const [ha, mia] = a.horaAtendimento.split(":").map(Number)
    const [hb, mib] = b.horaAtendimento.split(":").map(Number)
    const dateA = new Date(ya, ma - 1, da, ha, mia)
    const dateB = new Date(yb, mb - 1, db, hb, mib)
    return dateB.getTime() - dateA.getTime()
  })
}

export function contarPorStatus(atendimentos: AtendimentoRecente[]) {
  return {
    total: atendimentos.length,
    atendido: atendimentos.filter((a) => a.status === "atendido").length,
    em_atendimento: atendimentos.filter((a) => a.status === "em_atendimento").length,
    aguardando: atendimentos.filter((a) => a.status === "aguardando").length,
    nao_compareceu: atendimentos.filter((a) => a.status === "nao_compareceu").length,
  }
}
