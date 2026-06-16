'use client'

import { useState, useEffect, useRef } from 'react'

// ── Dados do cardápio padrão ──────────────────────────────────────────────────
const MENU = [
  { id: 's1', cat: 'salgadas', emoji: '🍕', name: 'Calabresa', desc: 'Calabresa fatiada, cebola e azeitonas sobre molho de tomate', price: 45, tag: 'hot', social: '🔥 Mais pedida' },
  { id: 's2', cat: 'salgadas', emoji: '🍗', name: 'Frango c/ Catupiry', desc: 'Frango desfiado temperado e catupiry original cremoso', price: 48, tag: null, social: '❤️ Favorita da casa' },
  { id: 's3', cat: 'salgadas', emoji: '🍕', name: 'Portuguesa', desc: 'Presunto, ovo, cebola, pimentão e azeitona — fartura em cada fatia', price: 47, tag: 'hot', social: '🔥 31 pedidos hoje' },
  { id: 's4', cat: 'salgadas', emoji: '🧀', name: 'Quatro Queijos', desc: 'Mussarela, parmesão, catupiry e cheddar derretidos', price: 52, tag: null, social: null },
  { id: 's5', cat: 'salgadas', emoji: '🍅', name: 'Margherita', desc: 'Molho de tomate fresco, mussarela e manjericão perfumado', price: 42, tag: null, social: null },
  { id: 's6', cat: 'salgadas', emoji: '🥓', name: 'Frango c/ Bacon', desc: 'Frango, bacon crocante e cream cheese — combinação viciante', price: 50, tag: 'new', social: null },
  { id: 's7', cat: 'salgadas', emoji: '🐟', name: 'Atum', desc: 'Atum selecionado, cebola e azeitonas', price: 46, tag: null, social: null },
  { id: 's8', cat: 'salgadas', emoji: '🌴', name: 'Palmito', desc: 'Palmito pupunha macio, mussarela e tomate', price: 47, tag: null, social: null },
  { id: 's9', cat: 'salgadas', emoji: '🥦', name: 'Brócolis c/ Bacon', desc: 'Brócolis no ponto, bacon e alho dourado no azeite', price: 48, tag: null, social: null },
  { id: 's10', cat: 'salgadas', emoji: '🍕', name: 'Pepperoni', desc: 'Pepperoni importado levemente curado e mussarela', price: 54, tag: 'new', social: '✨ Nova queridinha' },
  { id: 'd1', cat: 'doces', emoji: '🍓', name: 'Chocolate c/ Morango', desc: 'Chocolate ao leite cremoso e morangos frescos fatiados', price: 48, tag: 'hot', social: '🔥 Mais pedida nas doces' },
  { id: 'd2', cat: 'doces', emoji: '🍫', name: 'Brigadeiro', desc: 'Brigadeiro gourmet, granulado belga e leite condensado', price: 46, tag: null, social: null },
  { id: 'd3', cat: 'doces', emoji: '🍌', name: 'Banana c/ Canela', desc: 'Banana caramelizada, canela e leite condensado', price: 44, tag: null, social: null },
  { id: 'd4', cat: 'doces', emoji: '🧀', name: 'Romeu e Julieta', desc: 'Goiabada cremosa derretendo sobre mussarela', price: 44, tag: 'new', social: null },
  { id: 'd5', cat: 'doces', emoji: '🥥', name: 'Prestígio', desc: 'Chocolate ao leite e coco ralado fresquinho', price: 46, tag: null, social: null },
  { id: 'd6', cat: 'doces', emoji: '🍫', name: 'Nutella c/ Morango', desc: 'Nutella generosa e morangos fatiados — pura indulgência', price: 52, tag: 'hot', social: '🔥 Some rápido!' },
  { id: 'l1', cat: 'lanches', emoji: '🍔', name: 'X-Bacon Especial', desc: 'Hambúrguer artesanal, bacon crocante, queijo e alface', price: 28, tag: 'hot', social: '🔥 Top dos lanches' },
  { id: 'l2', cat: 'lanches', emoji: '🍗', name: 'X-Frango', desc: 'Frango empanado sequinho, queijo e maionese da casa', price: 25, tag: null, social: null },
  { id: 'l3', cat: 'lanches', emoji: '🥗', name: 'X-Salada', desc: 'Hambúrguer, queijo, alface e tomate', price: 22, tag: null, social: null },
  { id: 'b1', cat: 'bebidas', emoji: '🥤', name: 'Refrigerante Lata', desc: 'Coca-Cola, Guaraná ou Sprite geladíssimos', price: 6, tag: null, social: null },
  { id: 'b2', cat: 'bebidas', emoji: '🥤', name: 'Refrigerante 2L', desc: 'Coca-Cola ou Guaraná para toda a família', price: 12, tag: null, social: null },
  { id: 'b3', cat: 'bebidas', emoji: '🍊', name: 'Suco Natural', desc: 'Laranja, limão ou maracujá feitos na hora', price: 10, tag: 'new', social: null },
  { id: 'b4', cat: 'bebidas', emoji: '💧', name: 'Água Mineral', desc: '500ml com ou sem gás', price: 4, tag: null, social: null },
]

