'use client'

import { useState } from 'react'

type Benchmark = 'usd' | 'eur' | 'gold'

type YearData = { [year: string]: number }

interface CategoryPerformance {
  category: string
  categoryEn: string
  usd: YearData
  eur: YearData
  gold: YearData
}

const CATEGORY_PERFORMANCE: CategoryPerformance[] = [
  {
    category: 'Altın Fonları',
    categoryEn: 'Gold Funds',
    usd:  { '2019': 18, '2020': 23, '2021': -3, '2022': -3, '2023': 12, '2024': 26 },
    eur:  { '2019': 20, '2020': 13, '2021': 5,  '2022': 3,  '2023': 8,  '2024': 33 },
    gold: { '2019': 0,  '2020': -1, '2021': -1, '2022': -1, '2023': -1, '2024': -1 },
  },
  {
    category: 'Yabancı Hisse',
    categoryEn: 'Foreign Equity',
    usd:  { '2019': 27, '2020': 17, '2021': 11, '2022': -10, '2023': 14, '2024': 19 },
    eur:  { '2019': 30, '2020': 7,  '2021': 20, '2022': -4,  '2023': 10, '2024': 26 },
    gold: { '2019': 7,  '2020': -7, '2021': 13, '2022': -8,  '2023': 0,  '2024': -6 },
  },
  {
    category: 'Döviz Fonları',
    categoryEn: 'Currency Funds',
    usd:  { '2019': -1, '2020': 3,  '2021': -5, '2022': -3, '2023': 0,  '2024': -3 },
    eur:  { '2019': 1,  '2020': -6, '2021': 3,  '2022': 3,  '2023': -3, '2024': 3 },
    gold: { '2019': -16,'2020': -17,'2021': -2, '2022': -1, '2023': -12,'2024': -23 },
  },
  {
    category: 'Hisse Fonları',
    categoryEn: 'Equity Funds',
    usd:  { '2019': 8,  '2020': 1,  '2021': -31,'2022': 94, '2023': -18,'2024': 7 },
    eur:  { '2019': 11, '2020': -8, '2021': -25,'2022': 106,'2023': -20,'2024': 13 },
    gold: { '2019': -9, '2020': -19,'2021': -29,'2022': 98, '2023': -27,'2024': -15 },
  },
  {
    category: 'Karma Fonlar',
    categoryEn: 'Mixed Funds',
    usd:  { '2019': 5,  '2020': -7, '2021': -26,'2022': 25, '2023': -14,'2024': 5 },
    eur:  { '2019': 7,  '2020': -15,'2021': -20,'2022': 32, '2023': -17,'2024': 11 },
    gold: { '2019': -12,'2020': -26,'2021': -24,'2022': 27, '2023': -25,'2024': -17 },
  },
  {
    category: 'Tahvil Fonları',
    categoryEn: 'Bond Funds',
    usd:  { '2019': 2,  '2020': -10,'2021': -33,'2022': -20,'2023': -11,'2024': 19 },
    eur:  { '2019': 4,  '2020': -18,'2021': -27,'2022': -15,'2023': -14,'2024': 26 },
    gold: { '2019': -14,'2020': -28,'2021': -31,'2022': -19,'2023': -22,'2024': -6 },
  },
  {
    category: 'Para Piyasası',
    categoryEn: 'Money Market',
    usd:  { '2019': -1, '2020': -11,'2021': -35,'2022': -22,'2023': -14,'2024': 17 },
    eur:  { '2019': 1,  '2020': -19,'2021': -29,'2022': -18,'2023': -17,'2024': 24 },
    gold: { '2019': -16,'2020': -29,'2021': -33,'2022': -21,'2023': -25,'2024': -8 },
  },
]

const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024']

function getGrade(value: number): { grade: string; color: string; bgColor: string } {
  if (value >= 20) return { grade: 'A', color: 'text-white', bgColor: 'bg-emerald-500' }
  if (value >= 10) return { grade: 'B', color: 'text-white', bgColor: 'bg-emerald-400' }
  if (value >= 0) return { grade: 'C', color: 'text-white', bgColor: 'bg-amber-400' }
  if (value >= -15) return { grade: 'D', color: 'text-white', bgColor: 'bg-orange-500' }
  return { grade: 'F', color: 'text-white', bgColor: 'bg-red-500' }
}

