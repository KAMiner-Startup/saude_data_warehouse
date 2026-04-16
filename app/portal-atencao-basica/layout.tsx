"use client"

import { useState } from "react"
import { ApsSidebarNav } from "@/components/layout/aps-sidebar-nav"
import { ApsHeader } from "@/components/layout/aps-header"
import { ApsSidebarContext } from "@/lib/aps-sidebar-context"

export default function PortalAtencaoBasicaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <ApsSidebarContext.Provider value={{ collapsed: sidebarCollapsed, setCollapsed: setSidebarCollapsed }}>
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <ApsSidebarNav
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ApsHeader
          nomeUsuario="Dra. Ana Ferreira"
          perfilUsuario="Médica de Família - UBS Centro"
          alertasPendentes={3}
        />
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="min-h-full flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <footer className="px-4 py-3 mt-auto">
              <p className="text-xs text-muted-foreground text-center">
                Desenvolvido pela KAminer &copy; 2026
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
    </ApsSidebarContext.Provider>
  )
}
