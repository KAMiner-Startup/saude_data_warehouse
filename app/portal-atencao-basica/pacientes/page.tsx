"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Search, Users, UserCheck, AlertTriangle, Filter, Baby, Pill, Heart,
  ChevronRight, CalendarDays, ShieldCheck, ShieldAlert, FlaskConical,
  Clock, MapPin, Download, MoreHorizontal, Bell, ClipboardList,
  ArrowUpDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

const APS = "oklch(0.55 0.18 160)"

// Unidade do usuário logado — RF-FE-09.02
const UNIDADE_USUARIO = "UBS Central"

type SituacaoPaciente = "estavel" | "internado" | "pos_alta" | "atencao"
type GrupoPrioritario = "gestante" | "diabetico" | "hipertenso" | "saude_mental" | null
type Controle = "controlado" | "descontrolado"
type Prioridade = "alta" | "media" | "baixa"

interface Paciente {
  id: string
  nome: string
  cpf: string
  cns: string
  dataNascimento: string
  acs: string
  ubs: string
  situacao: SituacaoPaciente
  grupoPrioritario: GrupoPrioritario
  ultimoContato: string
  proximaVisita: string | null
  alertasAbertos: number
  // RF-FE-09.04
  controle?: Controle
  // RF-FE-09.05
  exameVencido?: boolean
  exameVencidoDesc?: string
  // RF-FE-09.06
  foraPrazoVisita?: boolean
  // RF-FE-09.07 / RF-FE-09.08
  indicadoresFora?: string[]
  // RF-FE-09.13
  prioridade: Prioridade
}

const situacaoConfig: Record<SituacaoPaciente, { label: string; className: string; style?: React.CSSProperties }> = {
  estavel:   { label: "Estável",        className: "bg-emerald-50 text-emerald-700" },
  internado: { label: "Internado",      className: "bg-destructive/10 text-destructive" },
  pos_alta:  { label: "Pós-alta",       className: "", style: { background: "oklch(0.55 0.18 160 / 0.10)", color: APS } },
  atencao:   { label: "Requer atenção", className: "bg-orange-50 text-orange-700" },
}

const grupoConfig: Record<NonNullable<GrupoPrioritario>, { label: string; icon: React.ElementType; cor: string; bg: string }> = {
  gestante:    { label: "Gestante",   icon: Baby,      cor: "#db2777", bg: "bg-pink-50"   },
  diabetico:   { label: "Diabético",  icon: Pill,      cor: "#d97706", bg: "bg-amber-50"  },
  hipertenso:  { label: "Hipertenso", icon: Heart,     cor: "#7c3aed", bg: "bg-violet-50" },
  saude_mental:{ label: "S. Mental",  icon: UserCheck, cor: "#0891b2", bg: "bg-cyan-50"   },
}

const prioridadeConfig: Record<Prioridade, { label: string; cor: string; bg: string; ordem: number }> = {
  alta:  { label: "Alta",  cor: "#dc2626", bg: "bg-red-50",    ordem: 0 },
  media: { label: "Média", cor: "#d97706", bg: "bg-amber-50",  ordem: 1 },
  baixa: { label: "Baixa", cor: "#16a34a", bg: "bg-emerald-50",ordem: 2 },
}

