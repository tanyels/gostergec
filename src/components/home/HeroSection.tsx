'use client'

import { useState, useEffect } from 'react'

const ROTATING_TEXTS = [
  { tr: 'Fonunuz gerçekten kazandırıyor mu?', en: 'Is your fund really profitable?' },
  { tr: 'TL getirisi yanıltıcı olabilir', en: 'TL returns can be misleading' },
  { tr: 'USD bazında gerçeği görün', en: 'See the truth in USD terms' },
  { tr: 'Altın mı, fon mu, kripto mu?', en: 'Gold, funds, or crypto?' },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ROTATING_TEXTS.length)
        setIsVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const currentText = ROTATING_TEXTS[currentIndex]

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 text-center">
        {/* Animated Headline */}
        <div className="h-24 flex items-center justify-center">
          <h1
            className={`text-3xl md:text-5xl font-bold text-slate-800 transition-all duration-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            {currentText.tr}
          </h1>
        </div>

        <p className="text-lg text-slate-500 mt-2 mb-8">
          {currentText.en}
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Canlı Veriler</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>10+ Yıl Geçmiş</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            <span>50+ Fon</span>
          </div>
        </div>
      </div>
    </section>
  )
}
