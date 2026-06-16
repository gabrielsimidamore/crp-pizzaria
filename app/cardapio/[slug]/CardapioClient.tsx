'use client'

import { useState } from 'react'

const DEFAULT_MENU = [
  { id: 's1', cat: 'salgadas', emoji: '🍕', name: 'Calabresa', desc: 'Calabresa fatiada, cebola e azeitonas sobre molho de tomate', price: 45, tag: 'hot', social: '🔥 Mais pedida' },
  { id: 's2', cat: 'salgadas', emoji: '🍗', name: 'Frango c/ Catupiry', desc: 'Frango desfiado temperado e catupiry original cremoso', price: 48, tag: null, social: '❤️ Favorita da casa' },
  { id: 's3', cat: 'salgadas', emoji: '🍕', name: 'Portuguesa', desc: 'Presunto, ovo, cebola, pimentão e azeitona', price: 47, tag: 'hot', social: '🔥 31 pedidos hoje' },
  { id: 's4', cat: 'salgadas', emoji: '🧀', name: 'Quatro Queijos', desc: 'Mussarela, parmesão, catupiry e cheddar derretidos', price: 52, tag: null, social: null },
  { id: 's5', cat: 'salgadas', emoji: '🍅', name: 'Margherita', desc: 'Molho de tomate fresco, mussarela e manjericão', price: 42, tag: null, social: null },
  { id: 's6', cat: 'salgadas', emoji: '🥓', name: 'Frango c/ Bacon', desc: 'Frango, bacon crocante e cream cheese', price: 50, tag: 'new', social: null },
  { id: 'd1', cat: 'doces', emoji: '🍓', name: 'Chocolate c/ Morango', desc: 'Chocolate ao leite cremoso e morangos frescos', price: 48, tag: 'hot', social: '🔥 Mais pedida nas doces' },
  { id: 'd2', cat: 'doces', emoji: '🍫', name: 'Brigadeiro', desc: 'Brigadeiro gourmet, granulado belga e leite condensado', price: 46, tag: null, social: null },
  { id: 'd3', cat: 'doces', emoji: '🍌', name: 'Banana c/ Canela', desc: 'Banana caramelizada, canela e leite condensado', price: 44, tag: null, social: null },
  { id: 'l1', cat: 'lanches', emoji: '🍔', name: 'X-Bacon Especial', desc: 'Hambúrguer artesanal, bacon crocante, queijo e alface', price: 28, tag: 'hot', social: '🔥 Top dos lanches' },
  { id: 'l2', cat: 'lanches', emoji: '🍗', name: 'X-Frango', desc: 'Frango empanado sequinho, queijo e maionese da casa', price: 25, tag: null, social: null },
  { id: 'b1', cat: 'bebidas', emoji: '🥤', name: 'Refrigerante Lata', desc: 'Coca-Cola, Guaraná ou Sprite geladíssimos', price: 6, tag: null, social: null },
  { id: 'b2', cat: 'bebidas', emoji: '🥤', name: 'Refrigerante 2L', desc: 'Coca-Cola ou Guaraná para toda a família', price: 12, tag: null, social: null },
  { id: 'b3', cat: 'bebidas', emoji: '💧', name: 'Água Mineral', desc: '500ml com ou sem gás', price: 4, tag: null, social: null },
]

const CAT_LABELS: Record<string, string> = {
  salgadas: '🍕 Pizzas Salgadas',
  doces: '🍫 Pizzas Doces',
  lanches: '🍔 Lanches',
  bebidas: '🥤 Bebidas',
}
const CAT_ORDER = ['salgadas', 'doces', 'lanches', 'bebidas']
const BRL = (n: number) => 'R$ ' + n.toFixed(2).replace('.', ',')

type MenuItem = typeof DEFAULT_MENU[0]
type CartEntry = { id: string; name: string; price: number; emoji: string; qty: number }