const pacientesMock: Paciente[] = [
  {
    id: "1", nome: "Maria das Graças Ferreira", cpf: "821.344.090-11", cns: "898 0012 3456 7890",
    dataNascimento: "14/05/1968", acs: "João Carlos", ubs: "UBS Central",
    situacao: "pos_alta", grupoPrioritario: null,
    ultimoContato: "08/03/2026", proximaVisita: "11/03/2026", alertasAbertos: 1,
    foraPrazoVisita: true, indicadoresFora: ["Pós-Alta Hospitalar"],
    prioridade: "alta",
  },
  {
    id: "2", nome: "Ana Lúcia Barbosa", cpf: "034.892.110-44", cns: "702 0034 5678 1234",
    dataNascimento: "22/06/2000", acs: "Fernanda Lima", ubs: "UBS Central",
    situacao: "estavel", grupoPrioritario: "gestante",
    ultimoContato: "01/02/2026", proximaVisita: "11/03/2026", alertasAbertos: 0,
    foraPrazoVisita: true, indicadoresFora: ["Acompanhamento de Gestantes"],
    prioridade: "alta",
  },
  {
    id: "3", nome: "José Augusto Correia", cpf: "511.023.770-88", cns: "123 0056 7890 5678",
    dataNascimento: "30/07/1955", acs: "João Carlos", ubs: "UBS Central",
    situacao: "atencao", grupoPrioritario: "diabetico",
    ultimoContato: "04/02/2026", proximaVisita: "13/03/2026", alertasAbertos: 0,
    controle: "descontrolado", exameVencido: true, exameVencidoDesc: "Hemoglobina glicada há 210 dias",
    foraPrazoVisita: true, indicadoresFora: ["Diabéticos — Acomp. Trimestral", "Hemoglobina Glicada"],
    prioridade: "alta",
  },
  {
    id: "4", nome: "Rosana Melo Santos", cpf: "192.774.050-33", cns: "456 0078 1234 9012",
    dataNascimento: "17/09/1972", acs: "Carla Souza", ubs: "UBS Central",
    situacao: "pos_alta", grupoPrioritario: "hipertenso",
    ultimoContato: "07/03/2026", proximaVisita: "12/03/2026", alertasAbertos: 1,
    controle: "descontrolado", indicadoresFora: ["Múltiplas Internações"],
    prioridade: "alta",
  },
  {
    id: "5", nome: "Francisco Nunes Lima", cpf: "673.019.440-55", cns: "234 0011 2233 4455",
    dataNascimento: "03/01/1948", acs: "Fernanda Lima", ubs: "UBS Central",
    situacao: "pos_alta", grupoPrioritario: null,
    ultimoContato: "07/03/2026", proximaVisita: "12/03/2026", alertasAbertos: 1,
    foraPrazoVisita: true, indicadoresFora: ["Pós-Alta Hospitalar"],
    prioridade: "alta",
  },
  {
    id: "6", nome: "João Batista Neto", cpf: "147.258.369-66", cns: "567 0022 3344 5566",
    dataNascimento: "12/03/1960", acs: "Fernanda Lima", ubs: "UBS Central",
    situacao: "estavel", grupoPrioritario: "hipertenso",
    ultimoContato: "10/02/2026", proximaVisita: "20/03/2026", alertasAbertos: 0,
    controle: "controlado",
    prioridade: "baixa",
  },
  {
    id: "7", nome: "Célia Regina Moura", cpf: "258.369.147-77", cns: "678 0033 4455 6677",
    dataNascimento: "08/04/2001", acs: "João Carlos", ubs: "UBS Central",
    situacao: "estavel", grupoPrioritario: "gestante",
    ultimoContato: "05/02/2026", proximaVisita: "11/03/2026", alertasAbertos: 0,
    foraPrazoVisita: true, indicadoresFora: ["Acompanhamento de Gestantes"],
    prioridade: "media",
  },
  {
    id: "8", nome: "Antônio Gomes", cpf: "369.147.258-88", cns: "789 0044 5566 7788",
    dataNascimento: "25/12/1958", acs: "Carla Souza", ubs: "UBS Central",
    situacao: "atencao", grupoPrioritario: "diabetico",
    ultimoContato: "11/02/2026", proximaVisita: "14/03/2026", alertasAbertos: 0,
    controle: "descontrolado", exameVencido: true, exameVencidoDesc: "Hemoglobina glicada há 195 dias",
    indicadoresFora: ["Hemoglobina Glicada"],
    prioridade: "media",
  },
  {
    id: "9", nome: "Severino Ramos", cpf: "982.011.440-22", cns: "321 0099 8877 6655",
    dataNascimento: "19/08/1943", acs: "Carla Souza", ubs: "UBS Norte",
    situacao: "pos_alta", grupoPrioritario: null,
    ultimoContato: "05/03/2026", proximaVisita: "13/03/2026", alertasAbertos: 1,
    foraPrazoVisita: true,
    prioridade: "alta",
  },
  {
    id: "10", nome: "Neide Aparecida Santos", cpf: "543.210.987-44", cns: "654 0011 2255 3388",
    dataNascimento: "27/11/1965", acs: "Roberto Meira", ubs: "UBS Norte",
    situacao: "estavel", grupoPrioritario: "hipertenso",
    ultimoContato: "18/02/2026", proximaVisita: "25/03/2026", alertasAbertos: 0,
    controle: "controlado",
    prioridade: "baixa",
  },
]

