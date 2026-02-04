'use client'

import { useState } from 'react'

interface FundGrade {
  code: string
  name: string
  category: string
  grade1Y: Grade
  grade3Y: Grade
  grade5Y: Grade
  usdReturn1Y: number
  usdReturn3Y: number
  usdReturn5Y: number
  trend: 'up' | 'down' | 'stable'
}

type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

const FUND_GRADES: FundGrade[] = [
  { code: 'TYH', name: 'Yapı Kredi Altın Fonu', category: 'Altın', grade1Y: 'A', grade3Y: 'A', grade5Y: 'B', usdReturn1Y: 28, usdReturn3Y: 45, usdReturn5Y: 62, trend: 'up' },
  { code: 'GAL', name: 'Garanti Altın Fonu', category: 'Altın', grade1Y: 'A', grade3Y: 'B', grade5Y: 'B', usdReturn1Y: 25, usdReturn3Y: 38, usdReturn5Y: 55, trend: 'stable' },
  { code: 'MAC', name: 'Ak Portföy Amerika', category: 'Yabancı', grade1Y: 'B', grade3Y: 'A', grade5Y: 'A', usdReturn1Y: 18, usdReturn3Y: 52, usdReturn5Y: 85, trend: 'stable' },
  { code: 'IPB', name: 'İş Portföy BIST Banka', category: 'Hisse', grade1Y: 'B', grade3Y: 'C', grade5Y: 'D', usdReturn1Y: 12, usdReturn3Y: -5, usdReturn5Y: -18, trend: 'up' },
  { code: 'GAE', name: 'Garanti Euro Fonu', category: 'Döviz', grade1Y: 'C', grade3Y: 'C', grade5Y: 'C', usdReturn1Y: 5, usdReturn3Y: 8, usdReturn5Y: 12, trend: 'stable' },
  { code: 'AFA', name: 'Ak Portföy BIST 30', category: 'Hisse', grade1Y: 'C', grade3Y: 'D', grade5Y: 'D', usdReturn1Y: -2, usdReturn3Y: -15, usdReturn5Y: -22, trend: 'up' },
  { code: 'IST', name: 'İş Portföy Tahvil', category: 'Tahvil', grade1Y: 'D', grade3Y: 'F', grade5Y: 'F', usdReturn1Y: -18, usdReturn3Y: -42, usdReturn5Y: -55, trend: 'down' },
  { code: 'AK1', name: 'Ak Para Piyasası', category: 'Para', grade1Y: 'F', grade3Y: 'F', grade5Y: 'F', usdReturn1Y: -25, usdReturn3Y: -52, usdReturn5Y: -68, trend: 'down' },
  { code: 'YKP', name: 'YK Para Piyasası', category: 'Para', grade1Y: 'F', grade3Y: 'F', grade5Y: 'F', usdReturn1Y: -28, usdReturn3Y: -55, usdReturn5Y: -70, trend: 'down' },
  { code: 'TTE', name: 'TEB Hisse Fonu', category: 'Hisse', grade1Y: 'C', grade3Y: 'D', grade5Y: 'D', usdReturn1Y: 0, usdReturn3Y: -12, usdReturn5Y: -20, trend: 'up' },
]

