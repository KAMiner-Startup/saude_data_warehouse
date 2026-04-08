"use client"

import { BuscaPaciente, type Paciente } from "@/components/busca-paciente"
import { Users, UserCheck, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const COR = "oklch(0.62 0.15 50)"
const COR_BG = "oklch(0.62 0.15 50 / 0.10)"

const pacientesRecepcao: Paciente[] = [
  { id: "1",  nome: "Maria das Graças Ferreira", cpf: "821.344.090-11", cns: "898 0012 3456 7890", dataNascimento: "14/05/1968", sexo: "Feminino" },
  { id: "2",  nome: "Ana Lúcia Barbosa",          cpf: "034.892.110-44", cns: "702 0034 5678 1234", dataNascimento: "22/06/2000", sexo: "Feminino" },
  { id: "3",  nome: "José Augusto Correia",        cpf: "511.023.770-88", cns: "123 0056 7890 5678", dataNascimento: "30/07/1955", sexo: "Masculino" },
  { id: "4",  nome: "Rosana Melo Santos",          cpf: "192.774.050-33", cns: "456 0078 1234 9012", dataNascimento: "17/09/1972", sexo: "Feminino" },
  { id: "5",  nome: "Francisco Nunes Lima",        cpf: "673.019.440-55", cns: "234 0011 2233 4455", dataNascimento: "03/01/1948", sexo: "Masculino" },
  { id: "6",  nome: "João Batista Neto",           cpf: "147.258.369-66", cns: "567 0022 3344 5566", dataNascimento: "12/03/1960", sexo: "Masculino" },
  { id: "7",  nome: "Célia Regina Moura",          cpf: "258.369.147-77", cns: "678 0033 4455 6677", dataNascimento: "08/04/2001", sexo: "Feminino" },
  { id: "8",  nome: "Antônio Gomes",               cpf: "369.147.258-88", cns: "789 0044 5566 7788", dataNascimento: "25/12/1958", sexo: "Masculino" },
  { id: "9",  nome: "Severino Ramos",              cpf: "982.011.440-22", cns: "321 0099 8877 6655", dataNascimento: "19/08/1943", sexo: "Masculino" },
  { id: "10", nome: "Neide Aparecida Santos",      cpf: "543.210.987-44", cns: "654 0011 2255 3388", dataNascimento: "27/11/1965", sexo: "Feminino" },
]

const pacientesRecentes = [
  { id: "1", nome: "Maria das Graças Ferreira", cpf: "821.344.090-11", ubs: "UBS Central", acs: "João Carlos" },
  { id: "2", nome: "Ana Lúcia Barbosa", cpf: "034.892.110-44", ubs: "UBS Central", acs: "Fernanda Lima" },
  { id: "3", nome: "José Augusto Correia", cpf: "511.023.770-88", ubs: "UBS Central", acs: "João Carlos" },
  { id: "4", nome: "Rosana Melo Santos", cpf: "192.774.050-33", ubs: "UBS Central", acs: "Carla Souza" },
  { id: "5", nome: "Francisco Nunes Lima", cpf: "673.019.440-55", ubs: "UBS Central", acs: "Fernanda Lima" },
]

export default function RecepcaoDashboardPage() {

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Painel de Recepção</h1>
        <p className="text-sm text-muted-foreground">
          Pesquise pacientes e acesse dados cadastrais
        </p>
      </div>

      {/* Busca de paciente */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: COR_BG }}>
              <Users className="w-3.5 h-3.5" style={{ color: COR }} strokeWidth={1.75} />
            </div>
            Buscar Paciente
          </CardTitle>
          <CardDescription className="text-[13px]">
            Pesquise por nome, CPF ou CNS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BuscaPaciente
            patients={pacientesRecepcao}
            basePath="/portal-recepcao"
            placeholder="Nome, CPF ou CNS do paciente..."
          />
        </CardContent>
      </Card>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Total de pacientes</p>
                <p className="text-3xl font-bold mt-2 text-foreground">10</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: COR_BG }}>
                <Users className="w-4 h-4" style={{ color: COR }} strokeWidth={1.5} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Unidades vinculadas</p>
                <p className="text-3xl font-bold mt-2 text-foreground">2</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: COR_BG }}>
                <Building2 className="w-4 h-4" style={{ color: COR }} strokeWidth={1.5} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Agentes de saúde</p>
                <p className="text-3xl font-bold mt-2 text-foreground">3</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: COR_BG }}>
                <UserCheck className="w-4 h-4" style={{ color: COR }} strokeWidth={1.5} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pacientes recentes */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: COR_BG }}>
                  <Users className="w-3.5 h-3.5" style={{ color: COR }} strokeWidth={1.25} />
                </div>
                Pacientes Recentes
              </CardTitle>
              <CardDescription className="text-[13px] mt-1">
                Últimos pacientes consultados no sistema
              </CardDescription>
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
                  <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Agente de Saúde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pacientesRecentes.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors cursor-pointer group">
                    <td className="py-3.5 pr-4">
                      <Link href={`/portal-recepcao/paciente/${p.id}`} className="block">
                        <p className="font-semibold text-sm text-foreground group-hover:transition-colors" style={{}}>
                          {p.nome}
                        </p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">CPF: {p.cpf}</p>
                      </Link>
                    </td>
                    <td className="py-3.5 pr-4 hidden sm:table-cell">
                      <p className="text-[13px] text-foreground">{p.ubs}</p>
                    </td>
                    <td className="py-3.5 hidden md:table-cell">
                      <p className="text-[13px] text-foreground">{p.acs}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            variant="outline"
            className="w-full mt-5 rounded-full border-none text-sm font-medium bg-muted/60 hover:bg-muted transition-colors"
            asChild
          >
            <Link href="/portal-recepcao/pacientes">Ver todos os pacientes</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

