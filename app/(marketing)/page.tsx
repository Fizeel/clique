'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ShoppingBag, Play, Camera, Images, Settings2, QrCode, Download, 
  Wifi, Clock, Lock, Smartphone, Heart, ShieldCheck, ChevronDown 
} from 'lucide-react'

const HOTMART_CHECKOUT_URL = process.env.NEXT_PUBLIC_HOTMART_URL || 'https://pay.hotmart.com/'

export default function MarketingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqItems = [
    {
      q: "O convidado precisa instalar algum app?",
      a: "Não! Basta escanear o QR Code. O álbum abre direto no navegador do celular."
    },
    {
      q: "Quantas fotos posso receber?",
      a: "Ilimitadas! Não há limite de fotos por evento."
    },
    {
      q: "Por quanto tempo as fotos ficam disponíveis?",
      a: "As fotos ficam armazenadas por 12 meses. Você pode baixar tudo a qualquer momento nesse período."
    },
    {
      q: "Funciona em iPhone e Android?",
      a: "Sim! Qualquer smartphone com câmera e internet funciona perfeitamente."
    },
    {
      q: "O que acontece após a compra?",
      a: "Em até 5 minutos você recebe um email com seu login e senha. Acesse, crie seu evento e compartilhe o QR Code."
    },
    {
      q: "Posso usar para outros eventos além de casamento?",
      a: "Sim! Aniversários, formaturas, chás de bebê, confraternizações — qualquer evento funciona."
    },
    {
      q: "E se eu quiser reembolso?",
      a: "Garantia de 7 dias, sem perguntas. Solicite em suporte@oclique.com.br."
    }
  ]

  return (
    <div className="w-full overflow-x-hidden">
      {/* SEÇÃO 1 - Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="inline-flex gap-2 bg-accent/20 text-accent-dark rounded-full px-4 py-1.5 text-sm mb-6 animate-fadeIn">
          ✨ Mais de 5.000 eventos realizados
        </div>
        
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight mb-5 animate-slideUp">
          As fotos mais emocionantes do seu evento estão no celular dos seus convidados.
        </h1>
        
        <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-8 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          Cliquê cria um álbum colaborativo com QR Code. Seus convidados escaneiam e enviam fotos
          em segundos — sem instalar nada. Você baixa tudo em alta qualidade.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <Button variant="primary" size="lg" href={HOTMART_CHECKOUT_URL} target="_blank" icon={<ShoppingBag className="w-5 h-5" />}>
            Garantir meu álbum — R$ 37
          </Button>
          <Button variant="ghost" size="lg" href="#como-funciona" icon={<Play className="w-5 h-5" />}>
            Ver como funciona
          </Button>
        </div>

        {/* MOCKUP */}
        <div className="max-w-sm mx-auto animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="bg-surface rounded-3xl border-2 border-border shadow-2xl overflow-hidden p-6 relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-border rounded-full" />
            <div className="font-serif text-sm text-primary/50 text-center mb-1 mt-2">Cliquê</div>
            <div className="font-serif text-xl text-primary text-center mb-4">Casamento Ana & João</div>
            
            <div className="space-y-3">
              <div className="py-4 rounded-xl border-dashed border-2 border-border text-muted flex flex-col items-center justify-center gap-1">
                <Camera className="w-6 h-6 opacity-50" />
              </div>
              <div className="py-4 rounded-xl border-dashed border-2 border-border text-muted flex flex-col items-center justify-center gap-1">
                <Images className="w-6 h-6 opacity-50" />
              </div>
            </div>

            <div className="bg-primary/30 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-primary h-full w-3/4 rounded-full" />
            </div>
            
            <div className="text-sm text-success text-center mt-3 font-medium">
              ✅ 3 fotos enviadas! 🎉
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 - Como Funciona */}
      <section id="como-funciona" className="bg-surface border-y border-border py-16 sm:py-20">
        <h2 className="font-serif text-3xl text-primary text-center mb-3">Simples assim</h2>
        <p className="text-muted text-center mb-12">Três passos para reunir todas as fotos num só lugar.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto px-4">
          <div>
            <div className="w-14 h-14 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Settings2 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-serif text-lg text-primary text-center mb-2">Crie seu álbum</h3>
            <p className="text-sm text-muted text-center">Configure em 2 minutos: nome do evento, data e mensagem para os convidados.</p>
          </div>
          <div>
            <div className="w-14 h-14 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-serif text-lg text-primary text-center mb-2">Compartilhe o QR Code</h3>
            <p className="text-sm text-muted text-center">Imprima nas mesas ou envie no convite. Convidados escaneiam e enviam fotos pelo celular — sem baixar nada.</p>
          </div>
          <div>
            <div className="w-14 h-14 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Download className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-serif text-lg text-primary text-center mb-2">Baixe tudo</h3>
            <p className="text-sm text-muted text-center">Todas as fotos chegam em tempo real. Baixe o álbum completo em alta qualidade com um clique.</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 - Benefícios */}
      <section className="bg-background py-16 sm:py-20 px-4">
        <h2 className="font-serif text-3xl text-primary text-center mb-12">Tudo que você precisa</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { icon: Wifi, title: "Sem instalar nada", desc: "Convidados acessam pelo navegador. Zero fricção." },
            { icon: Clock, title: "Tempo real", desc: "Cada foto aparece na galeria em segundos." },
            { icon: Download, title: "Download em ZIP", desc: "Todas as fotos em alta qualidade num arquivo." },
            { icon: Lock, title: "Galeria privada", desc: "Só você acessa. Convidados só podem enviar." },
            { icon: Smartphone, title: "Qualquer celular", desc: "iPhone, Android, qualquer navegador moderno." },
            { icon: Heart, title: "Momentos únicos", desc: "O que o fotógrafo não capturou. Tudo aqui." },
          ].map((b, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-5 hover:shadow-sm transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-primary mb-1">{b.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 4 - Depoimentos */}
      <section className="bg-surface border-y border-border py-16 sm:py-20 px-4">
        <h2 className="font-serif text-3xl text-primary text-center mb-10">O que dizem nossas clientes</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { text: "Recebi mais de 300 fotos que jamais teria visto. Vale muito mais que os R$ 37!", author: "Ana R. · Casamento" },
            { text: "As fotos começaram a chegar durante a festa. Quando cheguei em casa já tinha um álbum enorme.", author: "Beatriz M. · Aniversário 30 anos" },
            { text: "Minha sogra, que não manda foto pra ninguém, mandou 15 fotos lindas. Fez milagre!", author: "Camila P. · Casamento" }
          ].map((d, i) => (
            <div key={i} className="bg-background border border-border rounded-2xl p-5">
              <div className="text-accent/80 text-sm mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-sm text-muted leading-relaxed mb-4 italic">"{d.text}"</p>
              <div className="text-sm font-medium text-primary">{d.author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 5 - Preço */}
      <section id="preco" className="bg-gradient-to-b from-primary/5 to-accent/10 py-16 sm:py-24 px-4">
        <div className="max-w-lg mx-auto bg-surface border border-border rounded-3xl p-8 sm:p-10 shadow-lg text-center">
          <div className="bg-success/10 text-success text-xs font-semibold px-3 py-1 rounded-full mb-6 inline-block">
            Pagamento único · Sem mensalidade
          </div>

          <div className="mb-6">
            <span className="text-muted text-xl align-top mr-1">R$</span>
            <span className="font-serif text-6xl text-primary">37</span>
            <span className="text-xl text-muted">,00</span>
            <p className="text-sm text-muted mt-1">pagamento único &middot; acesso para sempre</p>
          </div>

          <hr className="border-border my-6" />

          <div className="text-left space-y-2 mb-8 text-sm text-muted-dark">
            <p>✅ Álbum colaborativo com QR Code</p>
            <p>✅ Galeria privada em tempo real</p>
            <p>✅ Download de todas as fotos em ZIP</p>
            <p>✅ 1 evento com fotos guardadas por 12 meses</p>
            <p>✅ Funciona em qualquer celular, sem app</p>
            <p>✅ Suporte por email</p>
          </div>

          <Button variant="primary" size="lg" className="w-full" href={HOTMART_CHECKOUT_URL} target="_blank" icon={<ShoppingBag className="w-5 h-5" />}>
            Garantir meu álbum agora &rarr;
          </Button>

          <div className="mt-4 text-xs text-muted flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            Garantia de 7 dias. Reembolso sem perguntas.
          </div>

          <div className="mt-5 text-xs text-muted/60 flex justify-center gap-4">
            <span>🔒 Pagamento seguro</span>
            <span>⚡ Acesso imediato após a compra</span>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 - FAQ */}
      <section id="faq" className="bg-background py-16 sm:py-20 px-4">
        <h2 className="font-serif text-3xl text-primary text-center mb-10">Perguntas frequentes</h2>
        
        <div className="max-w-2xl mx-auto space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200">
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex justify-between items-center w-full p-5 text-left focus:outline-none"
                >
                  <span className="text-sm font-medium text-primary pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="p-5 pt-0 text-sm text-muted leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
