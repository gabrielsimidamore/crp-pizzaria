import { redirect } from 'next/navigation'
import CardapioClient from './CardapioClient'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

async function getPizzeria(slug: string) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/pizzerias?slug=eq.${encodeURIComponent(slug)}&limit=1`,
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
        cache: 'no-store',
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
  const { slug } = await params
  const pizzeria = await getPizzeria(slug)

  // Pizzaria não existe ou assinatura inativa → página de pausado
  if (!pizzeria) {
    redirect(`/pausado?slug=${slug}`)
  }

  const isActive = pizzeria.status === 'active'
  const isPaidValid = pizzeria.paid_until
    ? new Date(pizzeria.paid_until) >= new Date()
    : false

  if (!isActive || !isPaidValid) {
    redirect(`/pausado?slug=${slug}`)
  }

  return <CardapioClient pizzeria={pizzeria} />
}
