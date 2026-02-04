'use client'

import { useState } from 'react'
import { BES_FUNDS, BES_PROVIDERS } from '@/lib/data/bes-funds'

export function BESCalculator() {
  const [provider, setProvider] = useState('')
  const [fund, setFund] = useState('')
  const [monthlyAmount, setMonthlyAmount] = useState('1000')
  const [startDate, setStartDate] = useState('2020-01')
  const [results, setResults] = useState<CalculationResults | null>(null)

  const availableFunds = provider
    ? BES_FUNDS.filter(f => f.provider === provider)
    : []

  function handleCalculate() {
    // Simulated calculation - in production, fetch from database
    const months = getMonthsDifference(startDate)
    const totalContribution = parseFloat(monthlyAmount) * months
    const governmentMatch = totalContribution * 0.30 // 30% devlet katkısı

    // Simulated fund performance
    const nominalReturn = 0.65 // 65% TL return
    const usdReturn = -0.15 // -15% USD return

    const currentValueTL = (totalContribution + governmentMatch) * (1 + nominalReturn)
    const currentValueUSD = (totalContribution + governmentMatch) * (1 + usdReturn)

    setResults({
      totalContribution,
      governmentMatch,
      totalInvested: totalContribution + governmentMatch,
      currentValueTL,
      nominalReturnPercent: nominalReturn * 100,
      usdReturnPercent: usdReturn * 100,
      realLossTL: currentValueTL - currentValueUSD,
      months,
    })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            BES Şirketi / Provider
          </label>
          <select
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value)
              setFund('')
            }}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 bg-white"
          >
            <option value="">Seçin...</option>
            {BES_PROVIDERS.map((p) => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Fund Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Fon / Fund
          </label>
          <select
            value={fund}
            onChange={(e) => setFund(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 bg-white"
            disabled={!provider}
          >
            <option value="">Seçin...</option>
            {availableFunds.map((f) => (
              <option key={f.code} value={f.code}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Monthly Contribution */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Aylık Katkı (₺)
          </label>
          <input
            type="number"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700"
            placeholder="1000"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Başlangıç / Start
          </label>
          <input
            type="month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full md:w-auto bg-slate-800 text-white py-2 px-6 rounded-lg hover:bg-slate-700 transition font-semibold"
      >
        Hesapla / Calculate
      </button>

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultCard
              label="Toplam Katkınız"
              sublabel="Your contributions"
              value={`₺${results.totalContribution.toLocaleString('tr-TR')}`}
            />
            <ResultCard
              label="Devlet Katkısı"
              sublabel="Government match"
              value={`₺${results.governmentMatch.toLocaleString('tr-TR')}`}
              highlight="green"
            />
            <ResultCard
              label="TL Getiri"
              sublabel="Nominal return"
              value={`+${results.nominalReturnPercent.toFixed(1)}%`}
              highlight="green"
            />
            <ResultCard
              label="USD Getiri"
              sublabel="Real return"
              value={`${results.usdReturnPercent.toFixed(1)}%`}
              highlight="red"
            />
          </div>

          {/* Reality Check */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-bold text-red-800 mb-2">Gerçek Durum / Reality Check</h4>
            <p className="text-red-700">
              {results.months} ayda toplam <strong>₺{results.totalInvested.toLocaleString('tr-TR')}</strong> yatırdınız
              (₺{results.governmentMatch.toLocaleString('tr-TR')} devlet katkısı dahil).
            </p>
            <p className="text-red-700 mt-2">
              TL bazında <span className="text-green-600 font-semibold">+{results.nominalReturnPercent.toFixed(1)}%</span> kazandınız,
              ama USD bazında <span className="text-red-600 font-semibold">{results.usdReturnPercent.toFixed(1)}%</span> kaybettiniz.
            </p>
            <p className="text-red-800 font-semibold mt-2">
              Devlet katkısı bile gerçek kaybınızı telafi edemedi.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ResultCard({
  label,
  sublabel,
  value,
  highlight
}: {
  label: string
  sublabel: string
  value: string
  highlight?: 'green' | 'red'
}) {
  const bgClass = highlight === 'green'
    ? 'bg-emerald-50 border-emerald-200'
    : highlight === 'red'
    ? 'bg-red-50 border-red-200'
    : 'bg-slate-50 border-slate-200'

  const valueClass = highlight === 'green'
    ? 'text-emerald-600'
    : highlight === 'red'
    ? 'text-red-600'
    : 'text-slate-800'

  return (
    <div className={`p-4 rounded-lg border ${bgClass}`}>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="text-xs text-slate-500">{sublabel}</p>
      <p className={`text-2xl font-bold mt-1 ${valueClass}`}>{value}</p>
    </div>
  )
}

function getMonthsDifference(startDate: string): number {
  const start = new Date(startDate + '-01')
  const now = new Date()
  return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
}

interface CalculationResults {
  totalContribution: number
  governmentMatch: number
  totalInvested: number
  currentValueTL: number
  nominalReturnPercent: number
  usdReturnPercent: number
  realLossTL: number
  months: number
}
