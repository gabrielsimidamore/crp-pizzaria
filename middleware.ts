import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/cardapio/:slug*'],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const slug = pathname.split('/')[2]
  if (!slug) return NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) return NextResponse.next()

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/pizzerias?slug=eq.${encodeURIComponent(slug)}&select=status,paid_until&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: 'no-store',
      }
    )

    const rows = await res.json() as Array<{ status: string; paid_until: string | null }>
    const pizzeria = rows?.[0]

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
  } catch {
    return NextResponse.next()
  }
}
