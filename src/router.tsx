import { Navigate, Outlet, Route, Routes } from "react-router-dom"

import HomePage from "@/app/page"
import LoginAdministrativoPage from "@/app/login/administrativo/page"
import LoginApsPage from "@/app/login/aps/page"
import LoginHospitalarPage from "@/app/login/hospitalar/page"

import PortalAdministrativoLayout from "@/app/portal-administrativo/layout"
import AdminDashboardPage from "@/app/portal-administrativo/dashboard/page"
import AdminAuditoriaPage from "@/app/portal-administrativo/auditoria/page"
import AdminConfiguracoesPage from "@/app/portal-administrativo/configuracoes/page"
import AdminConfiguracoesAlertasPage from "@/app/portal-administrativo/configuracoes/alertas/page"
import AdminMonitoramentoPage from "@/app/portal-administrativo/monitoramento/page"
import AdminRelatoriosPage from "@/app/portal-administrativo/relatorios/page"
import AdminUnidadesApsPage from "@/app/portal-administrativo/unidades-aps/page"
import AdminUnidadesHospitalaresPage from "@/app/portal-administrativo/unidades-hospitalares/page"
import AdminUsuariosPage from "@/app/portal-administrativo/usuarios/page"
import AdminAlertasOperacionaisPage from "@/app/portal-administrativo/alertas-operacionais/page"

import PortalAtencaoBasicaLayout from "@/app/portal-atencao-basica/layout"
import ApsDashboardPage from "@/app/portal-atencao-basica/dashboard/page"
import ApsAgentesPage from "@/app/portal-atencao-basica/agentes/page"
import ApsAlertasPage from "@/app/portal-atencao-basica/alertas/page"
import ApsIndicadoresPage from "@/app/portal-atencao-basica/indicadores/page"
import ApsPacientesPage from "@/app/portal-atencao-basica/pacientes/page"
import ApsPacientesAtendidosPage from "@/app/portal-atencao-basica/pacientes-atendidos/page"
import ApsPacientePage from "@/app/portal-atencao-basica/paciente/[id]/page"
import ApsVisitasPage from "@/app/portal-atencao-basica/visitas/page"

import PortalRecepcaoLayout from "@/app/portal-recepcao/layout"
import RecepcaoDashboardPage from "@/app/portal-recepcao/dashboard/page"
import RecepcaoPacientesPage from "@/app/portal-recepcao/pacientes/page"
import RecepcaoPacientesAtendidosPage from "@/app/portal-recepcao/pacientes-atendidos/page"
import RecepcaoPacientePage from "@/app/portal-recepcao/paciente/[id]/page"
import RecepcaoUnidadesPage from "@/app/portal-recepcao/unidades/page"
import RecepcaoAgentesPage from "@/app/portal-recepcao/agentes/page"
import LoginRecepcaoPage from "@/app/login/recepcao/page"

import PortalHospitalarLayout from "@/app/portal-hospitalar/layout"
import HospitalarDashboardPage from "@/app/portal-hospitalar/dashboard/page"
import HospitalarMovimentacoesPage from "@/app/portal-hospitalar/movimentacoes/page"
import HospitalarPacientePage from "@/app/portal-hospitalar/paciente/[id]/page"
import HospitalarPacientesRecentesPage from "@/app/portal-hospitalar/pacientes-recentes/page"

function RecepcaoLayoutRoute() {
  return (
    <PortalRecepcaoLayout>
      <Outlet />
    </PortalRecepcaoLayout>
  )
}

function AdminLayoutRoute() {
  return (
    <PortalAdministrativoLayout>
      <Outlet />
    </PortalAdministrativoLayout>
  )
}

function ApsLayoutRoute() {
  return (
    <PortalAtencaoBasicaLayout>
      <Outlet />
    </PortalAtencaoBasicaLayout>
  )
}

function HospitalarLayoutRoute() {
  return (
    <PortalHospitalarLayout>
      <Outlet />
    </PortalHospitalarLayout>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login/administrativo" element={<LoginAdministrativoPage />} />
      <Route path="/login/recepcao" element={<LoginRecepcaoPage />} />
      <Route path="/login/aps" element={<LoginApsPage />} />
      <Route path="/login/hospitalar" element={<LoginHospitalarPage />} />

      <Route path="/portal-administrativo" element={<AdminLayoutRoute />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="alertas-operacionais" element={<AdminAlertasOperacionaisPage />} />
        <Route path="auditoria" element={<AdminAuditoriaPage />} />
        <Route path="configuracoes" element={<AdminConfiguracoesPage />} />
        <Route path="configuracoes/alertas" element={<AdminConfiguracoesAlertasPage />} />
        <Route path="monitoramento" element={<AdminMonitoramentoPage />} />
        <Route path="relatorios" element={<AdminRelatoriosPage />} />
        <Route path="unidades-aps" element={<AdminUnidadesApsPage />} />
        <Route path="unidades-hospitalares" element={<AdminUnidadesHospitalaresPage />} />
        <Route path="usuarios" element={<AdminUsuariosPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/portal-atencao-basica" element={<ApsLayoutRoute />}>
        <Route path="dashboard" element={<ApsDashboardPage />} />
        <Route path="agentes" element={<ApsAgentesPage />} />
        <Route path="alertas" element={<ApsAlertasPage />} />
        <Route path="indicadores" element={<ApsIndicadoresPage />} />
        <Route path="pacientes" element={<ApsPacientesPage />} />
        <Route path="pacientes-atendidos" element={<ApsPacientesAtendidosPage />} />
        <Route path="paciente/:id" element={<ApsPacientePage />} />
        <Route path="visitas" element={<ApsVisitasPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/portal-hospitalar" element={<HospitalarLayoutRoute />}>
        <Route path="dashboard" element={<HospitalarDashboardPage />} />
        <Route path="movimentacoes" element={<HospitalarMovimentacoesPage />} />
        <Route path="paciente/:id" element={<HospitalarPacientePage />} />
        <Route path="pacientes-recentes" element={<HospitalarPacientesRecentesPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/portal-recepcao" element={<RecepcaoLayoutRoute />}>
        <Route path="dashboard" element={<RecepcaoDashboardPage />} />
        <Route path="pacientes" element={<RecepcaoPacientesPage />} />
        <Route path="pacientes-atendidos" element={<RecepcaoPacientesAtendidosPage />} />
        <Route path="paciente/:id" element={<RecepcaoPacientePage />} />
        <Route path="unidades" element={<RecepcaoUnidadesPage />} />
        <Route path="agentes" element={<RecepcaoAgentesPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
