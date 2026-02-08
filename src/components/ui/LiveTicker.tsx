'use client'

import { useEffect, useState } from 'react'
import { fetchLiveRates, type LiveRates } from '@/lib/api/rates'

export function LiveTicker() {
  const [rates, setRates] = useState<LiveRates | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRates() {
      try {
        const data = await fetchLiveRates()
        setRates(data)
      } catch (error) {
        console.error('Failed to fetch rates:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRates()
    // Refresh every minute
    const interval = setInterval(loadRates, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-slate-800 text-white py-3 px-4 rounded-lg">
        <div className="flex justify-center space-x-8">
          <span className="animate-pulse text-slate-300">Loading rates...</span>
        </div>
      </div>
    )
  }

  if (!rates) {
    return null
  }

  return (
    <div className="bg-slate-800 text-white py-3 px-4 rounded-lg shadow-md">
      <div className="flex justify-center flex-wrap gap-6 text-sm md:text-base">
        <TickerItem label="USD/TRY" value={rates.usdTry} />
        <TickerItem label="EUR/TRY" value={rates.eurTry} />
        <TickerItem label="Gram Altın" value={rates.goldTry} suffix=" ₺" />
        <TickerItem label="Ons Altın" value={rates.goldUsd} prefix="$" />
      </div>
    </div>
  )
}

function TickerItem({
  label,
  value,
  prefix = '',
  suffix = '',
}: {
  label: string
  value: number
  prefix?: string
  suffix?: string
}) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="font-bold text-gold-400">
        {prefix}{value.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}{suffix}
      </span>
    </div>
  )
}
