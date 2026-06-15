export default function PausadoPage({
  searchParams,
}: {
  searchParams: { slug?: string }
}) {
  return (
    <div className="min-h-screen bg-[#F3E3DD] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/60">
          <div className="text-6xl mb-4">😴</div>
          <h1 className="font-serif font-black text-2xl text-[#5a3c33] mb-2">
            Cardápio temporariamente indisponível
          </h1>
          <p className="text-[#8D6E63] text-sm leading-relaxed mb-6">
            Este cardápio está pausado no momento. Se você é o dono da pizzaria, regularize sua assinatura para reativar.
          </p>
          <div className="bg-[#FDECEA] border border-[#E74C3C]/30 rounded-2xl p-4 text-left">
            <p className="text-xs font-bold text-[#C0392B] uppercase tracking-wider mb-1">Para reativar</p>
            <p className="text-sm text-[#5a3c33]">
              Entre em contato com o suporte e regularize seu pagamento. O cardápio será reativado automaticamente.
            </p>
          </div>
          {searchParams.slug && (
            <p className="text-xs text-[#8D6E63] mt-4 font-mono">
              Cardápio: {searchParams.slug}
            </p>
          )}
        </div>
        <p className="text-xs text-[#8D6E63] mt-4">
          Powered by <span className="font-bold text-[#E8432A]">Pizzo</span> · Cardápio Digital para Pizzarias
        </p>
      </div>
    </div>
  )
}
