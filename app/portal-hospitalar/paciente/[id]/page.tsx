"use client"

import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Activity,
  Pill,
  Stethoscope,
  FileText,
  AlertTriangle,
  Heart,
  Droplets,
  Scale,
  Ruler,
  FlaskConical,
  Syringe,
  MessageSquare,
  Bell,
  ClipboardList,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LinhaDoTempo } from "@/components/linha-do-tempo"
import { pacientesData, timelineData } from "./dados-mockados"

// Cores da classificação de risco (triagem Manchester)
const corTriagem: Record<string, { bg: string; text: string; label: string }> = {
  vermelho: { bg: "bg-red-100", text: "text-red-700", label: "Vermelho - Emergência" },
  laranja: { bg: "bg-orange-100", text: "text-orange-700", label: "Laranja - Muito Urgente" },
  amarelo: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Amarelo - Urgente" },
  verde: { bg: "bg-green-100", text: "text-green-700", label: "Verde - Pouco Urgente" },
  azul: { bg: "bg-blue-100", text: "text-blue-700", label: "Azul - Não Urgente" },
}

// Cores da prioridade dos lembretes
const corPrioridade: Record<string, { dot: string; label: string }> = {
  alta: { dot: "bg-red-500", label: "Alta" },
  media: { dot: "bg-yellow-500", label: "Média" },
  baixa: { dot: "bg-green-500", label: "Baixa" },
}

// Cores do status dos exames
const corStatusExame: Record<string, { bg: string; text: string }> = {
  normal: { bg: "bg-green-50", text: "text-green-700" },
  alterado: { bg: "bg-yellow-50", text: "text-yellow-700" },
  critico: { bg: "bg-red-50", text: "text-red-700" },
}

