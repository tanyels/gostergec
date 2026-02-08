'use client'

import { useState } from 'react'
import { IllusionBarChart } from './IllusionBarChart'
import { FundMeltCounter } from './FundMeltCounter'
import { FUNDS } from '@/lib/data/funds'
import { calculateRealReturns, type RealReturns } from '@/lib/utils/calculations'

const AMOUNT = 10000

export function HeroVisual() {
  const [selectedFund, setSelectedFund] = useState('')
  const [results, setResults] = useState<RealReturns | null>(null)
  const [loading, setLoading] = useState(false)

  const fund = FUNDS.find((f) => f.code === selectedFund)

  async function handleFundChange(code: string) {
    setSelectedFund(code)
    if (!code) {
      setResults(null)
      return
    }

    setLoading(true)
    try {
      const data = await calculateRealReturns({
        fundCode: code,
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amountTry: AMOUNT,
      })
      setResults(data)
    } catch {
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const tlReturn = results?.tryReturn ?? 67
  const usdReturn = results?.usdReturn ?? -8
  const endTL = results?.endValueTry ?? 16700
  const endUSD = results?.endValueUsd ?? 1740
  const startUSD = results
    ? Math.round(results.endValueUsd / (1 + results.usdReturn / 100))
    : 1890

  return (
    <section className="w-full py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">
          Fonunuz Gerçekten Kazandırıyor mu?
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-6">
          TL bazlı getiriler yanıltıcı olabilir. Bir fon seçin, gerçek performansı görün.
        </p>

        {/* Fund selector */}
        <div className="flex justify-center">
          <select
            value={selectedFund}
            onChange={(e) => handleFundChange(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 bg-white font-medium focus:ring-2 focus:ring-slate-400 focus:border-slate-400 min-w-[300px] text-base"
          >
            <option value="">Fon seçin...</option>
            {FUNDS.map((f) => (
              <option key={f.code} value={f.code}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {fund && (
          <p className="text-sm text-slate-400 mt-2">
            {fund.category} · {fund.manager} · Son 1 yıl
          </p>
        )}
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-400 animate-pulse">Hesaplanıyor...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <IllusionBarChart
              tlReturn={tlReturn}
              usdReturn={usdReturn}
              fundName={fund?.name}
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <FundMeltCounter
              startTL={AMOUNT}
              endTL={Math.round(endTL)}
              startUSD={startUSD}
              endUSD={Math.round(endUSD)}
              tlReturn={tlReturn}
              usdReturn={usdReturn}
              fundName={fund?.name}
            />
          </div>
        </div>
      )}
    </section>
  )
}