const CATS = [
  { id: 'all', label: '🍽️ Tudo' },
  { id: 'salgadas', label: '🍕 Salgadas' },
  { id: 'doces', label: '🍫 Doces' },
  { id: 'lanches', label: '🍔 Lanches' },
  { id: 'bebidas', label: '🥤 Bebidas' },
]

const CAT_LABELS: Record<string, string> = {
  salgadas: '🍕 Pizzas Salgadas',
  doces: '🍫 Pizzas Doces',
  lanches: '🍔 Lanches',
  bebidas: '🥤 Bebidas',
}
const CAT_ORDER = ['salgadas', 'doces', 'lanches', 'bebidas']

const PROMOS = [
  { id: 'p1', name: 'Combo Casal', desc: '1 Pizza Grande + 2 Refri Lata — noite perfeita a dois', items: ['s1','b1','b1'], price: 52 },
  { id: 'p2', name: 'Sexta da Família', desc: '2 Pizzas Salgadas + Refri 2L — ninguém passa fome', items: ['s3','s4','b2'], price: 99 },
  { id: 'p3', name: 'Doce Encontro', desc: '1 Salgada + 1 Doce — do salgado ao docinho', items: ['s5','d1'], price: 79 },
  { id: 'p4', name: 'Combo Lanche', desc: '2 X-Bacon + 2 Refri Lata — a pedida da galera', items: ['l1','l1','b1','b1'], price: 62 },
]

const BUMP_IDS = ['b1', 'b2', 'b3', 'd1']
const DELIVERY = 5
const BRL = (n: number) => 'R$ ' + n.toFixed(2).replace('.', ',')
const byId = (id: string) => MENU.find(m => m.id === id)

type CartEntry = { id: string; qty: number }

