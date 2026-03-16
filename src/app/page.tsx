import { LiveTicker } from '@/components/ui/LiveTicker'
import { HeroVisual } from '@/components/ui/HeroVisual'
import { FundHighlights } from '@/components/ui/FundHighlights'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Live Ticker - USD, EUR, Gold prices */}
      <LiveTicker />

      {/* Fund Highlights - Top performers / worst performers */}
      <section className="py-8">
        <FundHighlights />
      </section>

      {/* Hero Visual - Yanılsama vs Gerçek + Gerçek Sonuç */}
      <HeroVisual />
    </div>
  )
}
