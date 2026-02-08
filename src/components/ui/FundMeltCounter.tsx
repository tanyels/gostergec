'use client'

import { useState, useEffect, useRef } from 'react'

function fmtTL(v: number) {
  return v.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' ₺'
}
function fmtUSD(v: number) {
  return '$' + v.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}
function fmtGold(v: number) {
  return v.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' gr'
}
function fmtDiff(v: number, fmt: (n: number) => string) {
  const abs = Math.abs(v)
  return v >= 0 ? '+' + fmt(abs) : '-' + fmt(abs)
}

interface Props {
  startTL: number
  endTL: number
  tlReturn: number
  startUSD: number
  endUSD: number
  usdReturn: number
  startGold: number
  endGold: number
  goldReturn: number
  fundName?: string
  onAmountChange?: (amount: number) => void
}

export function FundMeltCounter({
  startTL,
  endTL,
  tlReturn,
  startUSD,
  endUSD,
  usdReturn,
  startGold,
  endGold,
  goldReturn,
  fundName,
  onAmountChange,
}: Props) {
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

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [endTL, endUSD, endGold])

  const tlProfit = endTL - startTL
  const usdProfit = endUSD - startUSD
  const goldProfit = endGold - startGold

  const subtitle = fundName
    ? `${fundName} — Son 1 Yıl`
    : 'Bir fon seçerek gerçek sonucu görün'

  return (
    <div ref={containerRef}>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Gerçek Sonuç</h3>
      <p className="text-xs text-slate-500 mb-5">{subtitle}</p>

      {/* Amount input */}
      <div className="flex items-baseline gap-1.5 mb-4 flex-wrap">
        <span className="text-sm text-slate-600 font-medium">Tam 1 yıl önce</span>
        <input
          type="number"
          defaultValue={startTL}
          min={100}
          step={1000}
          onBlur={(e) => {
            const val = parseInt(e.target.value) || 10000
            onAmountChange?.(val)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = parseInt((e.target as HTMLInputElement).value) || 10000
              onAmountChange?.(val)
            }
          }}
          className="w-28 border border-slate-300 rounded px-2 py-0.5 text-sm font-bold text-slate-800 bg-white focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-center"
        />
        <span className="text-sm text-slate-600 font-medium">₺ yatırdınız.</span>
      </div>

      {/* What you could have bought */}
      <div
        className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 transition-all duration-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <p className="text-sm text-slate-600">
          {fmtTL(startTL)} ile{' '}
          <span className="font-bold text-amber-700">{fmtGold(startGold)}</span> altın veya{' '}
          <span className="font-bold text-blue-700">{fmtUSD(startUSD)}</span> sahibi olabilirdiniz.
        </p>
      </div>

      {/* "Peki fon ne getirmiş?" */}
      <p
        className="text-sm font-semibold text-slate-700 mb-3 transition-all duration-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDelay: '0.1s',
        }}
      >
        Peki aldığınız fon ne getirmiş?
      </p>

      {/* Result rows */}
      <div className="space-y-2">
        {/* TL */}
        <ResultRow
          icon="₺"
          label="TL olarak"
          value={fmtTL(endTL)}
          diff={fmtDiff(tlProfit, fmtTL)}
          pct={tlReturn}
          positive={tlProfit >= 0}
          isVisible={isVisible}
          delay={0.15}
        />
        {/* USD */}
        <ResultRow
          icon="$"
          label="Dolar olarak"
          value={fmtUSD(endUSD)}
          diff={fmtDiff(usdProfit, fmtUSD)}
          pct={usdReturn}
          positive={usdProfit >= 0}
          isVisible={isVisible}
          delay={0.25}
        />
        {/* Gold */}
        <ResultRow
          icon="Au"
          label="Altın olarak"
          value={fmtGold(endGold)}
          diff={fmtDiff(goldProfit, fmtGold)}
          pct={goldReturn}
          positive={goldProfit >= 0}
          isVisible={isVisible}
          delay={0.35}
        />
      </div>
    </div>
  )
}

function ResultRow({
  icon,
  label,
  value,
  diff,
  pct,
  positive,
  isVisible,
  delay,
}: {
  icon: string
  label: string
  value: string
  diff: string
  pct: number
  positive: boolean
  isVisible: boolean
  delay: number
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg p-3 border transition-all duration-500 ${
        positive
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-red-50 border-red-200'
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transitionDelay: `${delay}s`,
      }}
    >
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          positive ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
        }`}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-bold ${positive ? 'text-emerald-700' : 'text-red-700'}`}>
          {diff}
        </p>
        <p className={`text-xs ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
          {pct >= 0 ? '+' : ''}%{pct.toFixed(1)}
        </p>
      </div>
    </div>
  )
}
