# Pizzo · Cardápio Digital SaaS

Sistema de cardápio digital para pizzarias com controle de assinatura via Cakto + Supabase + n8n.

## Stack
- **Next.js 14** (App Router) · Vercel
- **Supabase** · Banco de dados
- **Cakto** · Gateway de pagamento (webhook)
- **n8n** · Automação complementar

---

## Fluxo de assinatura

```
Cliente paga na Cakto
      ↓
Cakto dispara webhook → /api/webhook/cakto
      ↓
API atualiza pizzerias.status + paid_until no Supabase
      ↓
middleware.ts checa status a cada request do cardápio
      ↓
✅ Ativo → serve o cardápio
❌ Pausado → redireciona para /pausado
```

---

## Setup rápido

1. Execute `supabase-schema.sql` no SQL Editor do Supabase
2. Copie `.env.local.example` para `.env.local` e preencha as chaves
3. Configure o webhook da Cakto: `https://seudominio.vercel.app/api/webhook/cakto`
4. `vercel --prod`

## Rotas

| Rota | Descrição |
|------|-----------|
| `/cardapio/[slug]` | Cardápio da pizzaria |
| `/pausado?slug=xxx` | Assinatura pausada |
| `/api/webhook/cakto` | Webhook Cakto |
