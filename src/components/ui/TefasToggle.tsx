'use client'

import { useTefasFilter } from '@/lib/context/TefasFilterContext'

export function TefasToggle() {
  const { showOnlyTefas, setShowOnlyTefas } = useTefasFilter()
  const includePrivate = !showOnlyTefas

  return (
    <button
      type="button"
      role="switch"
      aria-checked={includePrivate}
      aria-label="Özel fonları dahil et"
      onClick={() => setShowOnlyTefas(includePrivate)}
      className="inline-flex items-center gap-2 cursor-pointer text-sm group"
    >
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
          includePrivate ? 'bg-slate-800' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
            includePrivate ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
      <span className="text-slate-600 font-medium select-none">Özel fonları dahil et</span>
    </button>
  )
}
