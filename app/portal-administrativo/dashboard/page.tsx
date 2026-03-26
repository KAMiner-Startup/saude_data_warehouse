"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity, Users, Building2, HeartPulse, Bell, TrendingUp, TrendingDown,
  Clock, CheckCircle, AlertCircle, ArrowRight, BarChart3
} from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"

const dadosMovimentacoesMes = [
  { mes: "Out", internacoes: 42, altas: 38, evasoes: 3, obitos: 2 },
  { mes: "Nov", internacoes: 55, altas: 51, evasoes: 5, obitos: 3 },
  { mes: "Dez", internacoes: 48, altas: 45, evasoes: 4, obitos: 2 },
  { mes: "Jan", internacoes: 61, altas: 58, evasoes: 6, obitos: 4 },
  { mes: "Fev", internacoes: 53, altas: 49, evasoes: 3, obitos: 3 },
  { mes: "Mar", internacoes: 67, altas: 62, evasoes: 5, obitos: 2 },
]

const dadosTempoResposta = [
  { mes: "Out", horas: 28 },
  { mes: "Nov", horas: 24 },
  { mes: "Dez", horas: 22 },
  { mes: "Jan", horas: 19 },
  { mes: "Fev", horas: 17 },
  { mes: "Mar", horas: 14 },
]

const desempenhoUBS = [
  { nome: "UBS Centro", alertas: 18, respondidos: 17, taxa: 94 },
  { nome: "UBS Manguinhos", alertas: 12, respondidos: 10, taxa: 83 },
  { nome: "UBS Geribá", alertas: 9, respondidos: 9, taxa: 100 },
  { nome: "UBS Ferradura", alertas: 15, respondidos: 11, taxa: 73 },
  { nome: "UBS Armação", alertas: 7, respondidos: 6, taxa: 86 },
]

const alertasRecentes = [
  { paciente: "Maria Silva Santos", tipo: "Alta hospitalar", ubs: "UBS Centro", tempo: "2h", status: "pendente" },
  { paciente: "José Oliveira Costa", tipo: "Internação urgência", ubs: "UBS Manguinhos", tempo: "5h", status: "em_andamento" },
  { paciente: "Ana Carolina Pereira", tipo: "Resultado crítico", ubs: "UBS Geribá", tempo: "1d", status: "respondido" },
  { paciente: "Carlos Eduardo Lima", tipo: "Retorno pós-cirúrgico", ubs: "UBS Ferradura", tempo: "2d", status: "pendente" },
]

const statusBadge: Record<string, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-destructive/10 text-destructive" },
  em_andamento: { label: "Em andamento", className: "bg-primary/10 text-primary" },
  respondido: { label: "Respondido", className: "bg-emerald-100 text-emerald-700" },
}

