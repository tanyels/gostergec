import { CryptoComparison } from '@/components/ui/CryptoComparison'

export default function CryptoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Kripto Karşılaştırma</h1>
      <p className="text-slate-600 mb-2">
        Fonlarınızı Bitcoin ve Ethereum ile karşılaştırın
      </p>
      <p className="text-slate-500 text-sm mb-8">
        Compare your funds against Bitcoin and Ethereum performance
      </p>

      <CryptoComparison />
    </div>
  )
}