export function SectorHeatmap() {
  const [benchmark, setBenchmark] = useState<Benchmark>('usd')
  const [showValues, setShowValues] = useState(false)

  // Find best category for current year based on selected benchmark
  const currentYear = '2024'
  const benchmarkLabel = benchmark === 'usd' ? 'USD' : benchmark === 'eur' ? 'EUR' : 'Altın'
  const bestCategory = CATEGORY_PERFORMANCE.reduce((best, cat) =>
    cat[benchmark][currentYear] > best[benchmark][currentYear] ? cat : best
  )

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {(['usd', 'eur', 'gold'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBenchmark(b)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                benchmark === b
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b === 'usd' ? 'USD' : b === 'eur' ? 'EUR' : 'Altın'}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showValues}
            onChange={(e) => setShowValues(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300"
          />
          <span className="text-sm text-slate-600">Değerleri göster</span>
        </label>
      </div>

      {/* Best Category Highlight */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <p className="text-emerald-800">
          <span className="font-semibold">🏆 {currentYear} En İyi Kategori:</span>{' '}
          {bestCategory.category} ({bestCategory[benchmark][currentYear] >= 0 ? '+' : ''}{bestCategory[benchmark][currentYear]}% {benchmarkLabel})
        </p>
      </div>

      {/* Heatmap */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 sticky left-0 bg-slate-50 whitespace-nowrap min-w-[140px]">
                  Kategori
                </th>
                {YEARS.map((year) => (
                  <th key={year} className="px-4 py-3 text-sm font-semibold text-slate-600 text-center min-w-[80px]">
                    {year}
                  </th>
                ))}
                <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">
                  Ort.
                </th>
              </tr>
            </thead>
            <tbody>
              {CATEGORY_PERFORMANCE.map((cat) => {
                const years = cat[benchmark]
                const avgReturn = Object.values(years).reduce((a, b) => a + b, 0) / Object.values(years).length
                const avgGrade = getGrade(avgReturn)

                return (
                  <tr key={cat.category} className="border-t border-slate-100">
                    <td className="px-4 py-3 sticky left-0 bg-white whitespace-nowrap">
                      <p className="font-medium text-slate-800">{cat.category}</p>
                      <p className="text-xs text-slate-500">{cat.categoryEn}</p>
                    </td>
                    {YEARS.map((year) => {
                      const value = years[year]
                      const { grade, color, bgColor } = getGrade(value)

                      return (
                        <td key={year} className="px-2 py-2 text-center">
                          <div className={`${bgColor} ${color} rounded-lg py-2 px-1 font-bold`}>
                            {showValues ? (
                              <span className="text-sm">{value >= 0 ? '+' : ''}{value}%</span>
                            ) : (
                              <span className="text-lg">{grade}</span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                    <td className="px-2 py-2 text-center">
                      <div className={`${avgGrade.bgColor} ${avgGrade.color} rounded-lg py-2 px-1 font-bold`}>
                        {showValues ? (
                          <span className="text-sm">{avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(0)}%</span>
                        ) : (
                          <span className="text-lg">{avgGrade.grade}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { grade: 'A', label: '+20% ve üzeri', color: 'bg-emerald-500' },
          { grade: 'B', label: '+10% ile +20%', color: 'bg-emerald-400' },
          { grade: 'C', label: '0% ile +10%', color: 'bg-amber-400' },
          { grade: 'D', label: '-15% ile 0%', color: 'bg-orange-500' },
          { grade: 'F', label: '-15% altı', color: 'bg-red-500' },
        ].map((item) => (
          <div key={item.grade} className="flex items-center gap-2">
            <span className={`w-8 h-8 ${item.color} rounded text-white font-bold flex items-center justify-center`}>
              {item.grade}
            </span>
            <span className="text-sm text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h4 className="font-semibold text-emerald-800 mb-2">✓ Tutarlı Kazandıranlar</h4>
          <p className="text-sm text-emerald-700">
            Altın ve Yabancı Hisse fonları son 6 yılda çoğunlukla USD bazında pozitif getiri sağladı.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">⚠️ Değişken Performans</h4>
          <p className="text-sm text-amber-700">
            Hisse ve Karma fonlar bazı yıllarda iyi, bazı yıllarda kötü performans gösterdi.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">✗ Tutarlı Kaybettirenler</h4>
          <p className="text-sm text-red-700">
            Tahvil ve Para Piyasası fonları her yıl USD bazında değer kaybetti.
          </p>
        </div>
      </div>
    </div>
  )
}