export default function PacientePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const paciente = pacientesData[id]

  if (!paciente) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Paciente não encontrado</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/portal-hospitalar/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Navegação */}
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Button>

      {/* Cabeçalho do Paciente */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="p-4 md:p-6">
          {/* Nome e Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-foreground">{paciente.nome}</h1>
                {paciente.alertasAtivos > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {paciente.alertasAtivos} alerta{paciente.alertasAtivos > 1 ? "s" : ""} ativo{paciente.alertasAtivos > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <div className="space-y-0.5 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">{paciente.dataNascimento}</span> ({paciente.idade} anos) - {paciente.sexo}
                </p>
                <p>
                  Mae: <span className="font-medium text-foreground">{paciente.nomeMae}</span>
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Grid de Informações */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">CPF</p>
              <p className="text-sm font-medium">{paciente.cpf}</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">CNS</p>
              <p className="text-sm font-medium">{paciente.cns}</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Telefone</p>
              <p className="text-sm font-medium">{paciente.telefone}</p>
            </div>

            <div className="space-y-0.5 col-span-2 lg:col-span-3">
              <p className="text-xs text-muted-foreground">Endereco</p>
              <p className="text-sm font-medium">{paciente.endereco}</p>
            </div>

            <div className="space-y-0.5 col-span-2 md:col-span-2 lg:col-span-3">
              <p className="text-xs text-muted-foreground">Unidade de Referencia</p>
              <p className="text-sm font-medium">{paciente.unidadeReferencia}</p>
            </div>

            <div className="space-y-0.5 col-span-2 lg:col-span-3">
              <p className="text-xs text-muted-foreground">Equipe</p>
              <p className="text-sm font-medium">{paciente.equipeReferencia}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Triagem (RF-FE-02.11) - exibe apenas quando existir */}
      {paciente.triagem && (
        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" strokeWidth={1.25} />
              Última Triagem
            </CardTitle>
            <CardDescription>Dados da classificação de risco - {paciente.triagem.data}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${corTriagem[paciente.triagem.classificacao].bg} ${corTriagem[paciente.triagem.classificacao].text}`}>
                  {corTriagem[paciente.triagem.classificacao].label}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Queixa principal</p>
                <p className="text-sm font-medium">{paciente.triagem.queixaPrincipal}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Pressão Arterial</p>
                  <p className="text-sm font-semibold">{paciente.triagem.pressaoArterial}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Temperatura</p>
                  <p className="text-sm font-semibold">{paciente.triagem.temperatura}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Freq. Cardíaca</p>
                  <p className="text-sm font-semibold">{paciente.triagem.frequenciaCardiaca}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Saturação</p>
                  <p className="text-sm font-semibold">{paciente.triagem.saturacao}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lembretes Clínicos (RF-FE-02.10) */}
      {paciente.lembretesClinicas.length > 0 && (
        <Card className="rounded-[20px] border-none border-l-4" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" strokeWidth={1.25} />
              Lembretes Clínicos
            </CardTitle>
            <CardDescription>Alertas e observações associadas ao paciente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paciente.lembretesClinicas.map((lembrete, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${corPrioridade[lembrete.prioridade].dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{lembrete.descricao}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{lembrete.data}</span>
                      <Badge variant="outline" className="text-xs capitalize">{lembrete.tipo}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de Indicadores - Sinais Vitais (RF-FE-02.05 - com glicemia) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Pressão Arterial", valor: paciente.sinaisVitais.pressaoArterial, sub: "Última aferição", Icon: Heart, color: "text-red-500", bg: "bg-red-50" },
          { label: "Freq. Cardíaca", valor: paciente.sinaisVitais.frequenciaCardiaca, sub: "Última aferição", Icon: Activity, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Glicemia", valor: paciente.sinaisVitais.glicemia, sub: "Última aferição", Icon: Droplets, color: "text-violet-500", bg: "bg-violet-50" },
          { label: "Peso", valor: paciente.sinaisVitais.peso, sub: "Última aferição", Icon: Scale, color: "text-primary", bg: "bg-primary/8" },
          { label: "IMC", valor: paciente.sinaisVitais.imc, sub: `Altura: ${paciente.sinaisVitais.altura}`, Icon: Ruler, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map(({ label, valor, sub, Icon, color, bg }) => (
          <Card key={label} className="rounded-[20px] border-none overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="px-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${color}`} strokeWidth={1.25} />
                </div>
              </div>
              <p className={`vital-value text-[1.5rem] leading-none ${color}`}>{valor}</p>
              <p className="text-[11px] text-muted-foreground mt-2">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Condições Ativas (RF-FE-02.01 - com CID) e Alergias (RF-FE-02.04) */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" strokeWidth={1.25} />
              Condições Ativas
            </CardTitle>
            <CardDescription>Diagnósticos e condições de saúde atuais</CardDescription>
          </CardHeader>
          <CardContent>
            {paciente.condicoesAtivas.length > 0 ? (
              <div className="space-y-2">
                {paciente.condicoesAtivas.map((condicao, index) => (
                  <div key={index} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-primary/5">
                    <span className="text-sm font-medium text-foreground">{condicao.nome}</span>
                    <Badge variant="outline" className="text-xs font-mono shrink-0">{condicao.cid}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma condição ativa registrada</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" strokeWidth={1.25} />
              Alergias
            </CardTitle>
            <CardDescription>Alergias conhecidas do paciente</CardDescription>
          </CardHeader>
          <CardContent>
            {paciente.alergias.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {paciente.alergias.map((alergia, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-destructive/10 text-destructive">
                    {alergia}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma alergia registrada</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Queixas Referidas (RF-FE-02.07) */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" strokeWidth={1.25} />
            Queixas Referidas pelo Paciente
          </CardTitle>
          <CardDescription>Problemas e queixas relatados durante atendimentos</CardDescription>
        </CardHeader>
        <CardContent>
          {paciente.queixasReferidas.length > 0 ? (
            <div className="space-y-3">
              {paciente.queixasReferidas.map((queixa, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{queixa.queixa}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {queixa.data} - {queixa.profissional}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma queixa registrada</p>
          )}
        </CardContent>
      </Card>

      {/* Medicamentos em Uso (RF-FE-02.03) */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary" strokeWidth={1.25} />
            Medicamentos em Uso
          </CardTitle>
          <CardDescription>Prescrições ativas do paciente</CardDescription>
        </CardHeader>
        <CardContent>
          {paciente.medicamentosUso.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Medicamento</th>
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Dosagem</th>
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Frequência</th>
                  </tr>
                </thead>
                <tbody>
                  {paciente.medicamentosUso.map((med, index) => (
                    <tr key={index} className="border-b border-border/30 last:border-0">
                      <td className="py-3 text-sm font-semibold text-slate-900">{med.nome}</td>
                      <td className="py-3 text-sm text-muted-foreground vital-value">{med.dosagem}</td>
                      <td className="py-3 text-sm text-muted-foreground">{med.frequencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum medicamento em uso</p>
          )}
        </CardContent>
      </Card>

      {/* Exames Recentes (RF-FE-02.02) */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-primary" strokeWidth={1.25} />
            Exames Recentes
          </CardTitle>
          <CardDescription>Resultados dos últimos exames realizados</CardDescription>
        </CardHeader>
        <CardContent>
          {paciente.examesRecentes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Exame</th>
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Data</th>
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Resultado</th>
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paciente.examesRecentes.map((exame, index) => (
                    <tr key={index} className="border-b border-border/30 last:border-0">
                      <td className="py-3 text-sm font-semibold text-slate-900">{exame.nome}</td>
                      <td className="py-3 text-sm text-muted-foreground">{exame.data}</td>
                      <td className="py-3 text-sm text-muted-foreground vital-value">{exame.resultado}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${corStatusExame[exame.status].bg} ${corStatusExame[exame.status].text}`}>
                          {exame.status === "critico" ? "Crítico" : exame.status === "alterado" ? "Alterado" : "Normal"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum exame recente registrado</p>
          )}
        </CardContent>
      </Card>

      {/* Exames Pendentes */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" strokeWidth={1.25} />
            Exames Pendentes
          </CardTitle>
          <CardDescription>Exames aguardando realização</CardDescription>
        </CardHeader>
        <CardContent>
          {paciente.examesPendentes.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {paciente.examesPendentes.map((exame, index) => (
                <li key={index} className="flex items-center gap-2 text-sm bg-amber-50 text-amber-700 px-3.5 py-2 rounded-full font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {exame}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum exame pendente</p>
          )}
        </CardContent>
      </Card>

      {/* Vacinação (RF-FE-02.06) */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Syringe className="w-4 h-4 text-primary" strokeWidth={1.25} />
            Vacinação
          </CardTitle>
          <CardDescription>Histórico vacinal do paciente</CardDescription>
        </CardHeader>
        <CardContent>
          {paciente.vacinacao.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Vacina</th>
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Data</th>
                    <th className="pb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Dose</th>
                  </tr>
                </thead>
                <tbody>
                  {paciente.vacinacao.map((vacina, index) => (
                    <tr key={index} className="border-b border-border/30 last:border-0">
                      <td className="py-3 text-sm font-semibold text-slate-900">{vacina.nome}</td>
                      <td className="py-3 text-sm text-muted-foreground">{vacina.data}</td>
                      <td className="py-3 text-sm text-muted-foreground">{vacina.dose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum registro vacinal disponível</p>
          )}
        </CardContent>
      </Card>

      {/* Linha do Tempo (RF-FE-02.08 e RF-FE-02.09) */}
      <LinhaDoTempo eventos={timelineData[id] || []} />
    </div>
  )
}
