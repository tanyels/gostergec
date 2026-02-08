'use client'

import { useState, useEffect, useRef } from 'react'
import { IllusionBarChart } from './IllusionBarChart'
import { FundMeltCounter } from './FundMeltCounter'
import { FUNDS } from '@/lib/data/funds'
import { calculateRealReturns, type RealReturns } from '@/lib/utils/calculations'

const DEFAULT_AMOUNT = 10000

// Candidate funds for random selection
const CANDIDATE_CODES = ['IST', 'AK1', 'YKP', 'IPB', 'TTE', 'AFA']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function HeroVisual() {
  const [selectedFund, setSelectedFund] = useState('')
  const [amount, setAmount] = useState(DEFAULT_AMOUNT)
  const [results, setResults] = useState<RealReturns | null>(null)
  const [loading, setLoading] = useState(false)
  const initialized = useRef(false)

  const fund = FUNDS.find((f) => f.code === selectedFund)

  // Pick a random fund that has TL+ and USD- on first load
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function findIdealFund() {
      const shuffled = shuffle(CANDIDATE_CODES)
      for (const code of shuffled) {
        try {
          const data = await calculateRealReturns({
            fundCode: code,
            startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            amountTry: DEFAULT_AMOUNT,
          })
          if (data.tryReturn > 0 && data.usdReturn < 0) {
            setSelectedFund(code)
            setResults(data)
            return
          }
        } catch {
          continue
        }
      }
      // Fallback: just use the first one even if it doesn't match
      const fallback = shuffled[0]
      setSelectedFund(fallback)
      fetchResults(fallback, DEFAULT_AMOUNT)
    }

    setLoading(true)
    findIdealFund().finally(() => setLoading(false))
  }, [])

  async function fetchResults(code: string, amt: number) {
    if (!code) {
      setResults(null)
      return
    }

    setLoading(true)
    try {
      const data = await calculateRealReturns({
        fundCode: code,
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amountTry: amt,
      })
      setResults(data)
    } catch {
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  function handleFundChange(code: string) {
    setSelectedFund(code)
    fetchResults(code, amount)
  }

  function handleAmountChange(val: number) {
    setAmount(val)
    if (selectedFund) fetchResults(selectedFund, val)
  }

  // Placeholder defaults based on ~2024 rates
  const tlReturn = results?.tryReturn ?? 67
  const usdReturn = results?.usdReturn ?? -8
  const goldReturn = results?.goldReturn ?? -18
  const endTL = results?.endValueTry ?? Math.round(amount * 1.67)
  const startUSD = results?.startValueUsd ?? amount / 32
  const endUSD = results?.endValueUsd ?? (amount * 1.67) / 36
  const startGold = results?.startValueGold ?? amount / 2500
  const endGold = results?.endValueGold ?? (amount * 1.67) / 3200

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
              startTL={amount}
              endTL={Math.round(endTL)}
              tlReturn={tlReturn}
              startUSD={startUSD}
              endUSD={endUSD}
              usdReturn={usdReturn}
              startGold={startGold}
              endGold={endGold}
              goldReturn={goldReturn}
              selectedFund={selectedFund}
              fundName={fund?.name}
              onFundChange={handleFundChange}
              onAmountChange={handleAmountChange}
            />
          </div>
        </div>
      )}
    </section>
  )
}
