'use client'

import { useState, useEffect, useRef } from 'react'

// ── Fotos ────────────────────────────────────────────────────────────────────
const PH = {
  calabresa:   'https://images.unsplash.com/photo-1593504049359-74330189a345?w=500&q=80&auto=format&fit=crop',
  pepperoni:   'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80&auto=format&fit=crop',
  margherita:  'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&q=80&auto=format&fit=crop',
  pizza1:      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80&auto=format&fit=crop',
  pizza2:      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80&auto=format&fit=crop',
  pizza3:      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=80&auto=format&fit=crop',
  pizza4:      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80&auto=format&fit=crop',
  cheese:      'https://images.unsplash.com/photo-1548369937-47519962c11a?w=500&q=80&auto=format&fit=crop',
  dessertPizza:'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&q=80&auto=format&fit=crop',
  chocolate:   'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80&auto=format&fit=crop',
  strawberry:  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80&auto=format&fit=crop',
  nutella:     'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500&q=80&auto=format&fit=crop',
  burger1:     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80&auto=format&fit=crop',
  burger2:     'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80&auto=format&fit=crop',
  burger3:     'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80&auto=format&fit=crop',
  soda:        'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80&auto=format&fit=crop',
  soda2l:      'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500&q=80&auto=format&fit=crop',
  juice:       'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80&auto=format&fit=crop',
  water:       'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=500&q=80&auto=format&fit=crop',
}

// ── Cardápio ─────────────────────────────────────────────────────────────────
interface MenuItem { id:string; cat:string; emoji:string; name:string; desc:string; price:number; tag:string|null; social:string|null; img:string }

const MENU: MenuItem[] = [
  { id:'s1',  img:PH.calabresa,   cat:'salgadas', emoji:'🍕', name:'Calabresa',        desc:'Calabresa fatiada, cebola e azeitonas sobre molho de tomate',           price:45, tag:'hot', social:'🔥 Mais pedida' },
  { id:'s2',  img:PH.pizza2,      cat:'salgadas', emoji:'🍗', name:'Frango c/ Catupiry',desc:'Frango desfiado temperado e catupiry original cremoso',                  price:48, tag:null,  social:'❤️ Favorita da casa' },
  { id:'s3',  img:PH.pizza1,      cat:'salgadas', emoji:'🍕', name:'Portuguesa',        desc:'Presunto, ovo, cebola, pimentão e azeitona — fartura em cada fatia',     price:47, tag:'hot', social:'🔥 31 pedidos hoje' },
  { id:'s4',  img:PH.cheese,      cat:'salgadas', emoji:'🧀', name:'Quatro Queijos',    desc:'Mussarela, parmesão, catupiry e cheddar derretidos',                     price:52, tag:null,  social:null },
  { id:'s5',  img:PH.margherita,  cat:'salgadas', emoji:'🍅', name:'Margherita',        desc:'Molho de tomate fresco, mussarela e manjericão perfumado',                price:42, tag:null,  social:null },
  { id:'s6',  img:PH.pizza3,      cat:'salgadas', emoji:'🥓', name:'Frango c/ Bacon',   desc:'Frango, bacon crocante e cream cheese — combinação viciante',             price:50, tag:'new', social:null },
  { id:'s7',  img:PH.pizza4,      cat:'salgadas', emoji:'🐟', name:'Atum',              desc:'Atum selecionado, cebola e azeitonas',                                    price:46, tag:null,  social:null },
  { id:'s8',  img:PH.pizza2,      cat:'salgadas', emoji:'🌴', name:'Palmito',           desc:'Palmito pupunha macio, mussarela e tomate',                               price:47, tag:null,  social:null },
  { id:'s9',  img:PH.pizza3,      cat:'salgadas', emoji:'🥦', name:'Brócolis c/ Bacon', desc:'Brócolis no ponto, bacon e alho dourado no azeite',                       price:48, tag:null,  social:null },
  { id:'s10', img:PH.pepperoni,   cat:'salgadas', emoji:'🍕', name:'Pepperoni',         desc:'Pepperoni importado levemente curado e mussarela',                        price:54, tag:'new', social:'✨ Nova queridinha' },
  { id:'d1',  img:PH.strawberry,  cat:'doces',    emoji:'🍓', name:'Chocolate c/ Morango',desc:'Chocolate ao leite cremoso e morangos frescos fatiados',                price:48, tag:'hot', social:'🔥 Mais pedida nas doces' },
  { id:'d2',  img:PH.chocolate,   cat:'doces',    emoji:'🍫', name:'Brigadeiro',        desc:'Brigadeiro gourmet, granulado belga e leite condensado',                  price:46, tag:null,  social:null },
  { id:'d3',  img:PH.dessertPizza,cat:'doces',    emoji:'🍌', name:'Banana c/ Canela',  desc:'Banana caramelizada, canela e leite condensado',                          price:44, tag:null,  social:null },
  { id:'d4',  img:PH.dessertPizza,cat:'doces',    emoji:'🧀', name:'Romeu e Julieta',   desc:'Goiabada cremosa derretendo sobre mussarela',                             price:44, tag:'new', social:null },
  { id:'d5',  img:PH.chocolate,   cat:'doces',    emoji:'🥥', name:'Prestígio',         desc:'Chocolate ao leite e coco ralado fresquinho',                             price:46, tag:null,  social:null },
  { id:'d6',  img:PH.nutella,     cat:'doces',    emoji:'🍫', name:'Nutella c/ Morango',desc:'Nutella generosa e morangos fatiados — pura indulgência',                 price:52, tag:'hot', social:'🔥 Some rápido!' },
  { id:'l1',  img:PH.burger1,     cat:'lanches',  emoji:'🍔', name:'X-Bacon Especial',  desc:'Hambúrguer artesanal, bacon crocante, queijo e alface',                   price:28, tag:'hot', social:'🔥 Top dos lanches' },
  { id:'l2',  img:PH.burger2,     cat:'lanches',  emoji:'🍗', name:'X-Frango',          desc:'Frango empanado sequinho, queijo e maionese da casa',                     price:25, tag:null,  social:null },
  { id:'l3',  img:PH.burger3,     cat:'lanches',  emoji:'🥗', name:'X-Salada',          desc:'Hambúrguer, queijo, alface e tomate',                                     price:22, tag:null,  social:null },
  { id:'b1',  img:PH.soda,        cat:'bebidas',  emoji:'🥤', name:'Refrigerante Lata', desc:'Coca-Cola, Guaraná ou Sprite geladíssimos',                               price:6,  tag:null,  social:null },
  { id:'b2',  img:PH.soda2l,      cat:'bebidas',  emoji:'🥤', name:'Refrigerante 2L',   desc:'Coca-Cola ou Guaraná para toda a família',                                price:12, tag:null,  social:null },
  { id:'b3',  img:PH.juice,       cat:'bebidas',  emoji:'🍊', name:'Suco Natural',      desc:'Laranja, limão ou maracujá feitos na hora',                               price:10, tag:'new', social:null },
  { id:'b4',  img:PH.water,       cat:'bebidas',  emoji:'💧', name:'Água Mineral',      desc:'500ml com ou sem gás',                                                    price:4,  tag:null,  social:null },
]

const PIZZAS_SALGADAS = MENU.filter(m => m.cat === 'salgadas')
const PIZZAS_DOCES    = MENU.filter(m => m.cat === 'doces')

const CATS = [
  { id:'vendidos', label:'⭐ Mais Vendidos' },
  { id:'promos',   label:'🔥 Promoções' },
  { id:'combos',   label:'🎁 Combos' },
  { id:'bebidas',  label:'🥤 Bebidas' },
  { id:'salgadas', label:'🍕 Salgadas' },
  { id:'doces',    label:'🍫 Doces' },
  { id:'lanches',  label:'🍔 Lanches' },
]
const CAT_LABEL: Record<string,string> = { salgadas:'🍕 Pizzas Salgadas', doces:'🍫 Pizzas Doces', lanches:'🍔 Lanches', bebidas:'🥤 Bebidas' }
const ORDER_CATS = ['salgadas','doces','lanches','bebidas']
const BUMP_IDS   = ['b1','b2','b3','d1']
const DELIVERY   = 5

const BORDAS = [
  { id:'catupiry', name:'Borda de Catupiry', price:10 },
  { id:'cheddar',  name:'Borda de Cheddar',  price:10 },
]

const EXTRAS: Record<string,{id:string;name:string;price:number}[]> = {
  salgadas:[
    { id:'molho',     name:'Mais molho de tomate', price:3 },
    { id:'queijo',    name:'Mais queijo',           price:6 },
    { id:'bacon',     name:'Bacon',                 price:7 },
    { id:'calabresa', name:'Calabresa extra',       price:7 },
    { id:'catupiry',  name:'Catupiry',              price:6 },
    { id:'cheddar',   name:'Cheddar',               price:6 },
    { id:'milho',     name:'Milho',                 price:4 },
    { id:'palmito',   name:'Palmito',               price:5 },
    { id:'ovo',       name:'Ovo',                   price:4 },
  ],
  doces:[
    { id:'condensado', name:'Leite condensado', price:4 },
    { id:'morango',    name:'Morango extra',    price:6 },
    { id:'granulado',  name:'Granulado',        price:3 },
    { id:'nutella',    name:'Nutella extra',    price:8 },
  ],
  lanches:[
    { id:'queijo',  name:'Mais queijo',       price:4 },
    { id:'bacon',   name:'Bacon',             price:5 },
    { id:'ovo',     name:'Ovo',               price:3 },
    { id:'burger',  name:'Hambúrguer extra',  price:8 },
    { id:'cheddar', name:'Cheddar',           price:4 },
  ],
}

const PROMOS = [
  { id:'p1', name:'Combo Casal',      desc:'1 Pizza Grande + 2 Refri Lata — noite perfeita a dois',  items:['s1','b1','b1'],       price:52, group:'combos' as const },
  { id:'p2', name:'Sexta da Família', desc:'2 Pizzas Salgadas + Refri 2L — ninguém passa fome',      items:['s3','s4','b2'],       price:99, group:'combos' as const },
  { id:'p3', name:'Doce Encontro',    desc:'1 Salgada + 1 Doce — do salgado ao docinho',             items:['s5','d1'],            price:79, group:'promos' as const },
  { id:'p4', name:'Combo Lanche',     desc:'2 X-Bacon + 2 Refri Lata — a pedida da galera',          items:['l1','l1','b1','b1'], price:62, group:'combos' as const },
]

