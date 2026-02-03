'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr')

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Göstergeç
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/funds"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              {lang === 'tr' ? 'Fon Analizi' : 'Fund Analysis'}
            </Link>
            <Link
              href="/compare"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              {lang === 'tr' ? 'Karşılaştır' : 'Compare'}
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              {lang === 'tr' ? 'Sıralama' : 'Leaderboard'}
            </Link>
          </nav>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
        </div>
      </div>
    </header>
  )
}