export default function CardapioClient({ pizzeria }: { pizzeria: Record<string, string> }) {
  const [menu, setMenu] = useState<MenuItem[]>(DEFAULT_MENU)
  const [cart, setCart] = useState<CartEntry[]>([])
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [addr, setAddr] = useState('')
  const [pay, setPay] = useState('')
  const [obs, setObs] = useState('')
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  function addToCart(item: MenuItem) {
    setCart(prev => {
      const exists = prev.find(e => e.id === item.id)
      if (exists) return prev.map(e => e.id === item.id ? { ...e, qty: e.qty + 1 } : e)
      return [...prev, { id: item.id, name: item.name, price: item.price, emoji: item.emoji, qty: 1 }]
    })
    showToast(`${item.name} adicionado ✅`)
  }

  function decCart(id: string) {
    setCart(prev => {
      const entry = prev.find(e => e.id === id)
      if (!entry) return prev
      if (entry.qty <= 1) return prev.filter(e => e.id !== id)
      return prev.map(e => e.id === id ? { ...e, qty: e.qty - 1 } : e)
    })
  }

  const totalQty = cart.reduce((a, e) => a + e.qty, 0)
  const subtotal = cart.reduce((a, e) => a + e.price * e.qty, 0)
  const delivery = Number(pizzeria?.delivery_fee ?? 5)
  const total = subtotal + delivery
  const waNumber = pizzeria?.wa_number ?? '5511980794899'

  function sendWhatsApp() {
    if (!cart.length) return
    const NL = '\n'
    let msg = `*Novo Pedido — ${pizzeria?.name ?? 'Pizzaria'}* 🍕${NL}${NL}`
    if (nome) msg += `Cliente: ${nome}${NL}`
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
    (!query || item.name.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F3E3DD', fontFamily: 'system-ui, sans-serif' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', background: 'rgba(28,16,10,0.92)', color: '#fff', padding: '12px 20px', borderRadius: 12, zIndex: 999, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🍕</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#5a3c33' }}>{pizzeria?.name ?? 'Pizzo'}</h1>
            <span style={{ fontSize: 10, fontWeight: 800, background: 'linear-gradient(120deg,#F5A623,#E8432A)', color: '#fff', padding: '2px 8px', borderRadius: 6 }}>CARDÁPIO DIGITAL</span>
          </div>
          <div style={{ fontSize: 12, color: '#8D6E63', marginTop: 2 }}>🛵 {pizzeria?.address ?? 'Delivery'} · 📱 {pizzeria?.phone ?? ''}</div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ margin: '12px 16px', borderRadius: 20, overflow: 'hidden', minHeight: 160, background: 'linear-gradient(115deg,#C0341D,#E8432A 55%,#F5A623)', padding: '20px 20px 16px', position: 'relative', boxShadow: '0 12px 36px rgba(214,48,49,0.3)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1, color: '#fff' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.3)', padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4d4d', boxShadow: '0 0 8px #ff4d4d' }} />
            AO VIVO DO FORNO
          </div>
          <h2 style={{ margin: 0, fontSize: 'clamp(16px,5vw,24px)', fontWeight: 900, lineHeight: 1.2 }}>Massa fininha, borda dourada, queijo escorrendo. 🔥</h2>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {['🛵 Entrega ~40min', '🔥 Forno quente', '⭐ 4,9'].map(p => (
              <span key={p} style={{ fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 12px', borderRadius: 99 }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, padding: '8px 16px', overflowX: 'auto', position: 'sticky', top: 73, zIndex: 10, background: 'rgba(243,227,221,0.9)', backdropFilter: 'blur(8px)' }}>
        {[{ id: 'all', label: '🍽️ Tudo' }, { id: 'salgadas', label: '🍕 Salgadas' }, { id: 'doces', label: '🍫 Doces' }, { id: 'lanches', label: '🍔 Lanches' }, { id: 'bebidas', label: '🥤 Bebidas' }].map(c => (
          <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 99, border: 'none', cursor: 'pointer', background: activeCat === c.id ? '#E8432A' : 'rgba(255,255,255,0.8)', color: activeCat === c.id ? '#fff' : '#5a3c33', transition: 'all .15s' }}>
            {c.label}
          </button>
        ))}
        <input type="text" placeholder="🔍 Buscar..." value={query} onChange={e => setQuery(e.target.value)}
          style={{ flexShrink: 0, marginLeft: 8, background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: 99, padding: '8px 16px', fontSize: 13, color: '#5a3c33', width: 140, outline: 'none' }} />
      </div>

      {/* Menu */}
      <div style={{ padding: '12px 16px 120px' }}>
        {CAT_ORDER.map(catId => {
          const items = filteredMenu.filter(i => i.cat === catId)
          if (!items.length) return null
          return (
            <div key={catId} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 4, height: 24, borderRadius: 2, background: 'linear-gradient(#E8432A,#F5A623)', flexShrink: 0 }} />
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#5a3c33' }}>{CAT_LABELS[catId]}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                {items.map(item => {
                  const inCart = cart.find(e => e.id === item.id)
                  return (
                    <div key={item.id} onClick={() => addToCart(item)} style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform .15s', position: 'relative' }}>
                      <div style={{ height: 110, background: 'linear-gradient(135deg,#FFECD2,#FCB69F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, position: 'relative' }}>
                        {item.emoji}
                        {item.tag === 'hot' && <span style={{ position: 'absolute', top: 8, left: 8, background: '#E8432A', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 8 }}>🔥 Mais pedido</span>}
                        {item.tag === 'new' && <span style={{ position: 'absolute', top: 8, left: 8, background: '#8B5CF6', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 8 }}>✨ Novidade</span>}
                        {inCart && <span style={{ position: 'absolute', top: 8, right: 8, background: '#00B894', color: '#fff', fontSize: 12, fontWeight: 800, width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{inCart.qty}</span>}
                      </div>
                      <div style={{ padding: '10px 12px 12px' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#5a3c33', lineHeight: 1.2 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: '#8D6E63', marginTop: 4, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.desc}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                          <span style={{ fontWeight: 900, fontSize: 17, color: '#E8432A' }}>{BRL(item.price)}</span>
                          <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F5A623,#E8432A)', color: '#fff', border: 'none', fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(232,67,42,0.4)' }}>+</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
        {!filteredMenu.length && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8D6E63' }}>
            <div style={{ fontSize: 48, opacity: 0.3, marginBottom: 12 }}>🔍</div>
            <p>Nenhum item encontrado.</p>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      {totalQty > 0 && !cartOpen && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: '#fff', borderTop: '1px solid #f0e8e0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 12, background: '#E8432A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              🛒
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#ff6b00', color: '#fff', fontSize: 10, fontWeight: 800, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{totalQty}</span>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#888' }}>{totalQty} {totalQty === 1 ? 'item' : 'itens'}</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#1a1a1a' }}>{BRL(total)}</div>
            </div>
          </div>
          <button onClick={() => setCartOpen(true)} style={{ background: '#E8432A', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 12, padding: '14px 20px', cursor: 'pointer', flexShrink: 0 }}>
            Ver pedido
          </button>
        </div>
      )}

      {/* Cart screen */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#f5f0eb', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#fff', padding: '14px 16px', borderBottom: '1px solid #f0e8e0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setCartOpen(false)} style={{ width: 36, height: 36, borderRadius: '50%', background: '#f5f0eb', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>←</button>
            <h2 style={{ margin: 0, fontWeight: 900, fontSize: 20, color: '#1a1a1a', flex: 1 }}>Seu Pedido</h2>
            <span style={{ background: '#E8432A', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>{totalQty}</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            {/* Itens */}
            <div style={{ background: '#fff', borderRadius: 16, marginBottom: 12 }}>
              {cart.map(entry => (
                <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #f5f0eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => decCart(entry.id)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #E8432A', background: '#fff', color: '#E8432A', fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontWeight: 800, fontSize: 16, minWidth: 20, textAlign: 'center' }}>{entry.qty}</span>
                    <button onClick={() => addToCart(DEFAULT_MENU.find(m => m.id === entry.id)!)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#E8432A', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{entry.emoji} {entry.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{BRL(entry.price)} cada</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{BRL(entry.price * entry.qty)}</div>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#666', marginBottom: 8 }}><span>Subtotal</span><span>{BRL(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#666', marginBottom: 8 }}><span>Taxa de entrega</span><span>{BRL(delivery)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#1a1a1a', paddingTop: 12, borderTop: '1px dashed #e0d8d0' }}>
                <span>Total</span>
                <span style={{ fontWeight: 900, fontSize: 22, color: '#E8432A' }}>{BRL(total)}</span>
              </div>
            </div>

            {/* Checkout */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
              {[
                { label: 'Seu nome', val: nome, set: setNome, placeholder: 'Como podemos te chamar?' },
                { label: 'Endereço de entrega', val: addr, set: setAddr, placeholder: 'Rua, número, bairro...' },
                { label: 'Observações (opcional)', val: obs, set: setObs, placeholder: 'Sem cebola, borda recheada...' },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                    style={{ width: '100%', background: '#faf5f0', border: '1.5px solid #e0d8d0', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', display: 'block', marginBottom: 6 }}>Pagamento</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['💠 Pix', '💳 Cartão', '💵 Dinheiro'].map(p => (
                    <button key={p} onClick={() => setPay(p)} style={{ flex: 1, fontSize: 12, fontWeight: 700, padding: '9px 4px', borderRadius: 10, border: pay === p ? 'none' : '1.5px solid #e0d8d0', background: pay === p ? '#E8432A' : '#faf5f0', color: pay === p ? '#fff' : '#555', cursor: 'pointer' }}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '12px 16px', borderTop: '1px solid #f0e8e0' }}>
            <button onClick={sendWhatsApp} disabled={!cart.length} style={{ width: '100%', background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 14, padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span>💬</span> Enviar pedido no WhatsApp
            </button>
            <button onClick={() => { setCart([]); setCartOpen(false) }} style={{ width: '100%', textAlign: 'center', fontSize: 13, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, padding: 4 }}>
              Limpar carrinho
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
