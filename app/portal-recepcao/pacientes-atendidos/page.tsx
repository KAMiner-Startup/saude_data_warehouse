"use client"

import { ListaAtendimentosRecentes } from "@/components/lista-atendimentos-recentes"
import { MOCK_ATENDIMENTOS_RECENTES } from "@/lib/dados-atendimentos-recentes"

const RECEPCAO_COLOR = "oklch(0.62 0.15 50)"
const RECEPCAO_BG = "oklch(0.62 0.15 50 / 0.10)"

export default function RecepcaoPacientesAtendidosPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: RECEPCAO_COLOR }}>
          Agenda
        </p>
        <h1 className="text-2xl font-semibold text-foreground">Pacientes atendidos recentemente</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ultimos atendimentos agendados, nao comparecimentos e proximos retornos
        </p>
      </div>

      <ListaAtendimentosRecentes
        atendimentos={MOCK_ATENDIMENTOS_RECENTES}
        mostrarDadosClinicos={false}
        corPrimaria={RECEPCAO_COLOR}
        corBg={RECEPCAO_BG}
      />
    </div>
  )
}
