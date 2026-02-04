'use client'

import { useState } from 'react'

interface StatCard {
  label: string
  labelEn: string
  value: string
  subtext: string
  color: 'green' | 'red' | 'amber' | 'blue'
  detail: string
}

const STATS: StatCard[] = [
  {
    label: 'Ortalama TL Getiri',
    labelEn: 'Avg TL Return',
    value: '+67%',
    subtext: '2023 Fon Ortalaması',
    color: 'green',
    detail: 'Türk fonları 2023 yılında ortalama %67 TL bazlı getiri sağladı. Ancak bu rakam yanıltıcı olabilir.',
  },
  {
    label: 'Gerçek USD Getiri',
    labelEn: 'Real USD Return',
    value: '-8%',
    subtext: 'Aynı Dönem',
    color: 'red',
    detail: 'Aynı fonlar USD bazında değerlendirildiğinde ortalama %8 kayıp yaşandı. TL değer kaybı getiriyi sildi.',
  },
  {
    label: 'En İyi Kategori',
    labelEn: 'Best Category',
    value: 'Altın',
    subtext: '+28% USD',
    color: 'amber',
    detail: 'Altın fonları son 5 yılda tutarlı şekilde USD bazında pozitif getiri sağlayan tek kategori oldu.',
  },
  {
    label: 'En Kötü Kategori',
    labelEn: 'Worst Category',
    value: 'Para Piy.',
    subtext: '-25% USD',
    color: 'blue',
    detail: 'Para piyasası fonları her yıl USD bazında değer kaybetti. "Güvenli" olarak bilinen bu fonlar aslında en çok kaybettirdi.',
  },
]

export function QuickStats() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const colorClasses = {
    green: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    red: 'bg-red-50 border-red-200 hover:bg-red-100',
    amber: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  }

  const valueColorClasses = {
    green: 'text-emerald-600',
    red: 'text-red-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600',
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${colorClasses[stat.color]} ${
                expandedIndex === index ? 'col-span-2 md:col-span-4' : ''
              }`}
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-xs text-slate-400">{stat.labelEn}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <p className={`text-3xl font-bold mt-2 ${valueColorClasses[stat.color]}`}>
                {stat.value}
              </p>
              <p className="text-xs text-slate-500">{stat.subtext}</p>

              {/* Expanded Detail */}
              {expandedIndex === index && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">{stat.detail}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
