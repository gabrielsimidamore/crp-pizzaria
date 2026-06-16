import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function updatePizzeria(where: Record<string, string>, data: Record<string, unknown>) {
  const params = Object.entries(where).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&')
  return fetch(`${SUPABASE_URL}/rest/v1/pizzerias?${params}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(data),
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const event: string = body.event ?? ''
    const email: string = body.data?.customer?.email ?? ''
    const slug: string = body.data?.metadata?.pizzeria_slug ?? ''

    if (!email && !slug) {
      return NextResponse.json({ error: 'Sem identificador' }, { status: 400 })
    }

    const paidUntil = new Date()
    paidUntil.setDate(paidUntil.getDate() + 35)

    const ACTIVATE = ['purchase.approved', 'purchase.completed', 'subscription.active', 'subscription.renewed', 'Compra aprovada', 'Assinatura renovada', 'Assinatura criada', 'Renovação de assinatura']
    const PAUSE = ['subscription.cancelled', 'subscription.overdue', 'subscription.suspended', 'charge.failed', 'Assinatura cancelada', 'Compra recusada', 'Chargeback', 'Reembolso']

    let updateData: Record<string, unknown> = {}
    if (ACTIVATE.some(e => event.includes(e))) {
      updateData = { status: 'active', paid_until: paidUntil.toISOString() }
    } else if (PAUSE.some(e => event.includes(e))) {
      updateData = { status: 'paused' }
    } else {
      return NextResponse.json({ received: true, action: 'ignored', event })
    }

    const where: Record<string, string> = slug ? { slug } : { owner_email: email }
    await updatePizzeria(where, updateData)

    return NextResponse.json({ received: true, event, action: updateData.status })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
