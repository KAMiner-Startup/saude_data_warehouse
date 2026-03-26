"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Download, BarChart3, Activity, Clock, Users } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"

const dadosPorTipo = [
  { tipo: "Alta", quantidade: 62, fill: "oklch(0.55 0.18 160)" },
  { tipo: "Internação", quantidade: 67, fill: "oklch(0.38 0.19 264)" },
  { tipo: "Evasão", quantidade: 5, fill: "oklch(0.75 0.15 75)" },
  { tipo: "Óbito", quantidade: 2, fill: "oklch(0.54 0.22 27)" },
  { tipo: "Resultado Crítico", quantidade: 8, fill: "oklch(0.68 0.15 85)" },
]

const dadosPorUBS = [
  { nome: "UBS Centro", alertas: 18, respondidos: 17 },
  { nome: "UBS Manguinhos", alertas: 12, respondidos: 10 },
  { nome: "UBS Geribá", alertas: 9, respondidos: 9 },
  { nome: "UBS Ferradura", alertas: 15, respondidos: 11 },
  { nome: "UBS Armação", alertas: 7, respondidos: 6 },
]

const tiposRelatorio = [
  { id: "movimentacoes", label: "Movimentações", desc: "Internações, altas, evasões e óbitos por período e unidade", icon: Activity },
  { id: "alertas", label: "Alertas e Respostas", desc: "Taxa de resposta da APS, tempo médio, alertas pendentes", icon: Clock },
  { id: "usuarios", label: "Acesso de Usuários", desc: "Log de acessos, atividade por perfil e unidade", icon: Users },
  { id: "desempenho", label: "Desempenho da Rede", desc: "Indicadores consolidados de toda a rede de saúde", icon: BarChart3 },
]

export default function RelatoriosPage() {
  const [dataInicio, setDataInicio] = useState("2026-02-01")
  const [dataFim, setDataFim] = useState("2026-03-10")
  const [filtroUnidade, setFiltroUnidade] = useState("todas")

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Relatórios</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gere e exporte relatórios consolidados da rede de saúde
        </p>
      </div>

      {/* Filtros de período */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label className="text-[13px]">Data inicial</Label>
              <Input type="date" className="rounded-xl text-[13px] h-9 w-40" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Data final</Label>
              <Input type="date" className="rounded-xl text-[13px] h-9 w-40" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Unidade</Label>
              <select className="h-9 px-3 rounded-xl border border-border text-[13px] bg-background" value={filtroUnidade} onChange={(e) => setFiltroUnidade(e.target.value)}>
                <option value="todas">Toda a rede</option>
                <option>Hospital Municipal de Búzios</option>
                <option>Hospital Regional Costa do Sol</option>
                <option>UBS Centro</option>
                <option>UBS Manguinhos</option>
                <option>UBS Geribá</option>
                <option>UBS Ferradura</option>
                <option>UBS Armação</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de relatório para exportar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tiposRelatorio.map((rel) => {
          const Icon = rel.icon
          return (
            <Card key={rel.id} className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ADMIN_BG }}>
                      <Icon className="h-4 w-4" style={{ color: ADMIN_COLOR }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{rel.label}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{rel.desc}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl text-[12px] flex-shrink-0">
                    <Download className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} /> Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Movimentações por Tipo</CardTitle>
            <CardDescription className="text-[13px]">Distribuição no período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dadosPorTipo} dataKey="quantidade" nameKey="tipo" cx="50%" cy="50%" outerRadius={75} label={({ tipo, percent }) => `${tipo} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 11 }}>
                  {dadosPorTipo.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-soft)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Alertas por UBS</CardTitle>
            <CardDescription className="text-[13px]">Total vs. respondidos no período</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dadosPorUBS} barSize={12} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.006 247)" vertical={false} />
                <XAxis dataKey="nome" tick={{ fontSize: 10, fill: "oklch(0.50 0.014 255)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.014 255)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-soft)", fontSize: 12 }} />
                <Bar dataKey="alertas" name="Total" fill={ADMIN_COLOR} radius={[4, 4, 0, 0]} />
                <Bar dataKey="respondidos" name="Respondidos" fill="oklch(0.55 0.18 160)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
