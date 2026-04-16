"use client"

import { createContext, useContext } from "react"

interface ApsSidebarContextValue {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export const ApsSidebarContext = createContext<ApsSidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
})

export function useApsSidebar() {
  return useContext(ApsSidebarContext)
}
