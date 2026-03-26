"use client"

import { useState } from "react"
import { AlertCircle, Bell, Clock, Search, Users, ArrowUpDown, TrendingUp } from "lucide-react"
import { BuscaPaciente } from "@/components/busca-paciente"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"

type OrdenacaoCampo = "paciente" | "tipo" | "data" | "status"
// "Movimentação" representa eventos do paciente no hospital (alta, internação, evasão, óbito)
type OrdenacaoDirecao = "asc" | "desc"

const statusStyle: Record<string, { label: string; className: string }> = {
  ativo: {
    label: "Ativo",
    className: "bg-destructive/10 text-destructive",
  },
  visualizado: {
    label: "Visualizado",
    className: "bg-muted text-muted-foreground",
  },
  em_acompanhamento: {
    label: "Em acompanhamento",
    className: "bg-primary/8 text-primary",
  },
}

export default function DashboardPage() {
  const [ordenacao, setOrdenacao] = useState<{ campo: OrdenacaoCampo; direcao: OrdenacaoDirecao }>({
    campo: "data",
    direcao: "desc",
  })

  const movimentacoesPendentes = 5
  const pacientesRecentes = 12

  const handleOrdenacao = (campo: OrdenacaoCampo) => {
    setOrdenacao((prev) => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === "asc" ? "desc" : "asc",
    }))
  }

  const movimentacoesRecentes = [
    {
      paciente: "Maria Silva Santos",
      cpf: "123.456.789-00",
      tipo: "Alta hospitalar",
      dataMovimentacao: "04/03/2026",
      status: "ativo",
    },
    {
      paciente: "José Oliveira Costa",
      cpf: "456.789.123-11",
      tipo: "Internação urgência",
      dataMovimentacao: "03/03/2026",
      status: "visualizado",
    },
    {
      paciente: "Ana Carolina Pereira",
      cpf: "789.123.456-22",
      tipo: "Resultado crítico",
      dataMovimentacao: "02/03/2026",
      status: "em_acompanhamento",
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Painel Hospitalar</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe movimentações, busque pacientes e monitore a comunicação assistencial
        </p>
      </div>

      {/* Busca de Paciente */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
            </div>
            Buscar Paciente
          </CardTitle>
          <CardDescription className="text-[13px]">
            Pesquise por CPF, CNS ou identificador alternativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BuscaPaciente />
        </CardContent>
      </Card>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Movimentações Pendentes */}
        <Card className="rounded-[20px] border-none overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
              Movimentações Pendentes
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <Bell className="h-4 w-4 text-destructive" strokeWidth={1.5} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-bold tracking-tight text-foreground">{movimentacoesPendentes}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                Requer atenção
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground mt-1.5">Movimentações recebidas da Atenção Básica</p>
          </CardContent>
        </Card>

        {/* Pacientes Recentes */}
        <Card className="rounded-[20px] border-none overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
              Pacientes Recentes
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-bold tracking-tight text-foreground">{pacientesRecentes}</span>
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" strokeWidth={1.5} /> últimos 7 dias
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground mt-1.5">Consultados neste período</p>
          </CardContent>
        </Card>

        {/* Última atualização */}
        <Card className="rounded-[20px] border-none overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
              Última Sincronização
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-emerald-600" strokeWidth={1.5} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-foreground">Hoje, 14:32</div>
            <p className="text-[12px] text-muted-foreground mt-1.5">Dados atualizados com sucesso</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Movimentações Recentes */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5 text-primary" strokeWidth={1.25} />
                </div>
                Movimentações Recentes
              </CardTitle>
              <CardDescription className="text-[13px] mt-1">
                Movimentações recebidas da Atenção Básica para acompanhamento
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 pr-4 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 -ml-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground rounded-lg"
                      onClick={() => handleOrdenacao("paciente")}
                    >
                      Paciente
                      <ArrowUpDown className="w-3 h-3" strokeWidth={1.5} />
                    </Button>
                  </th>
                  <th className="pb-3 pr-4 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 -ml-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground rounded-lg"
                      onClick={() => handleOrdenacao("tipo")}
                    >
                      Tipo de Movimentação
                      <ArrowUpDown className="w-3 h-3" strokeWidth={1.5} />
                    </Button>
                  </th>
                  <th className="pb-3 pr-4 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 -ml-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground rounded-lg"
                      onClick={() => handleOrdenacao("data")}
                    >
                      Data
                      <ArrowUpDown className="w-3 h-3" strokeWidth={1.5} />
                    </Button>
                  </th>
                  <th className="pb-3 text-left">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 -ml-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground rounded-lg"
                      onClick={() => handleOrdenacao("status")}
                    >
                      Status
                      <ArrowUpDown className="w-3 h-3" strokeWidth={1.5} />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movimentacoesRecentes.map((mov, index) => (
                  <tr key={index} className="hover:bg-muted/40 transition-colors cursor-pointer group">
                    <td className="py-3.5 pr-4">
                      <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {mov.paciente}
                      </p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">CPF: {mov.cpf}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-sm text-foreground">{mov.tipo}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-sm font-medium text-muted-foreground tabular-nums">{mov.dataMovimentacao}</p>
                    </td>
                    <td className="py-3.5">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold", statusStyle[mov.status]?.className)}>
                        {statusStyle[mov.status]?.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            variant="outline"
            className="w-full mt-5 rounded-full border-none text-sm font-medium bg-muted/60 hover:bg-primary/8 hover:text-primary transition-colors"
            asChild
          >
            <Link href="/portal-hospitalar/movimentacoes">Ver todas as movimentações</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
