"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Bell, Save, AlertCircle, Clock, HeartPulse, Building2, Users } from "lucide-react"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"

export default function ConfiguracaoAlertasPage() {
  const [regras, setRegras] = useState({
    alta: true,
    internacao: true,
    evasao: true,
    obito: true,
    resultado_critico: true,
  })

  const [prazos, setPrazos] = useState({
    alta: 24,
    internacao: 12,
    evasao: 6,
    obito: 48,
    resultado_critico: 4,
  })

  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSistema, setNotifSistema] = useState(true)
  const [diasSemResposta, setDiasSemResposta] = useState(2)
  const [alertaGestor, setAlertaGestor] = useState(true)

  const tiposAlerta = [
    { key: "alta" as const, label: "Alta hospitalar", desc: "Quando um paciente recebe alta do hospital", cor: "oklch(0.55 0.18 160)" },
    { key: "internacao" as const, label: "Internação", desc: "Quando um paciente da APS é internado", cor: "oklch(0.38 0.19 264)" },
    { key: "evasao" as const, label: "Evasão", desc: "Quando um paciente deixa o hospital sem alta formal", cor: "oklch(0.75 0.15 75)" },
    { key: "obito" as const, label: "Óbito", desc: "Quando um óbito hospitalar é registrado", cor: "oklch(0.54 0.22 27)" },
    { key: "resultado_critico" as const, label: "Resultado crítico", desc: "Resultados de exames com valores críticos", cor: "oklch(0.68 0.15 85)" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Configuração de Alertas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Defina quais eventos disparam alertas, prazos de resposta e notificações
        </p>
      </div>

      {/* Tipos de alertas */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
              <Bell className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
            </div>
            Tipos de Eventos
          </CardTitle>
          <CardDescription className="text-[13px]">Ative ou desative quais movimentações geram alertas para a APS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tiposAlerta.map((tipo) => (
            <div key={tipo.key} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tipo.cor }} />
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{tipo.label}</p>
                  <p className="text-[12px] text-muted-foreground">{tipo.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-[12px] text-muted-foreground">Prazo:</span>
                  <Input
                    type="number"
                    min={1}
                    max={168}
                    value={prazos[tipo.key]}
                    onChange={(e) => setPrazos(p => ({ ...p, [tipo.key]: Number(e.target.value) }))}
                    className="w-16 h-7 text-center text-[12px] rounded-lg"
                    disabled={!regras[tipo.key]}
                  />
                  <span className="text-[12px] text-muted-foreground">h</span>
                </div>
                <Switch
                  checked={regras[tipo.key]}
                  onCheckedChange={(v) => setRegras(r => ({ ...r, [tipo.key]: v }))}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configurações de escalonamento */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
              <AlertCircle className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
            </div>
            Escalonamento e Cobrança
          </CardTitle>
          <CardDescription className="text-[13px]">Configure quando o gestor deve ser notificado sobre alertas não respondidos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-[13px] font-semibold text-foreground">Alertar gestor por alertas sem resposta</p>
              <p className="text-[12px] text-muted-foreground">Notifica automaticamente o gestor quando uma UBS não responde</p>
            </div>
            <Switch checked={alertaGestor} onCheckedChange={setAlertaGestor} />
          </div>
          {alertaGestor && (
            <div className="flex items-center gap-3 pl-4">
              <Label className="text-[13px] text-muted-foreground whitespace-nowrap">Notificar após</Label>
              <Input
                type="number"
                min={1}
                max={30}
                value={diasSemResposta}
                onChange={(e) => setDiasSemResposta(Number(e.target.value))}
                className="w-16 h-8 text-center text-[13px] rounded-xl"
              />
              <Label className="text-[13px] text-muted-foreground">dia(s) sem resposta</Label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Canais de notificação */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
              <Bell className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
            </div>
            Canais de Notificação
          </CardTitle>
          <CardDescription className="text-[13px]">Como os profissionais devem ser notificados sobre novos alertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-[13px] font-semibold text-foreground">Notificação no sistema</p>
              <p className="text-[12px] text-muted-foreground">Exibe badge e popup dentro da plataforma</p>
            </div>
            <Switch checked={notifSistema} onCheckedChange={setNotifSistema} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-[13px] font-semibold text-foreground">Notificação por e-mail</p>
              <p className="text-[12px] text-muted-foreground">Envia e-mail para o profissional responsável pela UBS</p>
            </div>
            <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
          </div>
        </CardContent>
      </Card>

      {/* Vinculação hospitais → UBS */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
              <Building2 className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
            </div>
            Vinculação Hospital → UBS
          </CardTitle>
          <CardDescription className="text-[13px]">Defina quais hospitais enviam alertas para quais unidades de APS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { hospital: "Hospital Municipal de Búzios", ubs: ["UBS Centro", "UBS Manguinhos", "UBS Geribá", "UBS Ferradura", "UBS Armação"] },
              { hospital: "Hospital Regional Costa do Sol", ubs: ["UBS Ferradura", "UBS Armação"] },
            ].map((vinculo) => (
              <div key={vinculo.hospital} className="p-3 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                  <span className="text-[13px] font-semibold text-foreground">{vinculo.hospital}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {vinculo.ubs.map(u => (
                    <span key={u} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-emerald-50 text-emerald-700">
                      <HeartPulse className="w-2.5 h-2.5" strokeWidth={1.5} /> {u}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Salvar */}
      <div className="flex justify-end">
        <Button className="rounded-xl text-[13px] text-white px-6" style={{ background: ADMIN_COLOR }}>
          <Save className="mr-2 h-4 w-4" strokeWidth={1.5} /> Salvar configurações
        </Button>
      </div>
    </div>
  )
}