const menuById  = (id:string) => MENU.find(m=>m.id===id)
const promoById = (id:string) => PROMOS.find(p=>p.id===id)
const extrasOf  = (cat:string) => EXTRAS[cat] || []
const BRL = (n:number) => 'R$ '+n.toFixed(2).replace('.',',')

// ── Tipos do carrinho ─────────────────────────────────────────────────────────
type CartMode = 'normal' | 'meio'
interface CartEntry {
  id:     string
  qty:    number
  borda:  string|null
  extras: string[]
  mode:   CartMode
  // meio a meio
  id2?:    string       // segundo sabor
  extras2?: string[]   // extras do segundo sabor
}
interface Cart { [key:string]: CartEntry }

function keyOf(e: Pick<CartEntry,'id'|'borda'|'extras'|'mode'|'id2'|'extras2'>) {
  let k = e.id + (e.mode==='meio' ? `|meio:${e.id2}` : '')
  if (e.borda) k += `|b:${e.borda}`
  if (e.extras?.length) k += `|e:${[...e.extras].sort().join(',')}`
  if (e.extras2?.length) k += `|e2:${[...e.extras2].sort().join(',')}`
  return k
}

function unitPrice(e: CartEntry): number {
  const promo = promoById(e.id)
  if (promo) return promo.price
  const item = menuById(e.id)
  if (!item) return 0
  let p = item.price

  if (e.mode === 'meio' && e.id2) {
    const item2 = menuById(e.id2)
    if (item2) p = Math.max(p, item2.price) // cobra o maior
  }

  if (e.borda) { const b = BORDAS.find(x=>x.id===e.borda); if(b) p += b.price }

  const exs = extrasOf(item.cat)
  e.extras.forEach(xid => { const x = exs.find(o=>o.id===xid); if(x) p += x.price })

  if (e.mode === 'meio' && e.id2 && e.extras2?.length) {
    const item2 = menuById(e.id2)
    if (item2) {
      const exs2 = extrasOf(item2.cat)
      e.extras2.forEach(xid => { const x = exs2.find(o=>o.id===xid); if(x) p += x.price })
    }
  }

  return p
}

function labelEntry(e: CartEntry): string {
  const promo = promoById(e.id)
  if (promo) return promo.name
  const item = menuById(e.id)
  if (!item) return e.id
  if (e.mode === 'meio' && e.id2) {
    const item2 = menuById(e.id2)
    return `½ ${item.name} + ½ ${item2?.name}`
  }
  return item.name
}

