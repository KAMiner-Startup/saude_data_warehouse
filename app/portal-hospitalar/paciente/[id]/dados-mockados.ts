import type { EventoTimeline } from "@/components/linha-do-tempo"

// ──────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────

export interface CondicaoAtiva {
  nome: string
  cid: string
}

export interface Medicamento {
  nome: string
  dosagem: string
  frequencia: string
}

export interface Atendimento {
  data: string
  tipo: string
  local: string
  profissional: string
}

export interface SinaisVitais {
  pressaoArterial: string
  frequenciaCardiaca: string
  glicemia: string
  peso: string
  altura: string
  imc: string
}

export interface ExameRecente {
  nome: string
  data: string
  resultado: string
  status: "normal" | "alterado" | "critico"
}

export interface Vacina {
  nome: string
  data: string
  dose: string
}

export interface QueixaReferida {
  data: string
  queixa: string
  profissional: string
}

export interface LembreteClinico {
  tipo: "alerta" | "observacao" | "lembrete"
  descricao: string
  data: string
  prioridade: "alta" | "media" | "baixa"
}

export interface DadosTriagem {
  data: string
  classificacao: "vermelho" | "laranja" | "amarelo" | "verde" | "azul"
  queixaPrincipal: string
  pressaoArterial: string
  temperatura: string
  frequenciaCardiaca: string
  saturacao: string
}

export interface PacienteData {
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
  condicoesAtivas: CondicaoAtiva[]
  alergias: string[]
  medicamentosUso: Medicamento[]
  ultimosAtendimentos: Atendimento[]
  sinaisVitais: SinaisVitais
  examesPendentes: string[]
  examesRecentes: ExameRecente[]
  vacinacao: Vacina[]
  queixasReferidas: QueixaReferida[]
  lembretesClinicas: LembreteClinico[]
  triagem: DadosTriagem | null
  alertasAtivos: number
}

// ──────────────────────────────────────────
// Timeline por paciente
// ──────────────────────────────────────────

