'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import type { Pizzeria, MenuItem } from '@/types'

// ─── Dados do cardápio padrão (override por pizzeria no Supabase) ─────────────
const DEFAULT_MENU: Omit<MenuItem, 'id' | 'pizzeria_id' | 'active' | 'sort_order'>[] = [
  { cat: 'salgadas', emoji: '🍕', img_url: null, name: 'Calabresa', desc: 'Calabresa fatiada, cebola e azeitonas sobre molho de tomate', price: 45, tag: 'hot', social: '🔥 Mais pedida' },
  { cat: 'salgadas', emoji: '🍗', img_url: null, name: 'Frango c/ Catupiry', desc: 'Frango desfiado temperado e catupiry original cremoso', price: 48, tag: null, social: '❤️ Favorita da casa' },
  { cat: 'salgadas', emoji: '🍕', img_url: null, name: 'Portuguesa', desc: 'Presunto, ovo, cebola, pimentão e azeitona', price: 47, tag: 'hot', social: '🔥 31 pedidos hoje' },
  { cat: 'salgadas', emoji: '🧀', img_url: null, name: 'Quatro Queijos', desc: 'Mussarela, parmesão, catupiry e cheddar derretidos', price: 52, tag: null, social: null },
  { cat: 'salgadas', emoji: '🍅', img_url: null, name: 'Margherita', desc: 'Molho de tomate fresco, mussarela e manjericão', price: 42, tag: null, social: null },
  { cat: 'salgadas', emoji: '🥓', img_url: null, name: 'Frango c/ Bacon', desc: 'Frango, bacon crocante e cream cheese', price: 50, tag: 'new', social: null },
  { cat: 'doces', emoji: '🍓', img_url: null, name: 'Chocolate c/ Morango', desc: 'Chocolate ao leite cremoso e morangos frescos', price: 48, tag: 'hot', social: '🔥 Mais pedida nas doces' },
  { cat: 'doces', emoji: '🍫', img_url: null, name: 'Brigadeiro', desc: 'Brigadeiro gourmet, granulado belga e leite condensado', price: 46, tag: null, social: null },
  { cat: 'doces', emoji: '🍌', img_url: null, name: 'Banana c/ Canela', desc: 'Banana caramelizada, canela e leite condensado', price: 44, tag: null, social: null },
  { cat: 'lanches', emoji: '🍔', img_url: null, name: 'X-Bacon Especial', desc: 'Hambúrguer artesanal, bacon crocante, queijo e alface', price: 28, tag: 'hot', social: '🔥 Top dos lanches' },
  { cat: 'lanches', emoji: '🍗', img_url: null, name: 'X-Frango', desc: 'Frango empanado sequinho, queijo e maionese da casa', price: 25, tag: null, social: null },
  { cat: 'bebidas', emoji: '🥤', img_url: null, name: 'Refrigerante Lata', desc: 'Coca-Cola, Guaraná ou Sprite geladíssimos', price: 6, tag: null, social: null },
  { cat: 'bebidas', emoji: '🥤', img_url: null, name: 'Refrigerante 2L', desc: 'Coca-Cola ou Guaraná para toda a família', price: 12, tag: null, social: null },
  { cat: 'bebidas', emoji: '💧', img_url: null, name: 'Água Mineral', desc: '500ml com ou sem gás', price: 4, tag: null, social: null },
]

const CAT_LABELS: Record<string, string> = {
  salgadas: '🍕 Pizzas Salgadas',
  doces: '🍫 Pizzas Doces',
  lanches: '🍔 Lanches',
  bebidas: '🥤 Bebidas',
}

const CAT_ORDER = ['salgadas', 'doces', 'lanches', 'bebidas']
const BRL = (n: number) => 'R$ ' + n.toFixed(2).replace('.', ',')

interface CartEntry {
  id: string
  name: string
  price: number
  emoji: string
  qty: number
}

