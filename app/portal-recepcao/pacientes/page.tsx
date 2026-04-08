"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLocation } from "react-router-dom"
import { Search, Users, ChevronRight, Filter, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const COR = "oklch(0.62 0.15 50)"
const COR_BG = "oklch(0.62 0.15 50 / 0.10)"

interface Paciente {
  id: string
  nome: string
  cpf: string
  cns: string
  dataNascimento: string
  sexo: string
  telefone: string
  endereco: string
  ubs: string
  equipe: string
  acs: string
}

const pacientesMock: Paciente[] = [
  { id: "1", nome: "Maria das Graças Ferreira", cpf: "821.344.090-11", cns: "898 0012 3456 7890", dataNascimento: "14/05/1968", sexo: "Feminino", telefone: "(22) 99999-1234", endereco: "Rua das Flores, 123 - Centro, Búzios/RJ", ubs: "UBS Central", equipe: "Equipe 001 - ESF Centro", acs: "João Carlos" },
  { id: "2", nome: "Ana Lúcia Barbosa", cpf: "034.892.110-44", cns: "702 0034 5678 1234", dataNascimento: "22/06/2000", sexo: "Feminino", telefone: "(22) 98888-5678", endereco: "Av. José Bento, 456 - Manguinhos, Búzios/RJ", ubs: "UBS Central", equipe: "Equipe 001 - ESF Centro", acs: "Fernanda Lima" },
  { id: "3", nome: "José Augusto Correia", cpf: "511.023.770-88", cns: "123 0056 7890 5678", dataNascimento: "30/07/1955", sexo: "Masculino", telefone: "(22) 97777-9012", endereco: "Rua dos Pescadores, 78 - Geribá, Búzios/RJ", ubs: "UBS Central", equipe: "Equipe 001 - ESF Centro", acs: "João Carlos" },
  { id: "4", nome: "Rosana Melo Santos", cpf: "192.774.050-33", cns: "456 0078 1234 9012", dataNascimento: "17/09/1972", sexo: "Feminino", telefone: "(22) 96666-3456", endereco: "Rua da Praia, 200 - Ferradura, Búzios/RJ", ubs: "UBS Central", equipe: "Equipe 002 - ESF Norte", acs: "Carla Souza" },
  { id: "5", nome: "Francisco Nunes Lima", cpf: "673.019.440-55", cns: "234 0011 2233 4455", dataNascimento: "03/01/1948", sexo: "Masculino", telefone: "(22) 95555-7890", endereco: "Rua do Sol, 55 - Armação, Búzios/RJ", ubs: "UBS Central", equipe: "Equipe 001 - ESF Centro", acs: "Fernanda Lima" },
  { id: "6", nome: "João Batista Neto", cpf: "147.258.369-66", cns: "567 0022 3344 5566", dataNascimento: "12/03/1960", sexo: "Masculino", telefone: "(22) 94444-1234", endereco: "Rua das Ostras, 10 - Centro, Búzios/RJ", ubs: "UBS Central", equipe: "Equipe 002 - ESF Norte", acs: "Fernanda Lima" },
  { id: "7", nome: "Célia Regina Moura", cpf: "258.369.147-77", cns: "678 0033 4455 6677", dataNascimento: "08/04/2001", sexo: "Feminino", telefone: "(22) 93333-5678", endereco: "Av. José Bento, 88 - Manguinhos, Búzios/RJ", ubs: "UBS Central", equipe: "Equipe 001 - ESF Centro", acs: "João Carlos" },
  { id: "8", nome: "Antônio Gomes", cpf: "369.147.258-88", cns: "789 0044 5566 7788", dataNascimento: "25/12/1958", sexo: "Masculino", telefone: "(22) 92222-9012", endereco: "Rua Nova, 300 - Geribá, Búzios/RJ", ubs: "UBS Central", equipe: "Equipe 002 - ESF Norte", acs: "Carla Souza" },
  { id: "9", nome: "Severino Ramos", cpf: "982.011.440-22", cns: "321 0099 8877 6655", dataNascimento: "19/08/1943", sexo: "Masculino", telefone: "(22) 91111-3456", endereco: "Rua das Pedras, 50 - Manguinhos, Búzios/RJ", ubs: "UBS Norte", equipe: "Equipe 003 - ESF Norte", acs: "Roberto Meira" },
  { id: "10", nome: "Neide Aparecida Santos", cpf: "543.210.987-44", cns: "654 0011 2255 3388", dataNascimento: "27/11/1965", sexo: "Feminino", telefone: "(22) 90000-7890", endereco: "Av. das Praias, 120 - Ferradura, Búzios/RJ", ubs: "UBS Norte", equipe: "Equipe 003 - ESF Norte", acs: "Roberto Meira" },
]

const todasUbs = [...new Set(pacientesMock.map((p) => p.ubs))].sort()

export default function RecepcaoPacientesPage() {
  const router = useRouter()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const [busca, setBusca] = useState("")
  const [filtroUbs, setFiltroUbs] = useState<string | "todas">(searchParams.get("ubs") || "todas")
  const [filtroAcs, setFiltroAcs] = useState<string | "todos">(searchParams.get("acs") || "todos")

  const pacientesFiltrados = pacientesMock.filter((p) => {
    const matchBusca =
      busca === "" ||
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.cpf.includes(busca) ||
      p.cns.includes(busca)
    const matchUbs = filtroUbs === "todas" || p.ubs === filtroUbs
    const matchAcs = filtroAcs === "todos" || p.acs === filtroAcs
    return matchBusca && matchUbs && matchAcs
  })

  const tituloFiltro = filtroUbs !== "todas"
    ? `Pacientes da ${filtroUbs}`
    : filtroAcs !== "todos"
    ? `Pacientes de ${filtroAcs}`
    : "Pacientes"

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Cabeçalho */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: COR }}>
          Cadastros
        </p>
        <h1 className="text-2xl font-semibold text-foreground">{tituloFiltro}</h1>
        <p className="text-sm text-muted-foreground mt-1">Pacientes cadastrados no sistema</p>
      </div>

      {/* Tabela */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: COR_BG }}>
                  <Users className="w-3.5 h-3.5" style={{ color: COR }} strokeWidth={1.25} />
                </div>
                Pacientes Cadastrados
              </CardTitle>
              <CardDescription className="text-[13px] mt-1">
                {pacientesFiltrados.length} de {pacientesMock.length} paciente{pacientesMock.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <Input
                  placeholder="Nome, CPF ou CNS..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9 h-9 rounded-xl text-[13px]"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-[13px] h-9">
                    <Filter className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {filtroUbs === "todas" ? "Todas as UBS" : filtroUbs}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuCheckboxItem
                    checked={filtroUbs === "todas"}
                    onCheckedChange={() => setFiltroUbs("todas")}
                    className="text-[13px]"
                  >
                    Todas as UBS
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  {todasUbs.map((ubs) => (
                    <DropdownMenuCheckboxItem
                      key={ubs}
                      checked={filtroUbs === ubs}
                      onCheckedChange={() => setFiltroUbs(ubs)}
                      className="text-[13px]"
                    >
                      {ubs}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {filtroAcs !== "todos" && (
                <button
                  onClick={() => setFiltroAcs("todos")}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-[13px] font-medium transition-colors"
                  style={{ background: COR_BG, color: COR }}
                >
                  ACS: {filtroAcs}
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Paciente</th>
                  <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">UBS Vinculada</th>
                  <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">Agente de Saúde</th>
                  <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pacientesFiltrados.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-muted/40 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/portal-recepcao/paciente/${p.id}`)}
                  >
                    <td className="py-3.5 pr-4">
                      <p className="font-semibold text-sm text-foreground">{p.nome}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">CPF: {p.cpf}</p>
                    </td>
                    <td className="py-3.5 pr-4 hidden sm:table-cell">
                      <p className="text-[13px] text-foreground">{p.ubs}</p>
                    </td>
                    <td className="py-3.5 pr-4 hidden lg:table-cell">
                      <p className="text-[13px] text-foreground">{p.acs}</p>
                    </td>
                    <td className="py-3.5 text-right">
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pacientesFiltrados.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-20" strokeWidth={1} />
              <p className="text-[13px] font-medium">Nenhum paciente encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