function optionsLabel(e: CartEntry): string {
  const parts: string[] = []
  if (e.borda) { const b = BORDAS.find(x=>x.id===e.borda); if(b) parts.push(b.name) }
  const item = menuById(e.id)
  if (item) {
    const exs = extrasOf(item.cat)
    e.extras.forEach(xid => { const x = exs.find(o=>o.id===xid); if(x) parts.push('+ '+x.name) })
  }
  if (e.mode === 'meio' && e.id2 && e.extras2?.length) {
    const item2 = menuById(e.id2)
    if (item2) {
      const exs2 = extrasOf(item2.cat)
      e.extras2.forEach(xid => { const x = exs2.find(o=>o.id===xid); if(x) parts.push('+ '+x.name+' (2ª metade)') })
    }
  }
  return parts.join(' · ')
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function CardapioClient({ pizzeria }: { pizzeria: Record<string,string|number|null> }) {
  const [cart,       setCart]       = useState<Cart>({})
  const [activeCat,  setActiveCat]  = useState('vendidos')
  const [query,      setQuery]      = useState('')
  const [cartOpen,   setCartOpen]   = useState(false)
  const [nome,       setNome]       = useState('')
  const [addr,       setAddr]       = useState('')
  const [pay,        setPay]        = useState('')
  const [change,     setChange]     = useState('')
  const [obs,        setObs]        = useState('')
  const [toast,      setToast]      = useState('')
  const [isOpenNow,  setIsOpenNow]  = useState(true)
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null)

  // Modal modo: 'product' = pizza normal, 'meio' = meio a meio step 1/2
  const [modal,      setModal]      = useState<'product'|'meio'|null>(null)
  const [pmItem,     setPmItem]     = useState<MenuItem|null>(null)
  const [pmQty,      setPmQty]      = useState(1)
  const [pmBorda,    setPmBorda]    = useState<string|null>(null)
  const [pmExtras,   setPmExtras]   = useState<Set<string>>(new Set())
  // meio a meio
  const [meioCat,    setMeioCat]    = useState<'salgadas'|'doces'>('salgadas')
  const [meioStep,   setMeioStep]   = useState<1|2>(1)
  const [meioItem1,  setMeioItem1]  = useState<MenuItem|null>(null)
  const [meioItem2,  setMeioItem2]  = useState<MenuItem|null>(null)
  const [meioExtras1,setMeioExtras1]= useState<Set<string>>(new Set())
  const [meioExtras2,setMeioExtras2]= useState<Set<string>>(new Set())
  const [meioBorda,  setMeioBorda]  = useState<string|null>(null)
  const [meioQty,    setMeioQty]    = useState(1)

  const waNumber    = String(pizzeria.wa_number ?? '5511980794899')
  const openHour    = Number(pizzeria.open_hour  ?? 18)
  const closeHour   = Number(pizzeria.close_hour ?? 24)
  const deliveryFee = Number(pizzeria.delivery_fee ?? DELIVERY)

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours()
      setIsOpenNow(closeHour>openHour ? (h>=openHour&&h<closeHour) : (h>=openHour||h<closeHour%24))
    }
    check(); const t = setInterval(check,60000); return ()=>clearInterval(t)
  },[openHour,closeHour])

  function showToast(txt:string) {
    setToast(txt)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(()=>setToast(''),2200)
  }

  const entries   = () => Object.entries(cart).map(([key,e])=>({key,e}))
  const totalQty  = () => Object.values(cart).reduce((a,e)=>a+e.qty,0)
  const qtyOfId   = (id:string) => Object.values(cart).reduce((s,e)=>s+(e.id===id||e.id2===id?e.qty:0),0)
  const subtotal  = entries().reduce((s,{e})=>s+unitPrice(e)*e.qty,0)
  const total     = subtotal + deliveryFee

  function addEntry(entry: Omit<CartEntry,'qty'>, qty=1) {
    const k = keyOf(entry)
    setCart(prev=>{
      const next={...prev}
      if(next[k]) next[k]={...next[k],qty:next[k].qty+qty}
      else next[k]={...entry,qty}
      return next
    })
  }
  function incKey(k:string){ setCart(prev=>prev[k]?{...prev,[k]:{...prev[k],qty:prev[k].qty+1}}:prev) }
  function decKey(k:string){ setCart(prev=>{ if(!prev[k]) return prev; const n={...prev}; if(n[k].qty<=1) delete n[k]; else n[k]={...n[k],qty:n[k].qty-1}; return n }) }
  function delKey(k:string){ setCart(prev=>{ const n={...prev}; delete n[k]; return n }) }
  function clearCart(){ setCart({}) }

  // ── Modal produto normal ──
  function openProduct(item:MenuItem) {
    setPmItem(item); setPmQty(1); setPmBorda(null); setPmExtras(new Set()); setModal('product')
  }
  function pmUnit() {
    if(!pmItem) return 0
    let p = pmItem.price
    if(pmBorda){ const b=BORDAS.find(x=>x.id===pmBorda); if(b) p+=b.price }
    pmExtras.forEach(xid=>{ const x=extrasOf(pmItem.cat).find(o=>o.id===xid); if(x) p+=x.price })
    return p
  }
  function addFromModal() {
    if(!pmItem) return
    addEntry({ id:pmItem.id, borda:pmBorda, extras:[...pmExtras], mode:'normal' }, pmQty)
    showToast(`${pmQty}x ${pmItem.name} adicionado ✅`)
    setModal(null)
  }

  // ── Modal meio a meio ──
  function openMeio() {
    setMeioStep(1); setMeioItem1(null); setMeioItem2(null)
    setMeioExtras1(new Set()); setMeioExtras2(new Set())
    setMeioBorda(null); setMeioQty(1); setMeioCat('salgadas')
    setModal('meio')
  }
  function meioUnit() {
    if(!meioItem1||!meioItem2) return 0
    let p = Math.max(meioItem1.price, meioItem2.price)
    if(meioBorda){ const b=BORDAS.find(x=>x.id===meioBorda); if(b) p+=b.price }
    const exs1=extrasOf(meioItem1.cat)
    meioExtras1.forEach(xid=>{ const x=exs1.find(o=>o.id===xid); if(x) p+=x.price })
    const exs2=extrasOf(meioItem2.cat)
    meioExtras2.forEach(xid=>{ const x=exs2.find(o=>o.id===xid); if(x) p+=x.price })
    return p
  }
  function addMeio() {
    if(!meioItem1||!meioItem2) return
    addEntry({
      id:meioItem1.id, id2:meioItem2.id,
      borda:meioBorda,
      extras:[...meioExtras1], extras2:[...meioExtras2],
      mode:'meio'
    }, meioQty)
    showToast(`½ ${meioItem1.name} + ½ ${meioItem2.name} adicionado ✅`)
    setModal(null)
  }

  // ── WhatsApp ──
  function buildMsg() {
    const NL='\n'
    let msg=`*Novo Pedido — Pizzo* 🍕${NL}${NL}`
    if(nome) msg+=`Cliente: ${nome}${NL}`
    if(addr) msg+=`Entrega: ${addr}${NL}`
    if(pay)  msg+=`Pagamento: ${pay}${pay==='Dinheiro'&&change?` (troco p/ R$ ${change})`:''}${NL}`
    msg+=`${NL}*Itens:*${NL}`
    entries().forEach(({e})=>{
      msg+=`${e.qty}x ${labelEntry(e)} — ${BRL(unitPrice(e)*e.qty)}${NL}`
      const opts=optionsLabel(e); if(opts) msg+=`   (${opts})${NL}`
    })
    if(obs) msg+=`${NL}Obs: ${obs}${NL}`
    msg+=`${NL}Subtotal: ${BRL(subtotal)}${NL}Entrega: ${BRL(deliveryFee)}${NL}*TOTAL: ${BRL(total)}*${NL}${NL}Aguardo confirmação, obrigado!`
    return msg
  }
  function sendWA() {
    if(!entries().length) return
    if(!nome.trim()||!addr.trim()){ showToast('Preencha nome e endereço ✏️'); return }
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(buildMsg())}`,'_blank')
  }

  const showPromoGroup = (activeCat==='promos'||activeCat==='combos') && !query.trim()
  const visiblePromos  = PROMOS.filter(p=>p.group===activeCat)
  const isVendidos      = activeCat==='vendidos'
  const filteredMenu  = MENU.filter(i=>((isVendidos?i.tag==='hot':i.cat===activeCat))&&(!query||i.name.toLowerCase().includes(query.toLowerCase())||i.desc.toLowerCase().includes(query.toLowerCase())))
  const isPizza       = (item:MenuItem) => item.cat==='salgadas'||item.cat==='doces'
  const meioPizzas    = meioCat==='salgadas' ? PIZZAS_SALGADAS : PIZZAS_DOCES

  // ── CSS ──────────────────────────────────────────────────────────────────────
  const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
:root{--red:#E8432A;--red-deep:#C0341D;--orange:#F5A623;--brand-grad:linear-gradient(120deg,#F5A623 0%,#E8432A 100%);--yellow:#FDCB6E;--green:#00B894;--green-badge:#27AE60;--brown:#5a3c33;--brown-mid:#8D6E63;}
*{box-sizing:border-box;margin:0;padding:0;}html,body{height:100%;}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--brown);background-color:#F5E8D6;line-height:1.45;overflow-x:hidden;font-size:15px;}
.serif{font-family:'Fraunces',Georgia,serif;}
.backdrop{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.blob{position:absolute;border-radius:50%;filter:blur(70px);opacity:.55;}
.b1{width:520px;height:520px;left:-120px;top:-140px;background:radial-gradient(circle,#FFD3A8,transparent 70%);}
.b2{width:460px;height:460px;right:-100px;top:12%;background:radial-gradient(circle,#FFC2C2,transparent 70%);}
.b3{width:600px;height:600px;left:18%;bottom:-240px;background:radial-gradient(circle,#FFE3A0,transparent 70%);}
.b4{width:420px;height:420px;right:22%;bottom:-160px;background:radial-gradient(circle,#C8F0D8,transparent 70%);}
.app{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) 392px;height:100vh;}
.main{min-width:0;overflow-y:auto;height:100vh;scrollbar-width:thin;scrollbar-color:#F3C5B0 transparent;}
.scroll-area{scrollbar-width:thin;scrollbar-color:#F3C5B0 transparent;}
.header{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.72);backdrop-filter:blur(22px) saturate(160%);padding:18px 28px;box-shadow:0 2px 20px rgba(109,76,65,.08);border-bottom:1px solid rgba(255,255,255,.6);display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.logo{width:56px;height:56px;border-radius:50%;flex-shrink:0;overflow:hidden;background:#0d0d0d;box-shadow:0 4px 16px rgba(232,67,42,.3);}
.logo img{width:100%;height:100%;object-fit:cover;display:block;}
.brand-tag{font-size:9px;font-weight:800;letter-spacing:.14em;background:var(--brand-grad);color:#fff;padding:3px 8px;border-radius:6px;}
.brand{flex:1;min-width:220px;}
.brand .nm{display:flex;align-items:center;gap:9px;flex-wrap:wrap;}
.brand h1{font-family:'Fraunces',serif;font-weight:800;font-size:22px;color:var(--brown);line-height:1.05;}
.brand .stars{font-size:11px;letter-spacing:1px;color:var(--yellow);}
.brand .stars b{color:var(--brown-mid);font-family:'Plus Jakarta Sans';font-size:11.5px;letter-spacing:0;margin-left:3px;}
.brand .addr{margin-top:3px;font-size:12px;color:var(--brown-mid);display:flex;gap:6px;flex-wrap:wrap;}
.open-badge{display:inline-flex;align-items:center;gap:8px;background:#EAFAF1;border:1px solid var(--green-badge);color:var(--green-badge);font-weight:700;font-size:12.5px;padding:8px 14px;border-radius:999px;white-space:nowrap;}
.open-badge.closed{background:#FDECEA;border-color:#E74C3C;color:#C0392B;}
.open-badge .dot{width:8px;height:8px;border-radius:50%;background:var(--green-badge);animation:pulse 1.8s infinite;}
.open-badge.closed .dot{background:#E74C3C;animation:none;}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.4}}
.hero{margin:18px 28px 4px;border-radius:22px;overflow:hidden;position:relative;background:linear-gradient(115deg,#C0341D,#E8432A 55%,#F5A623);color:#fff;padding:24px 26px;min-height:268px;box-shadow:0 16px 44px rgba(214,48,49,.30);display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;gap:13px;}
.hero-vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;}
.hero-overlay{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(100deg,rgba(105,18,10,.90) 0%,rgba(150,30,15,.62) 40%,rgba(20,8,5,.22) 78%,rgba(20,8,5,.05) 100%),linear-gradient(to top,rgba(20,8,5,.55),transparent 45%);}
.hero .ht{position:relative;z-index:2;max-width:560px;}
.hero h2{font-family:'Fraunces',serif;font-weight:800;font-size:clamp(18px,5vw,30px);line-height:1.1;text-shadow:0 2px 8px rgba(0,0,0,.4);}
.hero p{margin-top:6px;font-size:14px;color:rgba(255,255,255,.95);text-shadow:0 1px 6px rgba(0,0,0,.45);}
.hero .pills{position:relative;z-index:2;display:flex;gap:9px;flex-wrap:wrap;}
.hero .pill{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.35);backdrop-filter:blur(8px);padding:8px 13px;border-radius:999px;font-size:12.5px;font-weight:700;white-space:nowrap;}
.hero .live-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(0,0,0,.42);border:1px solid rgba(255,255,255,.3);backdrop-filter:blur(6px);padding:6px 11px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.3px;margin-bottom:10px;}
.hero .live-tag .rec{width:8px;height:8px;border-radius:50%;background:#ff4d4d;box-shadow:0 0 8px #ff4d4d;animation:pulse 1.4s infinite;}
.coupon-bar{margin:14px 28px 0;border-radius:16px;background:#1c0f08;color:#fff;display:flex;align-items:center;gap:14px;padding:14px 18px;box-shadow:0 8px 22px rgba(0,0,0,.18);}
.coupon-icon{font-size:24px;flex-shrink:0;}
.coupon-text{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;}
.coupon-text strong{font-size:14px;font-weight:800;}
.coupon-text span{font-size:12.5px;color:rgba(255,255,255,.72);}
.coupon-code-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;}
.coupon-label{font-size:12px;font-weight:800;color:#FFC857;}
.coupon-code{font-family:monospace;font-size:14px;font-weight:800;letter-spacing:1.5px;border:1.5px dashed rgba(255,255,255,.5);border-radius:8px;padding:3px 10px;background:rgba(255,255,255,.06);}
@media(max-width:600px){.coupon-bar{margin:12px 16px 0;padding:12px 14px;}.coupon-text span{display:none;}}
.toolbar{position:sticky;top:92px;z-index:10;background:rgba(255,251,247,.88);backdrop-filter:blur(16px);padding:12px 28px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,220,200,.3);}
.cats{display:flex;gap:8px;overflow-x:auto;flex:1;scrollbar-width:none;}
.cats::-webkit-scrollbar{display:none;}
.chip{padding:8px 16px;border-radius:99px;border:1px solid rgba(255,255,255,.9);cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;background:rgba(255,255,255,.72);color:var(--brown);transition:all .15s;flex-shrink:0;}
.chip.active{background:var(--brand-grad);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(232,67,42,.4);}
.search input{background:rgba(255,255,255,.9);border:1px solid rgba(255,220,200,.6);border-radius:99px;padding:8px 16px;font-size:13px;color:var(--brown);outline:none;font-family:inherit;width:200px;}
.main-inner{padding:0 28px 60px;}
.meio-btn{display:flex;align-items:center;gap:10px;width:100%;margin-top:22px;padding:14px 18px;border-radius:16px;border:2px dashed rgba(232,67,42,.4);background:rgba(255,255,255,.6);backdrop-filter:blur(12px);cursor:pointer;font-family:inherit;transition:all .2s;}
.meio-btn:hover{border-color:var(--red);background:rgba(255,255,255,.85);transform:translateY(-2px);}
.meio-icon{width:48px;height:48px;border-radius:12px;background:var(--brand-grad);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.meio-btn-text{text-align:left;}
.meio-btn-text .t1{font-family:'Fraunces',serif;font-weight:800;font-size:16px;color:var(--brown);}
.meio-btn-text .t2{font-size:12px;color:var(--brown-mid);margin-top:2px;}
.section-head{display:flex;align-items:center;gap:10px;margin:24px 0 14px;}
.section-head .bar{width:4px;height:24px;border-radius:2px;background:var(--brand-grad);flex-shrink:0;}
.section-head h2{font-family:'Fraunces',serif;font-weight:800;font-size:21px;color:var(--brown);}
.section-head .count{font-size:13px;color:var(--brown-mid);}
.promo-wrap{margin-top:22px;}
.promo-head{display:flex;align-items:center;gap:10px;margin:0 2px 14px;}
.promo-head .bar{width:4px;height:24px;border-radius:2px;background:linear-gradient(var(--red),var(--orange));}
.promo-head h2{font-family:'Fraunces',serif;font-weight:800;font-size:21px;color:var(--brown);}
.promo-head .sub{font-size:13px;color:var(--brown-mid);}
.promo-row{display:flex;gap:16px;overflow-x:auto;padding:2px 2px 10px;scrollbar-width:thin;scrollbar-color:#F3C5B0 transparent;}
.promo-card{flex-shrink:0;width:326px;display:flex;border-radius:20px;overflow:hidden;cursor:pointer;background:rgba(255,255,255,.6);backdrop-filter:blur(18px) saturate(170%);border:1px solid rgba(255,255,255,.7);box-shadow:0 10px 30px rgba(214,48,49,.14);transition:transform .2s,box-shadow .2s;}
.promo-card:hover{transform:translateY(-5px);box-shadow:0 20px 44px rgba(214,48,49,.22);}
.promo-media{position:relative;width:124px;flex-shrink:0;overflow:hidden;background:linear-gradient(145deg,#FFECD2,#FCB69F);}
.promo-media .pct{position:absolute;top:8px;left:8px;background:var(--red);color:#fff;font-size:11px;font-weight:800;padding:4px 8px;border-radius:8px;z-index:2;}
.promo-info{flex:1;min-width:0;padding:13px 14px 13px 15px;display:flex;flex-direction:column;}
.promo-info .pname{font-family:'Fraunces',serif;font-size:16px;font-weight:700;color:var(--brown);line-height:1.12;}
.promo-info .pdesc{font-size:11.5px;color:var(--brown-mid);line-height:1.4;margin-top:4px;flex:1;}
.promo-info .pfoot{display:flex;align-items:center;justify-content:space-between;margin-top:10px;gap:8px;}
.promo-info .pold{font-size:11px;color:var(--brown-mid);text-decoration:line-through;}
.promo-info .pnew{font-family:'Fraunces',serif;font-size:20px;font-weight:800;color:var(--red);margin-top:2px;}
.promo-info .pnew small{font-size:12px;font-weight:600;}
.promo-info .padd{display:inline-flex;align-items:center;gap:6px;background:var(--red);color:#fff;border:none;font-family:inherit;font-size:12.5px;font-weight:700;padding:9px 13px;border-radius:11px;cursor:pointer;box-shadow:0 4px 14px rgba(214,48,49,.4);transition:transform .15s,box-shadow .15s;white-space:nowrap;}
.promo-info .padd:hover{transform:scale(1.05);}
.grid{display:flex;overflow-x:auto;gap:14px;padding:2px 2px 10px;scrollbar-width:thin;scrollbar-color:#F3C5B0 transparent;}
.card{flex:0 0 168px;background:rgba(255,255,255,.68);backdrop-filter:blur(18px) saturate(170%);border:1px solid rgba(255,255,255,.8);border-radius:20px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;transition:transform .2s,box-shadow .2s;box-shadow:0 6px 20px rgba(109,76,65,.1);}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 36px rgba(109,76,65,.16);}
.card-img{height:128px;background:linear-gradient(145deg,#FFECD2,#FCB69F);display:flex;align-items:center;justify-content:center;font-size:44px;position:relative;overflow:hidden;}
.card-img .emoji{position:relative;z-index:1;}
.card-img .tag{position:absolute;top:8px;left:8px;font-size:10px;font-weight:800;padding:3px 7px;border-radius:7px;z-index:3;}
.card-img .tag.hot{background:var(--red);color:#fff;}
.card-img .tag.new{background:#8B5CF6;color:#fff;}
.card-img .social{position:absolute;bottom:8px;left:8px;right:8px;background:rgba(0,0,0,.5);color:#fff;font-size:10px;font-weight:600;padding:3px 7px;border-radius:7px;text-align:center;z-index:3;}
.in-cart-flag{position:absolute;top:8px;right:8px;z-index:4;min-width:22px;height:22px;padding:0 6px;border-radius:999px;background:var(--green);color:#fff;font-size:12px;font-weight:800;display:none;align-items:center;justify-content:center;}
.card.has-qty .in-cart-flag{display:inline-flex;}
.card-body{padding:14px 16px 0;flex:1;display:flex;flex-direction:column;}
.card-body h3{font-family:'Fraunces',serif;font-size:16px;font-weight:700;color:var(--brown);line-height:1.2;margin-bottom:4px;}
.card-body p{font-size:12px;color:var(--brown-mid);line-height:1.5;flex:1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.card-foot{display:flex;align-items:center;justify-content:space-between;padding:12px 16px 16px;}
.price{font-family:'Fraunces',serif;font-weight:800;font-size:20px;color:var(--red);line-height:1;}
.price small{font-size:13px;font-weight:600;}
.add-btn{width:38px;height:38px;flex-shrink:0;border:none;border-radius:50%;background:var(--brand-grad);color:#fff;font-size:21px;line-height:1;cursor:pointer;display:grid;place-items:center;box-shadow:0 4px 14px rgba(214,48,49,.45);transition:transform .15s,box-shadow .15s;}
.add-btn:hover{transform:scale(1.12);}
.order{height:100vh;display:flex;flex-direction:column;background:rgba(34,21,14,.84);backdrop-filter:blur(32px) saturate(180%);border-left:1px solid rgba(255,255,255,.18);box-shadow:-8px 0 44px rgba(109,76,65,.10);}
.order-head{padding:22px 24px 16px;border-bottom:1px solid rgba(255,200,150,.16);}
.order-head .row{display:flex;align-items:center;gap:10px;}
.order-head h2{font-family:'Fraunces',serif;font-weight:800;font-size:20px;color:#FFF1E0;}
.badge{min-width:24px;height:24px;padding:0 8px;border-radius:999px;background:var(--red);color:#fff;font-size:12.5px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;}
.order-list{flex:1;overflow-y:auto;padding:8px 20px;}
.order-empty{text-align:center;padding:44px 18px;}
.order-empty .ic{font-size:60px;opacity:.3;margin-bottom:10px;}
.order-empty .t1{font-family:'Fraunces',serif;font-size:16px;color:rgba(255,225,190,.62);font-weight:700;}
.order-empty .t2{font-size:13px;margin-top:4px;color:rgba(255,225,190,.4);}
.line{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:13px 4px;border-bottom:1px dashed rgba(255,200,150,.16);}
.line:last-child{border-bottom:none;}
.qty{display:flex;align-items:center;gap:6px;}
.qty button{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,200,150,.3);color:#FFB347;font-size:18px;font-weight:700;cursor:pointer;display:grid;place-items:center;line-height:1;transition:all .15s;}
.qty button:active{background:var(--red);border-color:var(--red);color:#fff;}
.qty .n{font-family:'Fraunces',serif;min-width:22px;text-align:center;font-weight:700;font-size:16px;color:#FFF1E0;}
.line-info .nm{font-size:13px;font-weight:600;color:#FFF1E0;line-height:1.2;}
.line-info .unit{font-size:11px;color:rgba(255,225,190,.62);margin-top:2px;}
.line-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;}
.line-total{font-family:'Fraunces',serif;font-weight:700;font-size:14px;color:#FFB347;white-space:nowrap;}
.del-btn{background:rgba(255,100,80,.2);border:1px solid rgba(255,150,130,.5);border-radius:8px;cursor:pointer;font-size:12px;color:#ffb3a0;padding:5px 10px;font-weight:700;font-family:inherit;white-space:nowrap;}
.bumps{padding:4px 20px 14px;}
.bumps-head{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:700;color:#FFF1E0;margin:6px 0 10px;}
.bump-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}
.bump-card{flex-shrink:0;width:122px;border-radius:14px;overflow:hidden;cursor:pointer;background:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.8);box-shadow:0 4px 14px rgba(109,76,65,.08);transition:transform .15s;}
.bump-card:hover{transform:translateY(-3px);}
.bump-card .bimg{height:56px;display:grid;place-items:center;font-size:28px;}
.bump-card .binfo{padding:7px 9px 9px;}
.bump-card .bn{font-size:11.5px;font-weight:700;color:var(--brown);line-height:1.15;}
.bump-card .bp{display:flex;align-items:center;justify-content:space-between;margin-top:5px;}
.bump-card .bprice{font-family:'Fraunces',serif;font-weight:700;font-size:13px;color:var(--red);}
.bump-card .badd{width:22px;height:22px;border-radius:50%;background:var(--red);color:#fff;border:none;font-size:15px;line-height:1;display:grid;place-items:center;cursor:pointer;}
.order-foot{border-top:1px solid rgba(255,200,150,.16);padding:14px 24px 18px;background:rgba(18,11,7,.5);overflow-y:auto;max-height:62vh;flex-shrink:0;}
.srow{display:flex;justify-content:space-between;font-size:13px;color:rgba(255,225,190,.62);margin-bottom:8px;}
.srow .v{color:#FFF1E0;font-weight:600;}
.srow.total{margin-top:12px;padding-top:13px;border-top:1px dashed rgba(255,200,150,.16);align-items:baseline;color:#FFF1E0;font-size:15px;font-weight:700;}
.srow.total .v{font-family:'Fraunces',serif;font-size:23px;font-weight:800;color:#FFB347;}
.addr-wrap{margin:10px 0 0;}
.addr-label{display:block;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,225,190,.62);margin-bottom:5px;}
.addr-input{width:100%;background:rgba(255,255,255,.08);border:1px solid rgba(255,200,150,.3);border-radius:10px;padding:9px 12px;font-size:13.5px;color:#FFF1E0;font-family:inherit;outline:none;}
.addr-input::placeholder{color:rgba(255,225,190,.4);}
.addr-input:focus{border-color:var(--red);}
.pay-row{display:flex;gap:7px;margin-top:8px;}
.pay-chip{flex:1;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;padding:9px 6px;border-radius:10px;border:1.5px solid rgba(255,200,150,.3);background:rgba(255,255,255,.08);color:#FFF1E0;transition:all .15s;}
.pay-chip.active{background:var(--red);border-color:var(--red);color:#fff;}
.wa-btn{width:100%;margin-top:12px;font-family:inherit;font-size:15px;font-weight:700;color:#fff;background:linear-gradient(135deg,#25D366 0%,#128C7E 100%);border:none;border-radius:14px;padding:16px 20px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 6px 20px rgba(37,211,102,.35);transition:all .2s;}
.wa-btn:hover:not(:disabled){transform:translateY(-2px);}
.wa-btn:disabled{opacity:.4;cursor:default;}
.clear-link{display:block;width:100%;text-align:center;margin-top:10px;font-size:12.5px;color:rgba(255,225,190,.62);background:none;border:none;cursor:pointer;font-family:inherit;}
.mobile-bar{display:none;}
.cart-screen{display:none;}
@media(max-width:768px){
  .app{grid-template-columns:1fr;height:auto;}
  .main{height:auto;overflow:visible;}
  .main-inner{padding:0 16px 100px;}
  .toolbar{top:68px;padding:10px 16px;}
  .hero{margin:12px 16px 4px;}
  .order{display:none!important;}
  .mobile-bar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:100;background:#fff;border-top:1px solid #f0e8e0;padding:10px 16px;padding-bottom:max(10px,env(safe-area-inset-bottom));align-items:center;gap:14px;box-shadow:0 -4px 24px rgba(0,0,0,.1);}
  .mobile-bar .mb-left{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}
  .mobile-bar .mb-bag{width:42px;height:42px;border-radius:12px;background:var(--red);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;}
  .mobile-bar .mb-badge{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;padding:0 5px;background:#ff6b00;color:#fff;border-radius:99px;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid #fff;}
  .mobile-bar .mb-count{font-size:12px;color:#888;}
  .mobile-bar .mb-total{font-family:'Fraunces',serif;font-size:18px;font-weight:800;color:#222;line-height:1.1;}
  .mobile-bar .mb-go{background:var(--red);color:#fff;font-family:inherit;font-weight:700;font-size:14px;border:none;border-radius:12px;padding:13px 20px;cursor:pointer;flex-shrink:0;}
  .cart-screen{display:flex;flex-direction:column;position:fixed;inset:0;z-index:200;background:#f5f0eb;transform:translateX(100%);transition:transform .28s cubic-bezier(.4,0,.2,1);overflow:hidden;}
  .cart-screen.open{transform:translateX(0);}
  .cs-header{background:#fff;padding:14px 16px 12px;padding-top:max(14px,env(safe-area-inset-top));display:flex;align-items:center;gap:12px;border-bottom:1px solid #f0e8e0;flex-shrink:0;}
  .cs-back{width:36px;height:36px;border-radius:50%;background:#f5f0eb;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;}
  .cs-back svg{width:20px;height:20px;fill:none;stroke:#333;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;}
  .cs-header h2{font-family:'Fraunces',serif;font-size:20px;font-weight:800;color:#1a1a1a;flex:1;}
  .cs-badge{background:var(--red);color:#fff;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;}
  .cs-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px 16px;}
  .cs-card{background:#fff;border-radius:16px;padding:4px 0;margin-bottom:12px;}
  .cs-line{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #f5f0eb;}
  .cs-line:last-child{border-bottom:none;}
  .cs-qty{display:flex;align-items:center;gap:8px;flex-shrink:0;}
  .cs-qty button{width:30px;height:30px;border-radius:50%;border:1.5px solid var(--red);background:#fff;color:var(--red);font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;}
  .cs-qty button.inc{background:var(--red);color:#fff;}
  .cs-qty .cs-n{font-family:'Fraunces',serif;font-weight:800;font-size:16px;color:#1a1a1a;min-width:20px;text-align:center;}
  .cs-name .nm{font-size:14px;font-weight:600;color:#1a1a1a;}
  .cs-name .un{font-size:12px;color:#888;margin-top:2px;}
  .cs-name{flex:1;min-width:0;}
  .cs-price{font-family:'Fraunces',serif;font-weight:700;font-size:15px;color:#1a1a1a;white-space:nowrap;}
  .cs-del{background:none;border:none;cursor:pointer;padding:6px;}
  .cs-del svg{width:18px;height:18px;fill:none;stroke:#bbb;stroke-width:2;}
  .cs-bumps-title{font-size:13px;font-weight:700;color:#555;margin:16px 0 10px;padding:0 4px;}
  .cs-bump-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}
  .cs-bump-card{flex-shrink:0;width:120px;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #f0e8e0;cursor:pointer;}
  .cs-bump-img{height:72px;display:grid;place-items:center;font-size:30px;background:#faf5f0;}
  .cs-bump-info{padding:8px 10px 10px;}
  .cs-bump-name{font-size:12px;font-weight:600;color:#1a1a1a;line-height:1.2;}
  .cs-bump-foot{display:flex;align-items:center;justify-content:space-between;margin-top:4px;}
  .cs-bump-price{font-family:'Fraunces',serif;font-weight:700;font-size:13px;color:var(--red);}
  .cs-bump-add{width:24px;height:24px;border-radius:50%;background:var(--red);color:#fff;border:none;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
  .cs-summary{background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;}
  .cs-srow{display:flex;justify-content:space-between;font-size:14px;color:#666;margin-bottom:10px;}
  .cs-srow.total{margin-top:12px;padding-top:12px;border-top:1px dashed #e0d8d0;color:#1a1a1a;font-weight:700;font-size:15px;margin-bottom:0;}
  .cs-srow.total .tv{font-family:'Fraunces',serif;font-size:22px;font-weight:800;color:var(--red);}
  .cs-addr{background:#fff;border-radius:16px;padding:14px 16px;margin-bottom:12px;}
  .cs-addr label{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#888;display:block;margin-bottom:8px;}
  .cs-addr input{width:100%;font-family:inherit;font-size:14px;color:#1a1a1a;border:1.5px solid #e0d8d0;border-radius:10px;padding:11px 14px;outline:none;background:#faf5f0;}
  .cs-addr input:focus{border-color:var(--red);}
  .cs-addr .pay-chip{background:#faf5f0;border-color:#e0d8d0;color:#555;}
  .cs-addr .pay-chip.active{background:var(--red);border-color:var(--red);color:#fff;}
  .cs-footer{background:#fff;padding:12px 16px;padding-bottom:max(12px,env(safe-area-inset-bottom));border-top:1px solid #f0e8e0;flex-shrink:0;}
  .cs-wa-btn{width:100%;font-family:inherit;font-size:15px;font-weight:700;color:#fff;background:#25D366;border:none;border-radius:14px;padding:15px 20px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;}
  .cs-wa-btn:disabled{opacity:.4;}
  .cs-clear{display:block;width:100%;text-align:center;margin-top:10px;font-size:13px;color:#aaa;background:none;border:none;cursor:pointer;font-family:inherit;}
  .grid .card{flex:0 0 44vw;max-width:180px;}
  .card-img{height:110px;}
  .hero{padding:16px 16px 14px;min-height:160px;}
  .hero .ht h2{font-size:clamp(1.25rem,5.5vw,1.8rem);}
  .promo-card{min-width:min(280px,82vw);}
  .header{padding:12px 16px;gap:10px;}
  .brand h1{font-size:17px;}
  .search{display:none;}
  .meio-btn{margin:16px 0 0;}
}
/* ── Modal ── */
.pm-overlay{position:fixed;inset:0;z-index:300;background:rgba(30,12,8,.5);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;}
.pm-overlay.open{display:flex;}
.pm{background:#fff;width:min(460px,calc(100vw - 32px));max-height:90vh;border-radius:22px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 80px rgba(0,0,0,.35);}
.pm-media{position:relative;height:160px;flex-shrink:0;background:linear-gradient(145deg,#FFECD2,#FCB69F);display:grid;place-items:center;font-size:56px;overflow:hidden;}
.pm-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.pm-media .pm-emoji{position:relative;z-index:1;}
.pm-media .pm-overlay-img{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.3),transparent 60%);z-index:0;}
.pm-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.92);border:none;cursor:pointer;font-size:15px;color:#333;display:grid;place-items:center;box-shadow:0 2px 10px rgba(0,0,0,.2);z-index:4;}
.pm-body{flex:1;overflow-y:auto;padding:16px 18px;}
.pm-body h3{font-family:'Fraunces',serif;font-size:20px;font-weight:800;color:#1a1a1a;}
.pm-body .pm-desc{font-size:13px;color:#777;margin-top:4px;line-height:1.5;}
.pm-sect{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#999;margin:18px 0 8px;display:flex;align-items:center;justify-content:space-between;}
.pm-sect .req{font-size:10px;background:#f2ece6;color:#888;padding:3px 8px;border-radius:99px;letter-spacing:0;text-transform:none;font-weight:600;}
.pm-opt{display:flex;align-items:center;gap:11px;padding:11px 4px;border-bottom:1px solid #f5efe9;cursor:pointer;}
.pm-opt:last-child{border-bottom:none;}
.pm-opt .ck{width:21px;height:21px;border-radius:50%;border:2px solid #ddd;flex-shrink:0;display:grid;place-items:center;transition:all .15s;font-size:11px;color:#fff;}
.pm-opt.sq .ck{border-radius:6px;}
.pm-opt.sel .ck{background:var(--brand-grad);border-color:transparent;}
.pm-opt .on{flex:1;font-size:14px;font-weight:600;color:#2a2a2a;}
.pm-opt .op{font-size:13px;font-weight:700;color:var(--red);white-space:nowrap;}
.pm-foot{flex-shrink:0;padding:12px 18px;padding-bottom:max(12px,env(safe-area-inset-bottom));border-top:1px solid #f0e8e0;display:flex;gap:12px;align-items:center;background:#fff;}
.pm-qty{display:flex;align-items:center;gap:8px;}
.pm-qty button{width:36px;height:36px;border-radius:50%;border:1.5px solid var(--red);background:#fff;color:var(--red);font-size:19px;font-weight:700;cursor:pointer;display:grid;place-items:center;}
.pm-qty .n{font-family:'Fraunces',serif;font-weight:800;font-size:17px;min-width:22px;text-align:center;}
.pm-add{flex:1;font-family:inherit;font-size:14.5px;font-weight:700;color:#fff;background:var(--brand-grad);border:none;border-radius:13px;padding:14px 16px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;box-shadow:0 6px 18px rgba(232,67,42,.35);}
.pm-add:disabled{opacity:.4;cursor:default;}
/* meio a meio */
.meio-tabs{display:flex;gap:8px;margin-bottom:14px;}
.meio-tab{flex:1;font-family:inherit;font-size:13px;font-weight:700;border-radius:10px;border:1.5px solid #e0d8d0;background:#faf5f0;color:#888;cursor:pointer;padding:9px 4px;transition:all .15s;}
.meio-tab.active{background:var(--brand-grad);color:#fff;border-color:transparent;}
.meio-pizza-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:8px;}
.meio-pizza-item{border-radius:14px;overflow:hidden;border:2px solid transparent;cursor:pointer;background:#faf5f0;transition:all .15s;}
.meio-pizza-item.sel{border-color:var(--red);box-shadow:0 0 0 3px rgba(232,67,42,.18);}
.meio-pizza-item .mpi-img{height:70px;display:grid;place-items:center;font-size:28px;position:relative;overflow:hidden;}
.meio-pizza-item .mpi-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.meio-pizza-item .mpi-emoji{position:relative;z-index:1;}
.meio-pizza-item .mpi-info{padding:6px 9px 8px;}
.meio-pizza-item .mpi-name{font-size:12px;font-weight:700;color:#1a1a1a;line-height:1.2;}
.meio-pizza-item .mpi-price{font-family:'Fraunces',serif;font-size:12px;font-weight:700;color:var(--red);margin-top:2px;}
.meio-step-bar{display:flex;gap:6px;margin-bottom:16px;}
.meio-step-bar .s{flex:1;height:4px;border-radius:99px;background:#f0e8e0;transition:background .2s;}
.meio-step-bar .s.done{background:var(--brand-grad);}
.meio-half-label{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#999;margin-bottom:10px;}
.meio-preview{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#faf5f0;border-radius:14px;margin-bottom:12px;}
.meio-preview .half{flex:1;text-align:center;}
.meio-preview .half .he{font-size:24px;}
.meio-preview .half .hn{font-size:12px;font-weight:700;color:#1a1a1a;margin-top:3px;line-height:1.2;}
.meio-preview .div{width:2px;height:40px;background:linear-gradient(var(--red),var(--orange));border-radius:99px;flex-shrink:0;}
@media(max-width:768px){.pm-overlay{align-items:flex-end;}.pm{width:100%;max-height:92vh;border-radius:22px 22px 0 0;}}
.toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%) translateY(20px);background:rgba(28,16,10,.92);color:#fff;font-size:13px;font-weight:600;padding:11px 18px;border-radius:12px;z-index:500;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;max-width:calc(100vw - 40px);text-align:center;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;}}
`

  // ── WA SVG ──
  const waSvg = <svg viewBox="0 0 32 32" fill="currentColor" style={{width:20,height:20}}><path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2 7.7L.5 31.5l8-2.1c2.2 1.2 4.8 1.9 7.5 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.2c-2.5 0-4.8-.7-6.8-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5A12.5 12.5 0 1 1 28.5 16 12.5 12.5 0 0 1 16 28.7zm7-9.3c-.4-.2-2.3-1.1-2.6-1.3s-.6-.2-.9.2-1 1.3-1.2 1.5-.4.3-.8.1a10.2 10.2 0 0 1-3-1.9 11.4 11.4 0 0 1-2.1-2.6c-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.4-.6s0-.5 0-.7-.9-2.2-1.3-3-.6-.6-.9-.6h-.7a1.4 1.4 0 0 0-1 .5 4.2 4.2 0 0 0-1.3 3.1c0 1.9 1.3 3.6 1.5 3.9s2.7 4.1 6.5 5.7c3.2 1.4 3.9 1.1 4.6 1.1a3.8 3.8 0 0 0 2.5-1.8 3.1 3.1 0 0 0 .2-1.8c-.1-.2-.4-.3-.8-.5z"/></svg>

  return (
    <div>
      <style>{css}</style>
      <div className="backdrop"><div className="blob b1"/><div className="blob b2"/><div className="blob b3"/><div className="blob b4"/></div>
      <div className={`toast${toast?' show':''}`}>{toast}</div>

      <div className="app">
        {/* ── MAIN ── */}
        <div className="main scroll-area">
          <header className="header">
            <div className="logo"><img src="/logo-pizzo.webp" alt="Pizzo" width="56" height="56"/></div>
            <div className="brand">
              <div className="nm">
                <h1>Pizzo</h1>
                <span className="brand-tag">CARDÁPIO DIGITAL</span>
                <span className="stars">⭐⭐⭐⭐⭐<b>4,9 · 1.2k avaliações</b></span>
              </div>
              <div className="addr">
                <span>🛵 Entrega em Osasco e região</span><span style={{opacity:.55}}>·</span><span>📱 (11) 98079-4899</span>
              </div>
            </div>
            <div className={`open-badge${isOpenNow?'':' closed'}`}>
              <span className="dot"/>
              <span>{isOpenNow?`⏰ Aberto até ${String(closeHour%24).padStart(2,'0')}h`:`😴 Fechado · abre às ${openHour}h`}</span>
            </div>
          </header>

          {/* Hero */}
          <div className="hero">
            <video className="hero-vid" autoPlay muted loop playsInline preload="metadata" poster="/hero-poster.webp">
              <source src="/foodporn-1.mp4" type="video/mp4"/>
            </video>
            <div className="hero-overlay"/>
            <div className="ht">
              <span className="live-tag"><span className="rec"/>AO VIVO DO FORNO</span>
              <h2>Massa fininha, borda dourada, queijo escorrendo. 🔥</h2>
              <p>Assada na hora no forno a lenha. Peça agora e receba quentinha na sua casa.</p>
            </div>
            <div className="pills">
              <span className="pill">🛵 Entrega ~40min</span>
              <span className="pill">🔥 Forno quente agora</span>
              <span className="pill">⭐ 4,9 de avaliação</span>
            </div>
          </div>

          {/* Cupom de desconto */}
          <div className="coupon-bar">
            <div className="coupon-icon">🏷️</div>
            <div className="coupon-text">
              <strong>Primeira compra?</strong>
              <span>Use o cupom abaixo e ganhe desconto</span>
            </div>
            <div className="coupon-code-wrap">
              <span className="coupon-label">10% OFF</span>
              <span className="coupon-code">PIZZO10</span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="cats">
              {CATS.map(c=><button key={c.id} className={`chip${activeCat===c.id?' active':''}`} onClick={()=>setActiveCat(c.id)}>{c.label}</button>)}
            </div>
            <div className="search">
              <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="🔍 Buscar pizza, lanche..." autoComplete="off"/>
            </div>
          </div>

          <div className="main-inner">
            {/* Botão meio a meio */}
            {(activeCat==='vendidos'||activeCat==='salgadas'||activeCat==='doces') && !query && (
              <button className="meio-btn" onClick={openMeio}>
                <div className="meio-icon">🍕</div>
                <div className="meio-btn-text">
                  <div className="t1">🔀 Monte sua Pizza Meio a Meio</div>
                  <div className="t2">Escolha 2 sabores — cobrado pelo maior preço</div>
                </div>
                <span style={{fontSize:20,color:'var(--brown-mid)'}}>›</span>
              </button>
            )}

            {/* Promos / Combos */}
            {showPromoGroup && (
              <div className="promo-wrap">
                <div className="promo-head"><span className="bar"/><h2>{activeCat==='combos'?'🎁 Combos':'🔥 Promoções da Semana'}</h2><span className="sub">· toque para adicionar</span></div>
                <div className="promo-row">
                  {visiblePromos.map(p=>{
                    const full=p.items.reduce((s,id)=>s+(menuById(id)?.price??0),0)
                    const off=Math.round((1-p.price/full)*100)
                    return (
                      <div key={p.id} className="promo-card" onClick={()=>{addEntry({id:p.id,borda:null,extras:[],mode:'normal'});showToast(`${p.name} adicionado ✅`)}}>
                        <div className="promo-media">{off>0&&<span className="pct">-{off}%</span>}<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40}}>🍕</div></div>
                        <div className="promo-info">
                          <div className="pname">{p.name}</div><div className="pdesc">{p.desc}</div>
                          <div className="pfoot">
                            <div><div className="pold">{off>0?BRL(full):''}</div><div className="pnew"><small>R$</small> {p.price.toFixed(2).replace('.',',')}</div></div>
                            <button className="padd" onClick={e=>{e.stopPropagation();addEntry({id:p.id,borda:null,extras:[],mode:'normal'});showToast(`${p.name} adicionado ✅`)}}>+ Adicionar</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Mais Vendidos */}
            {isVendidos && filteredMenu.length>0 && (
              <div>
                <div className="section-head"><span className="bar"/><h2>⭐ Mais Vendidos</h2><span className="count">· {filteredMenu.length} {filteredMenu.length===1?'item':'itens'}</span></div>
                <div className="grid">
                  {filteredMenu.map(item=>{
                    const q=qtyOfId(item.id)
                    return (
                      <div key={item.id} className={`card${q>0?' has-qty':''}`} onClick={()=>isPizza(item)?openProduct(item):(addEntry({id:item.id,borda:null,extras:[],mode:'normal'}),showToast(`${item.name} adicionado ✅`))}>
                        <div className="card-img">
                          <span className="emoji">{item.emoji}</span>
                          {item.img&&<img src={item.img} alt={item.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}} loading="lazy" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>}
                          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.35),transparent 60%)',zIndex:1,pointerEvents:'none'}}/>
                          {item.tag==='hot'&&<span className="tag hot" style={{zIndex:3}}>🔥 Mais pedido</span>}
                          {item.tag==='new'&&<span className="tag new" style={{zIndex:3}}>✨ Novidade</span>}
                          {item.social&&<span className="social" style={{zIndex:3}}>{item.social}</span>}
                          <span className="in-cart-flag" style={{zIndex:4}}>{q}</span>
                        </div>
                        <div className="card-body"><h3>{item.name}</h3><p>{item.desc}</p></div>
                        <div className="card-foot">
                          <div className="price"><small>R$</small> {item.price.toFixed(2).replace('.',',')}</div>
                          <button className="add-btn" onClick={e=>{e.stopPropagation();isPizza(item)?openProduct(item):(addEntry({id:item.id,borda:null,extras:[],mode:'normal'}),showToast(`${item.name} adicionado ✅`))}}>+</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Cardápio */}
            {ORDER_CATS.map(catId=>{
              const items=filteredMenu.filter(i=>i.cat===catId)
              if(!items.length) return null
              return (
                <div key={catId}>
                  <div className="section-head"><span className="bar"/><h2>{CAT_LABEL[catId]}</h2><span className="count">· {items.length} {items.length===1?'item':'itens'}</span></div>
                  <div className="grid">
                    {items.map(item=>{
                      const q=qtyOfId(item.id)
                      return (
                        <div key={item.id} className={`card${q>0?' has-qty':''}`} onClick={()=>isPizza(item)?openProduct(item):(addEntry({id:item.id,borda:null,extras:[],mode:'normal'}),showToast(`${item.name} adicionado ✅`))}>
                          <div className="card-img">
                            <span className="emoji">{item.emoji}</span>
                            {item.img&&<img src={item.img} alt={item.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}} loading="lazy" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>}
                            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.35),transparent 60%)',zIndex:1,pointerEvents:'none'}}/>
                            {item.tag==='hot'&&<span className="tag hot" style={{zIndex:3}}>🔥 Mais pedido</span>}
                            {item.tag==='new'&&<span className="tag new" style={{zIndex:3}}>✨ Novidade</span>}
                            {item.social&&<span className="social" style={{zIndex:3}}>{item.social}</span>}
                            <span className="in-cart-flag" style={{zIndex:4}}>{q}</span>
                          </div>
                          <div className="card-body"><h3>{item.name}</h3><p>{item.desc}</p></div>
                          <div className="card-foot">
                            <div className="price"><small>R$</small> {item.price.toFixed(2).replace('.',',')}</div>
                            <button className="add-btn" onClick={e=>{e.stopPropagation();isPizza(item)?openProduct(item):(addEntry({id:item.id,borda:null,extras:[],mode:'normal'}),showToast(`${item.name} adicionado ✅`))}}>+</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            {!filteredMenu.length&&<div style={{textAlign:'center',padding:'60px 20px',color:'var(--brown-mid)'}}><div style={{fontSize:48,opacity:.35,marginBottom:12}}>🔍</div><p>Nenhum item encontrado.</p></div>}
          </div>
        </div>

        {/* ── ORDER PANEL DESKTOP ── */}
        <aside className="order">
          <div className="order-head"><div className="row"><span style={{fontSize:18}}>🛒</span><h2>Seu Pedido</h2>{totalQty()>0&&<span className="badge">{totalQty()}</span>}</div></div>
          <div className="order-list scroll-area">
            {Object.keys(cart).length===0
              ? <div className="order-empty"><div className="ic">🍕</div><div className="t1">Carrinho vazio</div><div className="t2">Escolha as delícias do cardápio</div></div>
              : entries().map(({key,e})=>{
                const opts=optionsLabel(e)
                return (
                  <div key={key} className="line">
                    <div className="qty"><button onClick={()=>decKey(key)}>−</button><span className="n">{e.qty}</span><button onClick={()=>incKey(key)}>+</button></div>
                    <div className="line-info"><div className="nm">{labelEntry(e)}</div>{opts&&<div className="unit">{opts}</div>}<div className="unit">{BRL(unitPrice(e))} cada</div></div>
                    <div className="line-right"><div className="line-total">{BRL(unitPrice(e)*e.qty)}</div><button className="del-btn" onClick={()=>delKey(key)}>remover</button></div>
                  </div>
                )
              })}
          </div>
          {totalQty()>0&&(
            <div className="bumps">
              <div className="bumps-head"><span style={{color:'var(--orange)'}}>✨</span> Que tal completar?</div>
              <div className="bump-row">
                {BUMP_IDS.map(id=>menuById(id)).filter(Boolean).filter(it=>qtyOfId(it!.id)===0).map(it=>it&&(
                  <div key={it.id} className="bump-card" onClick={()=>{addEntry({id:it.id,borda:null,extras:[],mode:'normal'});showToast(`${it.name} adicionado ✅`)}}>
                    <div className="bimg">{it.emoji}</div>
                    <div className="binfo"><div className="bn">{it.name}</div><div className="bp"><span className="bprice">{BRL(it.price)}</span><button className="badd">+</button></div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="order-foot">
            <div className="srow"><span>Subtotal</span><span className="v">{BRL(subtotal)}</span></div>
            <div className="srow"><span>Entrega</span><span className="v">{BRL(deliveryFee)}</span></div>
            <div className="srow total"><span>Total</span><span className="v">{BRL(total)}</span></div>
            {[{lbl:'Seu nome',val:nome,set:setNome,ph:'Como podemos te chamar?',type:'text'},{lbl:'Endereço de entrega',val:addr,set:setAddr,ph:'Rua, número, bairro...',type:'text'}].map(f=>(
              <div key={f.lbl} className="addr-wrap"><label className="addr-label">{f.lbl}</label><input className="addr-input" type={f.type} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)}/></div>
            ))}
            <div className="addr-wrap">
              <label className="addr-label">Pagamento</label>
              <div className="pay-row">{['💠 Pix','💳 Cartão','💵 Dinheiro'].map(p=><button key={p} className={`pay-chip${pay===p?' active':''}`} onClick={()=>setPay(p)}>{p}</button>)}</div>
              {pay==='💵 Dinheiro'&&<input className="addr-input" type="text" inputMode="numeric" placeholder="Troco para quanto?" value={change} onChange={e=>setChange(e.target.value)} style={{marginTop:8}}/>}
            </div>
            <div className="addr-wrap"><label className="addr-label">Obs. <span style={{opacity:.5,textTransform:'none',letterSpacing:0}}>(opcional)</span></label><input className="addr-input" type="text" placeholder="Sem cebola, borda recheada..." value={obs} onChange={e=>setObs(e.target.value)}/></div>
            <button className="wa-btn" disabled={!totalQty()} onClick={sendWA}>{waSvg}Enviar Pedido pelo WhatsApp</button>
            {totalQty()>0&&<button className="clear-link" onClick={clearCart}>Limpar pedido</button>}
          </div>
        </aside>
      </div>

      {/* ── MOBILE BAR ── */}
      {totalQty()>0&&(
        <div className="mobile-bar">
          <div className="mb-left">
            <div className="mb-bag"><svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2"/><path d="M16 10a4 4 0 01-8 0"/></svg><span className="mb-badge">{totalQty()}</span></div>
            <div><div className="mb-count">{totalQty()} {totalQty()===1?'item':'itens'}</div><div className="mb-total">{BRL(total)}</div></div>
          </div>
          <button className="mb-go" onClick={()=>setCartOpen(true)}>Ver pedido</button>
        </div>
      )}

      {/* ── MOBILE CART SCREEN ── */}
      <div className={`cart-screen${cartOpen?' open':''}`}>
        <div className="cs-header">
          <button className="cs-back" onClick={()=>setCartOpen(false)}><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
          <h2>Seu Pedido</h2><span className="cs-badge">{totalQty()}</span>
        </div>
        <div className="cs-body">
          {Object.keys(cart).length>0&&(
            <div className="cs-card">
              {entries().map(({key,e})=>{
                const opts=optionsLabel(e)
                return (
                  <div key={key} className="cs-line">
                    <div className="cs-qty"><button onClick={()=>decKey(key)}>−</button><span className="cs-n">{e.qty}</span><button className="inc" onClick={()=>incKey(key)}>+</button></div>
                    <div className="cs-name"><div className="nm">{labelEntry(e)}</div>{opts&&<div className="un">{opts}</div>}<div className="un">{BRL(unitPrice(e))} cada</div></div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                      <div className="cs-price">{BRL(unitPrice(e)*e.qty)}</div>
                      <button className="cs-del" onClick={()=>delKey(key)}><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {BUMP_IDS.map(id=>menuById(id)).filter(Boolean).filter(it=>qtyOfId(it!.id)===0).length>0&&(
            <><div className="cs-bumps-title">✨ Que tal completar?</div>
            <div className="cs-bump-row">
              {BUMP_IDS.map(id=>menuById(id)).filter(Boolean).filter(it=>qtyOfId(it!.id)===0).map(it=>it&&(
                <div key={it.id} className="cs-bump-card" onClick={()=>{addEntry({id:it.id,borda:null,extras:[],mode:'normal'});showToast(`${it.name} adicionado ✅`)}}>
                  <div className="cs-bump-img">{it.emoji}</div>
                  <div className="cs-bump-info"><div className="cs-bump-name">{it.name}</div><div className="cs-bump-foot"><span className="cs-bump-price">{BRL(it.price)}</span><button className="cs-bump-add">+</button></div></div>
                </div>
              ))}
            </div></>
          )}
          <div className="cs-summary">
            <div className="cs-srow"><span>Subtotal</span><span>{BRL(subtotal)}</span></div>
            <div className="cs-srow"><span>Entrega</span><span>{BRL(deliveryFee)}</span></div>
            <div className="cs-srow total"><span>Total</span><span className="tv">{BRL(total)}</span></div>
          </div>
          <div className="cs-addr">
            <label>Seu nome</label><input type="text" placeholder="Como podemos te chamar?" value={nome} onChange={e=>setNome(e.target.value)} style={{marginBottom:12}}/>
            <label>Endereço de entrega</label><input type="text" placeholder="Rua, número, bairro..." value={addr} onChange={e=>setAddr(e.target.value)} style={{marginBottom:12}}/>
            <label>Pagamento</label>
            <div className="pay-row">{['💠 Pix','💳 Cartão','💵 Dinheiro'].map(p=><button key={p} className={`pay-chip${pay===p?' active':''}`} onClick={()=>setPay(p)}>{p}</button>)}</div>
            {pay==='💵 Dinheiro'&&<input type="text" inputMode="numeric" placeholder="Troco para quanto?" value={change} onChange={e=>setChange(e.target.value)} style={{marginTop:8,marginBottom:12}}/>}
            <label style={{marginTop:12}}>Obs. (opcional)</label><input type="text" placeholder="Sem cebola, borda recheada..." value={obs} onChange={e=>setObs(e.target.value)}/>
          </div>
        </div>
        <div className="cs-footer">
          <button className="cs-wa-btn" disabled={!totalQty()} onClick={sendWA}>{waSvg}Enviar Pedido pelo WhatsApp</button>
          <button className="cs-clear" onClick={()=>{clearCart();setCartOpen(false)}}>Limpar pedido</button>
        </div>
      </div>

      {/* ── MODAL PRODUTO NORMAL ── */}
      {modal==='product'&&pmItem&&(
        <div className="pm-overlay open" onClick={e=>{if(e.target===e.currentTarget)setModal(null)}}>
          <div className="pm">
            <div className="pm-media">
              <button className="pm-close" onClick={()=>setModal(null)}>✕</button>
              {pmItem.img&&<img src={pmItem.img} alt={pmItem.name}/>}
              <div className="pm-overlay-img"/>
              <span className="pm-emoji">{pmItem.emoji}</span>
            </div>
            <div className="pm-body">
              <h3>{pmItem.name}</h3>
              <div className="pm-desc">{pmItem.desc}</div>

              {/* Borda — só pizzas salgadas */}
              {pmItem.cat==='salgadas'&&(
                <>
                  <div className="pm-sect">Borda recheada <span className="req">escolha 1</span></div>
                  {[{id:null,name:'Sem borda',price:0},...BORDAS].map(b=>(
                    <div key={b.id??'none'} className={`pm-opt${pmBorda===b.id?' sel':''}`} onClick={()=>setPmBorda(b.id??null)}>
                      <span className="ck">✓</span>
                      <span className="on">{b.name}</span>
                      <span className="op" style={b.price===0?{color:'#aaa'}:{}}>{b.price===0?'Grátis':'+ '+BRL(b.price)}</span>
                    </div>
                  ))}
                </>
              )}

              {/* Acréscimos */}
              {extrasOf(pmItem.cat).length>0&&(
                <>
                  <div className="pm-sect">Acréscimos <span className="req">opcional</span></div>
                  {extrasOf(pmItem.cat).map(x=>(
                    <div key={x.id} className={`pm-opt sq${pmExtras.has(x.id)?' sel':''}`} onClick={()=>setPmExtras(prev=>{const s=new Set(prev);s.has(x.id)?s.delete(x.id):s.add(x.id);return s})}>
                      <span className="ck">✓</span>
                      <span className="on">{x.name}</span>
                      <span className="op">+ {BRL(x.price)}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="pm-foot">
              <div className="pm-qty">
                <button onClick={()=>setPmQty(q=>Math.max(1,q-1))}>−</button>
                <span className="n">{pmQty}</span>
                <button onClick={()=>setPmQty(q=>q+1)}>+</button>
              </div>
              <button className="pm-add" onClick={addFromModal}>
                <span>Adicionar ao pedido</span><span>{BRL(pmUnit()*pmQty)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL MEIO A MEIO ── */}
      {modal==='meio'&&(
        <div className="pm-overlay open" onClick={e=>{if(e.target===e.currentTarget)setModal(null)}}>
          <div className="pm">
            <div className="pm-media" style={{height:80,background:'var(--brand-grad)',flexDirection:'row',gap:0}}>
              <button className="pm-close" onClick={()=>setModal(null)}>✕</button>
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                <span style={{fontSize:28}}>{meioItem1?.emoji??'🍕'}</span>
                <span style={{fontSize:14,fontWeight:800,color:'#fff',fontFamily:'Fraunces, serif'}}>Meio a Meio</span>
                <span style={{fontSize:28}}>{meioItem2?.emoji??'🍕'}</span>
              </div>
            </div>

            <div className="pm-body">
              {/* Steps */}
              <div className="meio-step-bar">
                <div className={`s${meioStep>=1?' done':''}`}/>
                <div className={`s${meioStep>=2?' done':''}`}/>
              </div>

              {meioStep===1&&(
                <>
                  <div className="meio-half-label">1ª Metade — escolha o sabor</div>
                  <div className="meio-tabs">
                    <button className={`meio-tab${meioCat==='salgadas'?' active':''}`} onClick={()=>setMeioCat('salgadas')}>🍕 Salgadas</button>
                    <button className={`meio-tab${meioCat==='doces'?' active':''}`} onClick={()=>setMeioCat('doces')}>🍫 Doces</button>
                  </div>
                  <div className="meio-pizza-grid">
                    {meioPizzas.map(p=>(
                      <div key={p.id} className={`meio-pizza-item${meioItem1?.id===p.id?' sel':''}`} onClick={()=>setMeioItem1(p)}>
                        <div className="mpi-img">
                          {p.img&&<img src={p.img} alt={p.name}/>}
                          <span className="mpi-emoji">{p.emoji}</span>
                        </div>
                        <div className="mpi-info">
                          <div className="mpi-name">{p.name}</div>
                          <div className="mpi-price">{BRL(p.price)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Acréscimos 1ª metade */}
                  {meioItem1&&extrasOf(meioItem1.cat).length>0&&(
                    <>
                      <div className="pm-sect" style={{marginTop:12}}>Acréscimos — 1ª metade <span className="req">opcional</span></div>
                      {extrasOf(meioItem1.cat).map(x=>(
                        <div key={x.id} className={`pm-opt sq${meioExtras1.has(x.id)?' sel':''}`} onClick={()=>setMeioExtras1(prev=>{const s=new Set(prev);s.has(x.id)?s.delete(x.id):s.add(x.id);return s})}>
                          <span className="ck">✓</span><span className="on">{x.name}</span><span className="op">+ {BRL(x.price)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              {meioStep===2&&(
                <>
                  {/* Preview */}
                  <div className="meio-preview">
                    <div className="half"><div className="he">{meioItem1?.emoji}</div><div className="hn">{meioItem1?.name}</div></div>
                    <div className="div"/>
                    <div className="half"><div className="he">{meioItem2?.emoji??'?'}</div><div className="hn">{meioItem2?.name??'Escolha abaixo'}</div></div>
                  </div>

                  <div className="meio-half-label">2ª Metade — escolha o sabor</div>
                  <div className="meio-tabs">
                    <button className={`meio-tab${meioCat==='salgadas'?' active':''}`} onClick={()=>setMeioCat('salgadas')}>🍕 Salgadas</button>
                    <button className={`meio-tab${meioCat==='doces'?' active':''}`} onClick={()=>setMeioCat('doces')}>🍫 Doces</button>
                  </div>
                  <div className="meio-pizza-grid">
                    {meioPizzas.map(p=>(
                      <div key={p.id} className={`meio-pizza-item${meioItem2?.id===p.id?' sel':''}`} onClick={()=>setMeioItem2(p)}>
                        <div className="mpi-img">
                          {p.img&&<img src={p.img} alt={p.name}/>}
                          <span className="mpi-emoji">{p.emoji}</span>
                        </div>
                        <div className="mpi-info">
                          <div className="mpi-name">{p.name}</div>
                          <div className="mpi-price">{BRL(p.price)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Borda */}
                  <div className="pm-sect" style={{marginTop:12}}>Borda recheada <span className="req">opcional</span></div>
                  {[{id:null,name:'Sem borda',price:0},...BORDAS].map(b=>(
                    <div key={b.id??'none'} className={`pm-opt${meioBorda===b.id?' sel':''}`} onClick={()=>setMeioBorda(b.id??null)}>
                      <span className="ck">✓</span>
                      <span className="on">{b.name}</span>
                      <span className="op" style={b.price===0?{color:'#aaa'}:{}}>{b.price===0?'Grátis':'+ '+BRL(b.price)}</span>
                    </div>
                  ))}

                  {/* Acréscimos 2ª metade */}
                  {meioItem2&&extrasOf(meioItem2.cat).length>0&&(
                    <>
                      <div className="pm-sect" style={{marginTop:12}}>Acréscimos — 2ª metade <span className="req">opcional</span></div>
                      {extrasOf(meioItem2.cat).map(x=>(
                        <div key={x.id} className={`pm-opt sq${meioExtras2.has(x.id)?' sel':''}`} onClick={()=>setMeioExtras2(prev=>{const s=new Set(prev);s.has(x.id)?s.delete(x.id):s.add(x.id);return s})}>
                          <span className="ck">✓</span><span className="on">{x.name}</span><span className="op">+ {BRL(x.price)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>

            <div className="pm-foot" style={{flexDirection:'column',gap:8}}>
              {meioStep===2&&meioItem1&&meioItem2&&(
                <div style={{display:'flex',justifyContent:'space-between',width:'100%',fontSize:13,color:'#888'}}>
                  <span>Cobrado pelo maior preço</span>
                  <span style={{fontFamily:'Fraunces,serif',fontWeight:800,color:'var(--red)',fontSize:15}}>{BRL(meioUnit())}</span>
                </div>
              )}
              <div style={{display:'flex',gap:10,width:'100%',alignItems:'center'}}>
                {meioStep===2&&(
                  <button onClick={()=>setMeioStep(1)} style={{width:44,height:44,borderRadius:12,border:'1.5px solid #e0d8d0',background:'#faf5f0',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>‹</button>
                )}
                <div className="pm-qty">
                  <button onClick={()=>setMeioQty(q=>Math.max(1,q-1))}>−</button>
                  <span className="n">{meioQty}</span>
                  <button onClick={()=>setMeioQty(q=>q+1)}>+</button>
                </div>
                {meioStep===1
                  ? <button className="pm-add" disabled={!meioItem1} onClick={()=>{if(meioItem1){setMeioStep(2);setMeioCat(meioItem1.cat as 'salgadas'|'doces')}}}>
                      <span>Próximo — 2ª metade</span><span>›</span>
                    </button>
                  : <button className="pm-add" disabled={!meioItem1||!meioItem2} onClick={addMeio}>
                      <span>Adicionar ao pedido</span><span>{BRL(meioUnit()*meioQty)}</span>
                    </button>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
