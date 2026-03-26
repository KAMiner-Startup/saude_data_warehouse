"use client"

import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Phone,
  Activity,
  Pill,
  Stethoscope,
  FileText,
  AlertTriangle,
  Heart,
  Droplets,
  Scale,
  Ruler
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LinhaDoTempo, type EventoTimeline } from "@/components/linha-do-tempo"

// Dados mockados da linha do tempo por paciente
const timelineData: Record<string, EventoTimeline[]> = {
  "1": [
    {
      id: "evt-1-1",
      data: "01/03/2026",
      dataCompleta: "01/03/2026 14:30",
      tipo: "consulta",
      titulo: "Consulta Medica - Retorno",
      local: "UBS Centro",
      profissional: "Dra. Ana Paula",
      descricao: "Paciente retorna para acompanhamento de hipertensao e diabetes. Apresenta melhora nos niveis pressao. Ajustada medicacao.",
      status: "concluido",
      detalhes: [
        { label: "Pressao Arterial", valor: "140/90 mmHg" },
        { label: "Glicemia", valor: "126 mg/dL" },
        { label: "Proxima consulta", valor: "01/04/2026" },
      ]
    },
    {
      id: "evt-1-2",
      data: "15/02/2026",
      dataCompleta: "15/02/2026 08:00",
      tipo: "alta",
      titulo: "Alta Hospitalar",
      local: "Hospital Municipal de Buzios",
      profissional: "Dr. Carlos Mendes",
      cid: "I10 - Hipertensao Essencial",
      descricao: "Paciente recebe alta apos estabilizacao do quadro hipertensivo. Orientada sobre medicacao e retorno.",
      status: "concluido",
      detalhes: [
        { label: "Dias de internacao", valor: "5 dias" },
        { label: "Condicao na alta", valor: "Estavel" },
        { label: "Encaminhamento", valor: "UBS Centro - Acompanhamento" },
      ]
    },
    {
      id: "evt-1-3",
      data: "10/02/2026",
      dataCompleta: "10/02/2026 22:15",
      tipo: "internacao",
      titulo: "Internacao - UTI",
      local: "Hospital Municipal de Buzios",
      profissional: "Dr. Carlos Mendes",
      cid: "I10 - Hipertensao Essencial",
      descricao: "Paciente admitida com crise hipertensiva severa. Pressao 220/140 mmHg. Iniciado protocolo de emergencia.",
      status: "concluido",
      detalhes: [
        { label: "Setor", valor: "UTI" },
        { label: "Pressao na admissao", valor: "220/140 mmHg" },
        { label: "Sintomas", valor: "Cefaleia intensa, visao turva" },
      ]
    },
    {
      id: "evt-1-4",
      data: "10/02/2026",
      dataCompleta: "10/02/2026 21:30",
      tipo: "urgencia",
      titulo: "Atendimento de Urgencia",
      local: "UPA Buzios",
      profissional: "Dr. Roberto Lima",
      descricao: "Paciente chega com queixa de cefaleia intensa e mal-estar. Verificada pressao elevada. Encaminhada para internacao.",
      status: "concluido",
      detalhes: [
        { label: "Classificacao", valor: "Vermelho - Emergencia" },
        { label: "Tempo de espera", valor: "Imediato" },
        { label: "Conduta", valor: "Transferencia para Hospital Municipal" },
      ]
    },
    {
      id: "evt-1-5",
      data: "05/01/2026",
      dataCompleta: "05/01/2026 07:30",
      tipo: "exame",
      titulo: "Exames Laboratoriais",
      local: "Laboratorio Central",
      profissional: "-",
      resultado: "Hemoglobina glicada: 8,2% (elevada). Glicemia jejum: 145 mg/dL. Colesterol total: 220 mg/dL.",
      status: "concluido",
      detalhes: [
        { label: "Hemoglobina Glicada", valor: "8,2% (Ref: < 7%)" },
        { label: "Glicemia Jejum", valor: "145 mg/dL (Ref: < 100)" },
        { label: "Colesterol Total", valor: "220 mg/dL (Ref: < 200)" },
        { label: "Triglicerideos", valor: "180 mg/dL (Ref: < 150)" },
      ]
    },
    {
      id: "evt-1-6",
      data: "20/12/2025",
      dataCompleta: "20/12/2025 10:00",
      tipo: "consulta",
      titulo: "Consulta Medica - Rotina",
      local: "UBS Centro",
      profissional: "Dra. Ana Paula",
      descricao: "Consulta de rotina para acompanhamento de condicoes cronicas. Solicitados exames de controle.",
      status: "concluido",
    },
  ],
  "2": [
    {
      id: "evt-2-1",
      data: "28/02/2026",
      dataCompleta: "28/02/2026 06:00",
      tipo: "alta",
      titulo: "Alta Hospitalar",
      local: "Hospital Municipal de Buzios",
      profissional: "Dr. Joao Silva",
      cid: "I50 - Insuficiencia Cardiaca",
      descricao: "Alta apos compensacao do quadro de IC. Paciente orientado sobre restricao hidrica e sodio.",
      status: "concluido",
      detalhes: [
        { label: "Dias de internacao", valor: "8 dias" },
        { label: "Peso na alta", valor: "75 kg (-4kg)" },
        { label: "Fracao de ejecao", valor: "35%" },
      ]
    },
    {
      id: "evt-2-2",
      data: "20/02/2026",
      dataCompleta: "20/02/2026 03:45",
      tipo: "internacao",
      titulo: "Internacao - Enfermaria",
      local: "Hospital Municipal de Buzios",
      profissional: "Dr. Joao Silva",
      cid: "I50 - Insuficiencia Cardiaca",
      descricao: "Internacao por descompensacao de IC. Paciente com dispneia aos minimos esforcos e edema de MMII.",
      status: "concluido",
      detalhes: [
        { label: "Setor", valor: "Enfermaria Cardiologica" },
        { label: "Peso na admissao", valor: "79 kg" },
        { label: "Saturacao", valor: "89% em ar ambiente" },
      ]
    },
    {
      id: "evt-2-3",
      data: "20/02/2026",
      dataCompleta: "20/02/2026 02:30",
      tipo: "urgencia",
      titulo: "Atendimento de Urgencia",
      local: "UPA Buzios",
      profissional: "Dra. Maria Santos",
      descricao: "Paciente chega com dispneia intensa, nao conseguindo deitar. Edema importante em membros inferiores.",
      status: "concluido",
      detalhes: [
        { label: "Classificacao", valor: "Amarelo - Urgente" },
        { label: "Saturacao", valor: "88%" },
        { label: "Conduta", valor: "Oxigenoterapia e transferencia" },
      ]
    },
    {
      id: "evt-2-4",
      data: "15/02/2026",
      dataCompleta: "15/02/2026 09:00",
      tipo: "consulta",
      titulo: "Consulta Medica",
      local: "UBS Manguinhos",
      profissional: "Dr. Pedro Costa",
      descricao: "Paciente comparece para consulta de rotina. Refere piora da dispneia nos ultimos dias.",
      status: "concluido",
    },
  ],
  "3": [
    {
      id: "evt-3-1",
      data: "03/03/2026",
      dataCompleta: "03/03/2026 08:00",
      tipo: "pre_natal",
      titulo: "Consulta Pre-Natal - 8a",
      local: "UBS Geriba",
      profissional: "Enf. Carla Oliveira",
      descricao: "Oitava consulta de pre-natal. Gestacao de 32 semanas. Feto em apresentacao cefalica. BCF: 140 bpm.",
      status: "concluido",
      detalhes: [
        { label: "Idade Gestacional", valor: "32 semanas" },
        { label: "BCF", valor: "140 bpm" },
        { label: "Altura Uterina", valor: "30 cm" },
        { label: "Ganho de peso", valor: "+8 kg" },
      ]
    },
    {
      id: "evt-3-2",
      data: "20/02/2026",
      dataCompleta: "20/02/2026 14:00",
      tipo: "exame",
      titulo: "Ultrassom Obstetrico Morfologico",
      local: "Hospital Municipal de Buzios",
      profissional: "Dr. Andre Ferreira",
      resultado: "Feto unico, vivo, em apresentacao cefalica. Biometria compativel com 30 semanas. Placenta posterior grau I. ILA normal.",
      status: "concluido",
      detalhes: [
        { label: "Peso estimado", valor: "1.450g" },
        { label: "Apresentacao", valor: "Cefalica" },
        { label: "Placenta", valor: "Posterior, grau I" },
        { label: "Liquido amniotico", valor: "Normal (ILA 12cm)" },
      ]
    },
    {
      id: "evt-3-3",
      data: "06/02/2026",
      dataCompleta: "06/02/2026 08:30",
      tipo: "pre_natal",
      titulo: "Consulta Pre-Natal - 7a",
      local: "UBS Geriba",
      profissional: "Dra. Lucia Mendes",
      descricao: "Setima consulta de pre-natal. Paciente com queixa de anemia. Prescrito sulfato ferroso.",
      status: "concluido",
    },
  ],
  "4": [
    {
      id: "evt-4-1",
      data: "25/02/2026",
      dataCompleta: "25/02/2026 08:00",
      tipo: "quimioterapia",
      titulo: "Sessao de Quimioterapia - Ciclo 4",
      local: "Hospital Regional",
      profissional: "Dra. Fernanda Alves",
      descricao: "Quarto ciclo de quimioterapia. Paciente tolerou bem a infusao. Sem intercorrencias.",
      status: "concluido",
      detalhes: [
        { label: "Protocolo", valor: "Docetaxel" },
        { label: "Ciclo", valor: "4 de 6" },
        { label: "Duracao", valor: "3 horas" },
        { label: "Efeitos colaterais", valor: "Nausea leve" },
      ]
    },
    {
      id: "evt-4-2",
      data: "18/02/2026",
      dataCompleta: "18/02/2026 10:00",
      tipo: "consulta",
      titulo: "Consulta Oncologia",
      local: "Hospital Regional",
      profissional: "Dr. Marcos Pereira",
      descricao: "Avaliacao pre-quimioterapia. PSA em queda. Paciente tolerando bem o tratamento.",
      status: "concluido",
      detalhes: [
        { label: "PSA atual", valor: "8,5 ng/mL" },
        { label: "PSA anterior", valor: "12,3 ng/mL" },
        { label: "Resposta", valor: "Parcial" },
      ]
    },
    {
      id: "evt-4-3",
      data: "10/02/2026",
      dataCompleta: "10/02/2026 07:00",
      tipo: "exame",
      titulo: "Exames Laboratoriais Pre-QT",
      local: "Laboratorio Central",
      profissional: "-",
      resultado: "Hemograma dentro dos parametros para quimioterapia. Funcao renal e hepatica preservadas.",
      status: "concluido",
    },
  ],
  "5": [
    {
      id: "evt-5-1",
      data: "02/03/2026",
      dataCompleta: "02/03/2026 09:00",
      tipo: "consulta",
      titulo: "Consulta Medica - Retorno",
      local: "UBS Armacao",
      profissional: "Dr. Paulo Henrique",
      descricao: "Retorno para avaliacao de asma. Paciente refere melhora com uso regular da medicacao.",
      status: "concluido",
    },
    {
      id: "evt-5-2",
      data: "15/01/2026",
      dataCompleta: "15/01/2026 23:00",
      tipo: "urgencia",
      titulo: "Atendimento de Urgencia",
      local: "UPA Buzios",
      profissional: "Dra. Cristina Lima",
      descricao: "Paciente com crise de asma moderada. Realizada nebulizacao e prescrito corticoide oral.",
      status: "concluido",
      detalhes: [
        { label: "Classificacao", valor: "Amarelo - Urgente" },
        { label: "Peak Flow", valor: "60% do previsto" },
        { label: "Conduta", valor: "Nebulizacao + Corticoide" },
      ]
    },
  ],
  "6": [
    {
      id: "evt-6-1",
      data: "27/02/2026",
      dataCompleta: "27/02/2026 14:00",
      tipo: "fisioterapia",
      titulo: "Sessao de Fisioterapia",
      local: "Centro de Reabilitacao",
      profissional: "Ft. Marina Costa",
      descricao: "Decima sessao de fisioterapia. Paciente apresenta melhora da mobilidade lombar.",
      status: "concluido",
      detalhes: [
        { label: "Sessao", valor: "10 de 15" },
        { label: "Exercicios", valor: "Fortalecimento e alongamento" },
        { label: "Evolucao", valor: "Satisfatoria" },
      ]
    },
    {
      id: "evt-6-2",
      data: "10/02/2026",
      dataCompleta: "10/02/2026 10:00",
      tipo: "consulta",
      titulo: "Consulta Medica",
      local: "UBS Centro",
      profissional: "Dr. Felipe Souza",
      descricao: "Paciente com lombalgia cronica. Encaminhado para fisioterapia e solicitado RX de coluna.",
      status: "concluido",
    },
  ],
}

