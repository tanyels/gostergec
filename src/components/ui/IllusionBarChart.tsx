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

  // Bar heights as percentage of the half (max bar = 90% of half)
  const maxAbs = Math.max(Math.abs(tlReturn), Math.abs(usdReturn), 1)
  const tlBarPct = Math.max((Math.abs(tlReturn) / maxAbs) * 90, 4)
  const usdBarPct = Math.max((Math.abs(usdReturn) / maxAbs) * 90, 4)

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

      <div className="flex justify-center gap-14">
        {/* TL Bar */}
        <BarColumn
          value={tlReturn}
          barPct={tlBarPct}
          positive={isTLPositive}
          formatReturn={formatReturn}
          isVisible={isVisible}
          animDelay={0}
          labelDelay={0.9}
          label="TL Getiri"
          sublabel="Nominal"
        />

        {/* USD Bar */}
        <BarColumn
          value={usdReturn}
          barPct={usdBarPct}
          positive={isUSDPositive}
          formatReturn={formatReturn}
          isVisible={isVisible}
          animDelay={0.3}
          labelDelay={1.2}
          label="USD Getiri"
          sublabel="Gerçek"
        />
      </div>

      {/* Insight */}
      <p className="text-center text-sm text-slate-500 mt-4 italic">
        {insight}
      </p>
    </div>
  )
}

function BarColumn({
  value,
  barPct,
  positive,
  formatReturn,
  isVisible,
  animDelay,
  labelDelay,
  label,
  sublabel,
}: {
  value: number
  barPct: number
  positive: boolean
  formatReturn: (v: number) => string
  isVisible: boolean
  animDelay: number
  labelDelay: number
  label: string
  sublabel: string
}) {
  return (
    <div className="flex flex-col items-center" style={{ width: 80 }}>
      {/* Percentage label — above bar if positive */}
      {positive && (
        <div
          className="mb-1 h-8 flex items-end transition-all"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: `${labelDelay}s`,
            transitionDuration: '0.4s',
          }}
        >
          <span className="text-xl font-bold text-emerald-600">
            {formatReturn(value)}
          </span>
        </div>
      )}
      {/* Spacer if negative (keep alignment) */}
      {!positive && <div className="h-8" />}

      {/* Chart area — fixed height, split into top half + bottom half */}
      <div className="relative w-full" style={{ height: 160 }}>
        {/* Zero line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-px border-t-2 border-dashed border-slate-300" />

        {/* Top half — positive bars grow from bottom up */}
        <div className="absolute top-0 left-0 right-0 flex items-end justify-center" style={{ height: '50%' }}>
          {positive && (
            <div
              className={`w-full rounded-t-lg shadow-lg ${
                positive ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : ''
              }`}
              style={{
                height: `${barPct}%`,
                transformOrigin: 'bottom',
                transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${animDelay}s`,
              }}
            />
          )}
        </div>

        {/* Bottom half — negative bars grow from top down */}
        <div className="absolute bottom-0 left-0 right-0 flex items-start justify-center" style={{ height: '50%' }}>
          {!positive && (
            <div
              className="w-full rounded-b-lg bg-gradient-to-b from-red-500 to-red-600 shadow-lg"
              style={{
                height: `${barPct}%`,
                transformOrigin: 'top',
                transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${animDelay}s`,
              }}
            />
          )}
        </div>
      </div>

      {/* Percentage label — below bar if negative */}
      {!positive && (
        <div
          className="mt-1 h-8 flex items-start transition-all"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-8px)',
            transitionDelay: `${labelDelay}s`,
            transitionDuration: '0.4s',
          }}
        >
          <span className="text-xl font-bold text-red-600">
            {formatReturn(value)}
          </span>
        </div>
      )}
      {/* Spacer if positive (keep alignment) */}
      {positive && <div className="h-8" />}

      {/* Category label — always at the bottom, outside chart */}
      <div className="text-center mt-1">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{sublabel}</p>
      </div>
    </div>
  )
}
