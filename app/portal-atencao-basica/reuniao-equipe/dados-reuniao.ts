import {
  Baby, Pill, Heart, Brain, Activity, AlertTriangle, FlaskConical,
  type LucideIcon,
} from "lucide-react"

// Indicadores resumidos para a reunião

export interface IndicadorResumo {
  id: string
  nome: string
  icon: LucideIcon
  cor: string
  corBg: string
  cobertura: number
  meta: number
  foraPrazo: number
  total: number
  tendencia: "up" | "down" | "stable"
}

export const INDICADORES_REUNIAO: IndicadorResumo[] = [
  { id: "gestantes", nome: "Gestantes", icon: Baby, cor: "#db2777", corBg: "bg-pink-50", cobertura: 67, meta: 100, foraPrazo: 4, total: 12, tendencia: "up" },
  { id: "diabetes", nome: "Diabéticos", icon: Pill, cor: "#d97706", corBg: "bg-amber-50", cobertura: 82, meta: 90, foraPrazo: 6, total: 34, tendencia: "stable" },
  { id: "hemoglobina", nome: "HbA1c", icon: FlaskConical, cor: "#0284c7", corBg: "bg-sky-50", cobertura: 62, meta: 85, foraPrazo: 13, total: 34, tendencia: "down" },
  { id: "hipertensao", nome: "Hipertensos", icon: Heart, cor: "#7c3aed", corBg: "bg-violet-50", cobertura: 91, meta: 90, foraPrazo: 5, total: 58, tendencia: "up" },
  { id: "pos_alta", nome: "Pós-alta", icon: Activity, cor: "#dc2626", corBg: "bg-red-50", cobertura: 50, meta: 100, foraPrazo: 4, total: 8, tendencia: "down" },
  { id: "saude_mental", nome: "Saúde mental", icon: Brain, cor: "#0891b2", corBg: "bg-cyan-50", cobertura: 72, meta: 85, foraPrazo: 5, total: 18, tendencia: "stable" },
  { id: "reinternacoes", nome: "Reinternações", icon: AlertTriangle, cor: "#ea580c", corBg: "bg-orange-50", cobertura: 40, meta: 100, foraPrazo: 3, total: 5, tendencia: "down" },
]

// Alertas ativos da unidade

export type TipoAlertaReuniao =
  | "alta"
  | "internacao"
  | "evasao"
  | "descompensado"
  | "ausencia_exame"

export interface AlertaReuniao {
  id: string
  pacienteId: string
  paciente: string
  tipo: TipoAlertaReuniao
  descricao: string
  data: string
}

const tipoAlertaLabels: Record<TipoAlertaReuniao, { label: string; className: string }> = {
  alta:            { label: "Alta hospitalar",       className: "bg-emerald-50 text-emerald-700" },
  internacao:      { label: "Internação",            className: "bg-destructive/10 text-destructive" },
  evasao:          { label: "Evasão",                className: "bg-orange-50 text-orange-700" },
  descompensado:   { label: "Descompensado",         className: "bg-red-100 text-red-700" },
  ausencia_exame:  { label: "Exame não realizado",   className: "bg-amber-50 text-amber-700" },
}

export { tipoAlertaLabels }

export const ALERTAS_REUNIAO: AlertaReuniao[] = [
  { id: "a1", pacienteId: "1", paciente: "Maria Silva Santos", tipo: "alta", descricao: "Alta após descompensação de diabetes", data: "04/03/2026" },
  { id: "a2", pacienteId: "2", paciente: "José Oliveira Costa", tipo: "internacao", descricao: "Insuficiência cardíaca descompensada", data: "03/03/2026" },
  { id: "a3", pacienteId: "4", paciente: "Carlos Eduardo Lima", tipo: "evasao", descricao: "Evadiu antes da alta médica", data: "01/03/2026" },
  { id: "a4", pacienteId: "8", paciente: "Antônio Gomes", tipo: "ausencia_exame", descricao: "Sem hemoglobina glicada há 6+ meses", data: "05/03/2026" },
  { id: "a5", pacienteId: "4", paciente: "Rosana Melo Santos", tipo: "descompensado", descricao: "PA 180/110 na última visita", data: "04/03/2026" },
]

// Pacientes prioritarios agrupados por condicao

export type GrupoCondicao = "pos_alta" | "diabetes" | "hipertensao" | "gestante" | "saude_mental"


export interface PacientePrioritario {
  id: string
  nome: string
  acs: string
  diasAtraso: number
  grupo: GrupoCondicao
  motivo: string
  alertaAtivo: boolean
  cpf: string
  idade: number
  ultimoContato: string
  condicoes: string[]
}

export const grupoCondicaoConfig: Record<GrupoCondicao, {
  label: string
  icon: LucideIcon
  cor: string
  corBg: string
}> = {
  pos_alta:      { label: "Pós-alta hospitalar", icon: Activity, cor: "#dc2626", corBg: "bg-red-50" },
  diabetes:      { label: "Diabetes",            icon: Pill,     cor: "#d97706", corBg: "bg-amber-50" },
  hipertensao:   { label: "Hipertensão",         icon: Heart,    cor: "#7c3aed", corBg: "bg-violet-50" },
  gestante:      { label: "Gestantes",           icon: Baby,     cor: "#db2777", corBg: "bg-pink-50" },
  saude_mental:  { label: "Saúde mental",        icon: Brain,    cor: "#0891b2", corBg: "bg-cyan-50" },
}

