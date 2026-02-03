'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ComparisonChartProps {
  fundCode: string
  benchmark: 'USD' | 'EUR' | 'GOLD' | 'SP500'
  startDate: string
}

// Placeholder data - will come from calculation
const PLACEHOLDER_DATA = [
  { date: '2020-01', fund: 100000, benchmark: 100000 },
  { date: '2020-06', fund: 108000, benchmark: 115000 },
  { date: '2021-01', fund: 125000, benchmark: 142000 },
  { date: '2021-06', fund: 138000, benchmark: 158000 },
  { date: '2022-01', fund: 152000, benchmark: 178000 },
  { date: '2022-06', fund: 165000, benchmark: 195000 },
  { date: '2023-01', fund: 178000, benchmark: 205000 },
  { date: '2023-06', fund: 185400, benchmark: 210000 },
]

export function ComparisonChart({ fundCode, benchmark, startDate }: ComparisonChartProps) {
  // In production, calculate data based on fundCode, benchmark, and startDate
  const data = PLACEHOLDER_DATA

  const benchmarkLabel = {
    USD: 'USD Tutsaydınız',
    EUR: 'EUR Tutsaydınız',
    GOLD: 'Altın Tutsaydınız',
    SP500: 'S&P 500',
  }[benchmark]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [
            `${value.toLocaleString('tr-TR')} ₺`,
          ]}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="fund"
          name="Fon Değeri"
          stroke="#6b7280"
          fill="#e5e7eb"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="benchmark"
          name={benchmarkLabel}
          stroke="#10b981"
          fill="#d1fae5"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
