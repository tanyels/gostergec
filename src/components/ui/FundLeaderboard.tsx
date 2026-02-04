'use client'

import { useState } from 'react'

type Period = '1Y' | '3Y' | '5Y' | '10Y'
type SortBy = 'usd' | 'eur' | 'gold' | 'try'

interface FundRanking {
  rank: number
  code: string
  name: string
  category: string
  tryReturn: number
  usdReturn: number
  eurReturn: number
  goldReturn: number
}

const PLACEHOLDER_RANKINGS: FundRanking[] = [
  { rank: 1, code: 'TYH', name: 'Yapı Kredi Altın Fonu', category: 'Altın', tryReturn: 145, usdReturn: 32, eurReturn: 28, goldReturn: 2 },
  { rank: 2, code: 'IPB', name: 'İş Portföy BIST Banka', category: 'Hisse', tryReturn: 210, usdReturn: 28, eurReturn: 24, goldReturn: -8 },
  { rank: 3, code: 'MAC', name: 'Ak Portföy Amerikan', category: 'Yabancı', tryReturn: 180, usdReturn: 24, eurReturn: 20, goldReturn: -12 },
  { rank: 4, code: 'TTE', name: 'TEB Portföy Hisse', category: 'Hisse', tryReturn: 156, usdReturn: 18, eurReturn: 14, goldReturn: -16 },
  { rank: 5, code: 'GAE', name: 'Garanti Portföy Euro', category: 'Döviz', tryReturn: 98, usdReturn: 12, eurReturn: 8, goldReturn: -22 },
  { rank: 6, code: 'AK1', name: 'Ak Portföy Para Piyasası', category: 'Para', tryReturn: 45, usdReturn: -18, eurReturn: -22, goldReturn: -38 },
  { rank: 7, code: 'YKP', name: 'Yapı Kredi Para', category: 'Para', tryReturn: 42, usdReturn: -22, eurReturn: -26, goldReturn: -42 },
  { rank: 8, code: 'IST', name: 'İş Portföy Tahvil', category: 'Tahvil', tryReturn: 38, usdReturn: -28, eurReturn: -32, goldReturn: -48 },
]

export function FundLeaderboard() {
  const [period, setPeriod] = useState<Period>('1Y')
  const [sortBy, setSortBy] = useState<SortBy>('usd')
  const [category, setCategory] = useState<string>('all')

  const sortedFunds = [...PLACEHOLDER_RANKINGS].sort((a, b) => {
    const key = `${sortBy}Return` as keyof FundRanking
    return (b[key] as number) - (a[key] as number)
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Period */}
        <div className="flex rounded-lg border border-slate-300 overflow-hidden">
          {(['1Y', '3Y', '5Y', '10Y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium ${
                period === p
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-slate-700 bg-white font-medium"
        >
          <option value="usd">USD Getirisi</option>
          <option value="eur">EUR Getirisi</option>
          <option value="gold">Altın Getirisi</option>
          <option value="try">TL Getirisi</option>
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-slate-700 bg-white font-medium"
        >
          <option value="all">Tüm Kategoriler</option>
          <option value="hisse">Hisse Fonları</option>
          <option value="tahvil">Tahvil Fonları</option>
          <option value="altin">Altın Fonları</option>
          <option value="para">Para Piyasası</option>
          <option value="doviz">Döviz Fonları</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">#</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Fon</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Kategori</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">TL</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100">USD</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">EUR</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">Altın</th>
            </tr>
          </thead>
          <tbody>
            {sortedFunds.map((fund, i) => (
              <tr
                key={fund.code}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-slate-500 font-semibold">{i + 1}</td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-800">{fund.name}</p>
                    <p className="text-sm text-slate-500">{fund.code}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 font-medium">{fund.category}</td>
                <td className="px-4 py-3 text-right">
                  <ReturnValue value={fund.tryReturn} />
                </td>
                <td className="px-4 py-3 text-right bg-slate-50">
                  <ReturnValue value={fund.usdReturn} highlight />
                </td>
                <td className="px-4 py-3 text-right">
                  <ReturnValue value={fund.eurReturn} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ReturnValue value={fund.goldReturn} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <p className="text-sm text-slate-500 text-center">
        Getiriler {period} dönemi için hesaplanmıştır. USD kolonu gerçek (enflasyondan arındırılmış) getiriyi gösterir.
      </p>
    </div>
  )
}

function ReturnValue({ value, highlight = false }: { value: number; highlight?: boolean }) {
  const isPositive = value >= 0

  return (
    <span className={`font-semibold ${highlight ? 'text-lg' : ''} ${isPositive ? 'text-profit' : 'text-loss'}`}>
      {isPositive ? '+' : ''}{value}%
    </span>
  )
}
