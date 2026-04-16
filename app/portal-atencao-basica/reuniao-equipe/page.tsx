"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Maximize2, Minimize2, TrendingUp, TrendingDown, Minus,
  Bell, Users, ChevronRight, ChevronDown, CalendarPlus,
  X, ClipboardList, MapPin, AlertTriangle, CheckCircle,
  Plus, User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useApsSidebar } from "@/lib/aps-sidebar-context"
import {
  type GrupoCondicao,
  type TipoAcao,
  type AcaoReuniao,
  INDICADORES_REUNIAO,
  ALERTAS_REUNIAO,
  PACIENTES_PRIORITARIOS,
  grupoCondicaoConfig,
  tipoAlertaLabels,
  tipoAcaoConfig,
} from "./dados-reuniao"

const APS = "oklch(0.55 0.18 160)"
const APS_BG = "oklch(0.55 0.18 160 / 0.10)"

type AbaReuniao = "visao_geral" | "pacientes" | "acoes"
type FiltroGrupo = GrupoCondicao | "todos"

const tendenciaIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}
const tendenciaCor = {
  up: "text-green-600",
  down: "text-red-600",
  stable: "text-muted-foreground",
}

export default function ReuniaoEquipePage() {
  const { setCollapsed } = useApsSidebar()
  const [aba, setAba] = useState<AbaReuniao>("visao_geral")
  const [modoApresentacao, setModoApresentacao] = useState(false)

  useEffect(() => {
    setCollapsed(modoApresentacao)
  }, [modoApresentacao, setCollapsed])
  const [filtroGrupo, setFiltroGrupo] = useState<FiltroGrupo>("todos")
  const [pacienteExpandido, setPacienteExpandido] = useState<string | null>(null)

  // Ações da reunião
  const [acoes, setAcoes] = useState<AcaoReuniao[]>([])
  const [novaAcaoPacienteId, setNovaAcaoPacienteId] = useState<string | null>(null)
  const [novaAcaoTipo, setNovaAcaoTipo] = useState<TipoAcao>("visita")
  const [novaAcaoResponsavel, setNovaAcaoResponsavel] = useState("")
  const [novaAcaoPrazo, setNovaAcaoPrazo] = useState("")
  const [novaAcaoObs, setNovaAcaoObs] = useState("")

  const pacientesFiltrados = filtroGrupo === "todos"
    ? PACIENTES_PRIORITARIOS
    : PACIENTES_PRIORITARIOS.filter((p) => p.grupo === filtroGrupo)

  const grupos = Object.keys(grupoCondicaoConfig) as GrupoCondicao[]
  const gruposComPacientes = grupos.filter((g) => PACIENTES_PRIORITARIOS.some((p) => p.grupo === g))

  const totalForaPrazo = INDICADORES_REUNIAO.reduce((acc, i) => acc + i.foraPrazo, 0)
  const coberturaMedia = Math.round(INDICADORES_REUNIAO.reduce((acc, i) => acc + i.cobertura, 0) / INDICADORES_REUNIAO.length)
  const alertasPendentes = ALERTAS_REUNIAO.length

  function adicionarAcao() {
    if (!novaAcaoPacienteId || !novaAcaoResponsavel || !novaAcaoPrazo) return
    const paciente = PACIENTES_PRIORITARIOS.find((p) => p.id === novaAcaoPacienteId)
    if (!paciente) return
    const acao: AcaoReuniao = {
      id: `acao-${Date.now()}`,
      pacienteId: novaAcaoPacienteId,
      paciente: paciente.nome,
      tipo: novaAcaoTipo,
      responsavel: novaAcaoResponsavel,
      prazo: novaAcaoPrazo,
      observacao: novaAcaoObs,
    }
    setAcoes((prev) => [...prev, acao])
    setNovaAcaoPacienteId(null)
    setNovaAcaoTipo("visita")
    setNovaAcaoResponsavel("")
    setNovaAcaoPrazo("")
    setNovaAcaoObs("")
  }

  function removerAcao(id: string) {
    setAcoes((prev) => prev.filter((a) => a.id !== id))
  }

  const txtBase = modoApresentacao ? "text-[16px]" : "text-[13px]"
  const txtTitulo = modoApresentacao ? "text-3xl" : "text-2xl"
  const txtCard = modoApresentacao ? "text-4xl" : "text-3xl"
  const txtLabel = modoApresentacao ? "text-[13px]" : "text-[11px]"

  const abas: { id: AbaReuniao; label: string }[] = [
    { id: "visao_geral", label: "Visão geral" },
    { id: "pacientes", label: "Pacientes prioritários" },
    { id: "acoes", label: "Ações da reunião" },
  ]

  return (
    <main className="flex-1 overflow-y-auto">
      <div className={cn("p-4 md:p-6 space-y-6", modoApresentacao && "p-8 md:p-10 space-y-8")}>

        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3.5 h-3.5" style={{ color: APS }} strokeWidth={1.5} />
              <p className={cn(txtLabel, "font-semibold uppercase tracking-[0.15em]")} style={{ color: APS }}>
                UBS Central de Búzios - Reunião de equipe
              </p>
            </div>
            <h1 className={cn(txtTitulo, "font-semibold text-foreground")}>
              Reunião de Equipe
            </h1>
            <p className={cn(txtBase, "text-muted-foreground mt-1")}>
              Painel consolidado para discussão e planejamento coletivo
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn("rounded-xl gap-2", txtBase)}
            onClick={() => setModoApresentacao(!modoApresentacao)}
          >
            {modoApresentacao ? (
              <>
                <Minimize2 className="w-4 h-4" strokeWidth={1.5} />
                Modo normal
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" strokeWidth={1.5} />
                Modo apresentação
              </>
            )}
          </Button>
        </div>

        {/* Abas */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 w-fit">
          {abas.map((a) => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-150 cursor-pointer",
                modoApresentacao ? "text-[15px]" : "text-[13px]",
                aba === a.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {a.label}
              {a.id === "acoes" && acoes.length > 0 && (
                <span
                  className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white"
                  style={{ background: APS }}
                >
                  {acoes.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* === ABA: VISAO GERAL === */}
        {aba === "visao_geral" && (
          <div className="space-y-6">

            {/* Cards resumo */}
            <div className={cn("grid gap-4", modoApresentacao ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-4")}>
              <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
                <CardContent className="p-5">
                  <p className={cn(txtLabel, "font-semibold uppercase tracking-wide text-muted-foreground")}>Cobertura média</p>
                  <p className={cn(txtCard, "font-bold mt-2 text-foreground")}>
                    {coberturaMedia}<span className="text-base font-medium text-muted-foreground">%</span>
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
                <CardContent className="p-5">
                  <p className={cn(txtLabel, "font-semibold uppercase tracking-wide text-muted-foreground")}>Fora do prazo</p>
                  <p className={cn(txtCard, "font-bold mt-2 text-red-600")}>{totalForaPrazo}</p>
                </CardContent>
              </Card>
              <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
                <CardContent className="p-5">
                  <p className={cn(txtLabel, "font-semibold uppercase tracking-wide text-muted-foreground")}>Alertas ativos</p>
                  <p className={cn(txtCard, "font-bold mt-2 text-orange-600")}>{alertasPendentes}</p>
                </CardContent>
              </Card>
              <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
                <CardContent className="p-5">
                  <p className={cn(txtLabel, "font-semibold uppercase tracking-wide text-muted-foreground")}>Pacientes prioritários</p>
                  <p className={cn(txtCard, "font-bold mt-2 text-foreground")}>{PACIENTES_PRIORITARIOS.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Indicadores por grupo */}
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="pb-3">
                <CardTitle className={cn(modoApresentacao ? "text-lg" : "text-base", "font-semibold flex items-center gap-2")}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: APS_BG }}>
                    <ClipboardList className="w-3.5 h-3.5" style={{ color: APS }} strokeWidth={1.25} />
                  </div>
                  Indicadores da unidade
                </CardTitle>
                <CardDescription className={txtBase}>
                  Desempenho atual por grupo de acompanhamento
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={cn("grid gap-3", modoApresentacao ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-2")}>
                  {INDICADORES_REUNIAO.map((ind) => {
                    const Icon = ind.icon
                    const TendIcon = tendenciaIcon[ind.tendencia]
                    const metaCumprida = ind.cobertura >= ind.meta
                    return (
                      <div
                        key={ind.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", ind.corBg)}>
                          <Icon className="w-5 h-5" style={{ color: ind.cor }} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(txtBase, "font-semibold text-foreground")}>{ind.nome}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${ind.cobertura}%`, background: metaCumprida ? "#16a34a" : ind.cor }}
                              />
                            </div>
                            <span className={cn("text-[12px] font-bold tabular-nums", metaCumprida ? "text-green-600" : "text-red-600")}>
                              {ind.cobertura}%
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={cn("font-bold tabular-nums", modoApresentacao ? "text-lg" : "text-base", ind.foraPrazo > 0 ? "text-red-600" : "text-muted-foreground")}>
                            {ind.foraPrazo}
                          </p>
                          <p className={cn(txtLabel, "text-muted-foreground")}>fora prazo</p>
                        </div>
                        <TendIcon className={cn("w-4 h-4 flex-shrink-0", tendenciaCor[ind.tendencia])} strokeWidth={1.5} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Alertas ativos */}
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="pb-3">
                <CardTitle className={cn(modoApresentacao ? "text-lg" : "text-base", "font-semibold flex items-center gap-2")}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-red-50">
                    <Bell className="w-3.5 h-3.5 text-red-600" strokeWidth={1.25} />
                  </div>
                  Alertas que exigem atenção
                </CardTitle>
                <CardDescription className={txtBase}>
                  {ALERTAS_REUNIAO.length} situação(ões) para discussão
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {ALERTAS_REUNIAO.map((al) => {
                  const tipoCfg = tipoAlertaLabels[al.tipo]
                  return (
                    <div key={al.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                      <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/portal-atencao-basica/paciente/${al.pacienteId}`}
                            className={cn(txtBase, "font-semibold text-foreground hover:underline")}
                          >
                            {al.paciente}
                          </Link>
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold", tipoCfg.className)}>
                            {tipoCfg.label}
                          </span>
                        </div>
                        <p className={cn("text-muted-foreground mt-0.5", modoApresentacao ? "text-[14px]" : "text-[12px]")}>{al.descricao}</p>
                      </div>
                      <span className={cn(txtLabel, "text-muted-foreground tabular-nums flex-shrink-0")}>{al.data}</span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* === ABA: PACIENTES PRIORITÁRIOS === */}
        {aba === "pacientes" && (
          <div className="space-y-6">

            {/* Filtro por condição */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFiltroGrupo("todos")}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium transition-all cursor-pointer",
                  txtBase,
                  filtroGrupo === "todos"
                    ? "text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
                style={filtroGrupo === "todos" ? { background: APS } : {}}
              >
                Todos ({PACIENTES_PRIORITARIOS.length})
              </button>
              {gruposComPacientes.map((g) => {
                const cfg = grupoCondicaoConfig[g]
                const Icon = cfg.icon
                const count = PACIENTES_PRIORITARIOS.filter((p) => p.grupo === g).length
                const ativo = filtroGrupo === g
                return (
                  <button
                    key={g}
                    onClick={() => setFiltroGrupo(ativo ? "todos" : g)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer",
                      txtBase,
                      ativo
                        ? "text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                      !ativo && cfg.corBg
                    )}
                    style={ativo ? { background: cfg.cor } : {}}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {cfg.label} ({count})
                  </button>
                )
              })}
            </div>

            {/* Lista de pacientes */}
            <div className="space-y-2">
              {pacientesFiltrados.map((p) => {
                const grpCfg = grupoCondicaoConfig[p.grupo]
                const GrpIcon = grpCfg.icon
                const expandido = pacienteExpandido === p.id

                return (
                  <Card key={p.id} className="rounded-[20px] border-none overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
                    <button
                      className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
                      onClick={() => setPacienteExpandido(expandido ? null : p.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", grpCfg.corBg)}>
                          <GrpIcon className="w-4 h-4" style={{ color: grpCfg.cor }} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn(txtBase, "font-semibold text-foreground")}>{p.nome}</span>
                            {p.alertaAtivo && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-100 text-red-700">
                                <Bell className="w-3 h-3" strokeWidth={1.5} />
                                Alerta ativo
                              </span>
                            )}
                            <span className={cn(
                              "text-[12px] font-semibold px-2 py-0.5 rounded-lg",
                              p.diasAtraso >= 30 ? "bg-red-100 text-red-700"
                              : p.diasAtraso >= 14 ? "bg-amber-100 text-amber-700"
                              : "bg-orange-100 text-orange-700"
                            )}>
                              {p.diasAtraso}d em atraso
                            </span>
                          </div>
                          <p className={cn("text-muted-foreground mt-0.5", modoApresentacao ? "text-[14px]" : "text-[12px]")}>{p.motivo}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={cn(txtLabel, "text-muted-foreground")}>ACS: {p.acs}</span>
                          {expandido ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Painel expandido - contexto do paciente */}
                    {expandido && (
                      <div className="border-t border-border px-4 py-4 bg-muted/20 space-y-3">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <p className={cn(txtLabel, "font-semibold text-muted-foreground uppercase tracking-wide")}>CPF</p>
                            <p className={cn(txtBase, "text-foreground mt-0.5")}>{p.cpf}</p>
                          </div>
                          <div>
                            <p className={cn(txtLabel, "font-semibold text-muted-foreground uppercase tracking-wide")}>Idade</p>
                            <p className={cn(txtBase, "text-foreground mt-0.5")}>{p.idade} anos</p>
                          </div>
                          <div>
                            <p className={cn(txtLabel, "font-semibold text-muted-foreground uppercase tracking-wide")}>Último contato</p>
                            <p className={cn(txtBase, "text-foreground mt-0.5")}>{p.ultimoContato}</p>
                          </div>
                          <div>
                            <p className={cn(txtLabel, "font-semibold text-muted-foreground uppercase tracking-wide")}>ACS responsável</p>
                            <p className={cn(txtBase, "text-foreground mt-0.5")}>{p.acs}</p>
                          </div>
                        </div>

                        <div>
                          <p className={cn(txtLabel, "font-semibold text-muted-foreground uppercase tracking-wide mb-1")}>Condições</p>
                          <div className="flex gap-1.5 flex-wrap">
                            {p.condicoes.map((c) => (
                              <span key={c} className={cn("px-2 py-0.5 rounded-lg font-medium", txtLabel, grpCfg.corBg)} style={{ color: grpCfg.cor }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            size="sm"
                            className="rounded-xl gap-1.5 text-white"
                            style={{ background: APS }}
                            onClick={() => {
                              setNovaAcaoPacienteId(p.id)
                              setAba("acoes")
                            }}
                          >
                            <Plus className="w-3 h-3" />
                            Definir ação
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-xl gap-1.5" asChild>
                            <Link href={`/portal-atencao-basica/paciente/${p.id}`}>
                              Ver resumo clínico
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-xl gap-1.5" asChild>
                            <Link href="/portal-atencao-basica/visitas">
                              <CalendarPlus className="w-3 h-3" />
                              Agendar visita
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}

              {pacientesFiltrados.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-3 opacity-30" strokeWidth={1} />
                  <p className={txtBase}>Nenhum paciente encontrado nesta categoria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === ABA: AÇÕES DA REUNIÃO === */}
        {aba === "acoes" && (
          <div className="space-y-6">

            {/* Formulário de nova ação */}
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="pb-3">
                <CardTitle className={cn(modoApresentacao ? "text-lg" : "text-base", "font-semibold flex items-center gap-2")}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: APS_BG }}>
                    <Plus className="w-3.5 h-3.5" style={{ color: APS }} strokeWidth={1.25} />
                  </div>
                  Registrar ação
                </CardTitle>
                <CardDescription className={txtBase}>
                  Defina ações para pacientes discutidos na reunião
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className={cn(txtLabel, "font-semibold text-muted-foreground uppercase tracking-wide")}>
                      Paciente
                    </label>
                    <select
                      value={novaAcaoPacienteId || ""}
                      onChange={(e) => setNovaAcaoPacienteId(e.target.value || null)}
                      className={cn("mt-1.5 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2", txtBase)}
                    >
                      <option value="">Selecione...</option>
                      {PACIENTES_PRIORITARIOS.map((p) => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={cn(txtLabel, "font-semibold text-muted-foreground uppercase tracking-wide")}>
                      Tipo de ação
                    </label>
                    <select
                      value={novaAcaoTipo}
                      onChange={(e) => setNovaAcaoTipo(e.target.value as TipoAcao)}
                      className={cn("mt-1.5 w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2", txtBase)}
                    >
                      {(Object.keys(tipoAcaoConfig) as TipoAcao[]).map((t) => (
                        <option key={t} value={t}>{tipoAcaoConfig[t].label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={cn(txtLabel, "font-semibold text-muted-foreground uppercase tracking-wide")}>
                      Responsável
                    </label>
                    <Input
                      value={novaAcaoResponsavel}
                      onChange={(e) => setNovaAcaoResponsavel(e.target.value)}
                      placeholder="Nome do profissional"
                      className={cn("mt-1.5 rounded-xl", txtBase)}
                    />
                  </div>
                  <div>
                    <label className={cn(txtLabel, "font-semibold text-muted-foreground uppercase tracking-wide")}>
                      Prazo
                    </label>
                    <Input
                      type="date"
                      value={novaAcaoPrazo}
                      onChange={(e) => setNovaAcaoPrazo(e.target.value)}
                      className={cn("mt-1.5 rounded-xl", txtBase)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={cn(txtLabel, "font-semibold text-muted-foreground uppercase tracking-wide")}>
                      Observação (opcional)
                    </label>
                    <Input
                      value={novaAcaoObs}
                      onChange={(e) => setNovaAcaoObs(e.target.value)}
                      placeholder="Decisão da equipe, orientações..."
                      className={cn("mt-1.5 rounded-xl", txtBase)}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    className="rounded-xl gap-1.5 text-white"
                    style={{ background: APS }}
                    disabled={!novaAcaoPacienteId || !novaAcaoResponsavel || !novaAcaoPrazo}
                    onClick={adicionarAcao}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar ação
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de ações registradas */}
            <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="pb-3">
                <CardTitle className={cn(modoApresentacao ? "text-lg" : "text-base", "font-semibold flex items-center gap-2")}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: APS_BG }}>
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: APS }} strokeWidth={1.25} />
                  </div>
                  Ações definidas ({acoes.length})
                </CardTitle>
                <CardDescription className={txtBase}>
                  Encaminhamentos e decisões registrados nesta reunião
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {acoes.length > 0 ? (
                  acoes.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: APS }} strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(txtBase, "font-semibold text-foreground")}>{a.paciente}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold" style={{ background: APS_BG, color: APS }}>
                            {tipoAcaoConfig[a.tipo].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className={cn(txtLabel, "text-muted-foreground flex items-center gap-1")}>
                            <User className="w-3 h-3" strokeWidth={1.5} />
                            {a.responsavel}
                          </span>
                          <span className={cn(txtLabel, "text-muted-foreground")}>
                            Prazo: {a.prazo}
                          </span>
                          {a.observacao && (
                            <span className={cn(txtLabel, "text-muted-foreground")}>- {a.observacao}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removerAcao(a.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ClipboardList className="w-8 h-8 mx-auto mb-3 opacity-30" strokeWidth={1} />
                    <p className={txtBase}>Nenhuma ação registrada ainda</p>
                    <p className={cn(txtLabel, "text-muted-foreground mt-1")}>
                      Use o formulário acima ou clique em "Definir ação" na aba de pacientes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
