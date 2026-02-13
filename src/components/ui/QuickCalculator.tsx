'use client'

import { useState } from 'react'
import { FUNDS } from '@/lib/data/funds'
import { calculateRealReturns, type RealReturns } from '@/lib/utils/calculations'

export function QuickCalculator() {
  const [selectedFund, setSelectedFund] = useState('')
  const [startDate, setStartDate] = useState('2020-01-01')
  const [amount, setAmount] = useState('10000')
  const [results, setResults] = useState<RealReturns | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCalculate() {
    if (!selectedFund || !startDate || !amount) return

    setLoading(true)
    try {
      const returns = await calculateRealReturns({
        fundCode: selectedFund,
        startDate,
        amountTry: parseFloat(amount),
      })
      setResults(returns)
    } catch (error) {
      console.error('Calculation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Hızlı Hesaplama / Quick Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Fund Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Fon / Fund</label>
          <select
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 bg-white focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
          >
            <option value="">Seçin...</option>
            {FUNDS.map((fund) => (
              <option key={fund.code} value={fund.code}>
                {fund.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Başlangıç / Start</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 bg-white focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Tutar (TL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 bg-white focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
            placeholder="10000"
          />
        </div>

        {/* Calculate Button */}
        <div className="flex items-end">
          <button
            onClick={handleCalculate}
            disabled={loading || !selectedFund}
            className="w-full bg-slate-800 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Hesaplanıyor...' : 'Hesapla'}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
            <ResultCard
              label="TL Getiri"
              value={results.tryReturn}
              sublabel="Nominal"
            />
            <ResultCard
              label="USD Getiri"
              value={results.usdReturn}
              sublabel="Gerçek"
              highlight
            />
            <ResultCard
              label="EUR Getiri"
              value={results.eurReturn}
              sublabel="Gerçek"
            />
            <ResultCard
              label="Altın Getiri"
              value={results.goldReturn}
              sublabel="Gerçek"
            />
          </div>

          {/* Verdict Infographic */}
          <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-sm font-semibold text-slate-500 mb-4 text-center uppercase tracking-wide">
              Gerçek Sonuç
            </p>
            <div className="grid grid-cols-3 gap-4">
              <VerdictBadge
                symbol="₺"
                label="TL Bazında"
                value={results.tryReturn}
              />
              <VerdictBadge
                symbol="$"
                label="Dolar Bazında"
                value={results.usdReturn}
              />
              <VerdictBadge
                symbol={<GoldIcon />}
                label="Altın Bazında"
                value={results.goldReturn}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ResultCard({
  label,
  value,
  sublabel,
  highlight = false,
}: {
  label: string
  value: number
  sublabel: string
  highlight?: boolean
}) {
  const isPositive = value >= 0
  const colorClass = isPositive ? 'text-profit' : 'text-loss'

  return (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-slate-100 ring-2 ring-slate-300' : 'bg-slate-50'}`}>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>
        {isPositive ? '+' : ''}{value.toFixed(1)}%
      </p>
      <p className="text-xs text-slate-500 font-medium">{sublabel}</p>
    </div>
  )
}

function GoldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 17L8 7H16L20 17H4Z" fill="currentColor" opacity="0.3" />
      <path d="M2 20L6 14H18L22 20H2Z" fill="currentColor" />
      <path d="M7 14L10 8H14L17 14H7Z" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

function VerdictBadge({
  symbol,
  label,
  value,
}: {
  symbol: React.ReactNode
  label: string
  value: number
}) {
  const isPositive = value >= 0
  const bgColor = isPositive ? 'bg-emerald-50' : 'bg-red-50'
  const ringColor = isPositive ? 'ring-emerald-200' : 'ring-red-200'
  const symbolBg = isPositive ? 'bg-emerald-100' : 'bg-red-100'
  const symbolColor = isPositive ? 'text-emerald-700' : 'text-red-700'

  return (
    <div className={`${bgColor} ring-1 ${ringColor} rounded-xl p-4 flex flex-col items-center text-center`}>
      <div className={`w-14 h-14 ${symbolBg} rounded-full flex items-center justify-center mb-3`}>
        <span className={`text-2xl font-bold ${symbolColor}`}>{symbol}</span>
      </div>
      <p className={`text-xl font-bold ${isPositive ? 'text-profit' : 'text-loss'}`}>
        {isPositive ? '+' : ''}{value.toFixed(1)}%
      </p>
      <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
            Kazandırdı
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
            Kaybettirdi
          </>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
    </div>
  )
}
