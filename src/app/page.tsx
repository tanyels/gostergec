import { LiveTicker } from '@/components/ui/LiveTicker'
import { FeatureHub } from '@/components/home/FeatureHub'
import { QuickStats } from '@/components/home/QuickStats'
import { HeroSection } from '@/components/home/HeroSection'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Live Ticker */}
      <div className="container mx-auto px-4 pt-6">
        <LiveTicker />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Quick Stats */}
      <QuickStats />

      {/* Feature Hub - All Tools Compartmentalized */}
      <FeatureHub />
    </div>
  )
}
