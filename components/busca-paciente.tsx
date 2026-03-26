"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, User, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export interface Paciente {
  id: string
  nome: string
  cpf: string
  cns: string
  dataNascimento: string
  sexo: string
}

// Dados mockados de pacientes
const pacientesMock: Paciente[] = [
  {
    id: "1",
    nome: "Maria Silva Santos",
    cpf: "123.456.789-00",
    cns: "898 0012 3456 7890",
    dataNascimento: "15/03/1985",
    sexo: "Feminino"
  },
  {
    id: "2",
    nome: "José Oliveira Costa",
    cpf: "456.789.123-11",
    cns: "702 0034 5678 1234",
    dataNascimento: "22/07/1972",
    sexo: "Masculino"
  },
  {
    id: "3",
    nome: "Ana Carolina Pereira",
    cpf: "789.123.456-22",
    cns: "123 0056 7890 5678",
    dataNascimento: "08/11/1990",
    sexo: "Feminino"
  },
  {
    id: "4",
    nome: "Carlos Eduardo Lima",
    cpf: "321.654.987-33",
    cns: "456 0078 1234 9012",
    dataNascimento: "30/01/1968",
    sexo: "Masculino"
  },
  {
    id: "5",
    nome: "Mariana Souza Rodrigues",
    cpf: "654.987.321-44",
    cns: "789 0090 5678 3456",
    dataNascimento: "12/09/1995",
    sexo: "Feminino"
  },
  {
    id: "6",
    nome: "José Maria da Silva",
    cpf: "111.222.333-44",
    cns: "111 2223 3344 5556",
    dataNascimento: "05/05/1980",
    sexo: "Masculino"
  }
]

interface BuscaPacienteProps {
  modo?: "navegacao" | "filtro"
  onSelectPaciente?: (paciente: Paciente | null) => void
  placeholder?: string
  value?: string
  onClear?: () => void
  basePath?: string
}

export function BuscaPaciente({ 
  modo = "navegacao", 
  onSelectPaciente,
  placeholder = "Digite CPF, CNS ou nome do paciente...",
  value,
  onClear,
  basePath = "/portal-hospitalar"
}: BuscaPacienteProps) {
  const [termoBusca, setTermoBusca] = useState(value || "")
  const [resultados, setResultados] = useState<Paciente[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Sincroniza com valor externo (para limpar o campo)
  useEffect(() => {
    if (value !== undefined) {
      setTermoBusca(value)
    }
  }, [value])

  // Simula busca com delay (como se fosse uma API)
  useEffect(() => {
    if (termoBusca.length < 2) {
      setResultados([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(() => {
      const termoLower = termoBusca.toLowerCase()
      const filtered = pacientesMock.filter(
        (p) =>
          p.nome.toLowerCase().includes(termoLower) ||
          p.cpf.replace(/\D/g, "").includes(termoBusca.replace(/\D/g, "")) ||
          p.cns.replace(/\D/g, "").includes(termoBusca.replace(/\D/g, ""))
      )
      setResultados(filtered)
      setIsOpen(true)
      setIsLoading(false)
      setSelectedIndex(-1)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [termoBusca])

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectPaciente = (paciente: Paciente) => {
    setIsOpen(false)
    
    if (modo === "filtro" && onSelectPaciente) {
      setTermoBusca(paciente.nome)
      onSelectPaciente(paciente)
    } else {
      setTermoBusca("")
      router.push(`${basePath}/paciente/${paciente.id}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || resultados.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < resultados.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectPaciente(resultados[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        break
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" strokeWidth={1.5} />
        <Input
          placeholder={placeholder}
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => termoBusca.length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10 rounded-xl border-border bg-background transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-primary/15 focus-visible:border-primary/50 focus-visible:shadow-none"
        />
        {isLoading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60 animate-spin" strokeWidth={1.5} />
        )}
      </div>

      {isOpen && resultados.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-80 overflow-auto rounded-2xl border border-border" style={{ boxShadow: "0 8px 30px rgb(0 0 0 / 0.08)" }}>
          <ul className="py-1.5">
            {resultados.map((paciente, index) => (
              <li
                key={paciente.id}
                className={`
                  flex items-center gap-3 px-3 py-2.5 mx-1.5 rounded-xl cursor-pointer transition-colors
                  ${index === selectedIndex ? "bg-primary/8 text-primary" : "hover:bg-muted/70"}
                `}
                onClick={() => handleSelectPaciente(paciente)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${index === selectedIndex ? "bg-primary/15" : "bg-muted"}`}>
                  <User className={`w-4 h-4 ${index === selectedIndex ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {paciente.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CPF: {paciente.cpf} &middot; CNS: {paciente.cns}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">{paciente.dataNascimento}</p>
                  <p className="text-xs text-muted-foreground">{paciente.sexo}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {isOpen && termoBusca.length >= 2 && resultados.length === 0 && !isLoading && (
        <Card className="absolute z-50 w-full mt-2 rounded-2xl border border-border" style={{ boxShadow: "0 8px 30px rgb(0 0 0 / 0.08)" }}>
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum paciente encontrado para <span className="font-medium text-foreground">"{termoBusca}"</span>
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
