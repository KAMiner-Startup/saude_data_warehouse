"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle, CheckCircle, ExternalLink, Search, ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  type CategoriaAlertaOp,
  type StatusAlertaOp,
  MOCK_ALERTAS_OPERACIONAIS,
  categoriaConfig,
  prioridadeConfig,
  statusAlertaOpConfig,
  ordenarPorPrioridade,
  contarPorCategoria,
} from "./dados-alertas-operacionais"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"

type FiltroStatus = StatusAlertaOp | "todos"

export default function AlertasOperacionaisPage() {
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaAlertaOp | "todos">("todos")
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos")
  const [busca, setBusca] = useState("")

  const contadores = contarPorCategoria(MOCK_ALERTAS_OPERACIONAIS)

  const alertasFiltrados = ordenarPorPrioridade(
    MOCK_ALERTAS_OPERACIONAIS.filter((a) => {
      if (filtroCategoria !== "todos" && a.categoria !== filtroCategoria) return false
      if (filtroStatus !== "todos" && a.status !== filtroStatus) return false
      if (busca) {
        const termo = busca.toLowerCase()
        return (
          a.paciente.toLowerCase().includes(termo) ||
          a.cpf.includes(busca) ||
          a.descricao.toLowerCase().includes(termo) ||
          a.unidade.toLowerCase().includes(termo)
        )
      }
      return true
    })
  )

  const contadoresStatus = {
    pendente: MOCK_ALERTAS_OPERACIONAIS.filter((a) => a.status === "pendente").length,
    em_analise: MOCK_ALERTAS_OPERACIONAIS.filter((a) => a.status === "em_analise").length,
    resolvido: MOCK_ALERTAS_OPERACIONAIS.filter((a) => a.status === "resolvido").length,
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Cabecalho */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Alertas Operacionais</h1>
        <p className="text-sm text-muted-foreground">
          Inconsistencias, pendencias de registro e dados incompletos na rede
        </p>
      </div>

      {/* Cards de resumo por categoria */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.keys(categoriaConfig) as CategoriaAlertaOp[]).map((cat) => {
          const cfg = categoriaConfig[cat]
          const Icon = cfg.icon
          const count = contadores[cat]
          return (
            <Card
              key={cat}
              className={cn(
                "rounded-[20px] border-none cursor-pointer transition-all",
                filtroCategoria === cat ? "ring-2" : ""
              )}
              style={{
                boxShadow: "var(--shadow-soft)",
                ...(filtroCategoria === cat ? { ringColor: ADMIN_COLOR } : {}),
              }}
              onClick={() => setFiltroCategoria(filtroCategoria === cat ? "todos" : cat)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{cfg.label}</p>
                    <p className="text-3xl font-bold mt-2 text-foreground">{count}</p>
                    <p className="text-[12px] text-muted-foreground mt-1">pendente(s)</p>
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

      {/* Filtros */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
                  <AlertTriangle className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
                </div>
                {filtroCategoria === "todos" ? "Todos os alertas" : categoriaConfig[filtroCategoria].label}
              </CardTitle>
              <CardDescription className="text-[13px] mt-1">
                {alertasFiltrados.length} alerta(s) encontrado(s)
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <Input
                placeholder="Buscar por nome, CPF ou descricao..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9 h-9 rounded-xl text-[13px]"
              />
            </div>
          </div>
        </CardHeader>

        {/* Abas de status */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 w-fit">
            {([
              { id: "todos" as FiltroStatus, label: "Todos", count: MOCK_ALERTAS_OPERACIONAIS.length },
              { id: "pendente" as FiltroStatus, label: "Pendentes", count: contadoresStatus.pendente },
              { id: "em_analise" as FiltroStatus, label: "Em analise", count: contadoresStatus.em_analise },
              { id: "resolvido" as FiltroStatus, label: "Resolvidos", count: contadoresStatus.resolvido },
            ]).map((aba) => (
              <button
                key={aba.id}
                onClick={() => setFiltroStatus(aba.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer",
                  filtroStatus === aba.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {aba.label}
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold",
                    filtroStatus === aba.id
                      ? "text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                  style={filtroStatus === aba.id ? { background: ADMIN_COLOR } : {}}
                >
                  {aba.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de alertas */}
        <CardContent className="space-y-2 pt-0">
          {alertasFiltrados.length > 0 ? (
            alertasFiltrados.map((alerta) => {
              const catCfg = categoriaConfig[alerta.categoria]
              const CatIcon = catCfg.icon
              const priCfg = prioridadeConfig[alerta.prioridade]
              const staCfg = statusAlertaOpConfig[alerta.status]
              return (
                <div
                  key={alerta.id}
                  className={cn(
                    "p-4 rounded-xl border transition-colors",
                    alerta.status === "resolvido"
                      ? "bg-muted/20 border-border/30 opacity-60"
                      : "bg-card border-border hover:bg-muted/30"
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", catCfg.bg)}>
                        <CatIcon className={cn("w-4 h-4", catCfg.text)} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <span className={cn("w-2 h-2 rounded-full", priCfg.dot)} />
                            <span className="text-[11px] font-semibold text-muted-foreground">{priCfg.label}</span>
                          </span>
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold", catCfg.bg, catCfg.text)}>
                            {catCfg.label}
                          </span>
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold", staCfg.className)}>
                            {staCfg.label}
                          </span>
                        </div>
                        {/* Descricao */}
                        <p className="text-[13px] text-foreground leading-relaxed">{alerta.descricao}</p>
                        {/* Paciente + meta */}
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-[12px] font-semibold text-foreground">{alerta.paciente}</span>
                          <span className="text-[11px] text-muted-foreground">CPF: {alerta.cpf}</span>
                          <span className="text-[11px] text-muted-foreground">{alerta.unidade}</span>
                          <span className="text-[11px] text-muted-foreground tabular-nums">{alerta.dataDeteccao}</span>
                        </div>
                      </div>
                    </div>
                    {/* Acoes */}
                    <div className="flex items-center gap-2 flex-shrink-0 lg:mt-0.5">
                      {alerta.status !== "resolvido" && (
                        <Button variant="outline" size="sm" className="rounded-xl text-[12px] gap-1.5">
                          <CheckCircle className="w-3 h-3" />
                          Resolver
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-[12px] gap-1.5"
                        asChild
                      >
                        <Link href={`/portal-administrativo/monitoramento`}>
                          <ExternalLink className="w-3 h-3" />
                          Corrigir registro
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-3 opacity-30" strokeWidth={1} />
              <p className="text-sm">Nenhum alerta encontrado para os filtros selecionados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
