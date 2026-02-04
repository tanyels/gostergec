'use client'

import Link from 'next/link'

interface FundSummary {
  code: string
  name: string
  tryReturn: number
  usdReturn: number
  period: string
}

const PLACEHOLDER_DATA: FundSummary[] = [
  { code: 'TYH', name: 'Yapı Kredi Altın Fonu', tryReturn: 145, usdReturn: 32, period: '1Y' },
  { code: 'IPB', name: 'İş Portföy BIST Banka', tryReturn: 210, usdReturn: 28, period: '1Y' },
  { code: 'MAC', name: 'Ak Portföy Amerikan', tryReturn: 180, usdReturn: 24, period: '1Y' },
]

export function FundHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Performers */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">En İyiler (USD Bazında)</h3>
          <span className="text-sm text-slate-500 font-medium">Son 1 Yıl</span>
        </div>

        <div className="space-y-3">
          {PLACEHOLDER_DATA.map((fund, i) => (
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
                <p className="text-profit font-bold text-lg">+{fund.usdReturn}%</p>
                <p className="text-xs text-slate-500 font-medium">USD</p>
              </div>
            </div>
          ))}
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
  )
}
