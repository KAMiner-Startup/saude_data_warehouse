"use client"

import { useState } from "react"
import { RecepcaoSidebarNav } from "@/components/layout/recepcao-sidebar-nav"
import { RecepcaoHeader } from "@/components/layout/recepcao-header"

export default function PortalRecepcaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <RecepcaoSidebarNav
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <RecepcaoHeader
          nomeUsuario="Ana Lima"
          perfilUsuario="Recepcionista"
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
  )
}