// Dados mockados do paciente
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
  condicoesAtivas: string[]
  alergias: string[]
  medicamentosUso: { nome: string; dosagem: string; frequencia: string }[]
  ultimosAtendimentos: { data: string; tipo: string; local: string; profissional: string }[]
  sinaisVitais: { pressaoArterial: string; frequenciaCardiaca: string; peso: string; altura: string; imc: string }
  examesPendentes: string[]
  alertasAtivos: number
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
    condicoesAtivas: ["Hipertensão Arterial", "Diabetes Mellitus Tipo 2", "Obesidade"],
    alergias: ["Dipirona", "Penicilina"],
    medicamentosUso: [
      { nome: "Losartana", dosagem: "50mg", frequencia: "1x ao dia" },
      { nome: "Metformina", dosagem: "850mg", frequencia: "2x ao dia" },
      { nome: "AAS", dosagem: "100mg", frequencia: "1x ao dia" }
    ],
    ultimosAtendimentos: [
      { data: "01/03/2026", tipo: "Consulta Médica", local: "UBS Centro", profissional: "Dra. Ana Paula" },
      { data: "15/02/2026", tipo: "Internação", local: "Hospital Municipal", profissional: "Dr. Carlos" },
      { data: "10/02/2026", tipo: "Urgência", local: "UPA Búzios", profissional: "Dr. Roberto" },
      { data: "05/01/2026", tipo: "Exames Laboratoriais", local: "Laboratório Central", profissional: "-" }
    ],
    sinaisVitais: { pressaoArterial: "140/90 mmHg", frequenciaCardiaca: "78 bpm", peso: "82 kg", altura: "1,65 m", imc: "30,1" },
    examesPendentes: ["Hemoglobina Glicada", "Perfil Lipídico"],
    alertasAtivos: 2
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
    condicoesAtivas: ["Insuficiência Cardíaca", "DPOC", "Tabagismo"],
    alergias: [],
    medicamentosUso: [
      { nome: "Carvedilol", dosagem: "25mg", frequencia: "2x ao dia" },
      { nome: "Furosemida", dosagem: "40mg", frequencia: "1x ao dia" },
      { nome: "Enalapril", dosagem: "10mg", frequencia: "2x ao dia" },
      { nome: "Salbutamol", dosagem: "100mcg", frequencia: "SOS" }
    ],
    ultimosAtendimentos: [
      { data: "28/02/2026", tipo: "Internação", local: "Hospital Municipal", profissional: "Dr. João Silva" },
      { data: "20/02/2026", tipo: "Urgência", local: "UPA Búzios", profissional: "Dra. Maria" },
      { data: "15/02/2026", tipo: "Consulta Médica", local: "UBS Manguinhos", profissional: "Dr. Pedro" }
    ],
    sinaisVitais: { pressaoArterial: "130/85 mmHg", frequenciaCardiaca: "88 bpm", peso: "75 kg", altura: "1,72 m", imc: "25,4" },
    examesPendentes: ["Ecocardiograma", "Espirometria"],
    alertasAtivos: 3
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
    condicoesAtivas: ["Gestante (32 semanas)", "Anemia Ferropriva"],
    alergias: ["Látex"],
    medicamentosUso: [
      { nome: "Sulfato Ferroso", dosagem: "300mg", frequencia: "1x ao dia" },
      { nome: "Ácido Fólico", dosagem: "5mg", frequencia: "1x ao dia" }
    ],
    ultimosAtendimentos: [
      { data: "03/03/2026", tipo: "Pré-Natal", local: "UBS Geribá", profissional: "Enf. Carla" },
      { data: "20/02/2026", tipo: "Ultrassom Obstétrico", local: "Hospital Municipal", profissional: "Dr. André" },
      { data: "06/02/2026", tipo: "Pré-Natal", local: "UBS Geribá", profissional: "Dra. Lucia" }
    ],
    sinaisVitais: { pressaoArterial: "110/70 mmHg", frequenciaCardiaca: "82 bpm", peso: "68 kg", altura: "1,60 m", imc: "26,6" },
    examesPendentes: ["Glicemia de Jejum", "Urina Tipo I"],
    alertasAtivos: 1
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
    condicoesAtivas: ["Câncer de Próstata (em tratamento)", "Hipertensão Arterial"],
    alergias: ["Contraste Iodado"],
    medicamentosUso: [
      { nome: "Bicalutamida", dosagem: "50mg", frequencia: "1x ao dia" },
      { nome: "Anlodipino", dosagem: "5mg", frequencia: "1x ao dia" }
    ],
    ultimosAtendimentos: [
      { data: "25/02/2026", tipo: "Quimioterapia", local: "Hospital Regional", profissional: "Dra. Fernanda" },
      { data: "18/02/2026", tipo: "Consulta Oncologia", local: "Hospital Regional", profissional: "Dr. Marcos" },
      { data: "10/02/2026", tipo: "Exames Laboratoriais", local: "Laboratório Central", profissional: "-" }
    ],
    sinaisVitais: { pressaoArterial: "125/80 mmHg", frequenciaCardiaca: "72 bpm", peso: "70 kg", altura: "1,75 m", imc: "22,9" },
    examesPendentes: ["PSA", "Hemograma Completo"],
    alertasAtivos: 0
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
    condicoesAtivas: ["Asma", "Rinite Alérgica"],
    alergias: ["Ibuprofeno", "Camarão"],
    medicamentosUso: [
      { nome: "Budesonida", dosagem: "200mcg", frequencia: "2x ao dia" },
      { nome: "Loratadina", dosagem: "10mg", frequencia: "1x ao dia" }
    ],
    ultimosAtendimentos: [
      { data: "02/03/2026", tipo: "Consulta Médica", local: "UBS Armação", profissional: "Dr. Paulo" },
      { data: "15/01/2026", tipo: "Urgência", local: "UPA Búzios", profissional: "Dra. Cristina" }
    ],
    sinaisVitais: { pressaoArterial: "115/75 mmHg", frequenciaCardiaca: "70 bpm", peso: "58 kg", altura: "1,62 m", imc: "22,1" },
    examesPendentes: [],
    alertasAtivos: 0
  },
  "6": {
    id: "6",
    nome: "José Maria da Silva",
    nomeMae: "Joana da Silva",
    cpf: "111.222.333-44",
    cns: "111 2223 3344 5556",
    dataNascimento: "05/05/1980",
    idade: 45,
    sexo: "Masculino",
    telefone: "(22) 94444-1111",
    endereco: "Rua Nova, 300 - Centro, Búzios/RJ",
    unidadeReferencia: "UBS Centro",
    equipeReferencia: "Equipe 001 - ESF Centro",
    condicoesAtivas: ["Lombalgia Crônica"],
    alergias: [],
    medicamentosUso: [
      { nome: "Paracetamol", dosagem: "750mg", frequencia: "SOS" }
    ],
    ultimosAtendimentos: [
      { data: "27/02/2026", tipo: "Fisioterapia", local: "Centro de Reabilitação", profissional: "Ft. Marina" },
      { data: "10/02/2026", tipo: "Consulta Médica", local: "UBS Centro", profissional: "Dr. Felipe" }
    ],
    sinaisVitais: { pressaoArterial: "120/80 mmHg", frequenciaCardiaca: "68 bpm", peso: "78 kg", altura: "1,78 m", imc: "24,6" },
    examesPendentes: ["Raio-X Coluna Lombar"],
    alertasAtivos: 0
  }
}

