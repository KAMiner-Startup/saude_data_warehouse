"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, ArrowLeft, Send, Search } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Mensagem {
  id: string
  texto: string
  hora: string
  enviada: boolean // true = minha mensagem
}

interface Contato {
  id: string
  nome: string
  perfil: string
  avatar?: string
  iniciais: string
  corAvatar: string
  online: boolean
  ultimaMensagem?: string
  ultimaHora?: string
  naoLidas?: number
  mensagens: Mensagem[]
}

// ─── Dados mockados ───────────────────────────────────────────────────────────

const contatosIniciais: Contato[] = [
  {
    id: "1",
    nome: "Dra. Ana Paula",
    perfil: "Médica — UBS Centro",
    iniciais: "AP",
    corAvatar: "bg-violet-100 text-violet-700",
    online: true,
    ultimaMensagem: "Pode verificar o prontuário da paciente?",
    ultimaHora: "09:42",
    naoLidas: 2,
    mensagens: [
      { id: "m1", texto: "Bom dia! Pode verificar o prontuário da paciente Maria Silva?", hora: "09:40", enviada: false },
      { id: "m2", texto: "Ela teve alta ontem e preciso do relatório.", hora: "09:41", enviada: false },
      { id: "m3", texto: "Pode verificar o prontuário da paciente?", hora: "09:42", enviada: false },
    ],
  },
  {
    id: "2",
    nome: "Enf. Carlos Mendes",
    perfil: "Enfermeiro — Hospital Municipal",
    iniciais: "CM",
    corAvatar: "bg-emerald-100 text-emerald-700",
    online: true,
    ultimaMensagem: "Certo, vou encaminhar o laudo.",
    ultimaHora: "08:15",
    naoLidas: 0,
    mensagens: [
      { id: "m1", texto: "Bom dia! O paciente do leito 4 está estável.", hora: "08:10", enviada: false },
      { id: "m2", texto: "Ótimo, obrigado pelo update.", hora: "08:12", enviada: true },
      { id: "m3", texto: "Certo, vou encaminhar o laudo.", hora: "08:15", enviada: false },
    ],
  },
  {
    id: "3",
    nome: "Dr. Roberto Lima",
    perfil: "Médico — UPA Búzios",
    iniciais: "RL",
    corAvatar: "bg-blue-100 text-blue-700",
    online: false,
    ultimaMensagem: "Ok, já registrei no sistema.",
    ultimaHora: "Ontem",
    naoLidas: 0,
    mensagens: [
      { id: "m1", texto: "Preciso do histórico do José Costa para interconsulta.", hora: "14:00", enviada: false },
      { id: "m2", texto: "Estou enviando agora.", hora: "14:05", enviada: true },
      { id: "m3", texto: "Ok, já registrei no sistema.", hora: "14:10", enviada: false },
    ],
  },
  // Contatos sem conversa
  {
    id: "4",
    nome: "Ft. Marina Costa",
    perfil: "Fisioterapeuta — Centro de Reabilitação",
    iniciais: "MC",
    corAvatar: "bg-amber-100 text-amber-700",
    online: true,
    mensagens: [],
  },
  {
    id: "5",
    nome: "Dra. Fernanda Alves",
    perfil: "Oncologista — Hospital Regional",
    iniciais: "FA",
    corAvatar: "bg-rose-100 text-rose-700",
    online: false,
    mensagens: [],
  },
  {
    id: "6",
    nome: "Enf. Carla Oliveira",
    perfil: "Enfermeira — UBS Geriba",
    iniciais: "CO",
    corAvatar: "bg-teal-100 text-teal-700",
    online: false,
    mensagens: [],
  },
]

// ─── Sub-componente: Avatar ───────────────────────────────────────────────────

function Avatar({ contato, size = "md" }: { contato: Contato; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-8 h-8 text-[11px]" : "w-10 h-10 text-[13px]"
  return (
    <div className="relative flex-shrink-0">
      <div className={cn("rounded-full flex items-center justify-center font-semibold", dim, contato.corAvatar)}>
        {contato.iniciais}
      </div>
      {contato.online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-card rounded-full" />
      )}
    </div>
  )
}

// ─── Sub-componente: Lista de contatos ───────────────────────────────────────

