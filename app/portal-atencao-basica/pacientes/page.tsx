"use client"

import { useState } from "react"
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
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Users,
  UserCheck,
  AlertTriangle,
  Filter,
  Baby,
  Pill,
  Heart,
  ChevronRight,
  CalendarDays,
} from "lucide-react"
import { cn } from "@/lib/utils"

const APS = "oklch(0.55 0.18 160)"

type SituacaoPaciente = "estavel" | "internado" | "pos_alta" | "atencao"
type GrupoPrioritario = "gestante" | "diabetico" | "hipertenso" | "saude_mental" | null

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
}

const situacaoConfig: Record<SituacaoPaciente, { label: string; className: string; style?: React.CSSProperties }> = {
  estavel: { label: "Estável", className: "bg-emerald-50 text-emerald-700" },
  internado: { label: "Internado", className: "bg-destructive/10 text-destructive" },
  pos_alta: { label: "Pós-alta", className: "", style: { background: "oklch(0.55 0.18 160 / 0.10)", color: APS } },
  atencao: { label: "Requer atenção", className: "bg-orange-50 text-orange-700" },
}

const grupoConfig: Record<NonNullable<GrupoPrioritario>, { label: string; icon: React.ElementType; cor: string; bg: string }> = {
  gestante: { label: "Gestante", icon: Baby, cor: "#db2777", bg: "bg-pink-50" },
  diabetico: { label: "Diabético", icon: Pill, cor: "#d97706", bg: "bg-amber-50" },
  hipertenso: { label: "Hipertenso", icon: Heart, cor: "#7c3aed", bg: "bg-violet-50" },
  saude_mental: { label: "S. Mental", icon: UserCheck, cor: "#0891b2", bg: "bg-cyan-50" },
}

const pacientesMock: Paciente[] = [
  { id: "1", nome: "Maria das Graças Ferreira", cpf: "821.344.090-11", cns: "898 0012 3456 7890", dataNascimento: "14/05/1968", acs: "João Carlos", ubs: "UBS Central", situacao: "pos_alta", grupoPrioritario: null, ultimoContato: "08/03/2026", proximaVisita: "11/03/2026", alertasAbertos: 1 },
  { id: "2", nome: "Ana Lúcia Barbosa", cpf: "034.892.110-44", cns: "702 0034 5678 1234", dataNascimento: "22/06/2000", acs: "Fernanda Lima", ubs: "UBS Central", situacao: "estavel", grupoPrioritario: "gestante", ultimoContato: "01/02/2026", proximaVisita: "11/03/2026", alertasAbertos: 0 },
  { id: "3", nome: "José Augusto Correia", cpf: "511.023.770-88", cns: "123 0056 7890 5678", dataNascimento: "30/07/1955", acs: "João Carlos", ubs: "UBS Central", situacao: "atencao", grupoPrioritario: "diabetico", ultimoContato: "04/02/2026", proximaVisita: "13/03/2026", alertasAbertos: 0 },
  { id: "4", nome: "Rosana Melo Santos", cpf: "192.774.050-33", cns: "456 0078 1234 9012", dataNascimento: "17/09/1972", acs: "Carla Souza", ubs: "UBS Central", situacao: "pos_alta", grupoPrioritario: "hipertenso", ultimoContato: "07/03/2026", proximaVisita: "12/03/2026", alertasAbertos: 1 },
  { id: "5", nome: "Francisco Nunes Lima", cpf: "673.019.440-55", cns: "234 0011 2233 4455", dataNascimento: "03/01/1948", acs: "Fernanda Lima", ubs: "UBS Central", situacao: "pos_alta", grupoPrioritario: null, ultimoContato: "07/03/2026", proximaVisita: "12/03/2026", alertasAbertos: 1 },
  { id: "6", nome: "João Batista Neto", cpf: "147.258.369-66", cns: "567 0022 3344 5566", dataNascimento: "12/03/1960", acs: "Fernanda Lima", ubs: "UBS Central", situacao: "estavel", grupoPrioritario: "hipertenso", ultimoContato: "10/02/2026", proximaVisita: "20/03/2026", alertasAbertos: 0 },
  { id: "7", nome: "Célia Regina Moura", cpf: "258.369.147-77", cns: "678 0033 4455 6677", dataNascimento: "08/04/2001", acs: "João Carlos", ubs: "UBS Central", situacao: "estavel", grupoPrioritario: "gestante", ultimoContato: "05/02/2026", proximaVisita: "11/03/2026", alertasAbertos: 0 },
  { id: "8", nome: "Antônio Gomes", cpf: "369.147.258-88", cns: "789 0044 5566 7788", dataNascimento: "25/12/1958", acs: "Carla Souza", ubs: "UBS Central", situacao: "atencao", grupoPrioritario: "diabetico", ultimoContato: "11/02/2026", proximaVisita: "14/03/2026", alertasAbertos: 0 },
  { id: "9", nome: "Severino Ramos", cpf: "982.011.440-22", cns: "321 0099 8877 6655", dataNascimento: "19/08/1943", acs: "Carla Souza", ubs: "UBS Norte", situacao: "pos_alta", grupoPrioritario: null, ultimoContato: "05/03/2026", proximaVisita: "13/03/2026", alertasAbertos: 1 },
  { id: "10", nome: "Neide Aparecida Santos", cpf: "543.210.987-44", cns: "654 0011 2255 3388", dataNascimento: "27/11/1965", acs: "Roberto Meira", ubs: "UBS Norte", situacao: "estavel", grupoPrioritario: "hipertenso", ultimoContato: "18/02/2026", proximaVisita: "25/03/2026", alertasAbertos: 0 },
]

