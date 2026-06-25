'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  QrCode, Camera, Images, Download, MonitorPlay, ShieldCheck, Check,
  Play, Star, Sparkles, Clock, ChevronDown, Smartphone, ArrowRight,
  Gift, Lock, PartyPopper, Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft, ChevronRight,
} from 'lucide-react'

/* ════════════════════════════════════════════════════════════════
   ⬇️  TROQUE AQUI pelos seus links de checkout da Hotmart
   ════════════════════════════════════════════════════════════════ */
const CHECKOUT_STANDARD = 'https://pay.hotmart.com/N106442439E?off=zghijbpp&checkoutMode=10'
const CHECKOUT_PRO = 'https://pay.hotmart.com/N106442439E?off=di4pjz1e&checkoutMode=10'

/* Estatística editável do topo (troque pelo número real quando tiver) */
const EVENTOS_REGISTRADOS = '+1.200'

/* ─────────────────────────  Reveal on scroll  ───────────────────────── */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(28px)',
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-accent-dark mb-3">{children}</span>
)

/* ─────────── Carrossel (arrasta no celular, setas no PC) ─────────── */
function Carousel({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 380), behavior: 'smooth' })
  }
  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto px-4 sm:px-12 pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        type="button" onClick={() => scroll(-1)} aria-label="Anterior"
        className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-border shadow-md items-center justify-center text-primary hover:bg-background active:scale-95 transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button" onClick={() => scroll(1)} aria-label="Próximo"
        className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-border shadow-md items-center justify-center text-primary hover:bg-background active:scale-95 transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

/* ─────────────────────────────  Dados  ───────────────────────────── */
const EVENT_TYPES = ['Casamentos', 'Aniversários', '15 Anos', 'Formaturas', 'Chá de Bebê', 'Bodas', 'Corporativo', 'Confraternização']

const STEPS = [
  { icon: QrCode, t: 'Espalhe o QR Code', d: 'Coloque os QR Codes nas mesas, no convite ou num display. O convidado aponta a câmera, igual a um PIX.' },
  { icon: Camera, t: 'Os convidados enviam', d: 'Eles tiram e mandam a foto ali na hora, pelo navegador. Sem baixar app, sem login, sem grupo de WhatsApp.' },
  { icon: Images, t: 'Tudo cai no seu álbum', d: 'Cada foto aparece automaticamente numa galeria só sua. No dia seguinte, baixe tudo em alta qualidade.' },
]

const BENEFITS = [
  { icon: Smartphone, t: 'Funciona em qualquer celular', d: 'iPhone ou Android, direto pelo navegador. Nada pra instalar.' },
  { icon: Lock, t: 'Galeria privada e sua', d: 'Todas as fotos num lugar só. Você acessa, controla e decide.' },
  { icon: Download, t: 'Download em alta', d: 'Baixe todas as fotos com um clique, sem perder qualidade.' },
  { icon: Clock, t: 'Pronto em 2 minutos', d: 'Cria o álbum, gera o QR Code e já pode usar na festa.' },
  { icon: Images, t: 'Chega de “depois eu mando”', d: 'Sem caçar foto no grupo. Elas chegam sozinhas, na hora.' },
  { icon: ShieldCheck, t: 'Seguro por 1 ano', d: 'Fotos e vídeos guardados por 12 meses. Baixe quando quiser.' },
]

const TESTIMONIALS = [
  { name: 'Carolina M.', ev: 'Casamento · Out/2025', t: 'Recebi mais de 400 fotos dos convidados! Momentos que eu nunca teria visto. Chorei vendo cada uma.' },
  { name: 'Rafael e Bia', ev: 'Aniversário de 30 · Dez/2025', t: 'O telão com as fotos aparecendo ao vivo foi o ponto alto da festa. Todo mundo correu pra mandar.' },
  { name: 'Juliana S.', ev: 'Formatura · Jan/2026', t: 'Tava insegura antes de comprar, mas foi a melhor decisão. Os convidados mandaram MUITO mais do que eu esperava 😍' },
  { name: 'Mariana D.', ev: 'Chá de Bebê · Fev/2026', t: 'Revivo a festa toda vez que abro o álbum. São fotos de momentos que eu nem sabia que tinham acontecido 🥹' },
]