const todosAcs   = [...new Set(pacientesMock.map(p => p.acs))].sort()
const todasUbs   = [...new Set(pacientesMock.map(p => p.ubs))].sort()
const todosIndicadores = [...new Set(pacientesMock.flatMap(p => p.indicadoresFora ?? []))].sort()

// RF-FE-09.10 — computa os motivos de destaque ativos para um paciente
function computarMotivos(p: Paciente, filtros: {
  grupo: NonNullable<GrupoPrioritario>[]
  controle: Controle[]
  exameVencido: boolean
  foraPrazo: boolean
  indicadores: string[]
}): string[] {
  const motivos: string[] = []
  if (filtros.controle.includes("descontrolado") && p.controle === "descontrolado")
    motivos.push("Condição descontrolada")
  if (filtros.controle.includes("controlado") && p.controle === "controlado")
    motivos.push("Condição controlada")
  if (filtros.exameVencido && p.exameVencido && p.exameVencidoDesc)
    motivos.push(p.exameVencidoDesc)
  if (filtros.foraPrazo && p.foraPrazoVisita)
    motivos.push("Visita fora do prazo")
  filtros.indicadores.forEach(ind => {
    if (p.indicadoresFora?.includes(ind)) motivos.push(`Fora: ${ind}`)
  })
  return motivos
}

