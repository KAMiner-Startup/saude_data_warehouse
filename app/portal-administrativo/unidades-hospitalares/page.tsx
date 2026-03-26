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
import { Building2, Plus, MoreVertical, Pencil, Power, Users, Activity, MapPin } from "lucide-react"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"
const HOSPITAL_COLOR = "oklch(0.38 0.19 264)"

interface UnidadeHospitalar {
  id: string
  nome: string
  cnes: string
  endereco: string
  telefone: string
  tipo: string
  profissionais: number
  movimentacoesMs: number
  ativo: boolean
  responsavel: string
}

const MOCK_HOSPITAIS: UnidadeHospitalar[] = [
  {
    id: "1",
    nome: "Hospital Municipal de Búzios",
    cnes: "2345678",
    endereco: "Rua das Pedras, 100 - Centro, Búzios - RJ",
    telefone: "(22) 2623-1234",
    tipo: "Hospital Municipal",
    profissionais: 32,
    movimentacoesMs: 67,
    ativo: true,
    responsavel: "Dr. Marcelo Ribeiro",
  },
  {
    id: "2",
    nome: "Hospital Regional Costa do Sol",
    cnes: "3456789",
    endereco: "Av. José Bento Ribeiro Dantas, 500 - Armação, Búzios - RJ",
    telefone: "(22) 2623-5678",
    tipo: "Hospital Regional",
    profissionais: 16,
    movimentacoesMs: 24,
    ativo: true,
    responsavel: "Dra. Silvia Campos",
  },
]

export default function UnidadesHospitalaresPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Unidades Hospitalares</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os hospitais integrados à rede de saúde de Búzios
          </p>
        </div>
        <Button className="rounded-xl text-[13px] text-white" style={{ background: ADMIN_COLOR }} onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} /> Nova Unidade
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Unidades ativas", valor: MOCK_HOSPITAIS.filter(h => h.ativo).length, icon: Building2 },
          { label: "Profissionais vinculados", valor: MOCK_HOSPITAIS.reduce((a, h) => a + h.profissionais, 0), icon: Users },
          { label: "Movimentações no mês", valor: MOCK_HOSPITAIS.reduce((a, h) => a + h.movimentacoesMs, 0), icon: Activity },
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

      {/* Lista de unidades */}
      <div className="space-y-4">
        {MOCK_HOSPITAIS.map((hospital) => (
          <Card key={hospital.id} className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.38 0.19 264 / 0.08)" }}>
                    <Building2 className="h-5 w-5" style={{ color: HOSPITAL_COLOR }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">{hospital.nome}</CardTitle>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${hospital.ativo ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                        {hospital.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <CardDescription className="text-[12px] mt-0.5">{hospital.tipo} · CNES: {hospital.cnes}</CardDescription>
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
                  <p className="text-[13px] font-medium text-foreground mt-0.5">{hospital.responsavel}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Telefone</p>
                  <p className="text-[13px] font-medium text-foreground mt-0.5">{hospital.telefone}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Profissionais</p>
                  <p className="text-[13px] font-medium text-foreground mt-0.5">{hospital.profissionais}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Movimentações / mês</p>
                  <p className="text-[13px] font-medium text-foreground mt-0.5">{hospital.movimentacoesMs}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {hospital.endereco}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Nova Unidade Hospitalar</DialogTitle>
            <DialogDescription>Preencha os dados para cadastrar uma nova unidade hospitalar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[13px]">Nome da unidade</Label>
                <Input className="rounded-xl text-[13px]" placeholder="Nome oficial" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">CNES</Label>
                <Input className="rounded-xl text-[13px]" placeholder="0000000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">Tipo</Label>
                <select className="w-full h-9 px-3 rounded-xl border border-border text-[13px] bg-background">
                  <option>Hospital Municipal</option>
                  <option>Hospital Regional</option>
                  <option>UPA</option>
                  <option>Clínica Especializada</option>
                </select>
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
            <Button className="rounded-xl text-[13px] text-white" style={{ background: ADMIN_COLOR }} onClick={() => setModalOpen(false)}>Cadastrar unidade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