export default function PacientePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const paciente = pacientesData[id]

  if (!paciente) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Paciente não encontrado</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/portal-hospitalar/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Navegação */}
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Button>

      {/* Cabeçalho do Paciente */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="p-4 md:p-6">
          {/* Nome e Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-foreground">{paciente.nome}</h1>
                {paciente.alertasAtivos > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {paciente.alertasAtivos} alerta{paciente.alertasAtivos > 1 ? "s" : ""} ativo{paciente.alertasAtivos > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <div className="space-y-0.5 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">{paciente.dataNascimento}</span> ({paciente.idade} anos) - {paciente.sexo}
                </p>
                <p>
                  Mae: <span className="font-medium text-foreground">{paciente.nomeMae}</span>
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Grid de Informações */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">CPF</p>
              <p className="text-sm font-medium">{paciente.cpf}</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">CNS</p>
              <p className="text-sm font-medium">{paciente.cns}</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Telefone</p>
              <p className="text-sm font-medium">{paciente.telefone}</p>
            </div>

            <div className="space-y-0.5 col-span-2 lg:col-span-3">
              <p className="text-xs text-muted-foreground">Endereco</p>
              <p className="text-sm font-medium">{paciente.endereco}</p>
            </div>

            <div className="space-y-0.5 col-span-2 md:col-span-2 lg:col-span-3">
              <p className="text-xs text-muted-foreground">Unidade de Referencia</p>
              <p className="text-sm font-medium">{paciente.unidadeReferencia}</p>
            </div>

            <div className="space-y-0.5 col-span-2 lg:col-span-3">
              <p className="text-xs text-muted-foreground">Equipe</p>
              <p className="text-sm font-medium">{paciente.equipeReferencia}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Indicadores — Sinais Vitais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pressão Arterial", valor: paciente.sinaisVitais.pressaoArterial, sub: "Última aferição", Icon: Heart, color: "text-red-500", bg: "bg-red-50" },
          { label: "Freq. Cardíaca", valor: paciente.sinaisVitais.frequenciaCardiaca, sub: "Última aferição", Icon: Activity, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Peso", valor: paciente.sinaisVitais.peso, sub: "Última aferição", Icon: Scale, color: "text-primary", bg: "bg-primary/8" },
          { label: "IMC", valor: paciente.sinaisVitais.imc, sub: `Altura: ${paciente.sinaisVitais.altura}`, Icon: Ruler, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map(({ label, valor, sub, Icon, color, bg }) => (
          <Card key={label} className="rounded-[20px] border-none overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="px-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${color}`} strokeWidth={1.25} />
                </div>
              </div>
              <p className={`vital-value text-[1.5rem] leading-none ${color}`}>{valor}</p>
              <p className="text-[11px] text-muted-foreground mt-2">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Condições e Alergias */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" strokeWidth={1.25} />
              Condições Ativas
            </CardTitle>
            <CardDescription>Diagnósticos e condições de saúde atuais</CardDescription>
          </CardHeader>
          <CardContent>
            {paciente.condicoesAtivas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {paciente.condicoesAtivas.map((condicao, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-primary/8 text-primary">
                    {condicao}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma condição ativa registrada</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" strokeWidth={1.25} />
              Alergias
            </CardTitle>
            <CardDescription>Alergias conhecidas do paciente</CardDescription>
          </CardHeader>
          <CardContent>
            {paciente.alergias.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {paciente.alergias.map((alergia, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-destructive/10 text-destructive">
                    {alergia}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma alergia registrada</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Medicamentos em Uso */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary" strokeWidth={1.25} />
            Medicamentos em Uso
          </CardTitle>
          <CardDescription>Prescrições ativas do paciente</CardDescription>
        </CardHeader>
        <CardContent>
          {paciente.medicamentosUso.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Medicamento</th>
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Dosagem</th>
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Frequência</th>
                  </tr>
                </thead>
                <tbody>
                  {paciente.medicamentosUso.map((med, index) => (
                    <tr key={index} className="border-b border-border/30 last:border-0">
                      <td className="py-3 text-sm font-semibold text-slate-900">{med.nome}</td>
                      <td className="py-3 text-sm text-muted-foreground vital-value">{med.dosagem}</td>
                      <td className="py-3 text-sm text-muted-foreground">{med.frequencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum medicamento em uso</p>
          )}
        </CardContent>
      </Card>

      {/* Exames Pendentes */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Droplets className="w-4 h-4 text-amber-500" strokeWidth={1.25} />
            Exames Pendentes
          </CardTitle>
          <CardDescription>Exames aguardando realizacao</CardDescription>
        </CardHeader>
        <CardContent>
          {paciente.examesPendentes.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {paciente.examesPendentes.map((exame, index) => (
                <li key={index} className="flex items-center gap-2 text-sm bg-amber-50 text-amber-700 px-3.5 py-2 rounded-full font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {exame}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum exame pendente</p>
          )}
        </CardContent>
      </Card>

      {/* Linha do Tempo */}
      <LinhaDoTempo eventos={timelineData[id] || []} />
    </div>
  )
}
