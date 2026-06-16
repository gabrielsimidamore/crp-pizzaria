import { redirect } from 'next/navigation'
import CardapioClient from './CardapioClient'

export const dynamic = 'force-dynamic'

async function getPizzeria(slug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Se não tiver as variáveis, mostra o cardápio mesmo assim (modo demo)
  if (!supabaseUrl || !serviceKey) {
    console.log('AVISO: Variáveis Supabase não configuradas - modo demo')
    return { slug, name: 'Pizzo', status: 'active', paid_until: '2099-01-01', wa_number: '5511980794899', phone: '', address: 'Delivery', delivery_fee: 5 }
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/pizzerias?slug=eq.${encodeURIComponent(slug)}&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        cache: 'no-store',
      }
    )

    console.log('Supabase status:', res.status, 'slug:', slug)

    if (!res.ok) {
      const text = await res.text()
      console.log('Supabase error:', text)
      return null
    }

    const rows = await res.json()
    console.log('Pizzeria found:', rows?.[0]?.slug ?? 'nenhuma')
    return rows?.[0] ?? null
  } catch (err) {
    console.log('Fetch error:', err)
    return null
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pizzeria = await getPizzeria(slug)

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
