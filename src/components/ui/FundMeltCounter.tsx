'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

function formatTL(value: number): string {
  return value.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' ₺'
}

function formatUSD(value: number): string {
  return '$' + value.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}

export function FundMeltCounter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<HTMLSpanElement>(null)
  const usdRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const animFrameRef = useRef<number>(0)

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

  const animate = useCallback(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      if (tlRef.current) tlRef.current.textContent = formatTL(16700)
      if (usdRef.current) usdRef.current.textContent = formatUSD(1740)
      setIsDone(true)
      return
    }

    const duration = 2000
    const startTime = performance.now()

    const tlStart = 10000, tlEnd = 16700
    const usdStart = 1890, usdEnd = 1740

    let lastTL = -1, lastUSD = -1

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic

      const currentTL = Math.round(tlStart + (tlEnd - tlStart) * eased)
      const currentUSD = Math.round(usdStart + (usdEnd - usdStart) * eased)

      // Only update DOM when integer value changes
      if (currentTL !== lastTL && tlRef.current) {
        tlRef.current.textContent = formatTL(currentTL)
        lastTL = currentTL
      }
      if (currentUSD !== lastUSD && usdRef.current) {
        usdRef.current.textContent = formatUSD(currentUSD)
        lastUSD = currentUSD
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick)
      } else {
        setIsDone(true)
      }
    }

    animFrameRef.current = requestAnimationFrame(tick)
  }, [])

  // Start animation when visible
  useEffect(() => {
    if (isVisible) animate()
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isVisible, animate])

  return (
    <div ref={containerRef}>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Fon Erime Sayacı</h3>
      <p className="text-xs text-slate-500 mb-6">Fund Melt Counter — 1 Yıllık Simülasyon</p>

      <p className="text-sm text-slate-600 mb-4 font-medium">
        10.000 ₺ yatırsaydınız...
      </p>

      {/* TL Counter — goes UP */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-3">
        <p className="text-sm font-medium text-emerald-700 mb-1">TL Değeri</p>
        <span
          ref={tlRef}
          className="text-3xl font-bold text-emerald-600"
        >
          {isVisible ? formatTL(10000) : formatTL(16700)}
        </span>
        <p
          className="text-sm text-emerald-500 mt-1 font-medium transition-opacity duration-500"
          style={{ opacity: isDone ? 1 : 0 }}
        >
          +%67 ↑
        </p>
      </div>

      {/* VS divider */}
      <p className="text-center text-slate-400 font-bold text-sm my-1">vs</p>

      {/* USD Counter — goes DOWN */}
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-4 mt-3 transition-shadow duration-700 ${isDone ? 'shadow-md shadow-red-100' : ''}`}
      >
        <p className="text-sm font-medium text-red-700 mb-1">USD Karşılığı</p>
        <span
          ref={usdRef}
          className="text-3xl font-bold text-red-600"
        >
          {isVisible ? formatUSD(1890) : formatUSD(1740)}
        </span>
        <p
          className="text-sm text-red-500 mt-1 font-medium transition-opacity duration-500"
          style={{ opacity: isDone ? 1 : 0 }}
        >
          -%8 ↓
        </p>
      </div>

      {/* Insight */}
      <p className="text-center text-sm text-slate-500 mt-6 italic">
        Paranız TL&apos;de büyüyor ama gerçek değeri eriyor.
      </p>
    </div>
  )
}
