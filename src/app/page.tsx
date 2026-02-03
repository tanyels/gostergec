import { LiveTicker } from '@/components/ui/LiveTicker'
import { QuickCalculator } from '@/components/ui/QuickCalculator'
import { FundHighlights } from '@/components/ui/FundHighlights'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Live Ticker - USD, EUR, Gold prices */}
      <LiveTicker />

      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          Fonunuz Gerçekten Kazandırıyor mu?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          TL bazlı getiriler yanıltıcı olabilir. Yatırımınızın USD, EUR ve altın
          karşısındaki gerçek performansını görün.
        </p>
        <p className="text-lg text-gray-500 mt-2">
          Is your fund really profitable? See real returns against USD, EUR, and gold.
        </p>
      </section>

      {/* Quick Calculator */}
      <section className="py-8">
        <QuickCalculator />
      </section>

      {/* Fund Highlights - Top performers / worst performers */}
      <section className="py-8">
        <FundHighlights />
      </section>
    </div>
  )
}
