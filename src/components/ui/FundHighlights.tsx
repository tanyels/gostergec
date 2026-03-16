'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTefasFilter } from '@/lib/context/TefasFilterContext'

interface FundSummary {
  code: string
  name: string
  isTefas: boolean
  returns: Record<string, { tryReturn: number; usdReturn: number }>
}

// TODO: Replace with real data from Supabase fund_returns table
const PLACEHOLDER_DATA: FundSummary[] = [
  {
    code: 'TYH', name: 'Yapı Kredi Altın Fonu', isTefas: true,
    returns: { '1Y': { tryReturn: 145, usdReturn: 32 }, '3Y': { tryReturn: 420, usdReturn: 85 }, '5Y': { tryReturn: 900, usdReturn: 110 }, '10Y': { tryReturn: 2100, usdReturn: 180 } },
  },
  {
    code: 'IPB', name: 'İş Portföy BIST Banka', isTefas: true,
    returns: { '1Y': { tryReturn: 210, usdReturn: 28 }, '3Y': { tryReturn: 580, usdReturn: 45 }, '5Y': { tryReturn: 1200, usdReturn: -5 }, '10Y': { tryReturn: 3500, usdReturn: 60 } },
  },
  {
    code: 'MAC', name: 'Ak Portföy Amerikan', isTefas: true,
    returns: { '1Y': { tryReturn: 180, usdReturn: 24 }, '3Y': { tryReturn: 310, usdReturn: 72 }, '5Y': { tryReturn: 650, usdReturn: 95 }, '10Y': { tryReturn: 1800, usdReturn: 220 } },
  },
  {
    code: 'OKS', name: 'Odeabank Karma Özel', isTefas: false,
    returns: { '1Y': { tryReturn: 190, usdReturn: 35 }, '3Y': { tryReturn: 490, usdReturn: 90 }, '5Y': { tryReturn: 800, usdReturn: 120 }, '10Y': { tryReturn: 2500, usdReturn: 200 } },
  },
]

const PERIOD_LABELS: Record<string, string> = {
  '1Y': 'Son 1 Yıl',
  '3Y': 'Son 3 Yıl',
  '5Y': 'Son 5 Yıl',
  '10Y': 'Son 10 Yıl',
}

export function FundHighlights() {
  const [period, setPeriod] = useState<'1Y' | '3Y' | '5Y' | '10Y'>('1Y')
  const [returnType, setReturnType] = useState<'try' | 'usd'>('usd')
  const { showOnlyTefas, setShowOnlyTefas } = useTefasFilter()

  const getReturn = (fund: FundSummary) => {
    const r = fund.returns[period]
    return returnType === 'usd' ? r.usdReturn : r.tryReturn
  }

  const displayFunds = PLACEHOLDER_DATA
    .filter((f) => !showOnlyTefas || f.isTefas)
    .sort((a, b) => getReturn(b) - getReturn(a))

  return (
    <div>
      {/* Filter Row */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
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

        {/* Return Type */}
        <div className="flex rounded-lg border border-slate-300 overflow-hidden">
          {([
            { value: 'try' as const, label: 'Ham (TL)' },
            { value: 'usd' as const, label: 'Reel (USD)' },
          ]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setReturnType(opt.value)}
              className={`px-4 py-2 text-sm font-medium ${
                returnType === opt.value
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* TEFAS Toggle */}
        <label className="inline-flex items-center gap-2 cursor-pointer text-sm ml-auto">
          <input
            type="checkbox"
            checked={!showOnlyTefas}
            onChange={(e) => setShowOnlyTefas(!e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
          />
          <span className="text-slate-600 font-medium">Özel fonları dahil et</span>
        </label>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">
              En İyiler ({returnType === 'usd' ? 'USD' : 'TL'} Bazında)
            </h3>
            <span className="text-sm text-slate-500 font-medium">{PERIOD_LABELS[period]}</span>
          </div>

          <div className="space-y-3">
            {displayFunds.map((fund, i) => {
              const ret = getReturn(fund)
              const isPositive = ret >= 0
              return (
                <div
                  key={fund.code}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-slate-400">#{i + 1}</span>
                    <div>
                      <p className="font-semibold text-slate-800">{fund.name}</p>
                      <p className="text-sm text-slate-500">{fund.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${isPositive ? 'text-profit' : 'text-loss'}`}>
                      {isPositive ? '+' : ''}{ret}%
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {returnType === 'usd' ? 'USD' : 'TL'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <Link
            href="/leaderboard"
            className="block text-center mt-4 text-slate-600 hover:text-slate-900 font-medium"
          >
            Tüm sıralamayı gör →
          </Link>
        </div>

        {/* Reality Check Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-white">Gerçeği Görün</h3>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm text-slate-300">Ortalama TL Fon Getirisi (2023)</p>
              <p className="text-3xl font-bold text-emerald-400">+67%</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm text-slate-300">Aynı Dönem USD Getirisi</p>
              <p className="text-3xl font-bold text-red-400">-8%</p>
            </div>

            <p className="text-sm text-slate-400">
              TL&apos;deki değer kaybı hesaba katıldığında, birçok fon aslında
              zarar ettirdi.
            </p>
          </div>

          <Link
            href="/funds"
            className="block text-center mt-4 py-2.5 bg-white text-slate-800 rounded-lg font-semibold hover:bg-slate-100 transition"
          >
            Fonunuzu Analiz Edin
          </Link>
        </div>
      </div>
    </div>
  )
}
