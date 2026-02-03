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
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Hızlı Hesaplama / Quick Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Fund Selection */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Fon / Fund</label>
          <select
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
          <label className="block text-sm text-gray-600 mb-1">Başlangıç / Start</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tutar (TL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="10000"
          />
        </div>

        {/* Calculate Button */}
        <div className="flex items-end">
          <button
            onClick={handleCalculate}
            disabled={loading || !selectedFund}
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Hesaplanıyor...' : 'Hesapla'}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <ResultCard
            label="TL Getiri"
            value={results.tryReturn}
            sublabel="Nominal"
          />
          <ResultCard
            label="USD Getiri"
            value={results.usdReturn}
            sublabel="Real"
            highlight
          />
          <ResultCard
            label="EUR Getiri"
            value={results.eurReturn}
            sublabel="Real"
          />
          <ResultCard
            label="Altın Getiri"
            value={results.goldReturn}
            sublabel="Real"
          />
        </div>
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
    <div className={`p-4 rounded-lg ${highlight ? 'bg-gray-100' : 'bg-gray-50'}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>
        {isPositive ? '+' : ''}{value.toFixed(1)}%
      </p>
      <p className="text-xs text-gray-500">{sublabel}</p>
    </div>
  )
}
