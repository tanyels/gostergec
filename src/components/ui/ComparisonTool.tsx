'use client'

import { useState } from 'react'
import { FUNDS } from '@/lib/data/funds'
import { ComparisonChart } from '@/components/charts/ComparisonChart'

type Benchmark = 'USD' | 'EUR' | 'GOLD' | 'SP500'

export function ComparisonTool() {
  const [selectedFund, setSelectedFund] = useState('')
  const [benchmark, setBenchmark] = useState<Benchmark>('USD')
  const [startDate, setStartDate] = useState('2020-01-01')
  const [amount, setAmount] = useState('100000')

  const fund = FUNDS.find((f) => f.code === selectedFund)

  // Placeholder calculation results
  const fundFinalValue = 185400
  const benchmarkFinalValue = 210000
  const difference = fundFinalValue - benchmarkFinalValue

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fund Selection */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Fon</label>
            <select
              value={selectedFund}
              onChange={(e) => setSelectedFund(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Seçin...</option>
              {FUNDS.map((f) => (
                <option key={f.code} value={f.code}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Benchmark Selection */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Karşılaştır</label>
            <select
              value={benchmark}
              onChange={(e) => setBenchmark(e.target.value as Benchmark)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="USD">USD tutmak</option>
              <option value="EUR">EUR tutmak</option>
              <option value="GOLD">Altın tutmak</option>
              <option value="SP500">S&P 500</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Başlangıç</label>
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
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {fund && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-sm text-gray-600 mb-1">{fund.name}</p>
              <p className="text-3xl font-bold">
                {fundFinalValue.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-sm text-gray-500">Bugünkü değer</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-sm text-gray-600 mb-1">{benchmark} tutsaydınız</p>
              <p className="text-3xl font-bold">
                {benchmarkFinalValue.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-sm text-gray-500">Bugünkü değer</p>
            </div>

            <div className={`rounded-xl p-6 ${difference >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-sm text-gray-600 mb-1">Fark</p>
              <p className={`text-3xl font-bold ${difference >= 0 ? 'text-profit' : 'text-loss'}`}>
                {difference >= 0 ? '+' : ''}{difference.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-sm text-gray-500">
                {difference >= 0 ? 'Fon daha iyi' : `${benchmark} daha iyi`}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Değer Karşılaştırması</h3>
            <div className="h-80">
              <ComparisonChart
                fundCode={fund.code}
                benchmark={benchmark}
                startDate={startDate}
              />
            </div>
          </div>
        </>
      )}

      {!fund && (
        <div className="text-center py-16 text-gray-500">
          Karşılaştırma için bir fon seçin / Select a fund to compare
        </div>
      )}
    </div>
  )
}
