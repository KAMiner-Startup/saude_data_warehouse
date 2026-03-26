"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Save, Globe, Shield, FileText } from "lucide-react"

const ADMIN_COLOR = "oklch(0.50 0.14 280)"
const ADMIN_BG = "oklch(0.50 0.14 280 / 0.08)"

export default function ConfiguracoesPage() {
  const [nomeMunicipio, setNomeMunicipio] = useState("Armação dos Búzios")
  const [nomeSecretaria, setNomeSecretaria] = useState("Secretaria Municipal de Saúde")
  const [cnsMunicipio, setCnsMunicipio] = useState("330045")
  const [versaoSistema] = useState("1.0.0")
  const [modoManutencao, setModoManutencao] = useState(false)
  const [logAuditoria, setLogAuditoria] = useState(true)
  const [retencaoDados, setRetencaoDados] = useState(12)
  const [sessaoExpira, setSessaoExpira] = useState(480)
  const [cpfObrigatorio, setCpfObrigatorio] = useState(true)
  const [cnsObrigatorio, setCnsObrigatorio] = useState(true)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Parâmetros Gerais</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configurações gerais do sistema Saúde Búzios
        </p>
      </div>

      {/* Identificação do município */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
              <Globe className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
            </div>
            Identificação do Município
          </CardTitle>
          <CardDescription className="text-[13px]">Dados institucionais utilizados em relatórios e notificações</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[13px]">Nome do município</Label>
            <Input className="rounded-xl text-[13px]" value={nomeMunicipio} onChange={(e) => setNomeMunicipio(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px]">Código IBGE</Label>
            <Input className="rounded-xl text-[13px]" value={cnsMunicipio} onChange={(e) => setCnsMunicipio(e.target.value)} />
          </div>
          <div className="col-span-full space-y-1.5">
            <Label className="text-[13px]">Nome da Secretaria</Label>
            <Input className="rounded-xl text-[13px]" value={nomeSecretaria} onChange={(e) => setNomeSecretaria(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px]">Versão do sistema</Label>
            <Input className="rounded-xl text-[13px]" value={versaoSistema} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
              <Shield className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
            </div>
            Segurança e Sessão
          </CardTitle>
          <CardDescription className="text-[13px]">Controle de acesso e políticas de segurança</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-[13px] font-semibold text-foreground">Modo de manutenção</p>
              <p className="text-[12px] text-muted-foreground">Bloqueia o acesso de todos os usuários não-administradores</p>
            </div>
            <Switch checked={modoManutencao} onCheckedChange={setModoManutencao} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-[13px] font-semibold text-foreground">Log de auditoria ativo</p>
              <p className="text-[12px] text-muted-foreground">Registra todas as ações dos usuários no sistema</p>
            </div>
            <Switch checked={logAuditoria} onCheckedChange={setLogAuditoria} />
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl border border-border">
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">Expirar sessão inativa após</p>
              <p className="text-[12px] text-muted-foreground">Tempo em minutos sem atividade antes do logout automático</p>
            </div>
            <div className="flex items-center gap-2">
              <Input type="number" min={30} max={1440} value={sessaoExpira} onChange={(e) => setSessaoExpira(Number(e.target.value))} className="w-20 h-8 text-center text-[13px] rounded-xl" />
              <span className="text-[13px] text-muted-foreground">min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados e conformidade */}
      <Card className="rounded-[20px] border-none" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: ADMIN_BG }}>
              <FileText className="w-3.5 h-3.5" style={{ color: ADMIN_COLOR }} strokeWidth={1.25} />
            </div>
            Dados e Conformidade
          </CardTitle>
          <CardDescription className="text-[13px]">Campos obrigatórios e políticas de retenção de dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-[13px] font-semibold text-foreground">CPF obrigatório no cadastro de paciente</p>
              <p className="text-[12px] text-muted-foreground">Impede o cadastro de pacientes sem CPF informado</p>
            </div>
            <Switch checked={cpfObrigatorio} onCheckedChange={setCpfObrigatorio} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-[13px] font-semibold text-foreground">CNS obrigatório no cadastro de paciente</p>
              <p className="text-[12px] text-muted-foreground">Impede o cadastro de pacientes sem Cartão Nacional de Saúde</p>
            </div>
            <Switch checked={cnsObrigatorio} onCheckedChange={setCnsObrigatorio} />
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl border border-border">
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">Retenção do histórico de movimentações</p>
              <p className="text-[12px] text-muted-foreground">Por quantos meses os registros são mantidos no sistema</p>
            </div>
            <div className="flex items-center gap-2">
              <Input type="number" min={3} max={120} value={retencaoDados} onChange={(e) => setRetencaoDados(Number(e.target.value))} className="w-20 h-8 text-center text-[13px] rounded-xl" />
              <span className="text-[13px] text-muted-foreground">meses</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="rounded-xl text-[13px] text-white px-6" style={{ background: ADMIN_COLOR }}>
          <Save className="mr-2 h-4 w-4" strokeWidth={1.5} /> Salvar parâmetros
        </Button>
      </div>
    </div>
  )
}