export default function CardapioClient({ pizzeria }: { pizzeria: Record<string, string | number | null> }) {
  const [cart, setCart] = useState<CartEntry[]>([])
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [addr, setAddr] = useState('')
  const [pay, setPay] = useState('')
  const [obs, setObs] = useState('')
  const [toast, setToast] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const waNumber = String(pizzeria.wa_number ?? '5511980794899')
  const openHour = Number(pizzeria.open_hour ?? 18)
  const closeHour = Number(pizzeria.close_hour ?? 24)
  const deliveryFee = Number(pizzeria.delivery_fee ?? DELIVERY)
  const pizzeriaName = String(pizzeria.name ?? 'Pizzo')
  const pizzeriaPhone = String(pizzeria.phone ?? '')
  const pizzeriaAddr = String(pizzeria.address ?? '')

  useEffect(() => {
    function checkOpen() {
      const h = new Date().getHours()
      setIsOpen(closeHour > openHour ? (h >= openHour && h < closeHour) : (h >= openHour || h < closeHour % 24))
    }
    checkOpen()
    const t = setInterval(checkOpen, 60000)
    return () => clearInterval(t)
  }, [openHour, closeHour])

  function showToast(txt: string) {
    setToast(txt)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }

  const qtyOf = (id: string) => cart.filter(e => e.id === id).reduce((s, e) => s + e.qty, 0)
  const totalQty = cart.reduce((s, e) => s + e.qty, 0)
  const subtotal = cart.reduce((s, e) => {
    const item = byId(e.id)
    if (!item) return s
    // check if promo
    const promo = PROMOS.find(p => p.id === e.id)
    return s + (promo ? promo.price : item.price) * e.qty
  }, 0)
  const total = subtotal + deliveryFee

  function addItem(id: string) {
    setCart(prev => {
      const ex = prev.find(e => e.id === id)
      if (ex) return prev.map(e => e.id === id ? { ...e, qty: e.qty + 1 } : e)
      return [...prev, { id, qty: 1 }]
    })
  }

  function decItem(id: string) {
    setCart(prev => {
      const ex = prev.find(e => e.id === id)
      if (!ex) return prev
      if (ex.qty <= 1) return prev.filter(e => e.id !== id)
      return prev.map(e => e.id === id ? { ...e, qty: e.qty - 1 } : e)
    })
  }

  function clearCart() { setCart([]) }

  function buildMsg() {
    const NL = '\n'
    let msg = `*Novo Pedido — ${pizzeriaName}* 🍕${NL}${NL}`
    if (nome) msg += `Cliente: ${nome}${NL}`
    if (addr) msg += `Entrega: ${addr}${NL}`
    if (pay) msg += `Pagamento: ${pay}${NL}`
    msg += `${NL}*Itens:*${NL}`
    cart.forEach(e => {
      const item = byId(e.id)
      const promo = PROMOS.find(p => p.id === e.id)
      const nm = item?.name ?? promo?.name ?? e.id
      const pr = promo ? promo.price : (item?.price ?? 0)
      msg += `${e.qty}x ${nm} — ${BRL(pr * e.qty)}${NL}`
    })
    if (obs) msg += `${NL}Obs: ${obs}${NL}`
    msg += `${NL}Subtotal: ${BRL(subtotal)}${NL}Entrega: ${BRL(deliveryFee)}${NL}*TOTAL: ${BRL(total)}*`
    return msg
  }

  function sendWA() {
    if (!cart.length) return
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(buildMsg())}`, '_blank')
  }

  const filteredMenu = MENU.filter(item =>
    (activeCat === 'all' || item.cat === activeCat) &&
    (!query || item.name.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase()))
  )
  const showPromos = activeCat === 'all' && !query.trim()

  return (
    <div style={{ background: 'var(--cream, #FFFBF7)', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        :root {
          --red: #E8432A; --red-deep: #C0341D; --orange: #F5A623;
          --brand-grad: linear-gradient(120deg, #F5A623 0%, #E8432A 100%);
          --brown: #5a3c33; --brown-mid: #8D6E63; --cream: #FFFBF7;
          --green: #00B894; --green-badge: #27AE60;
        }
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Fraunces', Georgia, serif; }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.4} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)} }
        @keyframes addBounce { 0%{transform:scale(1)}35%{transform:scale(.88)}70%{transform:scale(1.15)}100%{transform:scale(1)} }
        @keyframes pmUp { from{transform:translateY(100%)}to{transform:none} }
        .app { display:grid; grid-template-columns: minmax(0,1fr) 392px; height:100vh; position:relative; z-index:1; }
        .main { min-width:0; overflow-y:auto; height:100vh; scrollbar-width:thin; scrollbar-color:#F3C5B0 transparent; }
        .card { background:rgba(255,255,255,.68); backdrop-filter:blur(18px) saturate(170%); border:1px solid rgba(255,255,255,.8); border-radius:20px; overflow:hidden; cursor:pointer; display:flex; flex-direction:column; transition:transform .2s,box-shadow .2s; box-shadow:0 6px 20px rgba(109,76,65,.1); }
        .card:hover { transform:translateY(-4px); box-shadow:0 16px 36px rgba(109,76,65,.16); }
        .grid { display:flex; overflow-x:auto; gap:14px; padding:2px 2px 10px; scrollbar-width:thin; scrollbar-color:#F3C5B0 transparent; }
        .grid .card { flex:0 0 168px; }
        .add-btn { width:38px;height:38px;flex-shrink:0;border:none;border-radius:50%;background:var(--brand-grad);color:#fff;font-size:21px;cursor:pointer;display:grid;place-items:center;box-shadow:0 4px 14px rgba(214,48,49,.45);transition:transform .15s,box-shadow .15s; }
        .add-btn:hover { transform:scale(1.12); box-shadow:0 6px 20px rgba(214,48,49,.6); }
        .chip { padding:8px 16px; border-radius:99px; border:none; cursor:pointer; font-family:inherit; font-size:13px; font-weight:700; background:rgba(255,255,255,.72); border:1px solid rgba(255,255,255,.9); color:var(--brown); transition:all .15s; flex-shrink:0; }
        .chip.active { background:var(--brand-grad); color:#fff; border-color:transparent; box-shadow:0 4px 14px rgba(232,67,42,.4); }
        .order { height:100vh; display:flex; flex-direction:column; background:rgba(34,21,14,.84); backdrop-filter:blur(32px) saturate(180%); border-left:1px solid rgba(255,255,255,.18); box-shadow:-8px 0 44px rgba(109,76,65,.1); }
        .order-line { display:grid; grid-template-columns:auto 1fr auto; gap:10px; align-items:center; padding:13px 4px; border-bottom:1px dashed rgba(255,200,150,.16); animation:slideInRight .2s ease; }
        .qty-btn { width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,200,150,.3);color:#FFB347;font-size:18px;font-weight:700;cursor:pointer;display:grid;place-items:center;transition:all .15s; }
        .qty-btn:active { background:var(--red);border-color:var(--red);color:#fff; }
        .wa-btn { width:100%;font-family:inherit;font-size:15px;font-weight:700;color:#fff;background:linear-gradient(135deg,#25D366 0%,#128C7E 100%);border:none;border-radius:14px;padding:16px 20px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 6px 20px rgba(37,211,102,.35);transition:all .2s; }
        .wa-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 28px rgba(37,211,102,.5); }
        .wa-btn:disabled { opacity:.4;cursor:default; }
        .mobile-bar { display:none; }
        @media(max-width:768px){
          .app { grid-template-columns:1fr; height:auto; }
          .main { height:auto; overflow:visible; }
          .order { display:none!important; }
          .mobile-bar { display:flex; position:fixed; left:0;right:0;bottom:0;z-index:100; background:#fff; border-top:1px solid #f0e8e0; padding:10px 16px; padding-bottom:max(10px,env(safe-area-inset-bottom)); align-items:center; gap:14px; box-shadow:0 -4px 24px rgba(0,0,0,.1); }
          .cart-screen { display:flex; flex-direction:column; position:fixed; inset:0; z-index:200; background:#f5f0eb; transform:translateX(100%); transition:transform .28s cubic-bezier(.4,0,.2,1); overflow:hidden; }
          .cart-screen.open { transform:translateX(0); }
          .grid .card { flex:0 0 44vw; max-width:180px; }
        }
        @media(prefers-reduced-motion:reduce){ *,*::before,*::after { animation-duration:.01ms!important; transition-duration:.01ms!important; } }
      `}</style>

      {/* Backdrops */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:520, height:520, left:-120, top:-140, borderRadius:'50%', filter:'blur(70px)', opacity:.55, background:'radial-gradient(circle,#FFD3A8,transparent 70%)' }} />
        <div style={{ position:'absolute', width:460, height:460, right:-100, top:'12%', borderRadius:'50%', filter:'blur(70px)', opacity:.55, background:'radial-gradient(circle,#FFC2C2,transparent 70%)' }} />
        <div style={{ position:'absolute', width:600, height:600, left:'18%', bottom:-240, borderRadius:'50%', filter:'blur(70px)', opacity:.55, background:'radial-gradient(circle,#FFE3A0,transparent 70%)' }} />
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', left:'50%', bottom:90, transform:'translateX(-50%)', background:'rgba(28,16,10,.92)', color:'#fff', fontSize:13, fontWeight:600, padding:'11px 18px', borderRadius:12, zIndex:400, maxWidth:'calc(100vw - 40px)', textAlign:'center', whiteSpace:'nowrap' }}>
          {toast}
        </div>
      )}

      <div className="app">
        {/* MAIN */}
        <div className="main">

          {/* Header */}
          <header style={{ position:'sticky', top:0, zIndex:20, background:'rgba(255,255,255,.72)', backdropFilter:'blur(22px) saturate(160%)', padding:'18px 28px', boxShadow:'0 2px 20px rgba(109,76,65,.08)', borderBottom:'1px solid rgba(255,255,255,.6)', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', overflow:'hidden', background:'#0d0d0d', boxShadow:'0 4px 16px rgba(232,67,42,.3)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>🍕</div>
            <div style={{ flex:1, minWidth:220 }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, flexWrap:'wrap' }}>
                <h1 className="serif" style={{ fontWeight:800, fontSize:22, color:'var(--brown)', lineHeight:1.05 }}>{pizzeriaName}</h1>
                <span style={{ fontSize:9, fontWeight:800, letterSpacing:'.14em', background:'var(--brand-grad)', color:'#fff', padding:'3px 8px', borderRadius:6 }}>CARDÁPIO DIGITAL</span>
                <span style={{ fontSize:11, letterSpacing:1, color:'#FDCB6E' }}>⭐⭐⭐⭐⭐<b style={{ color:'var(--brown-mid)', fontFamily:'Plus Jakarta Sans', fontSize:'11.5px', letterSpacing:0, marginLeft:3 }}>4,9 · 1.2k avaliações</b></span>
              </div>
              <div style={{ marginTop:3, fontSize:12, color:'var(--brown-mid)', display:'flex', gap:6, flexWrap:'wrap' }}>
                <span>🛵 {pizzeriaAddr || 'Delivery'}</span>
                {pizzeriaPhone && <><span style={{ opacity:.55 }}>·</span><span>📱 {pizzeriaPhone}</span></>}
              </div>
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:isOpen?'#EAFAF1':'#FDECEA', border:`1px solid ${isOpen?'#27AE60':'#E74C3C'}`, color:isOpen?'#27AE60':'#C0392B', fontWeight:700, fontSize:12.5, padding:'8px 14px', borderRadius:999, whiteSpace:'nowrap' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:isOpen?'#27AE60':'#E74C3C', animation:isOpen?'pulse 1.8s infinite':'none', display:'block' }} />
              {isOpen ? `⏰ Aberto até ${String(closeHour%24).padStart(2,'0')}h` : `😴 Fechado · abre às ${openHour}h`}
            </div>
          </header>

          {/* Hero com vídeo */}
          <div style={{ margin:'18px 28px 4px', borderRadius:22, overflow:'hidden', position:'relative', background:'linear-gradient(115deg,#C0341D,#E8432A 55%,#F5A623)', color:'#fff', padding:'24px 26px', minHeight:268, boxShadow:'0 16px 44px rgba(214,48,49,.3)', display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-end', gap:13 }}>
            <video style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }} autoPlay muted loop playsInline preload="metadata">
              <source src="/assets/foodporn-1.mp4" type="video/mp4" />
            </video>
            <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'linear-gradient(100deg,rgba(105,18,10,.9) 0%,rgba(150,30,15,.62) 40%,rgba(20,8,5,.22) 78%,rgba(20,8,5,.05) 100%),linear-gradient(to top,rgba(20,8,5,.55),transparent 45%)' }} />
            <div style={{ position:'relative', zIndex:2, maxWidth:560 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(0,0,0,.42)', border:'1px solid rgba(255,255,255,.3)', backdropFilter:'blur(6px)', padding:'6px 11px', borderRadius:999, fontSize:11, fontWeight:700, letterSpacing:'.3px', marginBottom:10 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'#ff4d4d', boxShadow:'0 0 8px #ff4d4d', animation:'pulse 1.4s infinite', display:'block' }} />
                AO VIVO DO FORNO
              </div>
              <h2 className="serif" style={{ fontWeight:800, fontSize:'clamp(18px,5vw,30px)', lineHeight:1.1, textShadow:'0 2px 8px rgba(0,0,0,.4)' }}>Massa fininha, borda dourada, queijo escorrendo. 🔥</h2>
              <p style={{ marginTop:6, fontSize:14, color:'rgba(255,255,255,.95)', textShadow:'0 1px 6px rgba(0,0,0,.45)' }}>Assada na hora no forno a lenha. Peça agora e receba quentinha na sua casa.</p>
            </div>
            <div style={{ position:'relative', zIndex:2, display:'flex', gap:9, flexWrap:'wrap' }}>
              {['🛵 Entrega ~40min','🔥 Forno quente agora','⭐ 4,9 de avaliação'].map(p => (
                <span key={p} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.35)', backdropFilter:'blur(8px)', padding:'8px 13px', borderRadius:999, fontSize:12.5, fontWeight:700, whiteSpace:'nowrap' }}>{p}</span>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div style={{ position:'sticky', top:92, zIndex:10, background:'rgba(255,251,247,.88)', backdropFilter:'blur(16px)', padding:'12px 28px', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', borderBottom:'1px solid rgba(255,220,200,.3)' }}>
            <div style={{ display:'flex', gap:8, overflowX:'auto', flex:1 }}>
              {CATS.map(c => (
                <button key={c.id} className={`chip${activeCat===c.id?' active':''}`} onClick={() => setActiveCat(c.id)}>{c.label}</button>
              ))}
            </div>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="🔍 Buscar pizza, lanche..." style={{ background:'rgba(255,255,255,.9)', border:'1px solid rgba(255,220,200,.6)', borderRadius:99, padding:'8px 16px', fontSize:13, color:'var(--brown)', outline:'none', width:200 }} />
          </div>

          <div style={{ padding:'0 28px 80px' }}>
            {/* Promos */}
            {showPromos && (
              <div style={{ marginTop:22 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <span style={{ width:4, height:24, borderRadius:2, background:'var(--brand-grad)', display:'block' }} />
                  <h2 className="serif" style={{ fontWeight:800, fontSize:21, color:'var(--brown)' }}>🔥 Promoções da Semana</h2>
                </div>
                <div style={{ display:'flex', gap:16, overflowX:'auto', padding:'2px 2px 10px', scrollbarWidth:'thin', scrollbarColor:'#F3C5B0 transparent' }}>
                  {PROMOS.map(p => {
                    const full = p.items.reduce((s,id) => s + (byId(id)?.price??0), 0)
                    const off = Math.round((1 - p.price/full)*100)
                    return (
                      <div key={p.id} onClick={() => { addItem(p.id); showToast(`${p.name} no pedido ✅`) }} style={{ flexShrink:0, width:326, display:'flex', borderRadius:20, overflow:'hidden', cursor:'pointer', background:'rgba(255,255,255,.6)', backdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,.7)', boxShadow:'0 10px 30px rgba(214,48,49,.14)', transition:'transform .2s,box-shadow .2s' }}>
                        <div style={{ position:'relative', width:124, flexShrink:0, overflow:'hidden', background:'linear-gradient(145deg,#FFECD2,#FCB69F)' }}>
                          {off>0&&<span style={{ position:'absolute', top:8, left:8, background:'var(--red)', color:'#fff', fontSize:11, fontWeight:800, padding:'4px 8px', borderRadius:8, zIndex:2 }}>-{off}%</span>}
                          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>🍕</div>
                        </div>
                        <div style={{ flex:1, minWidth:0, padding:'13px 14px 13px 15px', display:'flex', flexDirection:'column' }}>
                          <div className="serif" style={{ fontSize:16, fontWeight:700, color:'var(--brown)', lineHeight:1.12 }}>{p.name}</div>
                          <div style={{ fontSize:11.5, color:'var(--brown-mid)', lineHeight:1.4, marginTop:4, flex:1 }}>{p.desc}</div>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10, gap:8 }}>
                            <div>
                              {off>0&&<div style={{ fontSize:11, color:'var(--brown-mid)', textDecoration:'line-through' }}>{BRL(full)}</div>}
                              <div className="serif" style={{ fontSize:20, fontWeight:800, color:'var(--red)' }}><small style={{ fontSize:12, fontWeight:600 }}>R$</small> {p.price.toFixed(2).replace('.',',')}</div>
                            </div>
                            <button className="add-btn">+</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Menu */}
            {CAT_ORDER.map(catId => {
              const items = filteredMenu.filter(i => i.cat === catId)
              if (!items.length) return null
              return (
                <div key={catId} style={{ marginTop:24 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                    <span style={{ width:4, height:24, borderRadius:2, background:'var(--brand-grad)', display:'block' }} />
                    <h2 className="serif" style={{ fontWeight:800, fontSize:21, color:'var(--brown)' }}>{CAT_LABELS[catId]}</h2>
                    <span style={{ fontSize:13, color:'var(--brown-mid)' }}>· {items.length} {items.length===1?'item':'itens'}</span>
                  </div>
                  <div className="grid">
                    {items.map(item => {
                      const q = qtyOf(item.id)
                      return (
                        <div key={item.id} className="card" onClick={() => { addItem(item.id); showToast(`${item.name} adicionado ✅`) }}>
                          <div style={{ height:128, background:'linear-gradient(145deg,#FFECD2,#FCB69F)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, position:'relative' }}>
                            {item.emoji}
                            {item.tag==='hot'&&<span style={{ position:'absolute', top:8, left:8, background:'var(--red)', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 7px', borderRadius:7 }}>🔥 Mais pedido</span>}
                            {item.tag==='new'&&<span style={{ position:'absolute', top:8, left:8, background:'#8B5CF6', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 7px', borderRadius:7 }}>✨ Novidade</span>}
                            {item.social&&<span style={{ position:'absolute', bottom:8, left:8, right:8, background:'rgba(0,0,0,.5)', color:'#fff', fontSize:10, fontWeight:600, padding:'3px 7px', borderRadius:7, textAlign:'center' }}>{item.social}</span>}
                            {q>0&&<span style={{ position:'absolute', top:8, right:8, background:'var(--green)', color:'#fff', fontSize:12, fontWeight:800, width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{q}</span>}
                          </div>
                          <div style={{ padding:'14px 16px 0', flex:1 }}>
                            <h3 className="serif" style={{ fontWeight:700, fontSize:16, color:'var(--brown)', lineHeight:1.2, marginBottom:4 }}>{item.name}</h3>
                            <p style={{ fontSize:12, color:'var(--brown-mid)', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.desc}</p>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px 16px' }}>
                            <div className="serif" style={{ fontWeight:800, fontSize:20, color:'var(--red)' }}><small style={{ fontSize:13, fontWeight:600 }}>R$</small> {item.price.toFixed(2).replace('.',',')}</div>
                            <button className="add-btn" onClick={e => { e.stopPropagation(); addItem(item.id); showToast(`${item.name} adicionado ✅`) }}>+</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            {!filteredMenu.length&&(
              <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--brown-mid)' }}>
                <div style={{ fontSize:48, opacity:.35, marginBottom:12 }}>🔍</div>
                <p>Nenhum item encontrado.<br/>Tente outra busca ou categoria.</p>
              </div>
            )}
          </div>
        </div>

        {/* ORDER PANEL DESKTOP */}
        <aside className="order">
          <div style={{ padding:'22px 24px 16px', borderBottom:'1px solid rgba(255,200,150,.16)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:18 }}>🛒</span>
              <h2 className="serif" style={{ fontWeight:800, fontSize:20, color:'#FFF1E0' }}>Seu Pedido</h2>
              {totalQty>0&&<span style={{ minWidth:24, height:24, padding:'0 8px', borderRadius:999, background:'var(--red)', color:'#fff', fontSize:12.5, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{totalQty}</span>}
            </div>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'8px 20px' }}>
            {cart.length===0 ? (
              <div style={{ textAlign:'center', padding:'44px 18px' }}>
                <div style={{ fontSize:60, opacity:.3, marginBottom:10 }}>🍕</div>
                <div className="serif" style={{ fontSize:16, color:'rgba(255,225,190,.62)', fontWeight:700 }}>Seu carrinho está vazio</div>
                <div style={{ fontSize:13, marginTop:4, color:'rgba(255,225,190,.4)' }}>Escolha as delícias do cardápio</div>
              </div>
            ) : cart.map(e => {
              const item = byId(e.id)
              const promo = PROMOS.find(p => p.id === e.id)
              const nm = item?.name ?? promo?.name ?? e.id
              const pr = promo ? promo.price : (item?.price ?? 0)
              return (
                <div key={e.id} className="order-line">
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <button className="qty-btn" onClick={() => decItem(e.id)}>−</button>
                    <span className="serif" style={{ minWidth:22, textAlign:'center', fontWeight:700, fontSize:16, color:'#FFF1E0' }}>{e.qty}</span>
                    <button className="qty-btn" onClick={() => addItem(e.id)}>+</button>
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#FFF1E0', lineHeight:1.2 }}>{nm}</div>
                    <div style={{ fontSize:11, color:'rgba(255,225,190,.62)', marginTop:2 }}>{BRL(pr)} cada</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                    <div className="serif" style={{ fontWeight:700, fontSize:14, color:'#FFB347', whiteSpace:'nowrap' }}>{BRL(pr*e.qty)}</div>
                    <button onClick={() => decItem(e.id)} style={{ background:'rgba(255,100,80,.2)', border:'1px solid rgba(255,150,130,.5)', borderRadius:8, cursor:'pointer', fontSize:12, color:'#ffb3a0', padding:'4px 10px', fontWeight:700, fontFamily:'inherit' }}>remover</button>
                  </div>
                </div>
              )
            })}

            {/* Order bumps */}
            {totalQty>0&&(
              <div style={{ marginTop:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, fontWeight:700, color:'#FFF1E0', marginBottom:10 }}>
                  <span style={{ color:'#F5A623' }}>✨</span> Que tal complementar?
                </div>
                <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
                  {BUMP_IDS.map(byId).filter(Boolean).filter(it => qtyOf(it!.id)===0).map(it => it && (
                    <div key={it.id} onClick={() => { addItem(it.id); showToast(`${it.name} adicionado ✅`) }} style={{ flexShrink:0, width:122, borderRadius:14, overflow:'hidden', cursor:'pointer', background:'rgba(255,255,255,.7)', border:'1px solid rgba(255,255,255,.8)', boxShadow:'0 4px 14px rgba(109,76,65,.08)', transition:'transform .15s' }}>
                      <div style={{ height:56, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>{it.emoji}</div>
                      <div style={{ padding:'7px 9px 9px' }}>
                        <div style={{ fontSize:11.5, fontWeight:700, color:'var(--brown)', lineHeight:1.15 }}>{it.name}</div>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:5 }}>
                          <span className="serif" style={{ fontWeight:700, fontSize:13, color:'var(--red)' }}>{BRL(it.price)}</span>
                          <button style={{ width:22, height:22, borderRadius:'50%', background:'var(--red)', color:'#fff', border:'none', fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ borderTop:'1px solid rgba(255,200,150,.16)', padding:'14px 24px 18px', background:'rgba(18,11,7,.5)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'rgba(255,225,190,.62)', marginBottom:8 }}><span>Subtotal</span><span style={{ color:'#FFF1E0', fontWeight:600 }}>{BRL(subtotal)}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'rgba(255,225,190,.62)', marginBottom:8 }}><span>Entrega</span><span style={{ color:'#FFF1E0', fontWeight:600 }}>{BRL(deliveryFee)}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:12, paddingTop:13, borderTop:'1px dashed rgba(255,200,150,.16)', fontSize:15, fontWeight:700, color:'#FFF1E0' }}>
              <span>Total</span>
              <span className="serif" style={{ fontSize:23, fontWeight:800, color:'#FFB347' }}>{BRL(total)}</span>
            </div>

            {/* Campos checkout */}
            <div style={{ marginTop:12 }}>
              {[{lbl:'Seu nome',val:nome,set:setNome,ph:'Como podemos te chamar?'},{lbl:'Endereço',val:addr,set:setAddr,ph:'Rua, número, bairro...'},{lbl:'Observações',val:obs,set:setObs,ph:'Sem cebola, borda recheada...'}].map(f=>(
                <div key={f.lbl} style={{ marginBottom:8 }}>
                  <label style={{ display:'block', fontSize:10.5, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', color:'rgba(255,225,190,.62)', marginBottom:5 }}>{f.lbl}</label>
                  <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{ width:'100%', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,200,150,.3)', borderRadius:10, padding:'9px 12px', fontSize:13.5, color:'#FFF1E0', fontFamily:'inherit', outline:'none' }} />
                </div>
              ))}
              <div style={{ marginBottom:8 }}>
                <label style={{ display:'block', fontSize:10.5, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', color:'rgba(255,225,190,.62)', marginBottom:5 }}>Pagamento</label>
                <div style={{ display:'flex', gap:7 }}>
                  {['💠 Pix','💳 Cartão','💵 Dinheiro'].map(p=>(
                    <button key={p} onClick={()=>setPay(p)} style={{ flex:1, fontFamily:'inherit', fontSize:12, fontWeight:700, cursor:'pointer', padding:'9px 6px', borderRadius:10, border:'1.5px solid rgba(255,200,150,.3)', background:pay===p?'var(--red)':'rgba(255,255,255,.08)', color:pay===p?'#fff':'rgba(255,225,190,.62)', transition:'all .15s' }}>{p}</button>
                  ))}
                </div>
              </div>
            </div>

            <button className="wa-btn" disabled={!cart.length} onClick={sendWA} style={{ marginTop:12 }}>
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Enviar pedido no WhatsApp
            </button>
            {cart.length>0&&<button onClick={clearCart} style={{ width:'100%', textAlign:'center', marginTop:10, fontSize:12.5, color:'rgba(255,225,190,.62)', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Limpar pedido</button>}
          </div>
        </aside>
      </div>

      {/* MOBILE bottom bar */}
      <div className="mobile-bar" style={{ display: totalQty > 0 ? 'flex' : 'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, position:'relative' }}>
            <span style={{ fontSize:20 }}>🛒</span>
            <span style={{ position:'absolute', top:-6, right:-6, minWidth:20, height:20, padding:'0 5px', background:'#ff6b00', color:'#fff', borderRadius:99, fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' }}>{totalQty}</span>
          </div>
          <div>
            <div style={{ fontSize:12, color:'#888' }}>{totalQty} {totalQty===1?'item':'itens'}</div>
            <div className="serif" style={{ fontSize:18, fontWeight:800, color:'#222', lineHeight:1.1 }}>{BRL(total)}</div>
          </div>
        </div>
        <button onClick={() => setCartOpen(true)} style={{ background:'var(--red)', color:'#fff', fontFamily:'inherit', fontWeight:700, fontSize:14, border:'none', borderRadius:12, padding:'13px 20px', cursor:'pointer', flexShrink:0 }}>Ver pedido</button>
      </div>

      {/* MOBILE cart screen */}
      <div className={`cart-screen${cartOpen?' open':''}`}>
        <div style={{ background:'#fff', padding:'14px 16px 12px', paddingTop:'max(14px,env(safe-area-inset-top))', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid #f0e8e0', flexShrink:0 }}>
          <button onClick={() => setCartOpen(false)} style={{ width:36, height:36, borderRadius:'50%', background:'#f5f0eb', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h2 className="serif" style={{ fontSize:20, fontWeight:800, color:'#1a1a1a', flex:1 }}>Seu Pedido</h2>
          <span style={{ background:'var(--red)', color:'#fff', fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:99 }}>{totalQty}</span>
        </div>

        <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'12px 16px' }}>
          {/* Items */}
          <div style={{ background:'#fff', borderRadius:16, padding:'4px 0', marginBottom:12 }}>
            {cart.map(e => {
              const item = byId(e.id)
              const promo = PROMOS.find(p => p.id === e.id)
              const nm = item?.name ?? promo?.name ?? e.id
              const pr = promo ? promo.price : (item?.price ?? 0)
              return (
                <div key={e.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderBottom:'1px solid #f5f0eb' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <button onClick={()=>decItem(e.id)} style={{ width:30, height:30, borderRadius:'50%', border:'1.5px solid var(--red)', background:'#fff', color:'var(--red)', fontSize:18, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                    <span className="serif" style={{ fontWeight:800, fontSize:16, color:'#1a1a1a', minWidth:20, textAlign:'center' }}>{e.qty}</span>
                    <button onClick={()=>addItem(e.id)} style={{ width:30, height:30, borderRadius:'50%', border:'none', background:'var(--red)', color:'#fff', fontSize:18, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'#1a1a1a' }}>{nm}</div>
                    <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{BRL(pr)} cada</div>
                  </div>
                  <div className="serif" style={{ fontWeight:700, fontSize:15, color:'#1a1a1a', whiteSpace:'nowrap' }}>{BRL(pr*e.qty)}</div>
                </div>
              )
            })}
          </div>

          {/* Bumps mobile */}
          {BUMP_IDS.map(byId).filter(Boolean).filter(it=>qtyOf(it!.id)===0).length>0&&(
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#555', margin:'16px 0 10px', padding:'0 4px' }}>✨ Que tal completar o pedido?</div>
              <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
                {BUMP_IDS.map(byId).filter(Boolean).filter(it=>qtyOf(it!.id)===0).map(it => it && (
                  <div key={it.id} onClick={()=>{addItem(it.id);showToast(`${it.name} adicionado ✅`)}} style={{ flexShrink:0, width:120, background:'#fff', borderRadius:14, overflow:'hidden', border:'1px solid #f0e8e0', cursor:'pointer' }}>
                    <div style={{ height:72, display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, background:'#faf5f0' }}>{it.emoji}</div>
                    <div style={{ padding:'8px 10px 10px' }}>
                      <div style={{ fontSize:12, fontWeight:600, color:'#1a1a1a', lineHeight:1.2 }}>{it.name}</div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:4 }}>
                        <span className="serif" style={{ fontWeight:700, fontSize:13, color:'var(--red)' }}>{BRL(it.price)}</span>
                        <button style={{ width:24, height:24, borderRadius:'50%', background:'var(--red)', color:'#fff', border:'none', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div style={{ background:'#fff', borderRadius:16, padding:16, marginBottom:12, marginTop:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'#666', marginBottom:10 }}><span>Subtotal</span><span>{BRL(subtotal)}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'#666', marginBottom:10 }}><span>Taxa de entrega</span><span>{BRL(deliveryFee)}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:15, fontWeight:700, color:'#1a1a1a', paddingTop:12, borderTop:'1px dashed #e0d8d0', marginBottom:0 }}>
              <span>Total</span>
              <span className="serif" style={{ fontSize:22, fontWeight:800, color:'var(--red)' }}>{BRL(total)}</span>
            </div>
          </div>

          {/* Checkout fields */}
          <div style={{ background:'#fff', borderRadius:16, padding:'14px 16px', marginBottom:12 }}>
            {[{lbl:'Seu nome',val:nome,set:setNome,ph:'Como podemos te chamar?',mb:12},{lbl:'Endereço de entrega',val:addr,set:setAddr,ph:'Rua, número, bairro...',mb:12}].map(f=>(
              <div key={f.lbl} style={{ marginBottom:f.mb }}>
                <label style={{ fontSize:11, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', color:'#888', display:'block', marginBottom:8 }}>{f.lbl}</label>
                <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{ width:'100%', fontFamily:'inherit', fontSize:14, color:'#1a1a1a', border:'1.5px solid #e0d8d0', borderRadius:10, padding:'11px 14px', outline:'none', background:'#faf5f0' }} />
              </div>
            ))}
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', color:'#888', display:'block', marginBottom:8 }}>Pagamento</label>
              <div style={{ display:'flex', gap:8 }}>
                {['💠 Pix','💳 Cartão','💵 Dinheiro'].map(p=>(
                  <button key={p} onClick={()=>setPay(p)} style={{ flex:1, fontFamily:'inherit', fontSize:12, fontWeight:700, cursor:'pointer', padding:'9px 6px', borderRadius:10, border:'1.5px solid #e0d8d0', background:pay===p?'var(--red)':'#faf5f0', color:pay===p?'#fff':'#555' }}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', color:'#888', display:'block', marginBottom:8 }}>Observações (opcional)</label>
              <input value={obs} onChange={e=>setObs(e.target.value)} placeholder="Sem cebola, borda recheada..." style={{ width:'100%', fontFamily:'inherit', fontSize:14, color:'#1a1a1a', border:'1.5px solid #e0d8d0', borderRadius:10, padding:'11px 14px', outline:'none', background:'#faf5f0' }} />
            </div>
          </div>
        </div>

        <div style={{ background:'#fff', padding:'12px 16px', paddingBottom:'max(12px,env(safe-area-inset-bottom))', borderTop:'1px solid #f0e8e0', flexShrink:0 }}>
          <button onClick={sendWA} disabled={!cart.length} style={{ width:'100%', fontFamily:'inherit', fontSize:15, fontWeight:700, color:'#fff', background:'#25D366', border:'none', borderRadius:14, padding:'15px 20px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Enviar pedido no WhatsApp
          </button>
          <button onClick={()=>{clearCart();setCartOpen(false)}} style={{ display:'block', width:'100%', textAlign:'center', marginTop:10, fontSize:13, color:'#aaa', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Limpar carrinho</button>
        </div>
      </div>
    </div>
  )
}