export default function CardapioPage({ params }: { params: { slug: string } }) {
  const [pizzeria, setPizzeria] = useState<Pizzeria | null>(null)
  const [menu, setMenu] = useState<typeof DEFAULT_MENU>(DEFAULT_MENU)
  const [cart, setCart] = useState<CartEntry[]>([])
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [name, setName] = useState('')
  const [addr, setAddr] = useState('')
  const [pay, setPay] = useState('')
  const [obs, setObs] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient()
      const { data } = await supabase
        .from('pizzerias')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (data) {
        setPizzeria(data)
        // Tenta carregar menu customizado da pizzaria
        const { data: items } = await supabase
          .from('menu_items')
          .select('*')
          .eq('pizzeria_id', data.id)
          .eq('active', true)
          .order('sort_order')
        if (items && items.length > 0) setMenu(items)
      }
      setLoading(false)
    }
    load()
  }, [params.slug])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function addToCart(item: typeof DEFAULT_MENU[0] & { id?: string }) {
    setCart(prev => {
      const key = item.name
      const exists = prev.find(e => e.id === key)
      if (exists) return prev.map(e => e.id === key ? { ...e, qty: e.qty + 1 } : e)
      return [...prev, { id: key, name: item.name, price: item.price, emoji: item.emoji, qty: 1 }]
    })
    showToast(`${item.name} adicionado ✅`)
  }

  function decCart(name: string) {
    setCart(prev => {
      const entry = prev.find(e => e.id === name)
      if (!entry) return prev
      if (entry.qty <= 1) return prev.filter(e => e.id !== name)
      return prev.map(e => e.id === name ? { ...e, qty: e.qty - 1 } : e)
    })
  }

  const totalQty = cart.reduce((a, e) => a + e.qty, 0)
  const subtotal = cart.reduce((a, e) => a + e.price * e.qty, 0)
  const delivery = pizzeria?.delivery_fee ?? 5
  const total = subtotal + delivery

  const waNumber = pizzeria?.wa_number ?? '5511980794899'

  function sendWhatsApp() {
    if (!cart.length) return
    const NL = '\n'
    let msg = `*Novo Pedido — ${pizzeria?.name ?? 'Pizzaria'}* 🍕${NL}${NL}`
    if (name) msg += `Cliente: ${name}${NL}`
    if (addr) msg += `Entrega: ${addr}${NL}`
    if (pay) msg += `Pagamento: ${pay}${NL}`
    msg += `${NL}*Itens:*${NL}`
    cart.forEach(e => { msg += `${e.qty}x ${e.name} — ${BRL(e.price * e.qty)}${NL}` })
    if (obs) msg += `${NL}Obs: ${obs}${NL}`
    msg += `${NL}Subtotal: ${BRL(subtotal)}${NL}Entrega: ${BRL(delivery)}${NL}*TOTAL: ${BRL(total)}*`
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const filteredMenu = menu.filter(item =>
    (activeCat === 'all' || item.cat === activeCat) &&
    (!query || item.name.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase()))
  )

  const isOpen = () => {
    const h = new Date().getHours()
    const open = pizzeria?.open_hour ?? 18
    const close = pizzeria?.close_hour ?? 24
    return close > open ? (h >= open && h < close) : (h >= open || h < close % 24)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3E3DD] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🍕</div>
          <p className="text-[#5a3c33] font-semibold">Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3E3DD] font-sans">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[rgba(28,16,10,0.92)] text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm px-4 py-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0d0d0d] shadow-lg flex-shrink-0">
          {pizzeria?.logo_url
            ? <img src={pizzeria.logo_url} alt={pizzeria?.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-2xl">🍕</div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-serif font-black text-xl text-[#5a3c33]">{pizzeria?.name ?? 'Pizzo'}</h1>
            <span className="text-xs font-black bg-gradient-to-r from-[#F5A623] to-[#E8432A] text-white px-2 py-0.5 rounded-md">CARDÁPIO DIGITAL</span>
          </div>
          <div className="text-xs text-[#8D6E63] mt-0.5">
            🛵 {pizzeria?.address ?? 'Delivery'} · 📱 {pizzeria?.phone ?? ''}
          </div>
        </div>
        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full border ${isOpen() ? 'bg-[#EAFAF1] border-[#27AE60] text-[#27AE60]' : 'bg-[#FDECEA] border-[#E74C3C] text-[#C0392B]'}`}>
          <span className={`w-2 h-2 rounded-full ${isOpen() ? 'bg-[#27AE60] animate-pulse' : 'bg-[#E74C3C]'}`} />
          {isOpen() ? `⏰ Aberto até ${String((pizzeria?.close_hour ?? 24) % 24).padStart(2, '0')}h` : `😴 Fechado`}
        </div>
      </header>

      {/* Hero */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative min-h-[180px] flex flex-col justify-end p-5"
        style={{ background: 'linear-gradient(115deg, #C0341D 0%, #E8432A 55%, #F5A623 100%)' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 text-white">
          <span className="inline-flex items-center gap-2 bg-black/40 border border-white/30 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shadow-[0_0_8px_#ff4d4d]" />
            AO VIVO DO FORNO
          </span>
          <h2 className="font-serif font-black text-2xl leading-tight">Massa fininha, borda dourada, queijo escorrendo. 🔥</h2>
          <p className="text-sm text-white/90 mt-1">Assada na hora. Peça agora e receba quentinha.</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {['🛵 Entrega ~40min', '🔥 Forno quente agora', '⭐ 4,9 de avaliação'].map(p => (
              <span key={p} className="text-xs font-bold bg-white/15 border border-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="sticky top-[73px] z-10 bg-[#F3E3DD]/90 backdrop-blur-md px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {[{ id: 'all', label: '🍽️ Tudo' }, { id: 'salgadas', label: '🍕 Salgadas' }, { id: 'doces', label: '🍫 Doces' }, { id: 'lanches', label: '🍔 Lanches' }, { id: 'bebidas', label: '🥤 Bebidas' }].map(c => (
          <button key={c.id} onClick={() => setActiveCat(c.id)}
            className={`flex-shrink-0 text-sm font-bold px-4 py-2 rounded-full border transition-all ${activeCat === c.id ? 'bg-[#E8432A] text-white border-[#E8432A] shadow-lg' : 'bg-white/70 text-[#5a3c33] border-white/80'}`}>
            {c.label}
          </button>
        ))}
        <input
          type="text" placeholder="🔍 Buscar..." value={query} onChange={e => setQuery(e.target.value)}
          className="flex-shrink-0 ml-2 bg-white/70 border border-white/80 rounded-full px-4 py-2 text-sm text-[#5a3c33] outline-none focus:border-[#E8432A] w-40"
        />
      </div>

      {/* Menu */}
      <div className="px-4 pb-32 mt-4 space-y-6">
        {CAT_ORDER.map(catId => {
          const items = filteredMenu.filter(i => i.cat === catId)
          if (!items.length) return null
          return (
            <div key={catId}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[#E8432A] to-[#F5A623]" />
                <h2 className="font-serif font-black text-lg text-[#5a3c33]">{CAT_LABELS[catId]}</h2>
                <span className="text-xs text-[#8D6E63]">· {items.length} {items.length === 1 ? 'item' : 'itens'}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {items.map((item, i) => (
                  <div key={i} onClick={() => addToCart(item)}
                    className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer active:scale-95">
                    <div className="h-28 bg-gradient-to-br from-[#FFECD2] to-[#FCB69F] flex items-center justify-center text-4xl relative">
                      {item.img_url && <img src={item.img_url} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />}
                      <span className="relative z-10">{item.emoji}</span>
                      {item.tag === 'hot' && <span className="absolute top-2 left-2 bg-[#E8432A] text-white text-[10px] font-black px-2 py-0.5 rounded-lg z-20">🔥 Mais pedido</span>}
                      {item.tag === 'new' && <span className="absolute top-2 left-2 bg-[#8B5CF6] text-white text-[10px] font-black px-2 py-0.5 rounded-lg z-20">✨ Novidade</span>}
                      {item.social && <span className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-1 rounded-lg z-20 truncate">{item.social}</span>}
                      {(() => { const q = cart.find(e => e.id === item.name)?.qty; return q ? <span className="absolute top-2 right-2 bg-[#00B894] text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center z-20">{q}</span> : null })()}
                    </div>
                    <div className="p-3">
                      <h3 className="font-serif font-bold text-[#5a3c33] text-sm leading-tight">{item.name}</h3>
                      <p className="text-xs text-[#8D6E63] mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-serif font-black text-[#E8432A] text-base">{BRL(item.price)}</span>
                        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E8432A] text-white font-bold text-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {!filteredMenu.length && (
          <div className="text-center py-16 text-[#8D6E63]">
            <div className="text-5xl mb-3 opacity-30">🔍</div>
            <p>Nenhum item encontrado.<br />Tente outra busca ou categoria.</p>
          </div>
        )}
      </div>

      {/* Bottom bar mobile */}
      {totalQty > 0 && !cartOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#f0e8e0] px-4 py-3 pb-safe flex items-center gap-3 shadow-xl">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-11 h-11 rounded-xl bg-[#E8432A] flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{totalQty}</span>
            </div>
            <div>
              <div className="text-xs text-gray-400">{totalQty} {totalQty === 1 ? 'item' : 'itens'}</div>
              <div className="font-serif font-black text-[#1a1a1a] text-lg leading-none">{BRL(total)}</div>
            </div>
          </div>
          <button onClick={() => setCartOpen(true)}
            className="bg-[#E8432A] text-white font-bold text-sm px-5 py-3.5 rounded-xl flex-shrink-0 shadow-lg active:scale-95 transition-transform">
            Ver pedido
          </button>
        </div>
      )}

      {/* Cart screen */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-[#f5f0eb] flex flex-col">
          <div className="bg-white px-4 pt-safe pb-3 border-b border-[#f0e8e0] flex items-center gap-3">
            <button onClick={() => setCartOpen(false)} className="w-9 h-9 rounded-full bg-[#f5f0eb] flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <h2 className="font-serif font-black text-xl text-[#1a1a1a] flex-1">Seu Pedido</h2>
            <span className="bg-[#E8432A] text-white text-xs font-bold px-3 py-1 rounded-full">{totalQty}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Itens */}
            {cart.length > 0 && (
              <div className="bg-white rounded-2xl divide-y divide-[#f5f0eb]">
                {cart.map(entry => (
                  <div key={entry.id} className="flex items-center gap-3 p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => decCart(entry.id)} className="w-8 h-8 rounded-full border-2 border-[#E8432A] text-[#E8432A] font-bold text-lg flex items-center justify-center">−</button>
                      <span className="font-serif font-black text-base w-5 text-center">{entry.qty}</span>
                      <button onClick={() => addToCart({ ...entry, cat: 'salgadas', desc: '', tag: null, social: null, img_url: null })} className="w-8 h-8 rounded-full bg-[#E8432A] text-white font-bold text-lg flex items-center justify-center">+</button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#1a1a1a] truncate">{entry.emoji} {entry.name}</div>
                      <div className="text-xs text-gray-400">{BRL(entry.price)} cada</div>
                    </div>
                    <div className="font-serif font-bold text-[#1a1a1a]">{BRL(entry.price * entry.qty)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Resumo */}
            <div className="bg-white rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{BRL(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-gray-500"><span>Taxa de entrega</span><span>{BRL(delivery)}</span></div>
              <div className="flex justify-between text-base font-bold text-[#1a1a1a] pt-2 border-t border-dashed border-[#e0d8d0]">
                <span>Total</span>
                <span className="font-serif font-black text-2xl text-[#E8432A]">{BRL(total)}</span>
              </div>
            </div>

            {/* Checkout */}
            <div className="bg-white rounded-2xl p-4 space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">Seu nome</label>
                <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Como podemos te chamar?"
                  className="w-full bg-[#faf5f0] border border-[#e0d8d0] rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#E8432A]" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">Endereço de entrega</label>
                <input value={addr} onChange={e => setAddr(e.target.value)} type="text" placeholder="Rua, número, bairro..."
                  className="w-full bg-[#faf5f0] border border-[#e0d8d0] rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#E8432A]" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">Pagamento</label>
                <div className="flex gap-2">
                  {['💠 Pix', '💳 Cartão', '💵 Dinheiro'].map(p => (
                    <button key={p} onClick={() => setPay(p)}
                      className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-all ${pay === p ? 'bg-[#E8432A] text-white border-[#E8432A]' : 'bg-[#faf5f0] text-gray-500 border-[#e0d8d0]'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">Observações (opcional)</label>
                <input value={obs} onChange={e => setObs(e.target.value)} type="text" placeholder="Sem cebola, borda recheada..."
                  className="w-full bg-[#faf5f0] border border-[#e0d8d0] rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#E8432A]" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white px-4 py-3 pb-safe border-t border-[#f0e8e0]">
            <button onClick={sendWhatsApp} disabled={!cart.length}
              className="w-full bg-[#25D366] text-white font-bold text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 active:scale-95 transition-transform">
              <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Enviar pedido no WhatsApp
            </button>
            <button onClick={() => { setCart([]); setCartOpen(false) }} className="w-full text-center text-xs text-gray-400 mt-2 py-1">
              Limpar carrinho
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
