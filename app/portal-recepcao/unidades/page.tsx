"use client"

import { useRouter } from "next/navigation"
import { Building2, Users, UserCheck, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const COR = "oklch(0.62 0.15 50)"
const COR_BG = "oklch(0.62 0.15 50 / 0.10)"

const unidades = [
  {
    nome: "UBS Central",
    endereco: "Rua das Flores, 10 - Centro, Búzios/RJ",
    equipes: ["Equipe 001 - ESF Centro", "Equipe 002 - ESF Norte"],
    agentes: ["João Carlos", "Fernanda Lima", "Carla Souza"],
    totalPacientes: 8,
  },
  {
    nome: "UBS Norte",
    endereco: "Av. das Praias, 200 - Manguinhos, Búzios/RJ",
    equipes: ["Equipe 003 - ESF Norte"],
    agentes: ["Roberto Meira"],
    totalPacientes: 2,
  },
]

export default function RecepcaoUnidadesPage() {
  const router = useRouter()

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Cabeçalho */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: COR }}>
          Cadastros
        </p>
        <h1 className="text-2xl font-semibold text-foreground">Unidades de Saúde</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Selecione uma unidade para visualizar seus pacientes
        </p>
      </div>

      {/* Cards das UBS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {unidades.map((ubs) => (
          <Card
            key={ubs.nome}
            className="rounded-[20px] border-none cursor-pointer group transition-shadow hover:shadow-md"
            style={{ boxShadow: "var(--shadow-soft)" }}
            onClick={() => router.push(`/portal-recepcao/pacientes?ubs=${encodeURIComponent(ubs.nome)}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: COR_BG }}
                  >
                    <Building2 className="w-5 h-5" style={{ color: COR }} strokeWidth={1.25} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground group-hover:text-[--recepcao] transition-colors">
                      {ubs.nome}
                    </CardTitle>
                    <CardDescription className="text-[12px] mt-0.5">{ubs.endereco}</CardDescription>
                  </div>
                </div>
                <ChevronRight
                  className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  strokeWidth={1.5}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-6 mt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: COR_BG }}>
                    <Users className="w-3.5 h-3.5" style={{ color: COR }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Pacientes</p>
                    <p className="text-lg font-bold text-foreground">{ubs.totalPacientes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: COR_BG }}>
                    <UserCheck className="w-3.5 h-3.5" style={{ color: COR }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Agentes</p>
                    <p className="text-lg font-bold text-foreground">{ubs.agentes.length}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Equipes</p>
                <div className="flex flex-wrap gap-1.5">
                  {ubs.equipes.map((eq) => (
                    <span
                      key={eq}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-lg"
                      style={{ background: COR_BG, color: COR }}
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
