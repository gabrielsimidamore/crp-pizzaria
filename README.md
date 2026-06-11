# 🍕 Pizzo — Cardápio Digital

Cardápio digital responsivo (mobile-first) com carrinho, combos promocionais, bordas recheadas, adicionais, order bumps e fechamento de pedido via WhatsApp. Navegação por carrosséis horizontais estilo iFood. Zero dependências, um único arquivo HTML — deploy instantâneo na Vercel.

**Produto HeartBeat Business** · cardápio digital por assinatura para pizzarias.

## Funcionalidades

- Catálogo por categorias (salgadas, doces, lanches, bebidas) com busca em tempo real
- Combos promocionais com preço fechado e % de desconto calculado automaticamente
- Carrinho persistente (`localStorage`) — o cliente não perde o pedido ao recarregar
- Modal de produto estilo iFood: borda recheada (Catupiry/Cheddar) e adicionais por categoria (mais queijo, bacon, etc.)
- Order bumps inteligentes: sugere borda recheada para pizzas no carrinho sem borda + bebidas
- Checkout completo: nome, endereço, forma de pagamento (Pix/Cartão/Dinheiro + troco) e observações
- Validação antes do envio (nome e endereço obrigatórios)
- Pedido formatado enviado direto pro WhatsApp da pizzaria
- Badge de aberto/fechado automático por horário
- Mobile: barra inferior fixa + tela de carrinho em tela cheia (estilo iFood)
- Desktop: painel lateral de pedido com temas (Tweaks)
- Performance: logo otimizada (1 MB → 11 KB WebP), lazy loading nas imagens, vídeo com poster e `preload="metadata"`
- Acessibilidade: `prefers-reduced-motion` respeitado, `aria-labels` nos botões

## Configuração rápida

Tudo fica no bloco `DATA` dentro de `index.html`:

| Constante | O que é |
|---|---|
| `WA_NUMBER` | WhatsApp que recebe os pedidos (formato `5511...`) |
| `DELIVERY` | Taxa de entrega em R$ |
| `OPEN_HOUR` / `CLOSE_HOUR` | Horário de funcionamento (badge automático) |
| `MENU` | Itens do cardápio (nome, descrição, preço, foto, tag) |
| `BORDAS` | Opções de borda recheada e preços |
| `EXTRAS` | Adicionais por categoria e preços |
| `PROMOS` | Combos promocionais (itens + preço fechado) |
| `BUMP_IDS` | Itens sugeridos no carrinho |

## Estrutura

```
index.html        → app completo (HTML + CSS + JS)
assets/           → logo, favicon, vídeo do hero e poster
archive/          → versões anteriores de design (referência)
screenshots/      → capturas de desenvolvimento
```

## Deploy

Push na `main` → deploy automático na Vercel. Sem build step.
