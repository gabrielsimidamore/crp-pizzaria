-- ============================================================
-- PIZZO · Schema Supabase
-- Execute no SQL Editor do Supabase (projeto Pizzoapp)
-- ============================================================

-- 1. Pizzerias (clientes do SaaS)
CREATE TABLE pizzerias (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,          -- URL: /cardapio/familia-silva
  name          TEXT NOT NULL,                  -- Nome da pizzaria
  owner_email   TEXT NOT NULL,                  -- Email do dono (para match com Cakto)
  phone         TEXT,
  address       TEXT,
  logo_url      TEXT,
  wa_number     TEXT NOT NULL,                  -- WhatsApp p/ receber pedidos
  open_hour     INT DEFAULT 18,
  close_hour    INT DEFAULT 24,
  delivery_fee  NUMERIC(6,2) DEFAULT 5.00,
  -- Controle de assinatura
  status        TEXT NOT NULL DEFAULT 'paused'  -- active | paused | cancelled
                CHECK (status IN ('active', 'paused', 'cancelled')),
  paid_until    TIMESTAMPTZ,                    -- Quando a assinatura expira
  cakto_sub_id  TEXT,                           -- ID da assinatura na Cakto
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_pizzerias_slug ON pizzerias (slug);
CREATE INDEX idx_pizzerias_email ON pizzerias (owner_email);
CREATE INDEX idx_pizzerias_status ON pizzerias (status);

-- 2. Menu Items (cardápio de cada pizzaria)
CREATE TABLE menu_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pizzeria_id UUID NOT NULL REFERENCES pizzerias(id) ON DELETE CASCADE,
  cat         TEXT NOT NULL CHECK (cat IN ('salgadas', 'doces', 'lanches', 'bebidas')),
  name        TEXT NOT NULL,
  desc        TEXT,
  price       NUMERIC(8,2) NOT NULL,
  emoji       TEXT DEFAULT '🍕',
  img_url     TEXT,
  tag         TEXT CHECK (tag IN ('hot', 'new', NULL)),
  social      TEXT,
  active      BOOLEAN DEFAULT true,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_pizzeria ON menu_items (pizzeria_id, active, sort_order);

-- 3. Subscription Log (histórico de eventos da Cakto)
CREATE TABLE subscription_events (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pizzeria_id   UUID REFERENCES pizzerias(id),
  event         TEXT NOT NULL,       -- ex: purchase.approved
  old_status    TEXT,
  new_status    TEXT,
  paid_until    TIMESTAMPTZ,
  raw_payload   JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Trigger: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pizzerias_updated_at
  BEFORE UPDATE ON pizzerias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. RLS (Row Level Security)
ALTER TABLE pizzerias    ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items   ENABLE ROW LEVEL SECURITY;

-- Cardápio público: qualquer um pode LER pizzerias ativas
CREATE POLICY "Pizzerias ativas são públicas"
  ON pizzerias FOR SELECT
  USING (status = 'active');

-- Menu público: qualquer um pode LER itens de pizzerias ativas
CREATE POLICY "Menu de pizzerias ativas é público"
  ON menu_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pizzerias p
      WHERE p.id = menu_items.pizzeria_id
      AND p.status = 'active'
    )
  );

-- Service role tem acesso total (webhook n8n e Cakto)
-- (sem policy = bloqueado; service_role bypassa RLS)

-- ============================================================
-- DADOS DE EXEMPLO (remova em produção)
-- ============================================================
INSERT INTO pizzerias (slug, name, owner_email, phone, address, wa_number, status, paid_until, delivery_fee)
VALUES (
  'familia-silva',
  'Pizzaria Família Silva',
  'dono@pizzafamiliasilva.com.br',
  '(11) 98079-4899',
  'Osasco e região',
  '5511980794899',
  'active',
  NOW() + INTERVAL '30 days',
  5.00
);
