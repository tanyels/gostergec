'use client'

import { useState, useEffect, useRef } from 'react'

export function IllusionBarChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef}>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Yanılsama vs Gerçek</h3>
      <p className="text-xs text-slate-500 mb-6">Illusion vs Reality — 2023 Ortalama Fon</p>

      {/* Chart area */}
      <div className="relative h-56 flex items-end justify-center gap-12">
        {/* Zero line */}
        <div className="absolute left-0 right-0 bottom-[20%] border-t-2 border-dashed border-slate-300">
          <span className="absolute -top-5 right-0 text-xs font-medium text-slate-400">%0</span>
        </div>

        {/* TL Bar — positive, grows upward from zero line */}
        <div className="flex flex-col items-center z-10" style={{ height: '100%' }}>
          {/* Percentage label */}
          <div
            className="mb-2 transition-all"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transitionDelay: '1s',
              transitionDuration: '0.4s',
            }}
          >
            <span className="text-2xl font-bold text-emerald-600">+%67</span>
          </div>

          {/* Bar */}
          <div className="flex-1 flex items-end" style={{ paddingBottom: '20%' }}>
            <div
              className="w-20 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg"
              style={{
                height: '100%',
                transformOrigin: 'bottom',
                transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>

          {/* Label */}
          <div className="mt-2 text-center">
            <p className="text-sm font-semibold text-slate-700">TL Getiri</p>
            <p className="text-xs text-slate-400">Nominal</p>
          </div>
        </div>

        {/* USD Bar — negative, grows downward from zero line */}
        <div className="flex flex-col items-center z-10" style={{ height: '100%' }}>
          {/* Spacer to align with zero line */}
          <div className="flex-1" style={{ marginBottom: '0%' }} />

          {/* Area below zero line */}
          <div className="flex flex-col items-center" style={{ height: '20%' }}>
            {/* Bar */}
            <div
              className="w-20 rounded-b-lg bg-gradient-to-b from-red-500 to-red-600 shadow-lg"
              style={{
                height: '60%',
                transformOrigin: 'top',
                transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
              }}
            />

            {/* Percentage label */}
            <div
              className="mt-1 transition-all"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-8px)',
                transitionDelay: '1.2s',
                transitionDuration: '0.4s',
              }}
            >
              <span className="text-2xl font-bold text-red-600">-%8</span>
            </div>
          </div>

          {/* Label */}
          <div className="mt-2 text-center">
            <p className="text-sm font-semibold text-slate-700">USD Getiri</p>
            <p className="text-xs text-slate-400">Gerçek</p>
          </div>
        </div>
      </div>

      {/* Insight */}
      <p className="text-center text-sm text-slate-500 mt-6 italic">
        TL getirisi yanıltıcı. Gerçek getiri USD bazında negatif.
      </p>
    </div>
  )
}
