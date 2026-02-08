'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

function formatTL(value: number): string {
  return value.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' ₺'
}

function formatUSD(value: number): string {
  return '$' + value.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}

interface Props {
  startTL: number
  endTL: number
  startUSD: number
  endUSD: number
  tlReturn: number
  usdReturn: number
  fundName?: string
}

export function FundMeltCounter({
  startTL,
  endTL,
  startUSD,
  endUSD,
  tlReturn,
  usdReturn,
  fundName,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<HTMLSpanElement>(null)
  const usdRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const animFrameRef = useRef<number>(0)
  const prevDataRef = useRef({ endTL, endUSD })

  // Intersection Observer
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

  // Reset and re-animate when data changes
  useEffect(() => {
    if (prevDataRef.current.endTL !== endTL || prevDataRef.current.endUSD !== endUSD) {
      prevDataRef.current = { endTL, endUSD }
      setIsDone(false)
      if (isVisible) {
        // Small delay so DOM updates first
        const timer = setTimeout(() => animate(), 50)
        return () => clearTimeout(timer)
      }
    }
  }, [endTL, endUSD, isVisible])

  const animate = useCallback(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      if (tlRef.current) tlRef.current.textContent = formatTL(endTL)
      if (usdRef.current) usdRef.current.textContent = formatUSD(endUSD)
      setIsDone(true)
      return
    }

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)

    const duration = 2000
    const startTime = performance.now()

    let lastTLVal = -1, lastUSDVal = -1

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      const currentTL = Math.round(startTL + (endTL - startTL) * eased)
      const currentUSD = Math.round(startUSD + (endUSD - startUSD) * eased)

      if (currentTL !== lastTLVal && tlRef.current) {
        tlRef.current.textContent = formatTL(currentTL)
        lastTLVal = currentTL
      }
      if (currentUSD !== lastUSDVal && usdRef.current) {
        usdRef.current.textContent = formatUSD(currentUSD)
        lastUSDVal = currentUSD
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick)
      } else {
        setIsDone(true)
      }
    }

    animFrameRef.current = requestAnimationFrame(tick)
  }, [startTL, endTL, startUSD, endUSD])

  // Initial animation when first visible
  useEffect(() => {
    if (isVisible) animate()
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isVisible, animate])

  const isUSDPositive = usdReturn >= 0
  const subtitle = fundName
    ? `${fundName} — Son 1 Yıl`
    : 'Bir fon seçerek gerçek sonucu görün'

  const insight = isUSDPositive
    ? 'Bu fonla hem TL hem USD bazında kazanmışsınız.'
    : 'Paranız TL\u2019de büyüyor ama gerçek değeri eriyor.'

  const formatReturnLabel = (val: number) =>
    `${val >= 0 ? '+' : ''}%${val.toFixed(1)} ${val >= 0 ? '↑' : '↓'}`

  return (
    <div ref={containerRef}>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Fon Erime Sayacı</h3>
      <p className="text-xs text-slate-500 mb-6">{subtitle}</p>

      <p className="text-sm text-slate-600 mb-4 font-medium">
        {startTL.toLocaleString('tr-TR')} ₺ yatırsaydınız...
      </p>

      {/* TL Counter */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-3">
        <p className="text-sm font-medium text-emerald-700 mb-1">TL Değeri</p>
        <span
          ref={tlRef}
          className="text-3xl font-bold text-emerald-600"
        >
          {formatTL(isVisible ? startTL : endTL)}
        </span>
        <p
          className="text-sm text-emerald-500 mt-1 font-medium transition-opacity duration-500"
          style={{ opacity: isDone ? 1 : 0 }}
        >
          {formatReturnLabel(tlReturn)}
        </p>
      </div>

      {/* VS divider */}
      <p className="text-center text-slate-400 font-bold text-sm my-1">vs</p>

      {/* USD Counter */}
      <div
        className={`border rounded-lg p-4 mt-3 transition-shadow duration-700 ${
          isUSDPositive
            ? 'bg-emerald-50 border-emerald-200'
            : `bg-red-50 border-red-200 ${isDone ? 'shadow-md shadow-red-100' : ''}`
        }`}
      >
        <p className={`text-sm font-medium mb-1 ${isUSDPositive ? 'text-emerald-700' : 'text-red-700'}`}>
          USD Karşılığı
        </p>
        <span
          ref={usdRef}
          className={`text-3xl font-bold ${isUSDPositive ? 'text-emerald-600' : 'text-red-600'}`}
        >
          {formatUSD(isVisible ? startUSD : endUSD)}
        </span>
        <p
          className={`text-sm mt-1 font-medium transition-opacity duration-500 ${isUSDPositive ? 'text-emerald-500' : 'text-red-500'}`}
          style={{ opacity: isDone ? 1 : 0 }}
        >
          {formatReturnLabel(usdReturn)}
        </p>
      </div>

      {/* Insight */}
      <p className="text-center text-sm text-slate-500 mt-6 italic">
        {insight}
      </p>
    </div>
  )
}
