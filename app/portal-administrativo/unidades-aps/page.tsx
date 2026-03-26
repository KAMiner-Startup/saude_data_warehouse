"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { HeartPulse, Plus, MoreVertical, Pencil, Power, Users, Activity, MapPin, CheckCircle } from "lucide-react"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"
const APS_COLOR = "oklch(0.55 0.18 160)"

interface UnidadeAPS {
  id: string
  nome: string
  cnes: string
  endereco: string
  telefone: string
  microarea: string
  profissionais: number
  pacientesCarteira: number
  alertasRespondidos: number
  alertasTotal: number
  ativo: boolean
  responsavel: string
}

const MOCK_UBS: UnidadeAPS[] = [
  { id: "1", nome: "UBS Centro", cnes: "1234567", endereco: "Rua Manoel de Carvalho, 50 - Centro, Búzios - RJ", telefone: "(22) 2623-2345", microarea: "Microárea 1 e 2", profissionais: 9, pacientesCarteira: 312, alertasRespondidos: 17, alertasTotal: 18, ativo: true, responsavel: "Dra. Ana Ferreira" },
  { id: "2", nome: "UBS Manguinhos", cnes: "2345679", endereco: "Rua das Mangueiras, 20 - Manguinhos, Búzios - RJ", telefone: "(22) 2623-3456", microarea: "Microárea 3", profissionais: 7, pacientesCarteira: 218, alertasRespondidos: 10, alertasTotal: 12, ativo: true, responsavel: "Dra. Maria Santos" },
  { id: "3", nome: "UBS Geribá", cnes: "3456780", endereco: "Av. Geribá, 300 - Geribá, Búzios - RJ", telefone: "(22) 2623-4567", microarea: "Microárea 4", profissionais: 8, pacientesCarteira: 189, alertasRespondidos: 9, alertasTotal: 9, ativo: true, responsavel: "Dra. Fernanda Lima" },
  { id: "4", nome: "UBS Ferradura", cnes: "4567891", endereco: "Estrada da Ferradura, 10 - Ferradura, Búzios - RJ", telefone: "(22) 2623-5678", microarea: "Microárea 5 e 6", profissionais: 6, pacientesCarteira: 275, alertasRespondidos: 11, alertasTotal: 15, ativo: true, responsavel: "Enf. Lucia Pereira" },
  { id: "5", nome: "UBS Armação", cnes: "5678902", endereco: "Rua Armação, 80 - Armação, Búzios - RJ", telefone: "(22) 2623-6789", microarea: "Microárea 7", profissionais: 5, pacientesCarteira: 153, alertasRespondidos: 6, alertasTotal: 7, ativo: true, responsavel: "Dr. Paulo Henrique" },
]

export default function UnidadesAPSPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Unidades de Atenção Básica</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as UBS e seus indicadores de desempenho
          </p>
        </div>
        <Button className="rounded-xl text-[13px] text-white" style={{ background: ADMIN_COLOR }} onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} /> Nova UBS
        </Button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "UBS ativas", valor: MOCK_UBS.filter(u => u.ativo).length, icon: HeartPulse },
          { label: "Profissionais APS", valor: MOCK_UBS.reduce((a, u) => a + u.profissionais, 0), icon: Users },
          { label: "Pacientes em carteira", valor: MOCK_UBS.reduce((a, u) => a + u.pacientesCarteira, 0).toLocaleString("pt-BR"), icon: Activity },
          { label: "Taxa geral de resposta", valor: `${Math.round(MOCK_UBS.reduce((a, u) => a + u.alertasRespondidos, 0) / MOCK_UBS.reduce((a, u) => a + u.alertasTotal, 0) * 100)}%`, icon: CheckCircle },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label} className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardContent className="pt-4 pb-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ADMIN_BG }}>
                  <Icon className="h-4 w-4" style={{ color: ADMIN_COLOR }} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-foreground">{item.valor}</p>
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {MOCK_UBS.map((ubs) => {
          const taxa = Math.round((ubs.alertasRespondidos / ubs.alertasTotal) * 100)
          return (
            <Card key={ubs.id} className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.55 0.18 160 / 0.08)" }}>
                      <HeartPulse className="h-5 w-5" style={{ color: APS_COLOR }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold">{ubs.nome}</CardTitle>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${ubs.ativo ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                          {ubs.ativo ? "Ativa" : "Inativa"}
                        </span>
                      </div>
                      <CardDescription className="text-[12px] mt-0.5">CNES: {ubs.cnes} · {ubs.microarea}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl flex-shrink-0">
                        <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem className="text-[13px]"><Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} /> Editar dados</DropdownMenuItem>
                      <DropdownMenuItem className="text-[13px]"><Users className="mr-2 h-4 w-4" strokeWidth={1.5} /> Ver profissionais</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-[13px] text-destructive"><Power className="mr-2 h-4 w-4" strokeWidth={1.5} /> Desativar unidade</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Responsável</p>
                    <p className="text-[13px] font-medium text-foreground mt-0.5">{ubs.responsavel}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Profissionais</p>
                    <p className="text-[13px] font-medium text-foreground mt-0.5">{ubs.profissionais}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Carteira de pacientes</p>
                    <p className="text-[13px] font-medium text-foreground mt-0.5">{ubs.pacientesCarteira.toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Taxa de resposta</p>
                    <p className={`text-[13px] font-bold mt-0.5 ${taxa >= 90 ? "text-emerald-600" : taxa >= 75 ? "text-amber-600" : "text-destructive"}`}>{taxa}%</p>
                  </div>
                </div>
                {/* Barra de progresso */}
                <div className="mb-3">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${taxa}%`, background: taxa >= 90 ? APS_COLOR : taxa >= 75 ? "oklch(0.75 0.15 75)" : "oklch(0.54 0.22 27)" }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{ubs.alertasRespondidos} de {ubs.alertasTotal} alertas respondidos</p>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {ubs.endereco}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Nova Unidade de APS</DialogTitle>
            <DialogDescription>Preencha os dados para cadastrar uma nova unidade de atenção primária.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[13px]">Nome da unidade</Label>
                <Input className="rounded-xl text-[13px]" placeholder="Ex: UBS Bairro Norte" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">CNES</Label>
                <Input className="rounded-xl text-[13px]" placeholder="0000000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">Microárea</Label>
                <Input className="rounded-xl text-[13px]" placeholder="Ex: Microárea 8" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[13px]">Endereço</Label>
                <Input className="rounded-xl text-[13px]" placeholder="Endereço completo" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">Telefone</Label>
                <Input className="rounded-xl text-[13px]" placeholder="(22) 0000-0000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">Responsável técnico</Label>
                <Input className="rounded-xl text-[13px]" placeholder="Nome do responsável" />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl text-[13px]" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl text-[13px] text-white" style={{ background: ADMIN_COLOR }} onClick={() => setModalOpen(false)}>Cadastrar UBS</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
