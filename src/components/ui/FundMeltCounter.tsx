'use client'

import { useState, useEffect, useRef } from 'react'
import { FUNDS } from '@/lib/data/funds'

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
  selectedFund: string
  fundName?: string
  onFundChange?: (code: string) => void
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
  selectedFund,
  fundName,
  onFundChange,
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

  return (
    <div ref={containerRef}>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Gerçek Sonuç</h3>

      {/* Inline sentence: "Tam 1 yıl önce [FON] fonuna [10.000] ₺ yatırdınız." */}
      <div className="flex items-baseline gap-1.5 mb-4 flex-wrap text-sm text-slate-600 font-medium">
        <span>Tam 1 yıl önce</span>
        <select
          value={selectedFund}
          onChange={(e) => onFundChange?.(e.target.value)}
          className="border border-slate-300 rounded px-2 py-0.5 text-sm font-bold text-slate-800 bg-white focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
        >
          <option value="">Fon seçin</option>
          {FUNDS.map((f) => (
            <option key={f.code} value={f.code}>{f.name}</option>
          ))}
        </select>
        <span>fonuna</span>
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
        <span>₺ yatırdınız.</span>
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
          1 yıl önce {fmtTL(startTL)} ile{' '}
          <span className="font-bold text-amber-700">{fmtGold(startGold)}</span> altın veya{' '}
          <span className="font-bold text-blue-700">{fmtUSD(startUSD)}</span> sahibi olabilirdiniz.
        </p>
      </div>

      {/* Current value */}
      <div
        className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 transition-all duration-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transitionDelay: '0.1s',
        }}
      >
        <p className="text-sm text-slate-600">
          Bugün fonunuz TL olarak <span className="font-bold text-slate-800">{fmtTL(endTL)}</span>,
          altın olarak <span className="font-bold text-amber-700">{fmtGold(endGold)}</span>,
          dolar olarak <span className="font-bold text-blue-700">{fmtUSD(endUSD)}</span> ediyor.
        </p>
      </div>

      {/* Profit / loss */}
      <div
        className="bg-slate-50 border border-slate-200 rounded-lg p-3 transition-all duration-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transitionDelay: '0.2s',
        }}
      >
        <p className="text-sm text-slate-600">
          Bu fon size TL bazında{' '}
          <span className={`font-bold ${tlProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {fmtDiff(tlProfit, fmtTL)}
          </span>
          {tlProfit >= 0 ? ' kazandırmış' : ' kaybettirmiş'}, altın bazında{' '}
          <span className={`font-bold ${goldProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {fmtDiff(goldProfit, fmtGold)}
          </span>
          {goldProfit >= 0 ? ' kazandırmış' : ' kaybettirmiş'}, dolar bazında{' '}
          <span className={`font-bold ${usdProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {fmtDiff(usdProfit, fmtUSD)}
          </span>
          {usdProfit >= 0 ? ' kazandırmış' : ' kaybettirmiş'}.
        </p>
      </div>
    </div>
  )
}

