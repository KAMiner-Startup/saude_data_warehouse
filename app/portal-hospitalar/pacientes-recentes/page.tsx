"use client"

import Link from "next/link"
import { Clock, User, Calendar, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PacienteRecente {
  id: string
  nome: string
  cpf: string
  cns: string
  dataAcesso: string
  horaAcesso: string
  alertasAtivos: number
}

const pacientesRecentesMock: PacienteRecente[] = [
  {
    id: "1",
    nome: "Maria Silva Santos",
    cpf: "123.456.789-00",
    cns: "898 0012 3456 7890",
    dataAcesso: "05/03/2026",
    horaAcesso: "14:32",
    alertasAtivos: 2
  },
  {
    id: "2",
    nome: "José Oliveira Costa",
    cpf: "456.789.123-11",
    cns: "702 0034 5678 1234",
    dataAcesso: "05/03/2026",
    horaAcesso: "11:15",
    alertasAtivos: 3
  },
  {
    id: "3",
    nome: "Ana Carolina Pereira",
    cpf: "789.123.456-22",
    cns: "123 0056 7890 5678",
    dataAcesso: "04/03/2026",
    horaAcesso: "16:45",
    alertasAtivos: 1
  },
  {
    id: "4",
    nome: "Carlos Eduardo Lima",
    cpf: "321.654.987-33",
    cns: "456 0078 1234 9012",
    dataAcesso: "04/03/2026",
    horaAcesso: "10:20",
    alertasAtivos: 0
  },
  {
    id: "5",
    nome: "Mariana Souza Rodrigues",
    cpf: "654.987.321-44",
    cns: "789 0090 5678 3456",
    dataAcesso: "03/03/2026",
    horaAcesso: "09:00",
    alertasAtivos: 0
  },
  {
    id: "6",
    nome: "José Maria da Silva",
    cpf: "111.222.333-44",
    cns: "111 2223 3344 5556",
    dataAcesso: "02/03/2026",
    horaAcesso: "15:30",
    alertasAtivos: 0
  },
]

export default function PacientesRecentesPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          Pacientes Recentes
        </h1>
        <p className="text-sm text-muted-foreground">
          Últimos pacientes consultados nos últimos 7 dias
        </p>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Acessos</CardTitle>
          <CardDescription>
            {pacientesRecentesMock.length} paciente(s) consultado(s) recentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pacientesRecentesMock.map((paciente) => (
              <div
                key={paciente.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/paciente/${paciente.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {paciente.nome}
                      </Link>
                      {paciente.alertasAtivos > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {paciente.alertasAtivos}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      CPF: {paciente.cpf}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Último acesso: {paciente.dataAcesso} às {paciente.horaAcesso}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/paciente/${paciente.id}`}>
                    Ver paciente
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
