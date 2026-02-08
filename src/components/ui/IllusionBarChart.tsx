'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  tlReturn: number
  usdReturn: number
  fundName?: string
}

export function IllusionBarChart({ tlReturn, usdReturn, fundName }: Props) {
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

  // Reset animation when data changes
  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [tlReturn, usdReturn])

  const isTLPositive = tlReturn >= 0
  const isUSDPositive = usdReturn >= 0

  // Normalize bar heights relative to the larger absolute value
  const maxAbs = Math.max(Math.abs(tlReturn), Math.abs(usdReturn), 1)
  const tlBarHeight = Math.max((Math.abs(tlReturn) / maxAbs) * 70, 5) // % of chart area, min 5%
  const usdBarHeight = Math.max((Math.abs(usdReturn) / maxAbs) * 70, 5)

  const formatReturn = (val: number) =>
    `${val >= 0 ? '+' : ''}%${val.toFixed(1)}`

  const subtitle = fundName
    ? `${fundName} — Son 1 Yıl`
    : 'Bir fon seçerek gerçek getiriyi görün'

  const insight = isUSDPositive
    ? 'Bu fon USD bazında da kazandırmış.'
    : 'TL getirisi yanıltıcı. Gerçek getiri USD bazında negatif.'

  return (
    <div ref={containerRef}>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Yanılsama vs Gerçek</h3>
      <p className="text-xs text-slate-500 mb-6">{subtitle}</p>

      {/* Chart area */}
      <div className="relative h-56 flex items-center justify-center gap-16">
        {/* Zero line */}
        <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-slate-300">
          <span className="absolute -top-5 right-0 text-xs font-medium text-slate-400">%0</span>
        </div>

        {/* TL Bar */}
        <div className="flex flex-col items-center z-10 h-full justify-center">
          {isTLPositive ? (
            <>
              {/* Label above */}
              <div
                className="mb-1 transition-all"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                  transitionDelay: '0.9s',
                  transitionDuration: '0.4s',
                }}
              >
                <span className="text-2xl font-bold text-emerald-600">{formatReturn(tlReturn)}</span>
              </div>
              {/* Bar growing up from center */}
              <div
                className="w-20 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg"
                style={{
                  height: `${tlBarHeight}%`,
                  transformOrigin: 'bottom',
                  transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              {/* Center line sits here */}
              <div style={{ height: '50%' }} />
            </>
          ) : (
            <>
              <div style={{ height: '50%' }} />
              <div
                className="w-20 rounded-b-lg bg-gradient-to-b from-red-500 to-red-600 shadow-lg"
                style={{
                  height: `${tlBarHeight}%`,
                  transformOrigin: 'top',
                  transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              <div
                className="mt-1 transition-all"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '0.9s',
                  transitionDuration: '0.4s',
                }}
              >
                <span className="text-2xl font-bold text-red-600">{formatReturn(tlReturn)}</span>
              </div>
            </>
          )}
          <div className="mt-2 text-center absolute bottom-0">
            <p className="text-sm font-semibold text-slate-700">TL Getiri</p>
            <p className="text-xs text-slate-400">Nominal</p>
          </div>
        </div>

        {/* USD Bar */}
        <div className="flex flex-col items-center z-10 h-full justify-center">
          {isUSDPositive ? (
            <>
              <div
                className="mb-1 transition-all"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                  transitionDelay: '1.2s',
                  transitionDuration: '0.4s',
                }}
              >
                <span className="text-2xl font-bold text-emerald-600">{formatReturn(usdReturn)}</span>
              </div>
              <div
                className="w-20 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg"
                style={{
                  height: `${usdBarHeight}%`,
                  transformOrigin: 'bottom',
                  transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                }}
              />
              <div style={{ height: '50%' }} />
            </>
          ) : (
            <>
              <div style={{ height: '50%' }} />
              <div
                className="w-20 rounded-b-lg bg-gradient-to-b from-red-500 to-red-600 shadow-lg"
                style={{
                  height: `${usdBarHeight}%`,
                  transformOrigin: 'top',
                  transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                }}
              />
              <div
                className="mt-1 transition-all"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(-8px)',
                  transitionDelay: '1.2s',
                  transitionDuration: '0.4s',
                }}
              >
                <span className="text-2xl font-bold text-red-600">{formatReturn(usdReturn)}</span>
              </div>
            </>
          )}
          <div className="mt-2 text-center absolute bottom-0">
            <p className="text-sm font-semibold text-slate-700">USD Getiri</p>
            <p className="text-xs text-slate-400">Gerçek</p>
          </div>
        </div>
      </div>

      {/* Insight */}
      <p className="text-center text-sm text-slate-500 mt-6 italic">
        {insight}
      </p>
    </div>
  )
}
