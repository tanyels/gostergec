'use client'

import { useState } from 'react'
import { BES_CATEGORY_RETURNS, TL_ANNUAL_DEPRECIATION_VS_USD } from '@/lib/data/bes-funds'
import type { BESCategory } from '@/lib/data/bes-funds'

export function DevletKatkisi() {
  const [contribution, setContribution] = useState('50000')
  const [years, setYears] = useState('5')
  const [category, setCategory] = useState<BESCategory>('mixed')

  const totalContribution = parseFloat(contribution) || 0
  const governmentMatch = totalContribution * 0.30
  const totalWithMatch = totalContribution + governmentMatch
  const numYears = parseInt(years) || 5

  const scenarios = calculateScenarios(totalWithMatch, numYears, category)

  // Find best/worst for dynamic verdict
  const usdValues = scenarios.map(s => s.valueUSD)
  const bestUSD = Math.max(...usdValues)
  const besScenario = scenarios[0]
  const besIsBest = besScenario.valueUSD === bestUSD

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <p className="text-slate-600 mb-6">
        Devlet %30 katkı sağlıyor - ama bu gerçekten işe yarıyor mu?
        <span className="block text-sm text-slate-500 mt-1">
          Government provides 30% match - but does it actually help?
        </span>
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Fon Kategorisi
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as BESCategory)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 bg-white"
          >
            {Object.entries(BES_CATEGORY_RETURNS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
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
      <div className={`mt-6 p-4 border rounded-lg ${besIsBest ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <p className={`font-semibold ${besIsBest ? 'text-emerald-800' : 'text-amber-800'}`}>
          {besIsBest
            ? `✓ Sonuç: Seçtiğiniz ${BES_CATEGORY_RETURNS[category].label} kategorisi ile devlet katkısı avantajı gerçek bir kazanç sağlıyor.`
            : `💡 Sonuç: Devlet katkısı (%30 bonus) bile seçtiğiniz ${BES_CATEGORY_RETURNS[category].label} kategorisi ile TL'nin değer kaybını telafi edemiyor.`}
        </p>
        <p className={`text-sm mt-1 ${besIsBest ? 'text-emerald-700' : 'text-amber-700'}`}>
          {besIsBest
            ? 'Bu fon kategorisinde BES, alternatif yatırımlara göre daha iyi performans gösteriyor.'
            : 'Aynı parayı USD veya altın olarak tutsaydınız, devlet katkısı olmadan bile daha iyi durumda olabilirdiniz.'}
        </p>
      </div>

      <p className="mt-4 text-xs text-slate-400 italic">
        Getiriler kategori bazlı tahminidir, gerçek fon performansı farklı olabilir.
      </p>
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

function calculateScenarios(totalWithMatch: number, years: number, category: BESCategory): Scenario[] {
  const usdRate = 34
  const annualDepreciation = TL_ANNUAL_DEPRECIATION_VS_USD
  const futureUsdRate = usdRate / Math.pow(1 - annualDepreciation, years)

  // BES: ana fon with selected category, devlet katkısı with 'standart'
  const personalContribution = totalWithMatch / 1.3
  const govContribution = personalContribution * 0.30

  const anaFonReturn = BES_CATEGORY_RETURNS[category].annualTL
  const dkFonReturn = BES_CATEGORY_RETURNS['standart'].annualTL

  const anaFonValueTL = personalContribution * Math.pow(1 + anaFonReturn, years)
  const dkFonValueTL = govContribution * Math.pow(1 + dkFonReturn, years)
  const besValueTL = anaFonValueTL + dkFonValueTL
  const besValueUSD = besValueTL / futureUsdRate

  // Just holding USD (no government match, only personal)
  const justUsdValueUSD = personalContribution / usdRate
  const justUsdValueTL = justUsdValueUSD * futureUsdRate

  // Gold (no government match, only personal)
  const goldReturnUSD = Math.pow(1.08, years)
  const goldValueUSD = (personalContribution / usdRate) * goldReturnUSD
  const goldValueTL = goldValueUSD * futureUsdRate

  const allUSD = [besValueUSD, justUsdValueUSD, goldValueUSD]
  const maxUSD = Math.max(...allUSD)
  const minUSD = Math.min(...allUSD)

  function getVerdict(usd: number): 'winner' | 'loser' | 'neutral' {
    if (usd === maxUSD) return 'winner'
    if (usd === minUSD) return 'loser'
    return 'neutral'
  }

  return [
    {
      name: 'BES + Devlet Katkısı',
      description: `${BES_CATEGORY_RETURNS[category].label} + DK: Standart`,
      valueTL: Math.round(besValueTL),
      valueUSD: Math.round(besValueUSD),
      verdict: getVerdict(besValueUSD),
    },
    {
      name: 'Sadece USD Tutmak',
      description: 'Devlet katkısı yok',
      valueTL: Math.round(justUsdValueTL),
      valueUSD: Math.round(justUsdValueUSD),
      verdict: getVerdict(justUsdValueUSD),
    },
    {
      name: 'Altın Almak',
      description: 'Devlet katkısı yok, ~%8 USD/yıl',
      valueTL: Math.round(goldValueTL),
      valueUSD: Math.round(goldValueUSD),
      verdict: getVerdict(goldValueUSD),
    },
  ]
}
