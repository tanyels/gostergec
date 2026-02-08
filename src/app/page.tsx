import { LiveTicker } from '@/components/ui/LiveTicker'
import { HeroVisual } from '@/components/ui/HeroVisual'
import { QuickCalculator } from '@/components/ui/QuickCalculator'
import { FundHighlights } from '@/components/ui/FundHighlights'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Live Ticker - USD, EUR, Gold prices */}
      <LiveTicker />

      {/* Hero Visual - Animated bar chart + melt counter */}
      <HeroVisual />

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
