'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Feature {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  icon: string
  href: string
  color: string
  preview?: React.ReactNode
}

interface FeatureCategory {
  id: string
  title: string
  titleEn: string
  icon: string
  features: Feature[]
  defaultExpanded?: boolean
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'analysis',
    title: 'Analiz Araçları',
    titleEn: 'Analysis Tools',
    icon: '📊',
    defaultExpanded: true,
    features: [
      {
        id: 'funds',
        title: 'Fon Analizi',
        titleEn: 'Fund Analysis',
        description: 'Tek bir fonun USD, EUR ve altın bazında gerçek performansını görün',
        descriptionEn: 'See real performance of any fund in USD, EUR, and gold',
        icon: '🔍',
        href: '/funds',
        color: 'blue',
      },
      {
        id: 'report-cards',
        title: 'Fon Karneleri',
        titleEn: 'Report Cards',
        description: 'Her fon için A-F arası not. Hangi fonlar gerçekten başarılı?',
        descriptionEn: 'A-F grades for each fund based on real returns',
        icon: '📝',
        href: '/report-cards',
        color: 'emerald',
      },
      {
        id: 'leaderboard',
        title: 'Sıralama',
        titleEn: 'Leaderboard',
        description: 'Tüm fonları USD getirisine göre sıralayın ve karşılaştırın',
        descriptionEn: 'Rank all funds by USD-adjusted returns',
        icon: '🏆',
        href: '/leaderboard',
        color: 'amber',
      },
      {
        id: 'heatmap',
        title: 'Sektör Haritası',
        titleEn: 'Sector Heatmap',
        description: 'Fon kategorilerinin yıllara göre performans haritası',
        descriptionEn: 'Visual heatmap of category performance by year',
        icon: '🗺️',
        href: '/heatmap',
        color: 'purple',
      },
    ],
  },
  {
    id: 'comparison',
    title: 'Karşılaştırma Araçları',
    titleEn: 'Comparison Tools',
    icon: '⚖️',
    defaultExpanded: true,
    features: [
      {
        id: 'compare',
        title: 'Fon vs Döviz/Altın',
        titleEn: 'Fund vs Currency/Gold',
        description: 'Fonunuzu USD, EUR veya altın tutmakla karşılaştırın',
        descriptionEn: 'Compare your fund vs holding USD, EUR, or gold',
        icon: '💱',
        href: '/compare',
        color: 'blue',
      },
      {
        id: 'crypto',
        title: 'Fon vs Kripto',
        titleEn: 'Fund vs Crypto',
        description: 'Bitcoin ve Ethereum ile karşılaştırın. Risk ve getiri analizi',
        descriptionEn: 'Compare against Bitcoin and Ethereum with risk analysis',
        icon: '₿',
        href: '/crypto',
        color: 'orange',
      },
      {
        id: 'real-estate',
        title: 'Fon vs Gayrimenkul',
        titleEn: 'Fund vs Real Estate',
        description: 'Konut yatırımıyla karşılaştırın. İstanbul, Ankara, İzmir...',
        descriptionEn: 'Compare against housing in Turkish cities',
        icon: '🏠',
        href: '/real-estate',
        color: 'cyan',
      },
    ],
  },
  {
    id: 'pension',
    title: 'BES Analizi',
    titleEn: 'Pension Analysis',
    icon: '🏦',
    defaultExpanded: false,
    features: [
      {
        id: 'bes-calculator',
        title: 'BES Hesaplayıcı',
        titleEn: 'BES Calculator',
        description: 'Emeklilik fonunuzun gerçek getirisini hesaplayın',
        descriptionEn: 'Calculate real returns of your pension fund',
        icon: '🧮',
        href: '/bes#calculator',
        color: 'amber',
      },
      {
        id: 'bes-devlet',
        title: 'Devlet Katkısı Gerçeği',
        titleEn: 'Government Match Reality',
        description: '%30 devlet katkısı gerçekten işe yarıyor mu?',
        descriptionEn: 'Does the 30% government match actually help?',
        icon: '🏛️',
        href: '/bes#devlet-katkisi',
        color: 'red',
      },
      {
        id: 'bes-rankings',
        title: 'BES Şirket Sıralaması',
        titleEn: 'Provider Rankings',
        description: 'Hangi emeklilik şirketi daha iyi performans gösteriyor?',
        descriptionEn: 'Which pension company performs better?',
        icon: '📊',
        href: '/bes#rankings',
        color: 'blue',
      },
      {
        id: 'bes-withdrawal',
        title: 'Çıkış Hesaplayıcı',
        titleEn: 'Withdrawal Calculator',
        description: 'Erken çıkış yapmalı mısınız? Ceza ve maliyet analizi',
        descriptionEn: 'Should you withdraw early? Penalty analysis',
        icon: '🚪',
        href: '/bes#withdrawal',
        color: 'slate',
      },
      {
        id: 'bes-age',
        title: 'Yaşa Göre Öneriler',
        titleEn: 'Age Recommendations',
        description: 'Yaşınıza uygun BES fon dağılımı önerileri',
        descriptionEn: 'Age-based fund allocation recommendations',
        icon: '👤',
        href: '/bes#age',
        color: 'emerald',
      },
    ],
  },
]

export function FeatureHub() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(FEATURE_CATEGORIES.filter(c => c.defaultExpanded).map(c => c.id))
  )
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const colorClasses: { [key: string]: { bg: string; border: string; icon: string } } = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'bg-emerald-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-500' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-500' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', icon: 'bg-cyan-500' },
    red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-500' },
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', icon: 'bg-slate-500' },
  }

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Tüm Araçlar</h2>
          <p className="text-slate-500">All Tools</p>
        </div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {FEATURE_CATEGORIES.map((category) => {
            const isExpanded = expandedCategories.has(category.id)

            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-800">{category.title}</h3>
                      <p className="text-sm text-slate-500">{category.titleEn}</p>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-full">
                      {category.features.length} araç
                    </span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Category Features */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.features.map((feature) => {
                      const colors = colorClasses[feature.color] || colorClasses.blue
                      const isHovered = hoveredFeature === feature.id

                      return (
                        <Link
                          key={feature.id}
                          href={feature.href}
                          className={`group block rounded-xl border-2 p-4 transition-all duration-200 ${
                            colors.bg
                          } ${isHovered ? colors.border : 'border-transparent'} hover:shadow-md hover:scale-[1.02]`}
                          onMouseEnter={() => setHoveredFeature(feature.id)}
                          onMouseLeave={() => setHoveredFeature(null)}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center text-xl text-white shadow-sm`}
                            >
                              {feature.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-800 group-hover:text-slate-900">
                                {feature.title}
                              </h4>
                              <p className="text-xs text-slate-500 mb-2">{feature.titleEn}</p>
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {feature.description}
                              </p>
                            </div>
                          </div>

                          {/* Hover Arrow */}
                          <div className={`mt-3 flex justify-end transition-all duration-200 ${
                            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                          }`}>
                            <span className="text-slate-400 text-sm flex items-center gap-1">
                              Aç
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Expand/Collapse All */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              if (expandedCategories.size === FEATURE_CATEGORIES.length) {
                setExpandedCategories(new Set())
              } else {
                setExpandedCategories(new Set(FEATURE_CATEGORIES.map(c => c.id)))
              }
            }}
            className="text-sm text-slate-500 hover:text-slate-700 transition"
          >
            {expandedCategories.size === FEATURE_CATEGORIES.length
              ? '↑ Tümünü Kapat'
              : '↓ Tümünü Aç'}
          </button>
        </div>
      </div>
    </section>
  )
}
