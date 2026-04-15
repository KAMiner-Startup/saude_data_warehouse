"use client"

import { ListaAtendimentosRecentes } from "@/components/lista-atendimentos-recentes"
import {
  MOCK_ATENDIMENTOS_RECENTES,
  filtrarPorContexto,
} from "@/lib/dados-atendimentos-recentes"

const HOSP_COLOR = "oklch(0.38 0.19 264)"
const HOSP_BG = "oklch(0.38 0.19 264 / 0.10)"

export default function PacientesRecentesPage() {
  const atendimentos = filtrarPorContexto(MOCK_ATENDIMENTOS_RECENTES, "hospitalar")

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: HOSP_COLOR }}>
          Assistencial
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Pacientes atendidos recentemente
        </h1>
        <p className="text-sm text-muted-foreground">
          Historico recente de atendimentos, faltas e proximos agendamentos
        </p>
      </div>

      <ListaAtendimentosRecentes
        atendimentos={atendimentos}
        mostrarDadosClinicos
        linkPaciente={(id) => `/portal-hospitalar/paciente/${id}`}
        corPrimaria={HOSP_COLOR}
        corBg={HOSP_BG}
      />
    </div>
  )
}
