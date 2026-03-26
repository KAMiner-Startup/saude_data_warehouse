"use client"

import { useState } from "react"
import {
  Eye,
  UserCheck,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BuscaPaciente } from "@/components/busca-paciente"
import Link from "next/link"
import { cn } from "@/lib/utils"

type StatusMovimentacao = "ativo" | "visualizado" | "em_acompanhamento" | "resolvido" | "cancelado"

interface Movimentacao {
  id: string
  paciente: string
  cpf: string
  cns: string
  tipo: string
  descricao: string
  dataMovimentacao: string
  origem: string
  status: StatusMovimentacao
  responsavel?: string
}

const movimentacoesMock: Movimentacao[] = [
  {
    id: "1",
    paciente: "Maria Silva Santos",
    cpf: "123.456.789-00",
    cns: "898 0012 3456 7890",
    tipo: "Alta hospitalar",
    descricao: "Paciente recebeu alta após internação por descompensação de diabetes",
    dataMovimentacao: "04/03/2026",
    origem: "UBS Centro",
    status: "ativo"
  },
  {
    id: "2",
    paciente: "José Oliveira Costa",
    cpf: "456.789.123-11",
    cns: "702 0034 5678 1234",
    tipo: "Internação urgência",
    descricao: "Paciente internado por insuficiência cardíaca descompensada",
    dataMovimentacao: "03/03/2026",
    origem: "UBS Manguinhos",
    status: "visualizado"
  },
  {
    id: "3",
    paciente: "Ana Carolina Pereira",
    cpf: "789.123.456-22",
    cns: "123 0056 7890 5678",
    tipo: "Resultado crítico",
    descricao: "Hemoglobina abaixo de 8g/dL - gestante de alto risco",
    dataMovimentacao: "02/03/2026",
    origem: "UBS Geribá",
    status: "em_acompanhamento",
    responsavel: "Dr. João Silva"
  },
  {
    id: "4",
    paciente: "Carlos Eduardo Lima",
    cpf: "321.654.987-33",
    cns: "456 0078 1234 9012",
    tipo: "Retorno pós-cirúrgico",
    descricao: "Paciente necessita acompanhamento após procedimento oncológico",
    dataMovimentacao: "01/03/2026",
    origem: "UBS Ferradura",
    status: "ativo"
  },
  {
    id: "5",
    paciente: "Mariana Souza Rodrigues",
    cpf: "654.987.321-44",
    cns: "789 0090 5678 3456",
    tipo: "Evasão",
    descricao: "Paciente deixou a unidade sem autorização médica durante internação",
    dataMovimentacao: "28/02/2026",
    origem: "UBS Armação",
    status: "resolvido",
    responsavel: "Dra. Maria Santos"
  },
]

const statusConfig: Record<StatusMovimentacao, { label: string; className: string }> = {
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
  resolvido: {
    label: "Resolvido",
    className: "bg-emerald-100 text-emerald-700",
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-muted text-muted-foreground",
  },
}

interface Paciente {
  nome: string
  cpf: string
}

export default function MovimentacoesPage() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [pacienteFiltro, setPacienteFiltro] = useState<Paciente | null>(null)

  const movimentacoesFiltradas = movimentacoesMock.filter(mov => {
    const matchStatus = filtroStatus === "todos" || mov.status === filtroStatus
    const matchPaciente = !pacienteFiltro || mov.cpf === pacienteFiltro.cpf
    return matchStatus && matchPaciente
  })

  const contadores = {
    ativos: movimentacoesMock.filter(a => a.status === "ativo").length,
    visualizados: movimentacoesMock.filter(a => a.status === "visualizado").length,
    emAcompanhamento: movimentacoesMock.filter(a => a.status === "em_acompanhamento").length,
    resolvidos: movimentacoesMock.filter(a => a.status === "resolvido").length,
  }

  const filtros = [
    { label: "Todos", value: "todos", count: movimentacoesMock.length },
    { label: "Ativos", value: "ativo", count: contadores.ativos },
    { label: "Visualizados", value: "visualizado", count: contadores.visualizados },
    { label: "Em acompanhamento", value: "em_acompanhamento", count: contadores.emAcompanhamento },
    { label: "Resolvidos", value: "resolvido", count: contadores.resolvidos },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Movimentações
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as movimentações hospitalares recebidas da Atenção Básica
        </p>
      </div>

      {/* Busca por paciente */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Filtrar por paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <BuscaPaciente onSelect={(p) => setPacienteFiltro(p)} />
          {pacienteFiltro && (
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary" className="text-[12px] rounded-lg">
                {pacienteFiltro.nome}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[12px] text-muted-foreground hover:text-foreground rounded-lg px-2"
                onClick={() => setPacienteFiltro(null)}
              >
                Limpar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filtros de status */}
      <div className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <Button
            key={f.value}
            variant="outline"
            size="sm"
            onClick={() => setFiltroStatus(f.value)}
            className={cn(
              "rounded-full text-[13px] border-border transition-all",
              filtroStatus === f.value
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "hover:bg-muted/60"
            )}
          >
            {f.label}
            <span className={cn(
              "ml-1.5 text-[11px] font-bold",
              filtroStatus === f.value ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>
              {f.count}
            </span>
          </Button>
        ))}
      </div>

      {/* Lista */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Lista de Movimentações
          </CardTitle>
          <CardDescription className="text-[13px]">
            {movimentacoesFiltradas.length} movimentação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movimentacoesFiltradas.map((mov) => (
              <div
                key={mov.id}
                className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 hover:border-border/80 transition-all duration-150"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/portal-hospitalar/paciente/${mov.id}`}
                        className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {mov.paciente}
                      </Link>
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold",
                        statusConfig[mov.status].className
                      )}>
                        {statusConfig[mov.status].label}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground">
                      CPF: {mov.cpf} &middot; CNS: {mov.cns}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[13px]">
                      <span className="font-semibold text-primary">{mov.tipo}</span>
                      <span className="text-muted-foreground tabular-nums">{mov.dataMovimentacao}</span>
                      <span className="text-muted-foreground">Origem: {mov.origem}</span>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{mov.descricao}</p>
                    {mov.responsavel && (
                      <p className="text-[12px] text-muted-foreground">
                        Responsável: <span className="font-semibold text-foreground">{mov.responsavel}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-xl border-border text-[13px] cursor-pointer">
                          Ações
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="text-[13px] cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" strokeWidth={1.5} />
                          Marcar como visualizado
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] cursor-pointer">
                          <UserCheck className="mr-2 h-4 w-4" strokeWidth={1.5} />
                          Assumir acompanhamento
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-[13px] cursor-pointer">
                          <CheckCircle className="mr-2 h-4 w-4" strokeWidth={1.5} />
                          Marcar como resolvido
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive text-[13px] cursor-pointer">
                          <XCircle className="mr-2 h-4 w-4" strokeWidth={1.5} />
                          Cancelar movimentação
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="default" size="sm" className="rounded-xl text-[13px] cursor-pointer" asChild>
                      <Link href={`/portal-hospitalar/paciente/${mov.id}`}>
                        Ver paciente
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {movimentacoesFiltradas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Nenhuma movimentação encontrada com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
