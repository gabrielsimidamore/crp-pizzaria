export default async function PausadoPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>
}) {
  const { slug } = await searchParams
  return (
    <div style={{ minHeight: '100vh', background: '#F3E3DD', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: 32, boxShadow: '0 16px 48px rgba(80,40,20,0.15)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>😴</div>
          <h1 style={{ fontWeight: 900, fontSize: 24, color: '#5a3c33', marginBottom: 8 }}>Cardápio temporariamente indisponível</h1>
          <p style={{ color: '#8D6E63', fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
            Este cardápio está pausado no momento. Se você é o dono da pizzaria, regularize sua assinatura para reativar.
          </p>
          <div style={{ background: '#FDECEA', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 16, padding: 16, textAlign: 'left' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Para reativar</p>
            <p style={{ fontSize: 14, color: '#5a3c33', margin: 0 }}>
              Regularize seu pagamento. O cardápio será reativado automaticamente.
            </p>
          </div>
          {slug && <p style={{ fontSize: 12, color: '#8D6E63', marginTop: 16, fontFamily: 'monospace' }}>Cardápio: {slug}</p>}
        </div>
        <p style={{ fontSize: 12, color: '#8D6E63', marginTop: 16 }}>
          Powered by <span style={{ fontWeight: 700, color: '#E8432A' }}>Pizzo</span>
        </p>
      </div>
    </div>
  )
}
