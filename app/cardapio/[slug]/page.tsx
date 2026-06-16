import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import CardapioClient from './CardapioClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

async function getPizzeria(slug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return { slug, name: 'Pizzo', status: 'active', paid_until: '2099-01-01', wa_number: '5511980794899', phone: '', address: 'Delivery', delivery_fee: 5 }
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/pizzerias?slug=eq.${encodeURIComponent(slug)}&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
        },
        cache: 'no-store',
        next: { revalidate: 0 },
      }
    )
    if (!res.ok) return null
    const rows = await res.json()
    return rows?.[0] ?? null
  } catch {
    return null
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Força leitura dos headers para garantir execução dinâmica
  await headers()

  const { slug } = await params
  const pizzeria = await getPizzeria(slug)

  if (!pizzeria) redirect(`/pausado?slug=${slug}`)

  const isActive = pizzeria.status === 'active'
  const isPaidValid = pizzeria.paid_until
    ? new Date(pizzeria.paid_until) >= new Date()
    : false

  if (!isActive || !isPaidValid) redirect(`/pausado?slug=${slug}`)

  return <CardapioClient pizzeria={pizzeria} />
}
