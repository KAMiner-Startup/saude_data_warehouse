"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Search,
  Clock,
  CalendarPlus,
  X,
  AlertTriangle,
  ExternalLink,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  type AtendimentoRecente,
  type StatusAtendimento,
  statusAtendimentoConfig,
  tipoAtendimentoConfig,
  ordenarPorDataHora,
  contarPorStatus,
} from "@/lib/dados-atendimentos-recentes"

type FiltroStatus = StatusAtendimento | "todos"

interface ListaAtendimentosRecentesProps {
  atendimentos: AtendimentoRecente[]
  mostrarDadosClinicos: boolean
  linkPaciente?: (id: string) => string
  corPrimaria: string
  corBg: string
}

export function ListaAtendimentosRecentes({
  atendimentos: atendimentosIniciais,
  mostrarDadosClinicos,
  linkPaciente,
  corPrimaria,
  corBg,
}: ListaAtendimentosRecentesProps) {
  const [atendimentos, setAtendimentos] = useState(atendimentosIniciais)
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos")
  const [busca, setBusca] = useState("")

  const contadores = useMemo(() => contarPorStatus(atendimentos), [atendimentos])

  const atendimentosFiltrados = useMemo(() => {
    const filtrados = atendimentos.filter((a) => {
      if (filtroStatus !== "todos" && a.status !== filtroStatus) return false
      if (busca) {
        const termo = busca.toLowerCase()
        return (
          a.paciente.toLowerCase().includes(termo) ||
          a.cpf.includes(busca) ||
          a.unidade.toLowerCase().includes(termo) ||
          a.equipe.toLowerCase().includes(termo) ||
          (mostrarDadosClinicos && a.motivo?.toLowerCase().includes(termo))
        )
      }
      return true
    })
    return ordenarPorDataHora(filtrados)
  }, [atendimentos, filtroStatus, busca, mostrarDadosClinicos])

  const removerDaFila = (id: string) => {
    setAtendimentos((prev) => prev.filter((a) => a.id !== id))
  }

  const abas: { id: FiltroStatus; label: string; count: number }[] = [
    { id: "todos", label: "Todos", count: contadores.total },
    { id: "aguardando", label: "Aguardando", count: contadores.aguardando },
    { id: "em_atendimento", label: "Em atendimento", count: contadores.em_atendimento },
    { id: "atendido", label: "Atendidos", count: contadores.atendido },
    { id: "nao_compareceu", label: "Nao compareceram", count: contadores.nao_compareceu },
  ]

  return (
    <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: corBg }}>
                <Clock className="w-3.5 h-3.5" style={{ color: corPrimaria }} strokeWidth={1.25} />
              </div>
              Atendimentos recentes
            </CardTitle>
            <CardDescription className="text-[13px] mt-1">
              {atendimentosFiltrados.length} atendimento(s) encontrado(s)
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              placeholder={
                mostrarDadosClinicos
                  ? "Buscar por nome, CPF, equipe ou motivo..."
                  : "Buscar por nome, CPF, unidade ou equipe..."
              }
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9 h-9 rounded-xl text-[13px]"
            />
          </div>
        </div>
      </CardHeader>

      <div className="px-6 pb-4">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 w-fit flex-wrap">
          {abas.map((aba) => (
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
                  filtroStatus === aba.id ? "text-white" : "bg-muted text-muted-foreground"
                )}
                style={filtroStatus === aba.id ? { background: corPrimaria } : {}}
              >
                {aba.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <CardContent className="space-y-2 pt-0">
        {atendimentosFiltrados.length > 0 ? (
          atendimentosFiltrados.map((a) => {
            const tipoCfg = tipoAtendimentoConfig[a.tipo]
            const TipoIcon = tipoCfg.icon
            const statusCfg = statusAtendimentoConfig[a.status]
            const recorrenteFalta = a.faltasUltimos90Dias >= 2

            return (
              <div
                key={a.id}
                className={cn(
                  "p-4 rounded-xl border transition-colors",
                  a.status === "nao_compareceu"
                    ? "bg-red-50/30 border-red-100"
                    : "bg-card border-border hover:bg-muted/30"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", tipoCfg.bg)}>
                      <TipoIcon className={cn("w-4 h-4", tipoCfg.text)} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold", tipoCfg.bg, tipoCfg.text)}>
                          {tipoCfg.label}
                        </span>
                        <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold", statusCfg.className)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                          {statusCfg.label}
                        </span>
                        {recorrenteFalta && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-100 text-red-700">
                            <AlertTriangle className="w-3 h-3" strokeWidth={1.5} />
                            {a.faltasUltimos90Dias} faltas em 90d
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {linkPaciente ? (
                          <Link
                            href={linkPaciente(a.pacienteId)}
                            className="text-[14px] font-semibold text-foreground hover:underline"
                            style={{ textDecorationColor: corPrimaria }}
                          >
                            {a.paciente}
                          </Link>
                        ) : (
                          <span className="text-[14px] font-semibold text-foreground">{a.paciente}</span>
                        )}
                        <span className="text-[11px] text-muted-foreground">CPF: {a.cpf}</span>
                        <span className="text-[11px] text-muted-foreground">{a.idade} anos</span>
                      </div>

                      {mostrarDadosClinicos && a.motivo && (
                        <p className="text-[13px] text-foreground leading-relaxed mt-1">
                          <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wide mr-1.5">Motivo:</span>
                          {a.motivo}
                          {a.cid && <span className="ml-2 text-[11px] text-muted-foreground">CID {a.cid}</span>}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap text-[11px] text-muted-foreground">
                        <span className="tabular-nums">
                          {a.dataAtendimento} as {a.horaAtendimento}
                        </span>
                        <span>-</span>
                        <span>{a.unidade}</span>
                        <span>-</span>
                        <span>{a.equipe}</span>
                        {mostrarDadosClinicos && (
                          <>
                            <span>-</span>
                            <span>{a.profissional}</span>
                          </>
                        )}
                      </div>

                      {a.proximoAgendamento && (
                        <p className="text-[11px] mt-1" style={{ color: corPrimaria }}>
                          Proximo agendamento: <span className="font-semibold">{a.proximoAgendamento}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 lg:mt-0.5">
                    <Button variant="outline" size="sm" className="rounded-xl text-[12px] gap-1.5">
                      <CalendarPlus className="w-3 h-3" />
                      {a.status === "nao_compareceu" ? "Reagendar" : "Agendar retorno"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-[12px] gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => removerDaFila(a.id)}
                      aria-label="Remover da lista"
                      title="Remover da lista"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    {linkPaciente && mostrarDadosClinicos && (
                      <Button variant="outline" size="sm" className="rounded-xl text-[12px] gap-1.5" asChild>
                        <Link href={linkPaciente(a.pacienteId)}>
                          <ExternalLink className="w-3 h-3" />
                          Ver
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-3 opacity-30" strokeWidth={1} />
            <p className="text-sm">Nenhum atendimento encontrado para os filtros selecionados</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