const FAQS = [
  { q: 'Precisa baixar algum aplicativo?', a: 'Não. Funciona direto pelo navegador do celular. Seus convidados escaneiam o QR Code e já enviam as fotos. Nenhum download.' },
  { q: 'Funciona em iPhone e Android?', a: 'Sim, em qualquer celular com câmera e navegador. Não importa a marca ou o modelo.' },
  { q: 'Serve para qualquer tipo de evento?', a: 'Sim. Casamentos, aniversários, 15 anos, formaturas, chás de bebê, confraternizações, eventos corporativos — qualquer festa onde os convidados vão tirar fotos.' },
  { q: 'Qual a diferença entre o Standard e o Pro?', a: 'O Pro inclui o slideshow ao vivo: as fotos enviadas pelos convidados aparecem em tempo real no telão do evento. É o efeito “uau” da festa. O Standard tem todo o resto, só sem a projeção ao vivo.' },
  { q: 'E se meus convidados não souberem usar?', a: 'É mais fácil que mandar foto no WhatsApp: escanear, tirar a foto e enviar. Sem cadastro. Até a vovó consegue.' },
  { q: 'Por quanto tempo as fotos ficam guardadas?', a: 'Por 1 ano, com segurança. Nesse período você baixa tudo quando quiser, em alta qualidade.' },
  { q: 'E se eu não gostar?', a: 'Você tem 7 dias de garantia. Se sentir que não é pra você, devolvemos 100% do valor, sem perguntas.' },
]

