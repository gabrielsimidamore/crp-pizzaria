import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Eventos que a Cakto envia — ajuste conforme payload real
type CaktoEvent =
  | 'purchase.approved'
  | 'purchase.completed'
  | 'subscription.active'
  | 'subscription.renewed'
  | 'subscription.cancelled'
  | 'subscription.overdue'
  | 'subscription.suspended'
  | 'charge.failed'

interface CaktoWebhookPayload {
  event: CaktoEvent
  data: {
    customer: {
      email: string
      name?: string
    }
    subscription?: {
      id: string
      status: string
    }
    product?: {
      id: string
    }
    // Adicione campos conforme o payload real da Cakto
    metadata?: {
      pizzeria_slug?: string
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CaktoWebhookPayload = await req.json()
    const supabase = createServerClient()

    const { event, data } = body
    const email = data.customer?.email
    const slug = data.metadata?.pizzeria_slug

    if (!email && !slug) {
      return NextResponse.json({ error: 'Sem identificador' }, { status: 400 })
    }

    // Calcula paid_until: 35 dias a partir de hoje (30 dias + 5 de tolerância)
    const paidUntil = new Date()
    paidUntil.setDate(paidUntil.getDate() + 35)

    // Determina ação por evento
    const ACTIVATE_EVENTS: CaktoEvent[] = [
      'purchase.approved',
      'purchase.completed',
      'subscription.active',
      'subscription.renewed',
    ]

    const PAUSE_EVENTS: CaktoEvent[] = [
      'subscription.cancelled',
      'subscription.overdue',
      'subscription.suspended',
      'charge.failed',
    ]

    let updateData: Record<string, unknown> = {}

    if (ACTIVATE_EVENTS.includes(event)) {
      updateData = {
        status: 'active',
        paid_until: paidUntil.toISOString(),
      }
    } else if (PAUSE_EVENTS.includes(event)) {
      updateData = {
        status: 'paused',
      }
    } else {
      // Evento desconhecido — loga e ignora
      console.log('Evento Cakto desconhecido:', event)
      return NextResponse.json({ received: true, action: 'ignored' })
    }

    // Atualiza pelo slug (metadata) ou pelo email do cliente
    let query = supabase.from('pizzerias').update(updateData)

    if (slug) {
      query = query.eq('slug', slug)
    } else {
      query = query.eq('owner_email', email)
    }

    const { error } = await query

    if (error) {
      console.error('Erro ao atualizar Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`[Cakto] Evento: ${event} | Status: ${updateData.status} | Slug: ${slug || email}`)
    return NextResponse.json({ received: true, event, action: updateData.status })
  } catch (err) {
    console.error('Erro no webhook Cakto:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
