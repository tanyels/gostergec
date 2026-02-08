'use client'

import { IllusionBarChart } from './IllusionBarChart'
import { FundMeltCounter } from './FundMeltCounter'

export function HeroVisual() {
  return (
    <section className="w-full py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">
          Fonunuz Gerçekten Kazandırıyor mu?
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          TL bazlı getiriler yanıltıcı olabilir. Gerçek performansı görün.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <IllusionBarChart />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <FundMeltCounter />
        </div>
      </div>
    </section>
  )
}
