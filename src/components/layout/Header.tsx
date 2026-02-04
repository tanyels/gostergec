'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr')

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-800">
            Göstergeç
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/funds"
              className="text-slate-600 hover:text-slate-900 font-medium transition"
            >
              {lang === 'tr' ? 'Fon Analizi' : 'Fund Analysis'}
            </Link>
            <Link
              href="/compare"
              className="text-slate-600 hover:text-slate-900 font-medium transition"
            >
              {lang === 'tr' ? 'Karşılaştır' : 'Compare'}
            </Link>
            <Link
              href="/leaderboard"
              className="text-slate-600 hover:text-slate-900 font-medium transition"
            >
              {lang === 'tr' ? 'Sıralama' : 'Leaderboard'}
            </Link>
          </nav>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700 transition"
          >
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
        </div>
      </div>
    </header>
  )
}
