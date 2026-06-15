import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Só intercepta rotas de cardápio
  if (!pathname.startsWith('/cardapio/')) return NextResponse.next()

  const slug = pathname.split('/')[2]
  if (!slug) return NextResponse.next()

  // Verifica status da assinatura no Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: pizzeria, error } = await supabase
    .from('pizzerias')
    .select('status, paid_until')
    .eq('slug', slug)
    .single()

  // Pizzaria não encontrada
  if (error || !pizzeria) {
    return NextResponse.redirect(new URL('/404', req.url))
  }

  // Verifica se está ativa e dentro do prazo pago
  const isActive = pizzeria.status === 'active'
  const isPaidValid = pizzeria.paid_until
    ? new Date(pizzeria.paid_until) >= new Date()
    : false

  if (!isActive || !isPaidValid) {
    return NextResponse.redirect(new URL(`/pausado?slug=${slug}`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cardapio/:slug*'],
}
