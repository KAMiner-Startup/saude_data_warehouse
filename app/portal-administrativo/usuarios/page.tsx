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
import { Users, Search, Plus, MoreVertical, UserCheck, UserX, Pencil, Shield } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"

type Perfil = "hospitalar" | "aps" | "administrativo"
type StatusUsuario = "ativo" | "inativo" | "pendente"

interface Usuario {
  id: string
  nome: string
  email: string
  cpf: string
  perfil: Perfil
  unidade: string
  status: StatusUsuario
  ultimoAcesso: string
}

const perfilConfig: Record<Perfil, { label: string; className: string; cor: string }> = {
  hospitalar: { label: "Profissional Hospitalar", className: "bg-primary/10 text-primary", cor: "oklch(0.38 0.19 264)" },
  aps: { label: "Profissional APS", className: "bg-emerald-100 text-emerald-700", cor: "oklch(0.55 0.18 160)" },
  administrativo: { label: "Gestor Administrativo", className: "bg-[oklch(0.50_0.14_280_/_0.10)] text-[oklch(0.50_0.14_280)]", cor: ADMIN_COLOR },
}

const statusConfig: Record<StatusUsuario, { label: string; className: string }> = {
  ativo: { label: "Ativo", className: "bg-emerald-100 text-emerald-700" },
  inativo: { label: "Inativo", className: "bg-muted text-muted-foreground" },
  pendente: { label: "Pendente", className: "bg-amber-100 text-amber-700" },
}

const MOCK_USUARIOS: Usuario[] = [
  { id: "1", nome: "Dr. João Silva", email: "joao.silva@saude.buzios.rj.gov.br", cpf: "123.456.789-00", perfil: "hospitalar", unidade: "Hospital Municipal de Búzios", status: "ativo", ultimoAcesso: "10/03/2026" },
  { id: "2", nome: "Dra. Ana Ferreira", email: "ana.ferreira@saude.buzios.rj.gov.br", cpf: "456.789.123-11", perfil: "aps", unidade: "UBS Centro", status: "ativo", ultimoAcesso: "09/03/2026" },
  { id: "3", nome: "Enf. Carlos Mendes", email: "carlos.mendes@saude.buzios.rj.gov.br", cpf: "789.123.456-22", perfil: "hospitalar", unidade: "Hospital Municipal de Búzios", status: "ativo", ultimoAcesso: "08/03/2026" },
  { id: "4", nome: "Dra. Maria Santos", email: "maria.santos@saude.buzios.rj.gov.br", cpf: "321.654.987-33", perfil: "aps", unidade: "UBS Manguinhos", status: "ativo", ultimoAcesso: "10/03/2026" },
  { id: "5", nome: "Adm. Pedro Costa", email: "pedro.costa@saude.buzios.rj.gov.br", cpf: "654.321.987-44", perfil: "administrativo", unidade: "Secretaria de Saúde", status: "ativo", ultimoAcesso: "10/03/2026" },
  { id: "6", nome: "Dra. Fernanda Lima", email: "fernanda.lima@saude.buzios.rj.gov.br", cpf: "111.222.333-44", perfil: "aps", unidade: "UBS Geribá", status: "ativo", ultimoAcesso: "07/03/2026" },
  { id: "7", nome: "Dr. Roberto Alves", email: "roberto.alves@saude.buzios.rj.gov.br", cpf: "555.666.777-88", perfil: "hospitalar", unidade: "Hospital Regional", status: "inativo", ultimoAcesso: "15/02/2026" },
  { id: "8", nome: "Enf. Lucia Pereira", email: "lucia.pereira@saude.buzios.rj.gov.br", cpf: "999.888.777-66", perfil: "aps", unidade: "UBS Ferradura", status: "pendente", ultimoAcesso: "-" },
]

