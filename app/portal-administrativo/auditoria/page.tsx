"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollText, Search, Download, User, FileText, Settings, Bell, LogIn, LogOut } from "lucide-react"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"

type AcaoTipo = "acesso" | "visualizacao" | "configuracao" | "alerta" | "cadastro"

interface LogEntrada {
  id: string
  data: string
  hora: string
  usuario: string
  perfil: string
  acao: AcaoTipo
  descricao: string
  unidade: string
  ip: string
}

const acaoConfig: Record<AcaoTipo, { label: string; icon: React.ElementType; cor: string; bg: string }> = {
  acesso: { label: "Acesso", icon: LogIn, cor: "oklch(0.38 0.19 264)", bg: "oklch(0.38 0.19 264 / 0.08)" },
  visualizacao: { label: "Visualização", icon: FileText, cor: "oklch(0.55 0.18 160)", bg: "oklch(0.55 0.18 160 / 0.08)" },
  configuracao: { label: "Configuração", icon: Settings, cor: ADMIN_COLOR, bg: ADMIN_BG },
  alerta: { label: "Alerta", icon: Bell, cor: "oklch(0.75 0.15 75)", bg: "oklch(0.75 0.15 75 / 0.08)" },
  cadastro: { label: "Cadastro", icon: User, cor: "oklch(0.54 0.22 27)", bg: "oklch(0.54 0.22 27 / 0.08)" },
}

const MOCK_LOG: LogEntrada[] = [
  { id: "1", data: "10/03/2026", hora: "09:45", usuario: "Dr. João Silva", perfil: "Profissional Hospitalar", acao: "visualizacao", descricao: "Visualizou folha de rosto do paciente Maria Silva Santos", unidade: "Hospital Municipal de Búzios", ip: "192.168.1.10" },
  { id: "2", data: "10/03/2026", hora: "09:32", usuario: "Dra. Ana Ferreira", perfil: "Profissional APS", acao: "alerta", descricao: "Registrou acompanhamento pós-alta de José Oliveira Costa", unidade: "UBS Centro", ip: "192.168.1.22" },
  { id: "3", data: "10/03/2026", hora: "09:15", usuario: "Secretaria de Saúde", perfil: "Gestor Administrativo", acao: "configuracao", descricao: "Alterou prazo de resposta do alerta 'Alta hospitalar' de 24h para 18h", unidade: "Secretaria de Saúde", ip: "192.168.1.01" },
  { id: "4", data: "10/03/2026", hora: "08:58", usuario: "Secretaria de Saúde", perfil: "Gestor Administrativo", acao: "cadastro", descricao: "Criou novo usuário: Enf. Lucia Pereira (UBS Ferradura)", unidade: "Secretaria de Saúde", ip: "192.168.1.01" },
  { id: "5", data: "09/03/2026", hora: "17:30", usuario: "Dr. Roberto Alves", perfil: "Profissional Hospitalar", acao: "acesso", descricao: "Login no sistema", unidade: "Hospital Regional", ip: "192.168.2.15" },
  { id: "6", data: "09/03/2026", hora: "16:10", usuario: "Dra. Maria Santos", perfil: "Profissional APS", acao: "visualizacao", descricao: "Visualizou alerta de internação de Carlos Eduardo Lima", unidade: "UBS Manguinhos", ip: "192.168.1.35" },
  { id: "7", data: "09/03/2026", hora: "14:45", usuario: "Enf. Carlos Mendes", perfil: "Profissional Hospitalar", acao: "alerta", descricao: "Gerou movimentação de alta para paciente Ana Carolina Pereira", unidade: "Hospital Municipal de Búzios", ip: "192.168.1.12" },
  { id: "8", data: "08/03/2026", hora: "11:22", usuario: "Dra. Fernanda Lima", perfil: "Profissional APS", acao: "acesso", descricao: "Login no sistema", unidade: "UBS Geribá", ip: "192.168.1.48" },
]

export default function AuditoriaPage() {
  const [busca, setBusca] = useState("")
  const [filtroAcao, setFiltroAcao] = useState<string>("todos")
  const [dataFiltro, setDataFiltro] = useState("")

  const logFiltrado = MOCK_LOG.filter((l) => {
    const matchBusca = !busca || l.usuario.toLowerCase().includes(busca.toLowerCase()) || l.descricao.toLowerCase().includes(busca.toLowerCase())
    const matchAcao = filtroAcao === "todos" || l.acao === filtroAcao
    const matchData = !dataFiltro || l.data === new Date(dataFiltro).toLocaleDateString("pt-BR")
    return matchBusca && matchAcao && matchData
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Log de Auditoria</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registro de todas as ações realizadas no sistema por usuário e data
          </p>
        </div>
        <Button variant="outline" className="rounded-xl text-[13px]">
          <Download className="mr-2 h-4 w-4" strokeWidth={1.5} /> Exportar log
        </Button>
      </div>

      {/* Filtros */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <Input placeholder="Buscar por usuário ou ação..." className="pl-9 rounded-xl border-border text-[13px]" value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
            <select className="h-9 px-3 rounded-xl border border-border text-[13px] bg-background" value={filtroAcao} onChange={(e) => setFiltroAcao(e.target.value)}>
              <option value="todos">Todos os tipos</option>
              <option value="acesso">Acesso</option>
              <option value="visualizacao">Visualização</option>
              <option value="configuracao">Configuração</option>
              <option value="alerta">Alerta</option>
              <option value="cadastro">Cadastro</option>
            </select>
            <Input type="date" className="rounded-xl text-[13px] h-9 w-40" value={dataFiltro} onChange={(e) => setDataFiltro(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de log */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
              <ScrollText className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
            </div>
            Registros
          </CardTitle>
          <CardDescription className="text-[13px]">{logFiltrado.length} registro(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logFiltrado.map((entrada) => {
              const cfg = acaoConfig[entrada.acao]
              const Icon = cfg.icon
              return (
                <div key={entrada.id} className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: cfg.cor }} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-foreground">{entrada.usuario}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: cfg.bg, color: cfg.cor }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-foreground mt-0.5">{entrada.descricao}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{entrada.unidade} · {entrada.perfil} · IP: {entrada.ip}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[12px] font-semibold text-foreground tabular-nums">{entrada.hora}</p>
                    <p className="text-[11px] text-muted-foreground tabular-nums">{entrada.data}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
