"use client"

import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Phone,
  Pill,
  AlertTriangle,
  Heart,
  Droplets,
  Scale,
  Ruler,
  Bell,
  UserCheck,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const APS_COLOR = "oklch(0.55 0.18 160)"

interface Alerta {
  tipo: string
  descricao: string
  data: string
  status: "novo" | "em_acompanhamento" | "concluido"
}

const pacientesData: Record<string, {
  id: string
  nome: string
  nomeMae: string
  cpf: string
  cns: string
  dataNascimento: string
  idade: number
  sexo: string
  telefone: string
  endereco: string
  unidadeReferencia: string
  equipeReferencia: string
  acs: string
  condicoesAtivas: string[]
  alergias: string[]
  medicamentosUso: { nome: string; dosagem: string; frequencia: string }[]
  sinaisVitais: { pressaoArterial: string; frequenciaCardiaca: string; peso: string; altura: string; imc: string }
  examesPendentes: string[]
  alertasHospitalares: Alerta[]
  historico: { data: string; tipo: string; local: string; profissional: string }[]
}> = {
  "1": {
    id: "1",
    nome: "Maria Silva Santos",
    nomeMae: "Ana Maria Silva",
    cpf: "123.456.789-00",
    cns: "898 0012 3456 7890",
    dataNascimento: "15/03/1985",
    idade: 40,
    sexo: "Feminino",
    telefone: "(22) 99999-1234",
    endereco: "Rua das Flores, 123 - Centro, Búzios/RJ",
    unidadeReferencia: "UBS Centro",
    equipeReferencia: "Equipe 001 - ESF Centro",
    acs: "João Mendes",
    condicoesAtivas: ["Hipertensão Arterial", "Diabetes Mellitus Tipo 2", "Obesidade"],
    alergias: ["Dipirona", "Penicilina"],
    medicamentosUso: [
      { nome: "Losartana", dosagem: "50mg", frequencia: "1x ao dia" },
      { nome: "Metformina", dosagem: "850mg", frequencia: "2x ao dia" },
      { nome: "AAS", dosagem: "100mg", frequencia: "1x ao dia" },
    ],
    sinaisVitais: { pressaoArterial: "140/90 mmHg", frequenciaCardiaca: "78 bpm", peso: "82 kg", altura: "1,65 m", imc: "30,1" },
    examesPendentes: ["Hemoglobina Glicada", "Perfil Lipídico"],
    alertasHospitalares: [
      { tipo: "Alta hospitalar", descricao: "Paciente recebeu alta após internação por descompensação de diabetes. Necessita acompanhamento glicêmico.", data: "04/03/2026", status: "novo" },
      { tipo: "Internação", descricao: "Paciente admitida com crise hipertensiva severa.", data: "10/02/2026", status: "concluido" },
    ],
    historico: [
      { data: "01/03/2026", tipo: "Consulta Médica", local: "UBS Centro", profissional: "Dra. Ana Ferreira" },
      { data: "15/02/2026", tipo: "Alta hospitalar", local: "Hospital Municipal", profissional: "Dr. Carlos Mendes" },
      { data: "10/02/2026", tipo: "Internação", local: "Hospital Municipal", profissional: "Dr. Carlos Mendes" },
      { data: "05/01/2026", tipo: "Exames Laboratoriais", local: "Laboratório Central", profissional: "-" },
    ],
  },
  "2": {
    id: "2",
    nome: "José Oliveira Costa",
    nomeMae: "Francisca Oliveira",
    cpf: "456.789.123-11",
    cns: "702 0034 5678 1234",
    dataNascimento: "22/07/1972",
    idade: 53,
    sexo: "Masculino",
    telefone: "(22) 98888-5678",
    endereco: "Av. José Bento, 456 - Manguinhos, Búzios/RJ",
    unidadeReferencia: "UBS Manguinhos",
    equipeReferencia: "Equipe 003 - ESF Manguinhos",
    acs: "Maria Campos",
    condicoesAtivas: ["Insuficiência Cardíaca", "DPOC", "Tabagismo"],
    alergias: [],
    medicamentosUso: [
      { nome: "Carvedilol", dosagem: "25mg", frequencia: "2x ao dia" },
      { nome: "Furosemida", dosagem: "40mg", frequencia: "1x ao dia" },
      { nome: "Enalapril", dosagem: "10mg", frequencia: "2x ao dia" },
      { nome: "Salbutamol", dosagem: "100mcg", frequencia: "SOS" },
    ],
    sinaisVitais: { pressaoArterial: "130/85 mmHg", frequenciaCardiaca: "88 bpm", peso: "75 kg", altura: "1,72 m", imc: "25,4" },
    examesPendentes: ["Ecocardiograma", "Espirometria"],
    alertasHospitalares: [
      { tipo: "Internação", descricao: "Paciente internado por insuficiência cardíaca descompensada.", data: "03/03/2026", status: "em_acompanhamento" },
    ],
    historico: [
      { data: "28/02/2026", tipo: "Internação", local: "Hospital Municipal", profissional: "Dr. João Silva" },
      { data: "20/02/2026", tipo: "Urgência", local: "UPA Búzios", profissional: "Dra. Maria" },
      { data: "15/02/2026", tipo: "Consulta Médica", local: "UBS Manguinhos", profissional: "Dr. Pedro" },
    ],
  },
  "3": {
    id: "3",
    nome: "Ana Carolina Pereira",
    nomeMae: "Lucia Pereira dos Santos",
    cpf: "789.123.456-22",
    cns: "123 0056 7890 5678",
    dataNascimento: "08/11/1990",
    idade: 35,
    sexo: "Feminino",
    telefone: "(22) 97777-9012",
    endereco: "Rua dos Pescadores, 78 - Geribá, Búzios/RJ",
    unidadeReferencia: "UBS Geribá",
    equipeReferencia: "Equipe 002 - ESF Geribá",
    acs: "João Mendes",
    condicoesAtivas: ["Gestante (32 semanas)", "Anemia Ferropriva"],
    alergias: ["Látex"],
    medicamentosUso: [
      { nome: "Sulfato Ferroso", dosagem: "300mg", frequencia: "1x ao dia" },
      { nome: "Ácido Fólico", dosagem: "5mg", frequencia: "1x ao dia" },
    ],
    sinaisVitais: { pressaoArterial: "110/70 mmHg", frequenciaCardiaca: "82 bpm", peso: "68 kg", altura: "1,60 m", imc: "26,6" },
    examesPendentes: ["Glicemia de Jejum", "Urina Tipo I"],
    alertasHospitalares: [
      { tipo: "Alta hospitalar", descricao: "Alta pós-procedimento obstétrico. Retorno pré-natal em 15 dias.", data: "02/03/2026", status: "em_acompanhamento" },
    ],
    historico: [
      { data: "03/03/2026", tipo: "Pré-Natal", local: "UBS Geribá", profissional: "Enf. Carla" },
      { data: "20/02/2026", tipo: "Ultrassom Obstétrico", local: "Hospital Municipal", profissional: "Dr. André" },
      { data: "06/02/2026", tipo: "Pré-Natal", local: "UBS Geribá", profissional: "Dra. Lucia" },
    ],
  },
  "4": {
    id: "4",
    nome: "Carlos Eduardo Lima",
    nomeMae: "Rosa Maria Lima",
    cpf: "321.654.987-33",
    cns: "456 0078 1234 9012",
    dataNascimento: "30/01/1968",
    idade: 58,
    sexo: "Masculino",
    telefone: "(22) 96666-3456",
    endereco: "Rua da Praia, 200 - Ferradura, Búzios/RJ",
    unidadeReferencia: "UBS Ferradura",
    equipeReferencia: "Equipe 004 - ESF Ferradura",
    acs: "Sandra Rocha",
    condicoesAtivas: ["Câncer de Próstata (em tratamento)", "Hipertensão Arterial"],
    alergias: ["Contraste Iodado"],
    medicamentosUso: [
      { nome: "Bicalutamida", dosagem: "50mg", frequencia: "1x ao dia" },
      { nome: "Anlodipino", dosagem: "5mg", frequencia: "1x ao dia" },
    ],
    sinaisVitais: { pressaoArterial: "125/80 mmHg", frequenciaCardiaca: "72 bpm", peso: "70 kg", altura: "1,75 m", imc: "22,9" },
    examesPendentes: ["PSA", "Hemograma Completo"],
    alertasHospitalares: [
      { tipo: "Evasão", descricao: "Paciente evadiu antes da alta médica. Família notificada.", data: "01/03/2026", status: "novo" },
    ],
    historico: [
      { data: "25/02/2026", tipo: "Quimioterapia", local: "Hospital Regional", profissional: "Dra. Fernanda" },
      { data: "18/02/2026", tipo: "Consulta Oncologia", local: "Hospital Regional", profissional: "Dr. Marcos" },
      { data: "10/02/2026", tipo: "Exames Laboratoriais", local: "Laboratório Central", profissional: "-" },
    ],
  },
  "5": {
    id: "5",
    nome: "Mariana Souza Rodrigues",
    nomeMae: "Teresa Souza",
    cpf: "654.987.321-44",
    cns: "789 0090 5678 3456",
    dataNascimento: "12/09/1995",
    idade: 30,
    sexo: "Feminino",
    telefone: "(22) 95555-7890",
    endereco: "Rua do Sol, 55 - Armação, Búzios/RJ",
    unidadeReferencia: "UBS Armação",
    equipeReferencia: "Equipe 005 - ESF Armação",
    acs: "Maria Campos",
    condicoesAtivas: ["Asma", "Rinite Alérgica"],
    alergias: ["Ibuprofeno", "Camarão"],
    medicamentosUso: [
      { nome: "Budesonida", dosagem: "200mcg", frequencia: "2x ao dia" },
      { nome: "Loratadina", dosagem: "10mg", frequencia: "1x ao dia" },
    ],
    sinaisVitais: { pressaoArterial: "115/75 mmHg", frequenciaCardiaca: "70 bpm", peso: "58 kg", altura: "1,62 m", imc: "22,1" },
    examesPendentes: [],
    alertasHospitalares: [
      { tipo: "Óbito", descricao: "Óbito hospitalar registrado. Família necessita de suporte.", data: "28/02/2026", status: "concluido" },
    ],
    historico: [
      { data: "02/03/2026", tipo: "Consulta Médica", local: "UBS Armação", profissional: "Dr. Paulo" },
      { data: "15/01/2026", tipo: "Urgência", local: "UPA Búzios", profissional: "Dra. Cristina" },
    ],
  },
}

