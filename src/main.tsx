import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AppRouter } from "./router"
import "@/app/globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      storageKey="saude-theme"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <HashRouter>
        <AppRouter />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