function ListaContatos({
  contatos,
  onSelecionar,
  busca,
  onBusca,
}: {
  contatos: Contato[]
  onSelecionar: (c: Contato) => void
  busca: string
  onBusca: (v: string) => void
}) {
  const comConversa = contatos.filter((c) => c.mensagens.length > 0)
  const semConversa = contatos.filter((c) => c.mensagens.length === 0)

  const filtrar = (lista: Contato[]) =>
    busca.trim()
      ? lista.filter(
        (c) =>
          c.nome.toLowerCase().includes(busca.toLowerCase()) ||
          c.perfil.toLowerCase().includes(busca.toLowerCase())
      )
      : lista

  return (
    <div className="flex flex-col h-full">
      {/* Busca */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.25} />
          <Input
            placeholder="Buscar contato..."
            value={busca}
            onChange={(e) => onBusca(e.target.value)}
            className="pl-9 h-9 text-sm rounded-full border-none bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Com conversa */}
        {filtrar(comConversa).length > 0 && (
          <div>
            <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Conversas
            </p>
            {filtrar(comConversa).map((contato) => (
              <button
                key={contato.id}
                onClick={() => onSelecionar(contato)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <Avatar contato={contato} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 truncate">{contato.nome}</p>
                    <span className="text-[11px] text-muted-foreground ml-2 flex-shrink-0">{contato.ultimaHora}</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground truncate mt-0.5">{contato.ultimaMensagem}</p>
                </div>
                {(contato.naoLidas ?? 0) > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {contato.naoLidas}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Sem conversa */}
        {filtrar(semConversa).length > 0 && (
          <div>
            <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
              Outros contatos
            </p>
            {filtrar(semConversa).map((contato) => (
              <button
                key={contato.id}
                onClick={() => onSelecionar(contato)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <Avatar contato={contato} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{contato.nome}</p>
                  <p className="text-[12px] text-muted-foreground truncate mt-0.5">{contato.perfil}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {filtrar(comConversa).length === 0 && filtrar(semConversa).length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">Nenhum contato encontrado.</p>
        )}
      </div>
    </div>
  )
}

// ─── Sub-componente: Tela de chat ─────────────────────────────────────────────

function TelaChat({
  contato,
  onVoltar,
  onFechar,
}: {
  contato: Contato
  onVoltar: () => void
  onFechar: () => void
}) {
  const [mensagens, setMensagens] = useState<Mensagem[]>(contato.mensagens)
  const [texto, setTexto] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  const enviar = () => {
    const t = texto.trim()
    if (!t) return
    const nova: Mensagem = {
      id: `msg-${Date.now()}`,
      texto: t,
      hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      enviada: true,
    }
    setMensagens((prev) => [...prev, nova])
    setTexto("")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Topo do chat */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-8 h-8 hover:bg-muted/80 flex-shrink-0"
          onClick={onVoltar}
          aria-label="Voltar para contatos"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" strokeWidth={1.25} />
        </Button>
        <Avatar contato={contato} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{contato.nome}</p>
          <p className="text-[11px] text-muted-foreground">{contato.online ? "Online agora" : "Offline"}</p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {mensagens.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold", contato.corAvatar)}>
              {contato.iniciais}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{contato.nome}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{contato.perfil}</p>
              <p className="text-[12px] text-muted-foreground mt-3">Nenhuma mensagem ainda. Diga olá!</p>
            </div>
          </div>
        )}
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex", msg.enviada ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[75%] px-3.5 py-2.5 rounded-[16px] text-[13px] leading-relaxed",
                msg.enviada
                  ? "bg-primary text-primary-foreground rounded-br-[4px]"
                  : "bg-muted text-foreground rounded-bl-[4px]"
              )}
            >
              <p>{msg.texto}</p>
              <p className={cn("text-[10px] mt-1 text-right", msg.enviada ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {msg.hora}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input envio */}
      <div className="px-4 py-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Digite uma mensagem..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && enviar()}
            className="flex-1 h-9 text-sm rounded-full border-none bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <Button
            size="icon"
            className="w-9 h-9 rounded-full flex-shrink-0"
            onClick={enviar}
            disabled={!texto.trim()}
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" strokeWidth={1.25} />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ChatDrawer() {
  const [aberto, setAberto] = useState(false)
  const [contatos] = useState<Contato[]>(contatosIniciais)
  const [contatoAtivo, setContatoAtivo] = useState<Contato | null>(null)
  const [busca, setBusca] = useState("")
  const drawerRef = useRef<HTMLDivElement>(null)

  const totalNaoLidas = contatos.reduce((acc, c) => acc + (c.naoLidas ?? 0), 0)

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    if (aberto) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [aberto])

  const fecharTudo = () => {
    setAberto(false)
    setContatoAtivo(null)
  }

  return (
    <>
      {/* Botão no header */}
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full hover:bg-muted/80 cursor-pointer"
        onClick={() => setAberto((v) => !v)}
        aria-label="Abrir chat"
      >
        <MessageCircle className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.25} />
        {totalNaoLidas > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold px-1">
            {totalNaoLidas}
          </span>
        )}
      </Button>

      {/* Overlay */}
      {aberto && (
        <div className="fixed inset-0 z-40 bg-black/10" aria-hidden="true" />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-0 right-0 h-full w-[360px] z-50 bg-card flex flex-col transition-transform duration-300 ease-out",
          aberto ? "translate-x-0" : "translate-x-full"
        )}
        style={{ boxShadow: "-8px 0 40px rgb(0 0 0 / 0.10)", borderRadius: "20px 0 0 20px" }}
      >
        {/* Header do drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div>
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">Mensagens</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {contatos.filter((c) => c.online).length} contato(s) online
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-8 h-8 hover:bg-muted/80"
            onClick={fecharTudo}
            aria-label="Fechar painel de mensagens"
          >
            <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.25} />
          </Button>
        </div>

        {/* Conteúdo: lista ou chat */}
        <div className="flex-1 overflow-hidden pt-3">
          {contatoAtivo ? (
            <TelaChat
              contato={contatoAtivo}
              onVoltar={() => setContatoAtivo(null)}
              onFechar={fecharTudo}
            />
          ) : (
            <ListaContatos
              contatos={contatos}
              onSelecionar={setContatoAtivo}
              busca={busca}
              onBusca={setBusca}
            />
          )}
        </div>
      </div>
    </>
  )
}
