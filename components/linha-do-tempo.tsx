"use client"

import { useState } from "react"
import {
  Building2,
  CheckCircle,
  Stethoscope,
  FlaskConical,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  User,
  FileText,
  Baby,
  Pill,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Tipos de evento
type TipoEvento = 
  | "internacao" 
  | "alta" 
  | "consulta" 
  | "exame" 
  | "procedimento" 
  | "urgencia" 
  | "pre_natal"
  | "quimioterapia"
  | "fisioterapia"

interface EventoTimeline {
  id: string
  data: string
  dataCompleta: string
  tipo: TipoEvento
  titulo: string
  local: string
  profissional: string
  descricao?: string
  cid?: string
  resultado?: string
  status?: "concluido" | "em_andamento" | "pendente" | "critico"
  detalhes?: {
    label: string
    valor: string
  }[]
}

interface LinhaDoTempoProps {
  eventos: EventoTimeline[]
}

// Configuração visual por tipo de evento
const configEvento: Record<TipoEvento, { 
  icon: React.ElementType
  cor: string
  corBg: string
  label: string 
}> = {
  internacao: { 
    icon: Building2, 
    cor: "text-blue-600", 
    corBg: "bg-blue-100",
    label: "Internacao" 
  },
  alta: { 
    icon: CheckCircle, 
    cor: "text-green-600", 
    corBg: "bg-green-100",
    label: "Alta" 
  },
  consulta: { 
    icon: Stethoscope, 
    cor: "text-slate-600", 
    corBg: "bg-slate-100",
    label: "Consulta" 
  },
  exame: { 
    icon: FlaskConical, 
    cor: "text-amber-600", 
    corBg: "bg-amber-100",
    label: "Exame" 
  },
  procedimento: { 
    icon: Activity, 
    cor: "text-purple-600", 
    corBg: "bg-purple-100",
    label: "Procedimento" 
  },
  urgencia: { 
    icon: AlertTriangle, 
    cor: "text-red-600", 
    corBg: "bg-red-100",
    label: "Urgencia" 
  },
  pre_natal: { 
    icon: Baby, 
    cor: "text-pink-600", 
    corBg: "bg-pink-100",
    label: "Pre-Natal" 
  },
  quimioterapia: { 
    icon: Pill, 
    cor: "text-orange-600", 
    corBg: "bg-orange-100",
    label: "Quimioterapia" 
  },
  fisioterapia: { 
    icon: Activity, 
    cor: "text-teal-600", 
    corBg: "bg-teal-100",
    label: "Fisioterapia" 
  },
}

// Configuração de status
const configStatus: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  concluido: { label: "Concluido", variant: "secondary" },
  em_andamento: { label: "Em andamento", variant: "default" },
  pendente: { label: "Pendente", variant: "outline" },
  critico: { label: "Critico", variant: "destructive" },
}

function EventoCard({ evento, isLast }: { evento: EventoTimeline; isLast: boolean }) {
  const [expandido, setExpandido] = useState(false)
  const config = configEvento[evento.tipo]
  const Icon = config.icon

  return (
    <div className="relative flex gap-4">
      {/* Linha vertical */}
      {!isLast && (
        <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-border" />
      )}
      
      {/* Marcador circular */}
      <div className={cn(
        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        config.corBg
      )}>
        <Icon className={cn("h-4 w-4", config.cor)} />
      </div>

      {/* Card do evento */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-muted-foreground">{evento.data}</span>
          <Badge variant="outline" className={cn("text-xs", config.cor)}>
            {config.label}
          </Badge>
          {evento.status && (
            <Badge variant={configStatus[evento.status].variant} className="text-xs">
              {configStatus[evento.status].label}
            </Badge>
          )}
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1">
              <h4 className="font-semibold text-foreground">{evento.titulo}</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {evento.local}
                </span>
                {evento.profissional && evento.profissional !== "-" && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {evento.profissional}
                  </span>
                )}
              </div>
              {evento.cid && (
                <p className="text-sm text-muted-foreground">
                  CID: {evento.cid}
                </p>
              )}
            </div>

            {(evento.descricao || evento.detalhes) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandido(!expandido)}
                className="shrink-0"
              >
                {expandido ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Conteúdo expandido */}
          {expandido && (evento.descricao || evento.detalhes) && (
            <div className="mt-4 pt-4 border-t space-y-3">
              {evento.descricao && (
                <p className="text-sm text-muted-foreground">{evento.descricao}</p>
              )}
              {evento.resultado && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">Resultado: </span>
                    <span className="text-sm text-muted-foreground">{evento.resultado}</span>
                  </div>
                </div>
              )}
              {evento.detalhes && evento.detalhes.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {evento.detalhes.map((detalhe, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium">{detalhe.label}: </span>
                      <span className="text-muted-foreground">{detalhe.valor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function LinhaDoTempo({ eventos }: LinhaDoTempoProps) {
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")

  // Filtrar eventos
  const eventosFiltrados = eventos.filter(evento => {
    if (filtroTipo === "todos") return true
    return evento.tipo === filtroTipo
  })

  // Tipos únicos presentes nos eventos
  const tiposPresentes = Array.from(new Set(eventos.map(e => e.tipo)))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Linha do Tempo
        </CardTitle>
        <CardDescription>
          Historico completo de atendimentos e eventos assistenciais
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="mb-6">
          <Tabs value={filtroTipo} onValueChange={setFiltroTipo}>
            <TabsList className="h-auto flex-wrap gap-1 bg-muted p-1">
              <TabsTrigger 
                value="todos" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2"
              >
                Todos
              </TabsTrigger>
              {tiposPresentes.map(tipo => (
                <TabsTrigger 
                  key={tipo} 
                  value={tipo}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2"
                >
                  {configEvento[tipo].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Timeline */}
        {eventosFiltrados.length > 0 ? (
          <div className="space-y-0">
            {eventosFiltrados.map((evento, index) => (
              <EventoCard 
                key={evento.id} 
                evento={evento} 
                isLast={index === eventosFiltrados.length - 1} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum evento encontrado para o filtro selecionado
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export type { EventoTimeline, TipoEvento }