const todosAcs = [...new Set(pacientesMock.map(p => p.acs))].sort()
const todasUbs = [...new Set(pacientesMock.map(p => p.ubs))].sort()

export default function PacientesApsPage() {
  const [busca, setBusca] = useState("")
  const [filtroSituacao, setFiltroSituacao] = useState<SituacaoPaciente[]>([])
  const [filtroGrupo, setFiltroGrupo] = useState<NonNullable<GrupoPrioritario>[]>([])
  const [filtroAcs, setFiltroAcs] = useState<string | "todos">("todos")
  const [filtroUbs, setFiltroUbs] = useState<string | "todas">("todas")

  const pacientesFiltrados = pacientesMock.filter((p) => {
    const matchBusca = busca === "" ||
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.cpf.includes(busca) ||
      p.cns.includes(busca)
    const matchSituacao = filtroSituacao.length === 0 || filtroSituacao.includes(p.situacao)
    const matchGrupo = filtroGrupo.length === 0 || (p.grupoPrioritario && filtroGrupo.includes(p.grupoPrioritario))
    const matchAcs = filtroAcs === "todos" || p.acs === filtroAcs
    const matchUbs = filtroUbs === "todas" || p.ubs === filtroUbs
    return matchBusca && matchSituacao && matchGrupo && matchAcs && matchUbs
  })

  const filtrosAtivos = filtroSituacao.length + filtroGrupo.length + (filtroAcs !== "todos" ? 1 : 0) + (filtroUbs !== "todas" ? 1 : 0)

  const totalCarteira = pacientesMock.length
  const internados = pacientesMock.filter(p => p.situacao === "internado").length
  const posAlta = pacientesMock.filter(p => p.situacao === "pos_alta").length
  const prioritarios = pacientesMock.filter(p => p.grupoPrioritario !== null).length

  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="p-4 md:p-6 space-y-6">

        {/* Cabeçalho */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: APS }}>Monitoramento</p>
          <h1 className="text-2xl font-semibold text-foreground">Carteira de Pacientes</h1>
          <p className="text-sm text-muted-foreground mt-1">Pacientes vinculados às unidades de saúde</p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Total na carteira</p>
                  <p className="text-3xl font-bold mt-2 text-foreground">{totalCarteira}</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "oklch(0.55 0.18 160 / 0.10)" }}>
                    <Users className="w-3.5 h-3.5" style={{ color: APS }} strokeWidth={1.25} />
                  </div>
                  Pacientes Cadastrados
                </CardTitle>
                <CardDescription className="text-[13px] mt-1">
                  {pacientesFiltrados.length} de {totalCarteira} paciente{totalCarteira !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    placeholder="Nome, CPF ou CNS..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-9 h-9 rounded-xl text-[13px]"
                  />
                </div>

                {/* Filtro UBS */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-[13px] h-9">
                      <Filter className="h-3.5 w-3.5" strokeWidth={1.5} />
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
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Filtro avançado */}
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
                  <DropdownMenuContent align="end" className="rounded-xl w-52">
                    <DropdownMenuLabel className="text-[12px]">Situação</DropdownMenuLabel>
                    {(["estavel", "internado", "pos_alta", "atencao"] as SituacaoPaciente[]).map(s => (
                      <DropdownMenuCheckboxItem
                        key={s}
                        checked={filtroSituacao.includes(s)}
                        onCheckedChange={() => setFiltroSituacao(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                        className="text-[13px]"
                      >
                        {situacaoConfig[s].label}
                      </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[12px]">Grupo prioritário</DropdownMenuLabel>
                    {(["gestante", "diabetico", "hipertenso", "saude_mental"] as NonNullable<GrupoPrioritario>[]).map(g => (
                      <DropdownMenuCheckboxItem
                        key={g}
                        checked={filtroGrupo.includes(g)}
                        onCheckedChange={() => setFiltroGrupo(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                        className="text-[13px]"
                      >
                        {grupoConfig[g].label}
                      </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
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
                    <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Próxima visita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pacientesFiltrados.map((p) => {
                    const grp = p.grupoPrioritario ? grupoConfig[p.grupoPrioritario] : null
                    const GrpIcon = grp?.icon
                    return (
                      <tr key={p.id} className="hover:bg-muted/40 transition-colors cursor-pointer group">
                        <td className="py-3.5 pr-4">
                          <Link href={`/portal-atencao-basica/paciente/${p.id}`} className="block">
                            <p className="font-semibold text-sm text-foreground group-hover:text-[--aps] transition-colors"
                              style={{}}>
                              {p.nome}
                            </p>
                            <p className="text-[12px] text-muted-foreground mt-0.5">CPF: {p.cpf}</p>
                          </Link>
                        </td>
                        <td className="py-3.5 pr-4 hidden md:table-cell">
                          {grp && GrpIcon ? (
                            <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold", grp.bg)}>
                              <GrpIcon className="w-3 h-3 flex-shrink-0" style={{ color: grp.cor }} strokeWidth={1.5} />
                              <span style={{ color: grp.cor }}>{grp.label}</span>
                            </span>
                          ) : (
                            <span className="text-[12px] text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4 hidden lg:table-cell">
                          <p className="text-[13px] font-medium text-foreground">{p.acs}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{p.ubs}</p>
                        </td>
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
                        </td>
                        <td className="py-3.5 hidden sm:table-cell">
                          {p.proximaVisita ? (
                            <span className="flex items-center gap-1.5 text-[13px] text-foreground">
                              <CalendarDays className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                              {p.proximaVisita}
                            </span>
                          ) : (
                            <span className="text-[13px] text-muted-foreground">Não agendada</span>
                          )}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