export default function DashboardAdministrativoPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Painel Executivo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão consolidada da rede municipal de saúde de Búzios
        </p>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Movimentações este mês",
            valor: "67",
            variacao: "+14%",
            tendencia: "up",
            icon: Activity,
            desc: "vs. mês anterior",
            cor: ADMIN_COLOR,
            fundo: ADMIN_BG,
          },
          {
            label: "Alertas Pendentes",
            valor: "7",
            variacao: "-2",
            tendencia: "down",
            icon: Bell,
            desc: "sem resposta da APS",
            cor: "oklch(0.54 0.22 27)",
            fundo: "oklch(0.54 0.22 27 / 0.08)",
          },
          {
            label: "Taxa de Resposta APS",
            valor: "87%",
            variacao: "+5%",
            tendencia: "up",
            icon: CheckCircle,
            desc: "alertas respondidos",
            cor: "oklch(0.55 0.18 160)",
            fundo: "oklch(0.55 0.18 160 / 0.08)",
          },
          {
            label: "Tempo Médio de Resposta",
            valor: "14h",
            variacao: "-3h",
            tendencia: "down",
            icon: Clock,
            desc: "vs. mês anterior",
            cor: "oklch(0.38 0.19 264)",
            fundo: "oklch(0.38 0.19 264 / 0.08)",
          },
        ].map((kpi) => {
          const Icon = kpi.icon
          const isBom = (kpi.tendencia === "up" && kpi.label !== "Alertas Pendentes") || (kpi.tendencia === "down" && (kpi.label === "Alertas Pendentes" || kpi.label === "Tempo Médio de Resposta"))
          return (
            <Card key={kpi.label} className="rounded-[20px] border-none overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
                <CardTitle className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                  {kpi.label}
                </CardTitle>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: kpi.fundo }}>
                  <Icon className="h-4 w-4" style={{ color: kpi.cor }} strokeWidth={1.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-bold tracking-tight text-foreground">{kpi.valor}</span>
                  <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${isBom ? "text-emerald-600" : "text-destructive"}`}>
                    {kpi.tendencia === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.variacao}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground mt-1.5">{kpi.desc}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Movimentações por mês */}
        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
                <BarChart3 className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
              </div>
              Movimentações por Mês
            </CardTitle>
            <CardDescription className="text-[13px]">Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dadosMovimentacoesMes} barSize={10} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.006 247)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "oklch(0.50 0.014 255)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.014 255)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-soft)", fontSize: 12 }} />
                <Bar dataKey="internacoes" name="Internações" fill="oklch(0.38 0.19 264)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="altas" name="Altas" fill="oklch(0.55 0.18 160)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="evasoes" name="Evasões" fill="oklch(0.75 0.15 75)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="obitos" name="Óbitos" fill="oklch(0.54 0.22 27)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tempo médio de resposta */}
        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
                <Clock className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
              </div>
              Tempo Médio de Resposta APS
            </CardTitle>
            <CardDescription className="text-[13px]">Em horas — tendência de melhora</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dadosTempoResposta}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.006 247)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "oklch(0.50 0.014 255)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.014 255)" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}h`, "Tempo médio"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-soft)", fontSize: 12 }} />
                <Line type="monotone" dataKey="horas" stroke={ADMIN_COLOR} strokeWidth={2} dot={{ fill: ADMIN_COLOR, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Desempenho por UBS + Alertas recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Desempenho por UBS */}
        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
                <HeartPulse className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
              </div>
              Desempenho por UBS
            </CardTitle>
            <CardDescription className="text-[13px]">Taxa de resposta aos alertas no mês</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {desempenhoUBS.map((ubs) => (
              <div key={ubs.nome}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-medium text-foreground">{ubs.nome}</span>
                  <span className="text-[12px] text-muted-foreground tabular-nums">
                    {ubs.respondidos}/{ubs.alertas} alertas
                    <span className={`ml-2 font-semibold ${ubs.taxa >= 90 ? "text-emerald-600" : ubs.taxa >= 75 ? "text-warning" : "text-destructive"}`}>
                      {ubs.taxa}%
                    </span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${ubs.taxa}%`,
                      background: ubs.taxa >= 90 ? "oklch(0.55 0.18 160)" : ubs.taxa >= 75 ? "oklch(0.75 0.15 75)" : "oklch(0.54 0.22 27)",
                    }}
                  />
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-2 text-[13px] rounded-xl" asChild>
              <Link href="/portal-administrativo/unidades-aps">
                Ver todas as unidades <ArrowRight className="ml-1 w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Alertas recentes na rede */}
        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
                <AlertCircle className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
              </div>
              Alertas Recentes na Rede
            </CardTitle>
            <CardDescription className="text-[13px]">Últimos alertas de todas as unidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {alertasRecentes.map((alerta, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground truncate">{alerta.paciente}</p>
                  <p className="text-[12px] text-muted-foreground">{alerta.tipo} · {alerta.ubs}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${statusBadge[alerta.status].className}`}>
                    {statusBadge[alerta.status].label}
                  </span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{alerta.tempo}</span>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-1 text-[13px] rounded-xl" asChild>
              <Link href="/portal-administrativo/monitoramento">
                Ver monitoramento completo <ArrowRight className="ml-1 w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de unidades */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Hospitais ativos", valor: 2, icon: Building2, link: "/portal-administrativo/unidades-hospitalares" },
          { label: "UBS ativas", valor: 5, icon: HeartPulse, link: "/portal-administrativo/unidades-aps" },
          { label: "Profissionais cadastrados", valor: 48, icon: Users, link: "/portal-administrativo/usuarios" },
          { label: "Pacientes na rede", valor: "1.247", icon: Activity, link: "/portal-administrativo/monitoramento" },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.label} href={item.link}>
              <Card className="rounded-[20px] border-none hover:shadow-md transition-shadow cursor-pointer" style={{ boxShadow: "var(--shadow-soft)" }}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ADMIN_BG }}>
                      <Icon className="h-4 w-4" style={{ color: ADMIN_COLOR }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold tracking-tight text-foreground">{item.valor}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">{item.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
