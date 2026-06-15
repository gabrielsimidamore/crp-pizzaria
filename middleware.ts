import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/cardapio/:slug*'],
  runtime: 'edge',
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/cardapio/')) return NextResponse.next()

  const slug = pathname.split('/')[2]
  if (!slug) return NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Supabase env vars missing')
    return NextResponse.next()
  }

  try {
    // Usa fetch nativo — compatível com Edge Runtime
    const res = await fetch(
      `${supabaseUrl}/rest/v1/pizzerias?slug=eq.${slug}&select=status,paid_until&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await res.json()
    const pizzeria = data?.[0]

    if (!pizzeria) {
      return NextResponse.redirect(new URL('/pausado?slug=' + slug, req.url))
    }

    const isActive = pizzeria.status === 'active'
    const isPaidValid = pizzeria.paid_until
      ? new Date(pizzeria.paid_until) >= new Date()
      : false

    if (!isActive || !isPaidValid) {
      return NextResponse.redirect(new URL('/pausado?slug=' + slug, req.url))
    }

    return NextResponse.next()
  } catch (err) {
    console.error('Middleware error:', err)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/cardapio/:slug*'],
}
