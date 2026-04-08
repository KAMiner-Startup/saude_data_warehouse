"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, User, Phone, MapPin, Building2, Users, UserCheck, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const COR = "oklch(0.62 0.15 50)"
const COR_BG = "oklch(0.62 0.15 50 / 0.10)"

interface Paciente {
  id: string
  nome: string
  cpf: string
  cns: string
  dataNascimento: string
  idade: number
  sexo: string
  telefone: string
  endereco: string
  unidadeReferencia: string
  equipeReferencia: string
  acs: string
}

const pacientesData: Record<string, Paciente> = {
  "1": { id: "1", nome: "Maria das Graças Ferreira", cpf: "821.344.090-11", cns: "898 0012 3456 7890", dataNascimento: "14/05/1968", idade: 57, sexo: "Feminino", telefone: "(22) 99999-1234", endereco: "Rua das Flores, 123 - Centro, Búzios/RJ", unidadeReferencia: "UBS Central", equipeReferencia: "Equipe 001 - ESF Centro", acs: "João Carlos" },
  "2": { id: "2", nome: "Ana Lúcia Barbosa", cpf: "034.892.110-44", cns: "702 0034 5678 1234", dataNascimento: "22/06/2000", idade: 25, sexo: "Feminino", telefone: "(22) 98888-5678", endereco: "Av. José Bento, 456 - Manguinhos, Búzios/RJ", unidadeReferencia: "UBS Central", equipeReferencia: "Equipe 001 - ESF Centro", acs: "Fernanda Lima" },
  "3": { id: "3", nome: "José Augusto Correia", cpf: "511.023.770-88", cns: "123 0056 7890 5678", dataNascimento: "30/07/1955", idade: 70, sexo: "Masculino", telefone: "(22) 97777-9012", endereco: "Rua dos Pescadores, 78 - Geribá, Búzios/RJ", unidadeReferencia: "UBS Central", equipeReferencia: "Equipe 001 - ESF Centro", acs: "João Carlos" },
  "4": { id: "4", nome: "Rosana Melo Santos", cpf: "192.774.050-33", cns: "456 0078 1234 9012", dataNascimento: "17/09/1972", idade: 53, sexo: "Feminino", telefone: "(22) 96666-3456", endereco: "Rua da Praia, 200 - Ferradura, Búzios/RJ", unidadeReferencia: "UBS Central", equipeReferencia: "Equipe 002 - ESF Norte", acs: "Carla Souza" },
  "5": { id: "5", nome: "Francisco Nunes Lima", cpf: "673.019.440-55", cns: "234 0011 2233 4455", dataNascimento: "03/01/1948", idade: 78, sexo: "Masculino", telefone: "(22) 95555-7890", endereco: "Rua do Sol, 55 - Armação, Búzios/RJ", unidadeReferencia: "UBS Central", equipeReferencia: "Equipe 001 - ESF Centro", acs: "Fernanda Lima" },
  "6": { id: "6", nome: "João Batista Neto", cpf: "147.258.369-66", cns: "567 0022 3344 5566", dataNascimento: "12/03/1960", idade: 65, sexo: "Masculino", telefone: "(22) 94444-1234", endereco: "Rua das Ostras, 10 - Centro, Búzios/RJ", unidadeReferencia: "UBS Central", equipeReferencia: "Equipe 002 - ESF Norte", acs: "Fernanda Lima" },
  "7": { id: "7", nome: "Célia Regina Moura", cpf: "258.369.147-77", cns: "678 0033 4455 6677", dataNascimento: "08/04/2001", idade: 24, sexo: "Feminino", telefone: "(22) 93333-5678", endereco: "Av. José Bento, 88 - Manguinhos, Búzios/RJ", unidadeReferencia: "UBS Central", equipeReferencia: "Equipe 001 - ESF Centro", acs: "João Carlos" },
  "8": { id: "8", nome: "Antônio Gomes", cpf: "369.147.258-88", cns: "789 0044 5566 7788", dataNascimento: "25/12/1958", idade: 67, sexo: "Masculino", telefone: "(22) 92222-9012", endereco: "Rua Nova, 300 - Geribá, Búzios/RJ", unidadeReferencia: "UBS Central", equipeReferencia: "Equipe 002 - ESF Norte", acs: "Carla Souza" },
  "9": { id: "9", nome: "Severino Ramos", cpf: "982.011.440-22", cns: "321 0099 8877 6655", dataNascimento: "19/08/1943", idade: 82, sexo: "Masculino", telefone: "(22) 91111-3456", endereco: "Rua das Pedras, 50 - Manguinhos, Búzios/RJ", unidadeReferencia: "UBS Norte", equipeReferencia: "Equipe 003 - ESF Norte", acs: "Roberto Meira" },
  "10": { id: "10", nome: "Neide Aparecida Santos", cpf: "543.210.987-44", cns: "654 0011 2255 3388", dataNascimento: "27/11/1965", idade: 60, sexo: "Feminino", telefone: "(22) 90000-7890", endereco: "Av. das Praias, 120 - Ferradura, Búzios/RJ", unidadeReferencia: "UBS Norte", equipeReferencia: "Equipe 003 - ESF Norte", acs: "Roberto Meira" },
}

export default function RecepcaoPacientePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const paciente = pacientesData[id]

  if (!paciente) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Paciente não encontrado.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/portal-recepcao/pacientes")}
          >
            Voltar à lista
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Voltar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-1.5 -ml-2 rounded-xl"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Voltar
      </Button>

      {/* Cabeçalho do paciente */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
              style={{ background: `linear-gradient(135deg, ${COR} 0%, oklch(0.72 0.14 55) 100%)` }}
            >
              {paciente.nome.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-foreground">{paciente.nome}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {paciente.idade} anos &middot; {paciente.sexo} &middot; Nasc. {paciente.dataNascimento}
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <User className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>CPF: {paciente.cpf}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>CNS: {paciente.cns}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>{paciente.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{paciente.endereco}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Vínculos */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: COR_BG }}>
                <Building2 className="h-3 w-3" style={{ color: COR }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Unidade de saúde</p>
                <p className="font-semibold text-[13px] text-foreground">{paciente.unidadeReferencia}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: COR_BG }}>
                <Users className="h-3 w-3" style={{ color: COR }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Equipe de saúde</p>
                <p className="font-semibold text-[13px] text-foreground">{paciente.equipeReferencia}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: COR_BG }}>
                <UserCheck className="h-3 w-3" style={{ color: COR }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Agente comunitário</p>
                <p className="font-semibold text-[13px] text-foreground">{paciente.acs}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados cadastrais completos */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: COR_BG }}>
              <User className="w-3.5 h-3.5" style={{ color: COR }} strokeWidth={1.25} />
            </div>
            Dados Cadastrais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Nome completo</p>
              <p className="text-[13px] font-medium text-foreground">{paciente.nome}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Data de nascimento</p>
              <p className="text-[13px] font-medium text-foreground">{paciente.dataNascimento}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Sexo</p>
              <p className="text-[13px] font-medium text-foreground">{paciente.sexo}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">CPF</p>
              <p className="text-[13px] font-medium text-foreground tabular-nums">{paciente.cpf}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">CNS</p>
              <p className="text-[13px] font-medium text-foreground tabular-nums">{paciente.cns}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Telefone</p>
              <p className="text-[13px] font-medium text-foreground">{paciente.telefone}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Endereço</p>
              <p className="text-[13px] font-medium text-foreground">{paciente.endereco}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