const alertaStatusConfig: Record<Alerta["status"], { label: string; style?: React.CSSProperties; className?: string }> = {
  novo: { label: "Novo", className: "bg-destructive/10 text-destructive" },
  em_acompanhamento: { label: "Em acompanhamento", style: { background: "oklch(0.55 0.18 160 / 0.10)", color: APS_COLOR } },
  concluido: { label: "Concluído", className: "bg-emerald-50 text-emerald-700" },
}

const sinaisVitaisConfig = [
  { label: "Pressão Arterial", key: "pressaoArterial", Icon: Heart },
  { label: "Freq. Cardíaca", key: "frequenciaCardiaca", Icon: Droplets },
  { label: "Peso", key: "peso", Icon: Scale },
  { label: "Altura", key: "altura", Icon: Ruler },
] as const

export default function PacienteApsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const paciente = pacientesData[id]

  if (!paciente) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Paciente não encontrado</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/portal-atencao-basica/dashboard")}
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const alertasNovos = paciente.alertasHospitalares.filter((a) => a.status === "novo").length

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Voltar */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-1.5 -ml-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Voltar
        </Button>
      </div>

      {/* Cabeçalho do paciente */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.18 160) 0%, oklch(0.65 0.16 155) 100%)" }}
            >
              {paciente.nome.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">{paciente.nome}</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {paciente.idade} anos &middot; {paciente.sexo} &middot; Nasc. {paciente.dataNascimento}
                  </p>
                </div>
                {alertasNovos > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-destructive/10 text-destructive">
                    <Bell className="h-3 w-3" strokeWidth={1.5} />
                    {alertasNovos} alerta{alertasNovos > 1 ? "s" : ""} novo{alertasNovos > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <User className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>CPF: {paciente.cpf}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>CNS: {paciente.cns}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>{paciente.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{paciente.endereco}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-wrap gap-4 text-[13px]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                <MapPin className="h-3 w-3" style={{ color: APS_COLOR }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Unidade</p>
                <p className="font-semibold text-foreground">{paciente.unidadeReferencia}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                <Calendar className="h-3 w-3" style={{ color: APS_COLOR }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Equipe</p>
                <p className="font-semibold text-foreground">{paciente.equipeReferencia}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                <UserCheck className="h-3 w-3" style={{ color: APS_COLOR }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">ACS</p>
                <p className="font-semibold text-foreground">{paciente.acs}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-5">
          {/* Alertas Hospitalares */}
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-destructive" strokeWidth={1.25} />
                </div>
                Alertas Hospitalares
              </CardTitle>
              <CardDescription className="text-[13px]">
                Movimentações hospitalares deste paciente enviadas para a UBS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paciente.alertasHospitalares.map((alerta, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl"
                    style={{ border: "1px solid var(--border)", background: alerta.status === "novo" ? "oklch(0.99 0 0)" : "var(--muted)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold text-[13px] text-foreground">{alerta.tipo}</p>
                          <span
                            className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold", alertaStatusConfig[alerta.status]?.className)}
                            style={alertaStatusConfig[alerta.status]?.style}
                          >
                            {alertaStatusConfig[alerta.status]?.label}
                          </span>
                        </div>
                        <p className="text-[13px] text-muted-foreground leading-relaxed">{alerta.descricao}</p>
                        <p className="text-[12px] text-muted-foreground mt-1.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" strokeWidth={1.5} />
                          {alerta.data}
                        </p>
                      </div>
                    </div>
                    {alerta.status === "novo" && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg text-[12px] gap-1.5 h-7"
                        >
                          <UserCheck className="h-3 w-3" strokeWidth={1.5} />
                          Assumir acompanhamento
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-lg text-[12px] gap-1.5 h-7"
                        >
                          <CheckCircle className="h-3 w-3" strokeWidth={1.5} />
                          Marcar como visto
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Atendimentos */}
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                  <Clock className="w-3.5 h-3.5" style={{ color: APS_COLOR }} strokeWidth={1.25} />
                </div>
                Histórico de Atendimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {paciente.historico.map((evento, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: APS_COLOR }}
                      />
                      {i < paciente.historico.length - 1 && (
                        <div className="w-px flex-1 mt-1" style={{ background: "oklch(0.55 0.18 160 / 0.20)" }} />
                      )}
                    </div>
                    <div className={cn("pb-4 flex-1", i === paciente.historico.length - 1 && "pb-0")}>
                      <p className="text-[12px] text-muted-foreground tabular-nums">{evento.data}</p>
                      <p className="font-semibold text-[13px] text-foreground mt-0.5">{evento.tipo}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {evento.local} &middot; {evento.profissional}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-5">
          {/* Sinais Vitais */}
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                  <Heart className="w-3.5 h-3.5" style={{ color: APS_COLOR }} strokeWidth={1.25} />
                </div>
                Sinais Vitais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sinaisVitaisConfig.map(({ label, key, Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {label}
                    </div>
                    <p className="font-semibold text-[13px] text-foreground tabular-nums">
                      {paciente.sinaisVitais[key]}
                    </p>
                  </div>
                ))}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] text-muted-foreground">IMC</p>
                    <p className="font-bold text-[15px] text-foreground tabular-nums">{paciente.sinaisVitais.imc}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condições Ativas */}
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                  <AlertTriangle className="w-3.5 h-3.5" style={{ color: APS_COLOR }} strokeWidth={1.25} />
                </div>
                Condições Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {paciente.condicoesAtivas.map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-lg text-[12px] font-medium"
                    style={{ background: "oklch(0.55 0.18 160 / 0.08)", color: APS_COLOR }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              {paciente.alergias.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Alergias</p>
                  <div className="flex flex-wrap gap-1.5">
                    {paciente.alergias.map((a) => (
                      <span key={a} className="px-2 py-0.5 rounded-lg text-[12px] font-medium bg-destructive/10 text-destructive">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medicamentos */}
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                  <Pill className="w-3.5 h-3.5" style={{ color: APS_COLOR }} strokeWidth={1.25} />
                </div>
                Medicamentos em Uso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {paciente.medicamentosUso.map((med, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 py-1.5 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-[13px] text-foreground">{med.nome}</p>
                      <p className="text-[12px] text-muted-foreground">{med.frequencia}</p>
                    </div>
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-lg flex-shrink-0"
                      style={{ background: "oklch(0.55 0.18 160 / 0.08)", color: APS_COLOR }}
                    >
                      {med.dosagem}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exames Pendentes */}
          {paciente.examesPendentes.length > 0 && (
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                    <FileText className="w-3.5 h-3.5" style={{ color: APS_COLOR }} strokeWidth={1.25} />
                  </div>
                  Exames Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {paciente.examesPendentes.map((exame) => (
                    <div key={exame} className="flex items-center gap-2 text-[13px]">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: APS_COLOR }} />
                      {exame}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