export const PACIENTES_PRIORITARIOS: PacientePrioritario[] = [
  // Pós-alta
  { id: "1",  nome: "Maria das Graças Ferreira", acs: "João Carlos",  diasAtraso: 3, grupo: "pos_alta", motivo: "Alta por descompensação de diabetes - sem visita domiciliar", alertaAtivo: true, cpf: "821.344.090-11", idade: 58, ultimoContato: "28/02/2026", condicoes: ["Diabetes tipo 2", "Hipertensão"] },
  { id: "5",  nome: "Francisco Nunes Lima",      acs: "Fernanda Lima", diasAtraso: 4, grupo: "pos_alta", motivo: "Alta hospitalar pós-cirúrgica - acompanhamento pendente", alertaAtivo: true, cpf: "673.019.440-55", idade: 78, ultimoContato: "01/03/2026", condicoes: ["DPOC", "Hipertensão"] },
  { id: "9",  nome: "Severino Ramos",            acs: "Carla Souza",  diasAtraso: 6, grupo: "pos_alta", motivo: "Alta por pneumonia - risco de reinternação", alertaAtivo: true, cpf: "982.011.440-22", idade: 83, ultimoContato: "27/02/2026", condicoes: ["DPOC"] },
  // Diabetes
  { id: "3",  nome: "José Augusto Correia",      acs: "João Carlos",  diasAtraso: 35, grupo: "diabetes", motivo: "Sem acompanhamento trimestral - HbA1c vencida há 210 dias", alertaAtivo: false, cpf: "511.023.770-88", idade: 71, ultimoContato: "04/02/2026", condicoes: ["Diabetes tipo 2"] },
  { id: "8",  nome: "Antônio Gomes",             acs: "Carla Souza",  diasAtraso: 28, grupo: "diabetes", motivo: "HbA1c vencida há 195 dias - glicemia descontrolada", alertaAtivo: true, cpf: "369.147.258-88", idade: 67, ultimoContato: "11/02/2026", condicoes: ["Diabetes tipo 2", "Hipertensão"] },
  { id: "12", nome: "Rita de Cássia",            acs: "Fernanda Lima", diasAtraso: 22, grupo: "diabetes", motivo: "HbA1c vencida há 180 dias", alertaAtivo: false, cpf: "741.852.963-99", idade: 62, ultimoContato: "15/02/2026", condicoes: ["Diabetes tipo 2"] },
  // Hipertensão
  { id: "4",  nome: "Rosana Melo Santos",        acs: "Carla Souza",  diasAtraso: 12, grupo: "hipertensao", motivo: "PA 180/110 na última visita - descompensada", alertaAtivo: true, cpf: "192.774.050-33", idade: 53, ultimoContato: "01/03/2026", condicoes: ["Hipertensão", "Diabetes tipo 2"] },
  { id: "6",  nome: "João Batista Neto",         acs: "Fernanda Lima", diasAtraso: 8, grupo: "hipertensao", motivo: "Sem consulta de acompanhamento há 5 meses", alertaAtivo: false, cpf: "147.258.369-66", idade: 66, ultimoContato: "10/02/2026", condicoes: ["Hipertensão"] },
  // Gestantes
  { id: "2",  nome: "Ana Lúcia Barbosa",         acs: "Fernanda Lima", diasAtraso: 38, grupo: "gestante", motivo: "Visita mensal obrigatória atrasada - 26 semanas", alertaAtivo: false, cpf: "034.892.110-44", idade: 25, ultimoContato: "01/02/2026", condicoes: ["Gestante - 26 semanas"] },
  { id: "7",  nome: "Célia Regina Moura",        acs: "João Carlos",  diasAtraso: 32, grupo: "gestante", motivo: "Visita mensal obrigatória atrasada - 20 semanas", alertaAtivo: false, cpf: "258.369.147-77", idade: 24, ultimoContato: "05/02/2026", condicoes: ["Gestante - 20 semanas"] },
  // Saúde mental
  { id: "19", nome: "Luciana Barros",            acs: "João Carlos",  diasAtraso: 20, grupo: "saude_mental", motivo: "Monitoramento mensal atrasado - vulnerabilidade psicossocial", alertaAtivo: false, cpf: "159.357.258-11", idade: 38, ultimoContato: "18/02/2026", condicoes: ["Depressão", "Ansiedade"] },
  { id: "21", nome: "Marcos Pinheiro",           acs: "Fernanda Lima", diasAtraso: 14, grupo: "saude_mental", motivo: "Monitoramento mensal atrasado", alertaAtivo: false, cpf: "753.159.852-22", idade: 45, ultimoContato: "22/02/2026", condicoes: ["Esquizofrenia"] },
]

// Ações registradas na reunião

export type TipoAcao = "visita" | "consulta" | "encaminhamento" | "contato_telefonico" | "exame"

export const tipoAcaoConfig: Record<TipoAcao, { label: string }> = {
  visita:             { label: "Visita domiciliar" },
  consulta:           { label: "Consulta presencial" },
  encaminhamento:     { label: "Encaminhamento" },
  contato_telefonico: { label: "Contato telefônico" },
  exame:              { label: "Solicitar exame" },
}

export interface AcaoReuniao {
  id: string
  pacienteId: string
  paciente: string
  tipo: TipoAcao
  responsavel: string
  prazo: string
  observacao: string
}
