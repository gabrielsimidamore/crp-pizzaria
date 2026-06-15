export interface Pizzeria {
  id: string
  slug: string
  name: string
  phone: string
  address: string
  logo_url: string | null
  open_hour: number
  close_hour: number
  delivery_fee: number
  wa_number: string
  status: 'active' | 'paused' | 'cancelled'
  paid_until: string | null
  created_at: string
}

export interface MenuItem {
  id: string
  pizzeria_id: string
  cat: 'salgadas' | 'doces' | 'lanches' | 'bebidas'
  name: string
  desc: string
  price: number
  emoji: string
  img_url: string | null
  tag: 'hot' | 'new' | null
  social: string | null
  active: boolean
  sort_order: number
}

export interface CartEntry {
  id: string
  qty: number
  borda: string | null
  extras: string[]
}

export interface Cart {
  [key: string]: CartEntry
}