export default function UsuariosPage() {
  const [busca, setBusca] = useState("")
  const [filtroPerfil, setFiltroPerfil] = useState<string>("todos")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [modalOpen, setModalOpen] = useState(false)

  const usuariosFiltrados = MOCK_USUARIOS.filter((u) => {
    const matchBusca = !busca || u.nome.toLowerCase().includes(busca.toLowerCase()) || u.email.includes(busca)
    const matchPerfil = filtroPerfil === "todos" || u.perfil === filtroPerfil
    const matchStatus = filtroStatus === "todos" || u.status === filtroStatus
    return matchBusca && matchPerfil && matchStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Usuários</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os profissionais e seus vínculos com as unidades de saúde
          </p>
        </div>
        <Button
          className="rounded-xl text-[13px] text-white"
          style={{ background: ADMIN_COLOR }}
          onClick={() => setModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} /> Novo Usuário
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", valor: MOCK_USUARIOS.length, icon: Users },
          { label: "Ativos", valor: MOCK_USUARIOS.filter(u => u.status === "ativo").length, icon: UserCheck },
          { label: "Inativos", valor: MOCK_USUARIOS.filter(u => u.status === "inativo").length, icon: UserX },
          { label: "Pendentes", valor: MOCK_USUARIOS.filter(u => u.status === "pendente").length, icon: Shield },
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

      {/* Filtros */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <Input placeholder="Buscar por nome ou e-mail..." className="pl-9 rounded-xl border-border text-[13px]" value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
            <select className="h-9 px-3 rounded-xl border border-border text-[13px] bg-background" value={filtroPerfil} onChange={(e) => setFiltroPerfil(e.target.value)}>
              <option value="todos">Todos os perfis</option>
              <option value="hospitalar">Profissional Hospitalar</option>
              <option value="aps">Profissional APS</option>
              <option value="administrativo">Gestor Administrativo</option>
            </select>
            <select className="h-9 px-3 rounded-xl border border-border text-[13px] bg-background" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="todos">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
              <Users className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
            </div>
            Lista de Usuários
          </CardTitle>
          <CardDescription className="text-[13px]">{usuariosFiltrados.length} usuário(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {usuariosFiltrados.map((usuario) => {
              const iniciais = usuario.nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
              return (
                <div key={usuario.id} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarFallback className="text-[11px] font-bold text-white" style={{ background: perfilConfig[usuario.perfil].cor }}>
                      {iniciais}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[13px] text-foreground">{usuario.nome}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${perfilConfig[usuario.perfil].className}`}>
                        {perfilConfig[usuario.perfil].label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${statusConfig[usuario.status].className}`}>
                        {statusConfig[usuario.status].label}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground truncate">{usuario.email} · {usuario.unidade}</p>
                    <p className="text-[11px] text-muted-foreground">Último acesso: {usuario.ultimoAcesso}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl flex-shrink-0">
                        <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem className="text-[13px]"><Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} /> Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-[13px]"><Shield className="mr-2 h-4 w-4" strokeWidth={1.5} /> Alterar perfil</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {usuario.status === "ativo"
                        ? <DropdownMenuItem className="text-[13px] text-destructive"><UserX className="mr-2 h-4 w-4" strokeWidth={1.5} /> Desativar</DropdownMenuItem>
                        : <DropdownMenuItem className="text-[13px] text-emerald-600"><UserCheck className="mr-2 h-4 w-4" strokeWidth={1.5} /> Ativar</DropdownMenuItem>
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal novo usuário */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Novo Usuário</DialogTitle>
            <DialogDescription>Preencha os dados para cadastrar um novo usuário no sistema.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[13px]">Nome completo</Label>
                <Input className="rounded-xl text-[13px]" placeholder="Nome do profissional" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">CPF</Label>
                <Input className="rounded-xl text-[13px]" placeholder="000.000.000-00" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">E-mail</Label>
                <Input className="rounded-xl text-[13px]" type="email" placeholder="nome@saude.buzios.rj.gov.br" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">Perfil de acesso</Label>
                <select className="w-full h-9 px-3 rounded-xl border border-border text-[13px] bg-background">
                  <option value="">Selecione...</option>
                  <option value="hospitalar">Profissional Hospitalar</option>
                  <option value="aps">Profissional APS</option>
                  <option value="administrativo">Gestor Administrativo</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">Unidade de vínculo</Label>
                <select className="w-full h-9 px-3 rounded-xl border border-border text-[13px] bg-background">
                  <option value="">Selecione...</option>
                  <option>Hospital Municipal de Búzios</option>
                  <option>Hospital Regional</option>
                  <option>UBS Centro</option>
                  <option>UBS Manguinhos</option>
                  <option>UBS Geribá</option>
                  <option>UBS Ferradura</option>
                  <option>UBS Armação</option>
                  <option>Secretaria de Saúde</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl text-[13px]" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl text-[13px] text-white" style={{ background: ADMIN_COLOR }} onClick={() => setModalOpen(false)}>Criar usuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