export default function PacientesApsPage() {
  // RF-FE-09.02 — pré-filtrado pela unidade do usuário logado
  const [filtroUbs,        setFiltroUbs]        = useState<string>(UNIDADE_USUARIO)
  const [busca,            setBusca]            = useState("")
  const [filtroSituacao,   setFiltroSituacao]   = useState<SituacaoPaciente[]>([])
  const [filtroGrupo,      setFiltroGrupo]      = useState<NonNullable<GrupoPrioritario>[]>([])
  const [filtroAcs,        setFiltroAcs]        = useState<string>("todos")
  // RF-FE-09.04
  const [filtroControle,   setFiltroControle]   = useState<Controle[]>([])
  // RF-FE-09.05
  const [filtroExameVencido, setFiltroExameVencido] = useState(false)
  // RF-FE-09.06
  const [filtroForaPrazo,  setFiltroForaPrazo]  = useState(false)
  // RF-FE-09.07
  const [filtroIndicadores, setFiltroIndicadores] = useState<string[]>([])
  // RF-FE-09.13
  const [ordenarPrioridade, setOrdenarPrioridade] = useState(false)

  const filtrosAtivos =
    filtroSituacao.length +
    filtroGrupo.length +
    filtroControle.length +
    filtroIndicadores.length +
    (filtroAcs !== "todos" ? 1 : 0) +
    (filtroExameVencido ? 1 : 0) +
    (filtroForaPrazo ? 1 : 0)

  // RF-FE-09.15 / RF-FE-09.16 — filtragem combinada e dinâmica
  const pacientesFiltrados = useMemo(() => {
    let lista = pacientesMock.filter((p) => {
      const matchUbs      = filtroUbs === "todas" || p.ubs === filtroUbs
      const matchBusca    = busca === "" ||
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.cpf.includes(busca) || p.cns.includes(busca)
      const matchSituacao = filtroSituacao.length === 0 || filtroSituacao.includes(p.situacao)
      const matchGrupo    = filtroGrupo.length === 0 || (p.grupoPrioritario && filtroGrupo.includes(p.grupoPrioritario))
      const matchAcs      = filtroAcs === "todos" || p.acs === filtroAcs
      // RF-FE-09.04
      const matchControle = filtroControle.length === 0 || (p.controle && filtroControle.includes(p.controle))
      // RF-FE-09.05
      const matchExame    = !filtroExameVencido || p.exameVencido === true
      // RF-FE-09.06
      const matchPrazo    = !filtroForaPrazo || p.foraPrazoVisita === true
      // RF-FE-09.07
      const matchIndicador = filtroIndicadores.length === 0 ||
        filtroIndicadores.some(ind => p.indicadoresFora?.includes(ind))

      return matchUbs && matchBusca && matchSituacao && matchGrupo &&
        matchAcs && matchControle && matchExame && matchPrazo && matchIndicador
    })

    // RF-FE-09.13 — ordenação por prioridade
    if (ordenarPrioridade) {
      lista = [...lista].sort((a, b) =>
        prioridadeConfig[a.prioridade].ordem - prioridadeConfig[b.prioridade].ordem
      )
    }

    return lista
  }, [busca, filtroUbs, filtroSituacao, filtroGrupo, filtroAcs,
    filtroControle, filtroExameVencido, filtroForaPrazo, filtroIndicadores, ordenarPrioridade])

  const totalUnidade   = pacientesMock.filter(p => p.ubs === UNIDADE_USUARIO).length
  const internados     = pacientesMock.filter(p => p.ubs === UNIDADE_USUARIO && p.situacao === "internado").length
  const posAlta        = pacientesMock.filter(p => p.ubs === UNIDADE_USUARIO && p.situacao === "pos_alta").length
  const prioritarios   = pacientesMock.filter(p => p.ubs === UNIDADE_USUARIO && p.grupoPrioritario !== null).length

  // RF-FE-09.14 — exportar lista
  function exportarLista() {
    toast.success("Lista exportada", {
      description: `${pacientesFiltrados.length} paciente(s) exportados para planejamento da equipe.`,
    })
  }

  function toggleFiltroControle(v: Controle) {
    setFiltroControle(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }
  function toggleFiltroIndicador(v: string) {
    setFiltroIndicadores(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  return (
    <>
      <Toaster position="bottom-right" />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6">

          {/* Cabeçalho — RF-FE-09.02 */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: APS }} strokeWidth={1.5} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: APS }}>
                  {UNIDADE_USUARIO} — Monitoramento
                </p>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Carteira de Pacientes</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Pacientes vinculados à sua unidade de saúde
              </p>
            </div>
            {/* RF-FE-09.14 — exportar para planejamento */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl text-[13px] self-start flex-shrink-0"
              onClick={exportarLista}
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
              Exportar lista
            </Button>
          </div>

          {/* Cards de resumo */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Total na carteira</p>
                    <p className="text-3xl font-bold mt-2 text-foreground">{totalUnidade}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                    <Users className="w-4 h-4" style={{ color: APS }} strokeWidth={1.5} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Internados</p>
                    <p className="text-3xl font-bold mt-2 text-red-600">{internados}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-500" strokeWidth={1.5} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Pós-alta</p>
                    <p className="text-3xl font-bold mt-2" style={{ color: APS }}>{posAlta}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                    <UserCheck className="w-4 h-4" style={{ color: APS }} strokeWidth={1.5} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Grupos prioritários</p>
                    <p className="text-3xl font-bold mt-2 text-foreground">{prioritarios}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-pink-50">
                    <Baby className="w-4 h-4 text-pink-500" strokeWidth={1.5} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela */}
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardHeader>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                        <Users className="w-3.5 h-3.5" style={{ color: APS }} strokeWidth={1.25} />
                      </div>
                      Pacientes Cadastrados
                    </CardTitle>
                    <CardDescription className="text-[13px] mt-1">
                      {pacientesFiltrados.length} de {totalUnidade} paciente{totalUnidade !== 1 ? "s" : ""}
                      {filtrosAtivos > 0 && (
                        <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "oklch(0.55 0.18 160 / 0.10)", color: APS }}>
                          {filtrosAtivos} filtro{filtrosAtivos > 1 ? "s" : ""} ativo{filtrosAtivos > 1 ? "s" : ""}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {/* Busca livre */}
                    <div className="relative w-52">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                      <Input
                        placeholder="Nome, CPF ou CNS..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-9 h-9 rounded-xl text-[13px]"
                      />
                    </div>

                    {/* RF-FE-09.13 — ordenar por prioridade */}
                    <Button
                      variant={ordenarPrioridade ? "default" : "outline"}
                      size="sm"
                      className="rounded-xl gap-1.5 text-[13px] h-9"
                      style={ordenarPrioridade ? { background: APS } : {}}
                      onClick={() => setOrdenarPrioridade(!ordenarPrioridade)}
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Prioridade
                    </Button>

                    {/* Filtro UBS */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-[13px] h-9">
                          <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                          {filtroUbs === "todas" ? "Todas as UBS" : filtroUbs}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuCheckboxItem
                          checked={filtroUbs === "todas"}
                          onCheckedChange={() => setFiltroUbs("todas")}
                          className="text-[13px]"
                        >
                          Todas as UBS
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        {todasUbs.map(ubs => (
                          <DropdownMenuCheckboxItem
                            key={ubs}
                            checked={filtroUbs === ubs}
                            onCheckedChange={() => setFiltroUbs(ubs)}
                            className="text-[13px]"
                          >
                            {ubs}
                            {ubs === UNIDADE_USUARIO && (
                              <span className="ml-1.5 text-[10px] font-semibold" style={{ color: APS }}>(sua unidade)</span>
                            )}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Filtros avançados — RF-FE-09.03/04/05/06/07/15 */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-[13px] h-9">
                          <Filter className="h-3.5 w-3.5" strokeWidth={1.5} />
                          Filtros
                          {filtrosAtivos > 0 && (
                            <span className="w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center" style={{ background: APS }}>
                              {filtrosAtivos}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl w-60">

                        {/* Situação clínica */}
                        <DropdownMenuLabel className="text-[12px]">Situação clínica</DropdownMenuLabel>
                        {(["estavel", "internado", "pos_alta", "atencao"] as SituacaoPaciente[]).map(s => (
                          <DropdownMenuCheckboxItem
                            key={s}
                            checked={filtroSituacao.includes(s)}
                            onCheckedChange={() => setFiltroSituacao(prev =>
                              prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                            )}
                            className="text-[13px]"
                          >
                            {situacaoConfig[s].label}
                          </DropdownMenuCheckboxItem>
                        ))}

                        <DropdownMenuSeparator />

                        {/* RF-FE-09.03 — grupo prioritário */}
                        <DropdownMenuLabel className="text-[12px]">Grupo prioritário</DropdownMenuLabel>
                        {(["gestante", "diabetico", "hipertenso", "saude_mental"] as NonNullable<GrupoPrioritario>[]).map(g => (
                          <DropdownMenuCheckboxItem
                            key={g}
                            checked={filtroGrupo.includes(g)}
                            onCheckedChange={() => setFiltroGrupo(prev =>
                              prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
                            )}
                            className="text-[13px]"
                          >
                            {grupoConfig[g].label}
                          </DropdownMenuCheckboxItem>
                        ))}

                        <DropdownMenuSeparator />

                        {/* RF-FE-09.04 — controle da condição */}
                        <DropdownMenuLabel className="text-[12px]">Controle da condição</DropdownMenuLabel>
                        <DropdownMenuCheckboxItem
                          checked={filtroControle.includes("controlado")}
                          onCheckedChange={() => toggleFiltroControle("controlado")}
                          className="text-[13px]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-green-600 inline" strokeWidth={1.5} />
                          Controlado
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filtroControle.includes("descontrolado")}
                          onCheckedChange={() => toggleFiltroControle("descontrolado")}
                          className="text-[13px]"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-red-600 inline" strokeWidth={1.5} />
                          Descontrolado
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuSeparator />

                        {/* RF-FE-09.05 — exame vencido */}
                        <DropdownMenuLabel className="text-[12px]">Critérios clínicos</DropdownMenuLabel>
                        <DropdownMenuCheckboxItem
                          checked={filtroExameVencido}
                          onCheckedChange={() => setFiltroExameVencido(!filtroExameVencido)}
                          className="text-[13px]"
                        >
                          <FlaskConical className="w-3.5 h-3.5 mr-1.5 text-sky-600 inline" strokeWidth={1.5} />
                          Exame periódico vencido
                        </DropdownMenuCheckboxItem>

                        {/* RF-FE-09.06 — fora do prazo de visita */}
                        <DropdownMenuCheckboxItem
                          checked={filtroForaPrazo}
                          onCheckedChange={() => setFiltroForaPrazo(!filtroForaPrazo)}
                          className="text-[13px]"
                        >
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-orange-500 inline" strokeWidth={1.5} />
                          Visita fora do prazo
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuSeparator />

                        {/* RF-FE-09.07 — filtro por indicador */}
                        <DropdownMenuLabel className="text-[12px]">Fora do indicador</DropdownMenuLabel>
                        {todosIndicadores.map(ind => (
                          <DropdownMenuCheckboxItem
                            key={ind}
                            checked={filtroIndicadores.includes(ind)}
                            onCheckedChange={() => toggleFiltroIndicador(ind)}
                            className="text-[13px] leading-tight py-1.5"
                          >
                            {ind}
                          </DropdownMenuCheckboxItem>
                        ))}

                        <DropdownMenuSeparator />

                        {/* ACS */}
                        <DropdownMenuLabel className="text-[12px]">Agente de Saúde</DropdownMenuLabel>
                        <DropdownMenuCheckboxItem
                          checked={filtroAcs === "todos"}
                          onCheckedChange={() => setFiltroAcs("todos")}
                          className="text-[13px]"
                        >
                          Todos os agentes
                        </DropdownMenuCheckboxItem>
                        {todosAcs.map(acs => (
                          <DropdownMenuCheckboxItem
                            key={acs}
                            checked={filtroAcs === acs}
                            onCheckedChange={() => setFiltroAcs(acs)}
                            className="text-[13px]"
                          >
                            {acs}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Limpar filtros */}
                    {filtrosAtivos > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-[13px] h-9 text-muted-foreground"
                        onClick={() => {
                          setFiltroSituacao([])
                          setFiltroGrupo([])
                          setFiltroAcs("todos")
                          setFiltroControle([])
                          setFiltroExameVencido(false)
                          setFiltroForaPrazo(false)
                          setFiltroIndicadores([])
                        }}
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Paciente</th>
                      <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Grupo</th>
                      <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">ACS / UBS</th>
                      <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Situação</th>
                      <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Próxima visita</th>
                      <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pacientesFiltrados.map((p) => {
                      const grp    = p.grupoPrioritario ? grupoConfig[p.grupoPrioritario] : null
                      const GrpIcon = grp?.icon
                      const prio   = prioridadeConfig[p.prioridade]

                      // RF-FE-09.10 — motivos derivados dos filtros ativos
                      const motivos = computarMotivos(p, {
                        grupo: filtroGrupo,
                        controle: filtroControle,
                        exameVencido: filtroExameVencido,
                        foraPrazo: filtroForaPrazo,
                        indicadores: filtroIndicadores,
                      })

                      // RF-FE-09.08 — destaque visual para fora do indicador
                      const foraDeIndicador = (p.indicadoresFora?.length ?? 0) > 0

                      return (
                        <tr
                          key={p.id}
                          className={cn(
                            "hover:bg-muted/40 transition-colors cursor-pointer group",
                            foraDeIndicador && filtroIndicadores.length > 0 && "bg-red-50/40"
                          )}
                        >
                          {/* Paciente */}
                          <td className="py-3.5 pr-4">
                            <Link href={`/portal-atencao-basica/paciente/${p.id}`} className="block">
                              <div className="flex items-center gap-2">
                                {/* RF-FE-09.13 — indicador de prioridade */}
                                {ordenarPrioridade && (
                                  <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ background: prio.cor }}
                                    title={`Prioridade ${prio.label}`}
                                  />
                                )}
                                <div>
                                  <p className="font-semibold text-sm text-foreground group-hover:text-[--aps] transition-colors">
                                    {p.nome}
                                  </p>
                                  <p className="text-[12px] text-muted-foreground mt-0.5">CPF: {p.cpf}</p>
                                </div>
                              </div>

                              {/* RF-FE-09.08 — badge fora do indicador */}
                              {foraDeIndicador && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {(p.indicadoresFora ?? []).map(ind => (
                                    <span key={ind} className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-red-100 text-red-700">
                                      <Bell className="w-2.5 h-2.5" strokeWidth={2} /> {ind}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* RF-FE-09.10 — motivos do filtro ativo */}
                              {motivos.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {motivos.map(m => (
                                    <span key={m} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-amber-50 text-amber-700">
                                      {m}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </Link>
                          </td>

                          {/* Grupo prioritário */}
                          <td className="py-3.5 pr-4 hidden md:table-cell">
                            <div className="space-y-1">
                              {grp && GrpIcon ? (
                                <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold", grp.bg)}>
                                  <GrpIcon className="w-3 h-3 flex-shrink-0" style={{ color: grp.cor }} strokeWidth={1.5} />
                                  <span style={{ color: grp.cor }}>{grp.label}</span>
                                </span>
                              ) : (
                                <span className="text-[12px] text-muted-foreground">—</span>
                              )}
                              {/* RF-FE-09.04 — controle da condição */}
                              {p.controle && (
                                <div>
                                  {p.controle === "controlado" ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-md">
                                      <ShieldCheck className="w-3 h-3" strokeWidth={1.5} /> Controlado
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded-md">
                                      <ShieldAlert className="w-3 h-3" strokeWidth={1.5} /> Descontrolado
                                    </span>
                                  )}
                                </div>
                              )}
                              {/* RF-FE-09.05 — exame vencido */}
                              {p.exameVencido && (
                                <div>
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-md">
                                    <FlaskConical className="w-3 h-3" strokeWidth={1.5} /> Exame vencido
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* ACS / UBS */}
                          <td className="py-3.5 pr-4 hidden lg:table-cell">
                            <p className="text-[13px] font-medium text-foreground">{p.acs}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{p.ubs}</p>
                          </td>

                          {/* Situação */}
                          <td className="py-3.5 pr-4">
                            <span
                              className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold", situacaoConfig[p.situacao].className)}
                              style={situacaoConfig[p.situacao].style}
                            >
                              {situacaoConfig[p.situacao].label}
                            </span>
                            {p.alertasAbertos > 0 && (
                              <span className="ml-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] inline-flex items-center justify-center font-bold">
                                {p.alertasAbertos}
                              </span>
                            )}
                            {/* RF-FE-09.06 — fora do prazo de visita */}
                            {p.foraPrazoVisita && (
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded-md">
                                  <Clock className="w-3 h-3" strokeWidth={1.5} /> Fora do prazo
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Próxima visita */}
                          <td className="py-3.5 pr-4 hidden sm:table-cell">
                            {p.proximaVisita ? (
                              <span className="flex items-center gap-1.5 text-[13px] text-foreground">
                                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                                {p.proximaVisita}
                              </span>
                            ) : (
                              <span className="text-[13px] text-muted-foreground">Não agendada</span>
                            )}
                          </td>

                          {/* RF-FE-09.12 — ações diretas na lista */}
                          <td className="py-3.5">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl text-[13px]">
                                <DropdownMenuItem asChild>
                                  <Link href={`/portal-atencao-basica/paciente/${p.id}`} className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} /> Ver prontuário
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2"
                                  onClick={() => toast.success("Acompanhamento registrado", { description: p.nome })}
                                >
                                  <ClipboardList className="w-4 h-4" strokeWidth={1.5} /> Registrar acompanhamento
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2"
                                  onClick={() => toast.success("Visita agendada", { description: p.nome })}
                                >
                                  <CalendarDays className="w-4 h-4" strokeWidth={1.5} /> Agendar visita
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="flex items-center gap-2 text-red-600"
                                  onClick={() => toast.success("Alerta gerado", { description: p.nome })}
                                >
                                  <Bell className="w-4 h-4" strokeWidth={1.5} /> Gerar alerta
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {pacientesFiltrados.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-20" strokeWidth={1} />
                  <p className="text-[13px] font-medium">Nenhum paciente encontrado.</p>
                  {filtrosAtivos > 0 && (
                    <p className="text-[12px] mt-1">Tente remover alguns filtros.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}
