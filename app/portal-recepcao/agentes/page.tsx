"use client"

import { useRouter } from "next/navigation"
import { UserCheck, Users, Building2, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const COR = "oklch(0.62 0.15 50)"
const COR_BG = "oklch(0.62 0.15 50 / 0.10)"

const agentes = [
  { nome: "João Carlos",    ubs: "UBS Central", equipe: "Equipe 001 - ESF Centro", totalPacientes: 3 },
  { nome: "Fernanda Lima",  ubs: "UBS Central", equipe: "Equipe 001 - ESF Centro", totalPacientes: 3 },
  { nome: "Carla Souza",    ubs: "UBS Central", equipe: "Equipe 002 - ESF Norte",  totalPacientes: 2 },
  { nome: "Roberto Meira",  ubs: "UBS Norte",   equipe: "Equipe 003 - ESF Norte",  totalPacientes: 2 },
]

export default function RecepcaoAgentesPage() {
  const router = useRouter()

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Cabeçalho */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: COR }}>
          Cadastros
        </p>
        <h1 className="text-2xl font-semibold text-foreground">Agentes de Saúde</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Selecione um agente para visualizar seus pacientes
        </p>
      </div>

      {/* Cards dos ACS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentes.map((acs) => (
          <Card
            key={acs.nome}
            className="rounded-[20px] border-none cursor-pointer group transition-shadow hover:shadow-md"
            style={{ boxShadow: "var(--shadow-soft)" }}
            onClick={() => router.push(`/portal-recepcao/pacientes?acs=${encodeURIComponent(acs.nome)}`)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar com inicial */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                    style={{ background: `linear-gradient(135deg, ${COR} 0%, oklch(0.72 0.14 55) 100%)` }}
                  >
                    {acs.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-foreground leading-tight">{acs.nome}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Agente Comunitário de Saúde</p>
                  </div>
                </div>
                <ChevronRight
                  className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                  strokeWidth={1.5}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>{acs.ubs}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <UserCheck className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>{acs.equipe}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: COR_BG }}>
                  <Users className="w-3 h-3" style={{ color: COR }} strokeWidth={1.5} />
                </div>
                <span className="text-[13px] font-semibold text-foreground">{acs.totalPacientes}</span>
                <span className="text-[12px] text-muted-foreground">paciente{acs.totalPacientes !== 1 ? "s" : ""} vinculado{acs.totalPacientes !== 1 ? "s" : ""}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
