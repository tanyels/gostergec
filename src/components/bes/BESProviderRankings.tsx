'use client'

import { useState } from 'react'

interface ProviderRanking {
  rank: number
  name: string
  logo: string
  avgUsdReturn1Y: number
  avgUsdReturn3Y: number
  avgFee: number
  fundCount: number
  bestFund: string
  bestFundReturn: number
}

const PROVIDER_RANKINGS: ProviderRanking[] = [
  {
    rank: 1,
    name: 'Garanti Emeklilik',
    logo: 'GE',
    avgUsdReturn1Y: -8,
    avgUsdReturn3Y: -15,
    avgFee: 1.6,
    fundCount: 24,
    bestFund: 'Altın Emeklilik Fonu',
    bestFundReturn: 18,
  },
  {
    rank: 2,
    name: 'Anadolu Hayat Emeklilik',
    logo: 'AH',
    avgUsdReturn1Y: -12,
    avgUsdReturn3Y: -22,
    avgFee: 1.8,
    fundCount: 32,
    bestFund: 'Döviz Emeklilik Fonu',
    bestFundReturn: 8,
  },
  {
    rank: 3,
    name: 'Allianz Yaşam',
    logo: 'AL',
    avgUsdReturn1Y: -15,
    avgUsdReturn3Y: -28,
    avgFee: 2.1,
    fundCount: 18,
    bestFund: 'Altın Katılım Fonu',
    bestFundReturn: 12,
  },
  {
    rank: 4,
    name: 'Yapı Kredi Emeklilik',
    logo: 'YK',
    avgUsdReturn1Y: -14,
    avgUsdReturn3Y: -25,
    avgFee: 1.9,
    fundCount: 28,
    bestFund: 'Katkı Emeklilik Fonu',
    bestFundReturn: 5,
  },
  {
    rank: 5,
    name: 'Halk Hayat ve Emeklilik',
    logo: 'HH',
    avgUsdReturn1Y: -18,
    avgUsdReturn3Y: -32,
    avgFee: 2.0,
    fundCount: 15,
    bestFund: 'Karma Emeklilik Fonu',
    bestFundReturn: -5,
  },
  {
    rank: 6,
    name: 'Aegon Emeklilik',
    logo: 'AE',
    avgUsdReturn1Y: -20,
    avgUsdReturn3Y: -35,
    avgFee: 2.2,
    fundCount: 12,
    bestFund: 'Dengeli Emeklilik Fonu',
    bestFundReturn: -8,
  },
]

export function BESProviderRankings() {
  const [sortBy, setSortBy] = useState<'usd1y' | 'usd3y' | 'fee'>('usd1y')

  const sortedProviders = [...PROVIDER_RANKINGS].sort((a, b) => {
    if (sortBy === 'usd1y') return b.avgUsdReturn1Y - a.avgUsdReturn1Y
    if (sortBy === 'usd3y') return b.avgUsdReturn3Y - a.avgUsdReturn3Y
    return a.avgFee - b.avgFee
  })

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <p className="text-slate-600 mb-6">
        Hangi BES şirketinin fonları USD bazında daha iyi performans gösteriyor?
        <span className="block text-sm text-slate-500 mt-1">
          Which pension company&apos;s funds perform better in USD terms?
        </span>
      </p>

      {/* Sort Options */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSortBy('usd1y')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            sortBy === 'usd1y' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          1Y USD Getiri
        </button>
        <button
          onClick={() => setSortBy('usd3y')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            sortBy === 'usd3y' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          3Y USD Getiri
        </button>
        <button
          onClick={() => setSortBy('fee')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            sortBy === 'fee' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          En Düşük Ücret
        </button>
      </div>

      {/* Rankings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">#</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Şirket</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">USD 1Y</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">USD 3Y</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">Ort. Ücret</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">En İyi Fon</th>
            </tr>
          </thead>
          <tbody>
            {sortedProviders.map((provider, index) => (
              <tr key={provider.name} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className={`font-bold ${index === 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-sm font-bold text-slate-600">
                      {provider.logo}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{provider.name}</p>
                      <p className="text-xs text-slate-500">{provider.fundCount} fon</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold ${provider.avgUsdReturn1Y >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {provider.avgUsdReturn1Y >= 0 ? '+' : ''}{provider.avgUsdReturn1Y}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold ${provider.avgUsdReturn3Y >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {provider.avgUsdReturn3Y >= 0 ? '+' : ''}{provider.avgUsdReturn3Y}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold text-slate-700">{provider.avgFee}%</span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-700">{provider.bestFund}</p>
                  <p className={`text-xs font-semibold ${provider.bestFundReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {provider.bestFundReturn >= 0 ? '+' : ''}{provider.bestFundReturn}% USD
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <p className="text-xs text-slate-500 mt-4">
        * Ortalama getiriler her şirketin tüm BES fonlarının ağırlıklı ortalamasıdır. Veriler örnek amaçlıdır.
      </p>
    </div>
  )
}