const GRADE_CONFIG = {
  A: { color: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50', label: 'Mükemmel', description: 'USD bazında pozitif getiri, üst %10' },
  B: { color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50', label: 'İyi', description: 'Minimal USD kaybı, üst %25' },
  C: { color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50', label: 'Ortalama', description: 'Tipik USD kaybı, ortalama performans' },
  D: { color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50', label: 'Zayıf', description: 'Önemli USD kaybı, alt %25' },
  F: { color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', label: 'Başarısız', description: 'Ciddi USD kaybı, alt %10' },
}

export function FundReportCards() {
  const [selectedPeriod, setSelectedPeriod] = useState<'1Y' | '3Y' | '5Y'>('1Y')
  const [selectedFund, setSelectedFund] = useState<string | null>(null)

  const getGrade = (fund: FundGrade): Grade => {
    if (selectedPeriod === '1Y') return fund.grade1Y
    if (selectedPeriod === '3Y') return fund.grade3Y
    return fund.grade5Y
  }

  const getReturn = (fund: FundGrade): number => {
    if (selectedPeriod === '1Y') return fund.usdReturn1Y
    if (selectedPeriod === '3Y') return fund.usdReturn3Y
    return fund.usdReturn5Y
  }

  const selectedFundData = selectedFund ? FUND_GRADES.find(f => f.code === selectedFund) : null

  return (
    <div className="space-y-6">
      {/* Grade Legend */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Not Sistemi / Grading System</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(GRADE_CONFIG).map(([grade, config]) => (
            <div key={grade} className="flex items-center gap-2">
              <span className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                {grade}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-700">{config.label}</p>
                <p className="text-xs text-slate-500">{config.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {(['1Y', '3Y', '5Y'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedPeriod === period
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {FUND_GRADES.map((fund) => {
          const grade = getGrade(fund)
          const config = GRADE_CONFIG[grade]
          const usdReturn = getReturn(fund)

          return (
            <div
              key={fund.code}
              onClick={() => setSelectedFund(fund.code)}
              className={`${config.bgLight} border-2 ${selectedFund === fund.code ? 'border-slate-400' : 'border-transparent'} rounded-xl p-4 cursor-pointer hover:shadow-md transition`}
            >
              {/* Grade Badge */}
              <div className="flex justify-between items-start mb-3">
                <span className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {grade}
                </span>
                <span className="text-xs text-slate-500">
                  {fund.trend === 'up' ? '📈' : fund.trend === 'down' ? '📉' : '➡️'}
                </span>
              </div>

              {/* Fund Info */}
              <h4 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">{fund.name}</h4>
              <p className="text-xs text-slate-500 mb-2">{fund.code} · {fund.category}</p>

              {/* USD Return */}
              <p className={`text-lg font-bold ${usdReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {usdReturn >= 0 ? '+' : ''}{usdReturn}%
                <span className="text-xs font-normal text-slate-500 ml-1">USD</span>
              </p>
            </div>
          )
        })}
      </div>

      {/* Selected Fund Detail */}
      {selectedFundData && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{selectedFundData.name}</h3>
              <p className="text-slate-500">{selectedFundData.code} · {selectedFundData.category}</p>
            </div>
            <button
              onClick={() => setSelectedFund(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          {/* Grade History */}
          <h4 className="font-semibold text-slate-700 mb-3">Not Geçmişi / Grade History</h4>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {(['1Y', '3Y', '5Y'] as const).map((period) => {
              const grade = period === '1Y' ? selectedFundData.grade1Y : period === '3Y' ? selectedFundData.grade3Y : selectedFundData.grade5Y
              const usdReturn = period === '1Y' ? selectedFundData.usdReturn1Y : period === '3Y' ? selectedFundData.usdReturn3Y : selectedFundData.usdReturn5Y
              const config = GRADE_CONFIG[grade]

              return (
                <div key={period} className={`${config.bgLight} rounded-lg p-4 text-center`}>
                  <p className="text-sm text-slate-600 mb-2">{period}</p>
                  <span className={`inline-block w-10 h-10 ${config.color} rounded-lg text-white text-xl font-bold leading-10`}>
                    {grade}
                  </span>
                  <p className={`text-sm font-semibold mt-2 ${usdReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {usdReturn >= 0 ? '+' : ''}{usdReturn}% USD
                  </p>
                </div>
              )
            })}
          </div>

          {/* Verdict */}
          <div className={`p-4 rounded-lg ${GRADE_CONFIG[selectedFundData.grade1Y].bgLight}`}>
            <p className={`font-semibold ${GRADE_CONFIG[selectedFundData.grade1Y].textColor}`}>
              {selectedFundData.grade1Y === 'A' || selectedFundData.grade1Y === 'B'
                ? '✓ Bu fon USD bazında değer koruyor'
                : selectedFundData.grade1Y === 'C'
                ? '⚠️ Bu fon ortalama performans gösteriyor'
                : '✗ Bu fon USD bazında değer kaybettiriyor'}
            </p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(GRADE_CONFIG).map(([grade, config]) => {
          const count = FUND_GRADES.filter(f => getGrade(f) === grade).length
          return (
            <div key={grade} className={`${config.bgLight} rounded-lg p-4 text-center`}>
              <span className={`text-3xl font-bold ${config.textColor}`}>{count}</span>
              <p className="text-sm text-slate-600">Fon {grade} notu aldı</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
