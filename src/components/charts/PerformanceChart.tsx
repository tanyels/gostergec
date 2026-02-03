'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface PerformanceChartProps {
  fundCode: string
  period: '1Y' | '3Y' | '5Y' | '10Y'
}

// Placeholder data - will come from Supabase
const PLACEHOLDER_DATA = [
  { date: '2023-01', try: 100, usd: 100, eur: 100, gold: 100 },
  { date: '2023-03', try: 112, usd: 98, eur: 99, gold: 95 },
  { date: '2023-06', try: 128, usd: 94, eur: 96, gold: 90 },
  { date: '2023-09', try: 156, usd: 90, eur: 92, gold: 85 },
  { date: '2023-12', try: 185, usd: 88, eur: 91, gold: 82 },
]

export function PerformanceChart({ fundCode, period }: PerformanceChartProps) {
  // In production, fetch data based on fundCode and period
  const data = PLACEHOLDER_DATA

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number, name: string) => [
            `${value.toFixed(1)}`,
            name.toUpperCase(),
          ]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="try"
          name="TL"
          stroke="#6b7280"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="usd"
          name="USD"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="eur"
          name="EUR"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="gold"
          name="Altın"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
