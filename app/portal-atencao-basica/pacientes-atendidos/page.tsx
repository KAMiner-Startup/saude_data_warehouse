"use client"

import { ListaAtendimentosRecentes } from "@/components/lista-atendimentos-recentes"
import {
  MOCK_ATENDIMENTOS_RECENTES,
  filtrarPorContexto,
} from "@/lib/dados-atendimentos-recentes"

const APS_COLOR = "oklch(0.55 0.18 160)"
const APS_BG = "oklch(0.55 0.18 160 / 0.10)"

export default function ApsPacientesAtendidosPage() {
  const atendimentos = filtrarPorContexto(MOCK_ATENDIMENTOS_RECENTES, "aps")

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: APS_COLOR }}>
            Monitoramento
          </p>
          <h1 className="text-2xl font-semibold text-foreground">Pacientes atendidos recentemente</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Consultas, retornos e nao comparecimentos da equipe ESF
          </p>
        </div>

        <ListaAtendimentosRecentes
          atendimentos={atendimentos}
          mostrarDadosClinicos
          linkPaciente={(id) => `/portal-atencao-basica/paciente/${id}`}
          corPrimaria={APS_COLOR}
          corBg={APS_BG}
        />
      </div>
    </main>
  )
}