/* ─────────────────────────────  Página  ───────────────────────────── */
export default function SalesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="overflow-x-hidden pb-24 sm:pb-0">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative px-4 pt-12 pb-10 sm:pt-20 sm:pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/10 via-background to-background" />
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/8 border border-primary/15 rounded-full px-3 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Para toda festa que merece ser lembrada
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-serif text-[2rem] leading-[1.1] sm:text-5xl text-primary mb-5">
              As melhores fotos da sua festa estão no celular de quem você nunca vai conseguir cobrar.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-base sm:text-lg text-muted-dark leading-relaxed max-w-2xl mx-auto mb-7">
              O Cliquê reúne, num álbum só seu, as fotos que cada convidado tirou. Um QR Code na mesa e pronto —
              você acorda no dia seguinte com o evento inteiro visto por todos os olhos que estavam lá.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button href="#planos" size="lg" icon={<ArrowRight className="w-5 h-5" />} className="w-full sm:w-auto">
                Quero meu álbum agora
              </Button>
              <Button href="#como-funciona" variant="ghost" size="lg" className="w-full sm:w-auto">
                Ver como funciona
              </Button>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted">
              <div className="flex text-accent-dark">
                {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span>{EVENTOS_REGISTRADOS} eventos já registrados</span>
            </div>
          </Reveal>
        </div>

        {/* ─── VSL ─── */}
        <Reveal delay={120} className="max-w-3xl mx-auto mt-10 sm:mt-14">
          <div className="relative w-full max-w-[340px] mx-auto rounded-3xl overflow-hidden border border-border shadow-lg bg-black" style={{ aspectRatio: '9 / 16' }}>
            <iframe
              src="https://player.vimeo.com/video/1203965207?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="CLIQUÊ"
            />
          </div>
        </Reveal>

        {/* tipos de evento */}
        <Reveal delay={200} className="max-w-3xl mx-auto mt-8">
          <p className="text-center text-xs uppercase tracking-wider text-muted mb-3">Funciona para</p>
          <div className="flex flex-wrap justify-center gap-2">
            {EVENT_TYPES.map((e) => (
              <span key={e} className="text-xs sm:text-sm text-muted-dark bg-surface border border-border rounded-full px-3 py-1.5">{e}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════════ DOR ═══════════════ */}
      <section className="px-4 py-12 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal><Eyebrow>A real</Eyebrow></Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-2xl sm:text-4xl text-primary leading-tight mb-6">
              O fotógrafo registra o palco. A festa de verdade acontece nas mesas, na pista e nos cantos onde a câmera dele não chegou.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <div className="text-left text-muted-dark leading-relaxed space-y-4 text-[15px] sm:text-base">
              <p>Aquele abraço apertado, a risada no meio da dança, o detalhe que só um convidado de um cantinho viu. Tudo isso acontece — e tudo isso fica espalhado em dezenas de celulares.</p>
              <p>Uns mandam no grupo e some no meio de 300 mensagens. Outros falam que enviam depois. E nunca enviam.</p>
              <p className="text-primary font-medium">E aí momentos que aconteceram viram momentos que nunca existiram.</p>
              <p>Não precisa ser assim. Existe um jeito simples de garantir que nenhum desses momentos se perca.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ COMO FUNCIONA ═══════════════ */}
      <section id="como-funciona" className="px-4 py-12 sm:py-20 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-10 sm:mb-14">
            <Eyebrow>Na prática</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-4xl text-primary">Em 3 passos, cada convidado vira parte da sua história</h2>
            <p className="text-muted mt-3 text-sm sm:text-base">Sem app pra baixar, sem complicação.</p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 120}>
                <div className="bg-surface border border-border rounded-3xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-serif text-3xl text-accent">{i + 1}</span>
                    <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><s.icon className="w-5 h-5" /></span>
                  </div>
                  <h3 className="font-medium text-primary text-lg mb-1.5">{s.t}</h3>
                  <p className="text-sm text-muted-dark leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SLIDESHOW (vende o Pro) ═══════════════ */}
      <section className="px-4 py-12 sm:py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-accent-light mb-3">
              <MonitorPlay className="w-4 h-4" /> Exclusivo do plano Pro
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-2xl sm:text-4xl leading-tight mb-5">O momento em que a festa inteira para pra olhar o telão</h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/80 leading-relaxed max-w-xl mx-auto">
              No plano Pro, as fotos que os convidados enviam aparecem <strong className="text-white">ao vivo</strong> numa tela ou projetor do evento.
              A festa começa a se alimentar sozinha: cada um quer ver a sua foto na telona — e manda mais e mais.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto">
              {[Camera, MonitorPlay, Heart].map((Icon, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-accent-light" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ BENEFÍCIOS ═══════════════ */}
      <section className="px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-10">
            <Eyebrow>Benefícios</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-4xl text-primary">Tudo que você precisa, nada que atrapalha</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.t} delay={(i % 3) * 100}>
                <div className="bg-surface border border-border rounded-2xl p-5 h-full">
                  <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent-dark flex items-center justify-center mb-3"><b.icon className="w-5 h-5" /></span>
                  <h3 className="font-medium text-primary mb-1">{b.t}</h3>
                  <p className="text-sm text-muted-dark leading-relaxed">{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BÔNUS — CARROSSEL ═══════════════ */}
      <section className="py-12 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal className="text-center mb-8">
            <Eyebrow>Incluso em todos os planos</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-4xl text-primary">Bônus pra deixar sua festa ainda mais especial</h2>
            <p className="text-muted mt-3 text-sm sm:text-base">+50 modelos de cards de QR Code e desafios de fotos, prontos pra imprimir.</p>
          </Reveal>
        </div>
        {/* ════════════════════════════════════════════════════════
            CARROSSEL DE BÔNUS — troque cada bloco placeholder por:
            <img src="/bonus/card-1.webp" alt="Modelo de card" class="w-full h-full object-cover" />
            ════════════════════════════════════════════════════════ */}
        <Reveal>
          <Carousel>
            {['/bonus/1.webp', '/bonus/2.webp', '/bonus/3.webp', '/bonus/4.webp', '/bonus/5.webp', '/bonus/6.webp', '/bonus/7.webp'].map((src, i) => (
              <div key={i} className="snap-center shrink-0 w-44 sm:w-52 aspect-[3/4] rounded-2xl border border-border overflow-hidden bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Modelo de card ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Carousel>
        </Reveal>
        <div className="max-w-4xl mx-auto px-4 mt-6 grid sm:grid-cols-2 gap-4">
          <Reveal className="bg-background border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2 text-primary"><Gift className="w-5 h-5" /><span className="font-medium">Modelos de cards para QR Code</span></div>
            <p className="text-sm text-muted-dark">Templates editáveis e elegantes pra imprimir e espalhar nas mesas e convites.</p>
          </Reveal>
          <Reveal delay={100} className="bg-background border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2 text-primary"><PartyPopper className="w-5 h-5" /><span className="font-medium">Desafios de fotos para convidados</span></div>
            <p className="text-sm text-muted-dark">Cards com desafios divertidos que incentivam os convidados a capturar momentos únicos.</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ PROVA SOCIAL — WHATSAPP ═══════════════ */}
      <section className="px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-8">
            <Eyebrow>Quem usou, aprovou</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-4xl text-primary">O que chega no nosso WhatsApp depois da festa</h2>
          </Reveal>
        </div>
        {

        }
        <Reveal>
          <Carousel className="max-w-4xl mx-auto">
            {['/prints/PROVASOCIAL01.png', '/prints/PROVASOCIAL02.png', '/prints/PROVASOCIAL03.png', '/prints/PROVASOCIAL04.png', '/prints/PROVASOCIAL05.png', '/prints/PROVASOCIAL06.png'].map((src, i) => (
              <div key={i} className="snap-center shrink-0 w-60 rounded-2xl border border-border overflow-hidden bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Depoimento ${i + 1}`} className="w-full h-auto" />
              </div>
            ))}
          </Carousel>
        </Reveal>

        {/* depoimentos em texto (troque pelos reais) */}
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4 mt-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 100}>
              <div className="bg-surface border border-border rounded-2xl p-5 h-full">
                <div className="flex text-accent-dark mb-2">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}</div>
                <p className="text-sm text-muted-dark leading-relaxed mb-3">“{t.t}”</p>
                <p className="text-sm font-medium text-primary">{t.name}</p>
                <p className="text-xs text-muted">{t.ev}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════ PLANOS ═══════════════ */}
      <section id="planos" className="px-4 py-12 sm:py-20 bg-surface border-y border-border scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-3">
            <Eyebrow>Planos</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-4xl text-primary">Escolha o plano ideal pro seu evento</h2>
            <p className="text-muted mt-3 text-sm sm:text-base">Pagamento único. Sem mensalidade, sem pegadinha.</p>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-5 mt-8 items-stretch">
            {/* STANDARD */}
            <Reveal>
              <div className="bg-background border border-border rounded-3xl p-6 sm:p-7 h-full flex flex-col">
                <h3 className="font-serif text-2xl text-primary">Standard</h3>
                <p className="text-sm text-muted mt-1">O essencial pra não perder nenhuma foto.</p>
                <div className="mt-5">
                  <span className="inline-block text-xs font-semibold text-success bg-success/10 rounded-full px-2.5 py-1 mb-2">62% OFF</span>
                  <div className="flex items-end gap-2">
                    <span className="text-sm text-muted line-through">R$ 97</span>
                    <span className="font-serif text-4xl text-primary">R$ 37</span>
                  </div>
                  <p className="text-xs text-muted mt-1">pagamento único</p>
                </div>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {['Galeria privada ilimitada', 'QR Codes personalizados', 'Upload direto pelo celular', 'Download em alta qualidade', 'Funciona em qualquer celular', 'Suporte por WhatsApp', '+50 modelos de card (bônus)', 'Desafios de fotos (bônus)'].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-dark">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button href={CHECKOUT_STANDARD} target="_blank" variant="outline" size="lg" className="w-full mt-6">
                  Começar com o Standard
                </Button>
              </div>
            </Reveal>

            {/* PRO (destacado) */}
            <Reveal delay={120}>
              <div className="relative bg-primary text-white rounded-3xl p-6 sm:p-7 h-full flex flex-col shadow-xl ring-2 ring-accent lg:scale-[1.03]">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary-dark text-xs font-bold tracking-wide uppercase rounded-full px-4 py-1 whitespace-nowrap shadow">
                  ⭐ Mais escolhido
                </span>
                <h3 className="font-serif text-2xl">Pro</h3>
                <p className="text-sm text-white/75 mt-1">Tudo do Standard + o telão ao vivo que vira o assunto da festa.</p>
                <div className="mt-5">
                  <span className="inline-block text-xs font-semibold text-primary-dark bg-accent rounded-full px-2.5 py-1 mb-2">61% OFF</span>
                  <div className="flex items-end gap-2">
                    <span className="text-sm text-white/50 line-through">R$ 147</span>
                    <span className="font-serif text-4xl">R$ 57</span>
                  </div>
                  <p className="text-xs text-white/60 mt-1">pagamento único</p>
                </div>

                <div className="mt-5 bg-white/10 ring-1 ring-white/15 rounded-xl px-4 py-3">
                  <p className="text-sm text-white/90">
                    Por <strong className="text-accent-light">só R$ 20 a mais</strong> que o Standard, sua festa ganha o
                    <strong className="text-white"> telão ao vivo</strong> — o detalhe que todo mundo comenta depois.
                  </p>
                </div>

                <ul className="mt-5 space-y-2.5 flex-1">
                  {['Tudo do Standard incluído', 'Slideshow ao vivo no telão', 'Fotos aparecem em tempo real', 'Tela personalizada com o nome do evento', 'O momento “uau” da festa'].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/90">
                      <Check className="w-4 h-4 text-accent-light mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button href={CHECKOUT_PRO} target="_blank" variant="primary" size="lg" className="w-full mt-6 !bg-accent !text-primary-dark hover:!bg-accent-dark">
                  Quero o Pro com telão ao vivo
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal className="text-center mt-6">
            <p className="inline-flex items-center gap-2 text-sm text-muted"><ShieldCheck className="w-4 h-4 text-success" /> 7 dias de garantia. Não gostou, devolvemos 100%.</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq" className="px-4 py-12 sm:py-20 scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <Reveal className="text-center mb-8">
            <Eyebrow>Dúvidas</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-4xl text-primary">Perguntas frequentes</h2>
          </Reveal>
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i
              return (
                <Reveal key={f.q} delay={(i % 4) * 60}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full text-left bg-surface border border-border rounded-2xl p-4 sm:p-5 transition-colors hover:border-primary/30"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-primary text-[15px]">{f.q}</span>
                      <ChevronDown className={`w-5 h-5 text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="grid transition-all duration-300" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                      <div className="overflow-hidden">
                        <p className="text-sm text-muted-dark leading-relaxed pt-3">{f.a}</p>
                      </div>
                    </div>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="px-4 py-14 sm:py-24 bg-gradient-to-b from-background to-accent/10">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="font-serif text-2xl sm:text-4xl text-primary leading-tight mb-4">
              Sua festa merece ser vista por todos os ângulos
            </h2>
            <p className="text-muted-dark mb-8">Crie seu álbum hoje e nunca mais dependa do “depois eu te mando”.</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <Button href={CHECKOUT_PRO} target="_blank" size="lg" className="w-full !bg-accent !text-primary-dark hover:!bg-accent-dark">
                Quero o Pro — R$ 57 · telão ao vivo
              </Button>
              <Button href={CHECKOUT_STANDARD} target="_blank" variant="outline" size="lg" className="w-full">
                Prefiro o Standard — R$ 37
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ BARRA FIXA (MOBILE) ═══════════════ */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur border-t border-border px-4 py-3 flex items-center justify-between gap-3">
        <div className="leading-tight">
          <p className="text-[11px] text-muted">A partir de</p>
          <p className="font-serif text-lg text-primary">R$ 37</p>
        </div>
        <a
          href="#planos"
          className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-1.5 bg-primary text-white font-medium rounded-xl h-11 active:scale-[0.98] transition-transform"
        >
          Ver planos <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}