export const timelineData: Record<string, EventoTimeline[]> = {
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

// ──────────────────────────────────────────
// Dados dos pacientes
// ──────────────────────────────────────────

export const pacientesData: Record<string, PacienteData> = {
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
    condicoesAtivas: [
      { nome: "Hipertensão Arterial", cid: "I10" },
      { nome: "Diabetes Mellitus Tipo 2", cid: "E11" },
      { nome: "Obesidade", cid: "E66" },
    ],
    alergias: ["Dipirona", "Penicilina"],
    medicamentosUso: [
      { nome: "Losartana", dosagem: "50mg", frequencia: "1x ao dia" },
      { nome: "Metformina", dosagem: "850mg", frequencia: "2x ao dia" },
      { nome: "AAS", dosagem: "100mg", frequencia: "1x ao dia" },
    ],
    ultimosAtendimentos: [
      { data: "01/03/2026", tipo: "Consulta Médica", local: "UBS Centro", profissional: "Dra. Ana Paula" },
      { data: "15/02/2026", tipo: "Internação", local: "Hospital Municipal", profissional: "Dr. Carlos" },
      { data: "10/02/2026", tipo: "Urgência", local: "UPA Búzios", profissional: "Dr. Roberto" },
      { data: "05/01/2026", tipo: "Exames Laboratoriais", local: "Laboratório Central", profissional: "-" },
    ],
    sinaisVitais: {
      pressaoArterial: "140/90 mmHg",
      frequenciaCardiaca: "78 bpm",
      glicemia: "126 mg/dL",
      peso: "82 kg",
      altura: "1,65 m",
      imc: "30,1",
    },
    examesPendentes: ["Hemoglobina Glicada", "Perfil Lipídico"],
    examesRecentes: [
      { nome: "Hemoglobina Glicada", data: "05/01/2026", resultado: "8,2% (Ref: < 7%)", status: "alterado" },
      { nome: "Glicemia Jejum", data: "05/01/2026", resultado: "145 mg/dL (Ref: < 100)", status: "alterado" },
      { nome: "Colesterol Total", data: "05/01/2026", resultado: "220 mg/dL (Ref: < 200)", status: "alterado" },
      { nome: "Triglicerídeos", data: "05/01/2026", resultado: "180 mg/dL (Ref: < 150)", status: "alterado" },
      { nome: "Creatinina", data: "05/01/2026", resultado: "0,9 mg/dL (Ref: 0,6-1,2)", status: "normal" },
    ],
    vacinacao: [
      { nome: "Influenza", data: "15/04/2025", dose: "Dose anual" },
      { nome: "COVID-19", data: "10/03/2025", dose: "Bivalente" },
      { nome: "Hepatite B", data: "20/06/2010", dose: "3ª dose" },
    ],
    queixasReferidas: [
      { data: "01/03/2026", queixa: "Cefaleia ocasional, principalmente à noite", profissional: "Dra. Ana Paula" },
      { data: "10/02/2026", queixa: "Cefaleia intensa, visão turva, mal-estar", profissional: "Dr. Roberto Lima" },
    ],
    lembretesClinicas: [
      { tipo: "alerta", descricao: "Paciente com crises hipertensivas recorrentes - monitorar adesão medicamentosa", data: "15/02/2026", prioridade: "alta" },
      { tipo: "lembrete", descricao: "Solicitar fundo de olho no próximo retorno", data: "01/03/2026", prioridade: "media" },
    ],
    triagem: {
      data: "10/02/2026",
      classificacao: "vermelho",
      queixaPrincipal: "Cefaleia intensa e visão turva",
      pressaoArterial: "220/140 mmHg",
      temperatura: "36,5°C",
      frequenciaCardiaca: "110 bpm",
      saturacao: "96%",
    },
    alertasAtivos: 2,
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
    condicoesAtivas: [
      { nome: "Insuficiência Cardíaca", cid: "I50" },
      { nome: "DPOC", cid: "J44" },
      { nome: "Tabagismo", cid: "F17" },
    ],
    alergias: [],
    medicamentosUso: [
      { nome: "Carvedilol", dosagem: "25mg", frequencia: "2x ao dia" },
      { nome: "Furosemida", dosagem: "40mg", frequencia: "1x ao dia" },
      { nome: "Enalapril", dosagem: "10mg", frequencia: "2x ao dia" },
      { nome: "Salbutamol", dosagem: "100mcg", frequencia: "SOS" },
    ],
    ultimosAtendimentos: [
      { data: "28/02/2026", tipo: "Internação", local: "Hospital Municipal", profissional: "Dr. João Silva" },
      { data: "20/02/2026", tipo: "Urgência", local: "UPA Búzios", profissional: "Dra. Maria" },
      { data: "15/02/2026", tipo: "Consulta Médica", local: "UBS Manguinhos", profissional: "Dr. Pedro" },
    ],
    sinaisVitais: {
      pressaoArterial: "130/85 mmHg",
      frequenciaCardiaca: "88 bpm",
      glicemia: "98 mg/dL",
      peso: "75 kg",
      altura: "1,72 m",
      imc: "25,4",
    },
    examesPendentes: ["Ecocardiograma", "Espirometria"],
    examesRecentes: [
      { nome: "BNP", data: "20/02/2026", resultado: "850 pg/mL (Ref: < 100)", status: "critico" },
      { nome: "Creatinina", data: "20/02/2026", resultado: "1,4 mg/dL (Ref: 0,7-1,3)", status: "alterado" },
      { nome: "Sódio", data: "20/02/2026", resultado: "138 mEq/L (Ref: 136-145)", status: "normal" },
      { nome: "Potássio", data: "20/02/2026", resultado: "4,2 mEq/L (Ref: 3,5-5,0)", status: "normal" },
    ],
    vacinacao: [
      { nome: "Influenza", data: "20/04/2025", dose: "Dose anual" },
      { nome: "Pneumocócica 23", data: "15/08/2023", dose: "Dose única" },
      { nome: "COVID-19", data: "05/05/2025", dose: "Bivalente" },
    ],
    queixasReferidas: [
      { data: "20/02/2026", queixa: "Dispneia intensa, não consegue deitar, edema em membros inferiores", profissional: "Dra. Maria Santos" },
      { data: "15/02/2026", queixa: "Piora da falta de ar nos últimos dias", profissional: "Dr. Pedro Costa" },
    ],
    lembretesClinicas: [
      { tipo: "alerta", descricao: "Paciente com IC descompensada recente - controle rigoroso de peso e restrição hídrica", data: "28/02/2026", prioridade: "alta" },
      { tipo: "alerta", descricao: "Orientar cessação do tabagismo em toda consulta", data: "28/02/2026", prioridade: "alta" },
      { tipo: "lembrete", descricao: "Agendar ecocardiograma de controle em 30 dias", data: "28/02/2026", prioridade: "media" },
    ],
    triagem: {
      data: "20/02/2026",
      classificacao: "amarelo",
      queixaPrincipal: "Dispneia intensa e edema de membros inferiores",
      pressaoArterial: "150/95 mmHg",
      temperatura: "36,8°C",
      frequenciaCardiaca: "102 bpm",
      saturacao: "88%",
    },
    alertasAtivos: 3,
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
    condicoesAtivas: [
      { nome: "Gestante (32 semanas)", cid: "Z34" },
      { nome: "Anemia Ferropriva", cid: "D50" },
    ],
    alergias: ["Látex"],
    medicamentosUso: [
      { nome: "Sulfato Ferroso", dosagem: "300mg", frequencia: "1x ao dia" },
      { nome: "Ácido Fólico", dosagem: "5mg", frequencia: "1x ao dia" },
    ],
    ultimosAtendimentos: [
      { data: "03/03/2026", tipo: "Pré-Natal", local: "UBS Geribá", profissional: "Enf. Carla" },
      { data: "20/02/2026", tipo: "Ultrassom Obstétrico", local: "Hospital Municipal", profissional: "Dr. André" },
      { data: "06/02/2026", tipo: "Pré-Natal", local: "UBS Geribá", profissional: "Dra. Lucia" },
    ],
    sinaisVitais: {
      pressaoArterial: "110/70 mmHg",
      frequenciaCardiaca: "82 bpm",
      glicemia: "85 mg/dL",
      peso: "68 kg",
      altura: "1,60 m",
      imc: "26,6",
    },
    examesPendentes: ["Glicemia de Jejum", "Urina Tipo I"],
    examesRecentes: [
      { nome: "Hemoglobina", data: "06/02/2026", resultado: "10,2 g/dL (Ref: 12-16)", status: "alterado" },
      { nome: "Ferritina", data: "06/02/2026", resultado: "8 ng/mL (Ref: 20-200)", status: "critico" },
      { nome: "Glicemia Jejum", data: "06/02/2026", resultado: "85 mg/dL (Ref: < 92 gestante)", status: "normal" },
    ],
    vacinacao: [
      { nome: "dTpa", data: "10/01/2026", dose: "Dose gestacional" },
      { nome: "Influenza", data: "15/04/2025", dose: "Dose anual" },
      { nome: "Hepatite B", data: "20/03/2015", dose: "3ª dose" },
    ],
    queixasReferidas: [
      { data: "03/03/2026", queixa: "Cansaço frequente e tontura ao levantar", profissional: "Enf. Carla Oliveira" },
      { data: "06/02/2026", queixa: "Fraqueza e palidez, queda de cabelo", profissional: "Dra. Lucia Mendes" },
    ],
    lembretesClinicas: [
      { tipo: "lembrete", descricao: "Acompanhar hemoglobina após 30 dias de suplementação", data: "06/02/2026", prioridade: "media" },
      { tipo: "observacao", descricao: "Gestação de alto risco por anemia - acompanhamento quinzenal", data: "03/03/2026", prioridade: "alta" },
    ],
    triagem: null,
    alertasAtivos: 1,
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
    condicoesAtivas: [
      { nome: "Câncer de Próstata (em tratamento)", cid: "C61" },
      { nome: "Hipertensão Arterial", cid: "I10" },
    ],
    alergias: ["Contraste Iodado"],
    medicamentosUso: [
      { nome: "Bicalutamida", dosagem: "50mg", frequencia: "1x ao dia" },
      { nome: "Anlodipino", dosagem: "5mg", frequencia: "1x ao dia" },
    ],
    ultimosAtendimentos: [
      { data: "25/02/2026", tipo: "Quimioterapia", local: "Hospital Regional", profissional: "Dra. Fernanda" },
      { data: "18/02/2026", tipo: "Consulta Oncologia", local: "Hospital Regional", profissional: "Dr. Marcos" },
      { data: "10/02/2026", tipo: "Exames Laboratoriais", local: "Laboratório Central", profissional: "-" },
    ],
    sinaisVitais: {
      pressaoArterial: "125/80 mmHg",
      frequenciaCardiaca: "72 bpm",
      glicemia: "92 mg/dL",
      peso: "70 kg",
      altura: "1,75 m",
      imc: "22,9",
    },
    examesPendentes: ["PSA", "Hemograma Completo"],
    examesRecentes: [
      { nome: "PSA", data: "18/02/2026", resultado: "8,5 ng/mL (anterior: 12,3)", status: "alterado" },
      { nome: "Hemograma", data: "10/02/2026", resultado: "Dentro dos parâmetros para QT", status: "normal" },
      { nome: "Creatinina", data: "10/02/2026", resultado: "1,0 mg/dL (Ref: 0,7-1,3)", status: "normal" },
      { nome: "TGO/TGP", data: "10/02/2026", resultado: "28/32 U/L (Ref: < 40)", status: "normal" },
    ],
    vacinacao: [
      { nome: "Influenza", data: "20/04/2025", dose: "Dose anual" },
      { nome: "COVID-19", data: "12/06/2025", dose: "Bivalente" },
    ],
    queixasReferidas: [
      { data: "25/02/2026", queixa: "Náusea leve após quimioterapia", profissional: "Dra. Fernanda Alves" },
      { data: "18/02/2026", queixa: "Fadiga persistente entre os ciclos", profissional: "Dr. Marcos Pereira" },
    ],
    lembretesClinicas: [
      { tipo: "lembrete", descricao: "Próximo ciclo de QT em 15 dias - solicitar hemograma prévio", data: "25/02/2026", prioridade: "alta" },
      { tipo: "observacao", descricao: "PSA em queda - resposta parcial ao tratamento", data: "18/02/2026", prioridade: "media" },
    ],
    triagem: null,
    alertasAtivos: 0,
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
    condicoesAtivas: [
      { nome: "Asma", cid: "J45" },
      { nome: "Rinite Alérgica", cid: "J30" },
    ],
    alergias: ["Ibuprofeno", "Camarão"],
    medicamentosUso: [
      { nome: "Budesonida", dosagem: "200mcg", frequencia: "2x ao dia" },
      { nome: "Loratadina", dosagem: "10mg", frequencia: "1x ao dia" },
    ],
    ultimosAtendimentos: [
      { data: "02/03/2026", tipo: "Consulta Médica", local: "UBS Armação", profissional: "Dr. Paulo" },
      { data: "15/01/2026", tipo: "Urgência", local: "UPA Búzios", profissional: "Dra. Cristina" },
    ],
    sinaisVitais: {
      pressaoArterial: "115/75 mmHg",
      frequenciaCardiaca: "70 bpm",
      glicemia: "88 mg/dL",
      peso: "58 kg",
      altura: "1,62 m",
      imc: "22,1",
    },
    examesPendentes: [],
    examesRecentes: [
      { nome: "Espirometria", data: "02/03/2026", resultado: "VEF1 85% do previsto - asma controlada", status: "normal" },
      { nome: "IgE Total", data: "02/03/2026", resultado: "320 UI/mL (Ref: < 100)", status: "alterado" },
    ],
    vacinacao: [
      { nome: "Influenza", data: "10/04/2025", dose: "Dose anual" },
      { nome: "COVID-19", data: "20/05/2025", dose: "Bivalente" },
      { nome: "Febre Amarela", data: "15/01/2020", dose: "Dose única" },
    ],
    queixasReferidas: [
      { data: "02/03/2026", queixa: "Melhora significativa com uso regular da medicação", profissional: "Dr. Paulo Henrique" },
      { data: "15/01/2026", queixa: "Falta de ar intensa, chiado no peito, tosse seca", profissional: "Dra. Cristina Lima" },
    ],
    lembretesClinicas: [
      { tipo: "observacao", descricao: "Asma controlada - manter medicação e retorno em 3 meses", data: "02/03/2026", prioridade: "baixa" },
    ],
    triagem: null,
    alertasAtivos: 0,
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
    condicoesAtivas: [
      { nome: "Lombalgia Crônica", cid: "M54.5" },
    ],
    alergias: [],
    medicamentosUso: [
      { nome: "Paracetamol", dosagem: "750mg", frequencia: "SOS" },
    ],
    ultimosAtendimentos: [
      { data: "27/02/2026", tipo: "Fisioterapia", local: "Centro de Reabilitação", profissional: "Ft. Marina" },
      { data: "10/02/2026", tipo: "Consulta Médica", local: "UBS Centro", profissional: "Dr. Felipe" },
    ],
    sinaisVitais: {
      pressaoArterial: "120/80 mmHg",
      frequenciaCardiaca: "68 bpm",
      glicemia: "95 mg/dL",
      peso: "78 kg",
      altura: "1,78 m",
      imc: "24,6",
    },
    examesPendentes: ["Raio-X Coluna Lombar"],
    examesRecentes: [],
    vacinacao: [
      { nome: "Influenza", data: "15/04/2025", dose: "Dose anual" },
      { nome: "COVID-19", data: "10/06/2025", dose: "Bivalente" },
      { nome: "dT", data: "20/08/2020", dose: "Reforço" },
    ],
    queixasReferidas: [
      { data: "10/02/2026", queixa: "Dor lombar persistente, piora ao ficar muito tempo sentado", profissional: "Dr. Felipe Souza" },
    ],
    lembretesClinicas: [
      { tipo: "lembrete", descricao: "Aguardando resultado de RX de coluna lombar", data: "10/02/2026", prioridade: "media" },
    ],
    triagem: null,
    alertasAtivos: 0,
  },
}
