'use client'

import { useState } from 'react'

export function DevletKatkisi() {
  const [contribution, setContribution] = useState('50000')
  const [years, setYears] = useState('5')

  const totalContribution = parseFloat(contribution) || 0
  const governmentMatch = totalContribution * 0.30
  const totalWithMatch = totalContribution + governmentMatch

  // Simulated scenarios
  const scenarios = calculateScenarios(totalWithMatch, parseInt(years) || 5)

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <p className="text-slate-600 mb-6">
        Devlet %30 katkı sağlıyor - ama bu gerçekten işe yarıyor mu?
        <span className="block text-sm text-slate-500 mt-1">
          Government provides 30% match - but does it actually help?
        </span>
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Toplam Katkınız (₺)
          </label>
          <input
            type="number"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Süre (Yıl)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700"
            min="1"
            max="20"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-600">Sizin Katkınız</p>
          <p className="text-xl font-bold text-slate-800">₺{totalContribution.toLocaleString('tr-TR')}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-600">Devlet Katkısı (+30%)</p>
          <p className="text-xl font-bold text-emerald-600">₺{governmentMatch.toLocaleString('tr-TR')}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-600">Toplam</p>
          <p className="text-xl font-bold text-blue-600">₺{totalWithMatch.toLocaleString('tr-TR')}</p>
        </div>
      </div>

      {/* Scenario Comparison */}
      <h4 className="font-semibold text-slate-800 mb-4">{years} Yıl Sonra Karşılaştırma</h4>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Senaryo</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">TL Değer</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">USD Değer</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">Sonuç</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.description}</p>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-slate-700">
                  ₺{s.valueTL.toLocaleString('tr-TR')}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-slate-700">
                  ${s.valueUSD.toLocaleString('en-US')}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-bold ${s.verdict === 'winner' ? 'text-emerald-600' : s.verdict === 'loser' ? 'text-red-600' : 'text-slate-600'}`}>
                    {s.verdict === 'winner' ? '✓ En İyi' : s.verdict === 'loser' ? '✗ En Kötü' : '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verdict */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-800 font-semibold">
          💡 Sonuç: Devlet katkısı (%30 bonus) bile TL&apos;nin değer kaybını telafi edemiyor.
        </p>
        <p className="text-amber-700 text-sm mt-1">
          Aynı parayı USD olarak tutsaydınız, devlet katkısı olmadan bile daha iyi durumda olabilirdiniz.
        </p>
      </div>
    </div>
  )
}

interface Scenario {
  name: string
  description: string
  valueTL: number
  valueUSD: number
  verdict: 'winner' | 'loser' | 'neutral'
}

function calculateScenarios(totalWithMatch: number, years: number): Scenario[] {
  // Assumptions based on typical Turkish market conditions
  const tlDepreciation = Math.pow(0.75, years) // TL loses ~25% per year vs USD
  const besReturn = Math.pow(1.15, years) // BES funds return ~15% TL annually
  const usdRate2024 = 34 // Current rate
  const futureUsdRate = usdRate2024 / tlDepreciation

  const besValueTL = totalWithMatch * besReturn
  const besValueUSD = besValueTL / futureUsdRate

  const justUsdValueTL = totalWithMatch * tlDepreciation * (futureUsdRate / usdRate2024) * (1 / tlDepreciation)
  const justUsdValueUSD = totalWithMatch / usdRate2024

  const goldReturn = Math.pow(1.08, years) // Gold ~8% USD annually
  const goldValueUSD = (totalWithMatch / usdRate2024) * goldReturn
  const goldValueTL = goldValueUSD * futureUsdRate

  return [
    {
      name: 'BES + Devlet Katkısı',
      description: 'Mevcut durumunuz',
      valueTL: Math.round(besValueTL),
      valueUSD: Math.round(besValueUSD),
      verdict: 'loser',
    },
    {
      name: 'Sadece USD Tutmak',
      description: 'Devlet katkısı yok',
      valueTL: Math.round(totalWithMatch / 1.3 * (futureUsdRate / usdRate2024)),
      valueUSD: Math.round(totalWithMatch / 1.3 / usdRate2024),
      verdict: 'neutral',
    },
    {
      name: 'Altın Almak',
      description: 'Devlet katkısı yok',
      valueTL: Math.round(goldValueTL / 1.3),
      valueUSD: Math.round(goldValueUSD / 1.3),
      verdict: 'winner',
    },
  ]
}
