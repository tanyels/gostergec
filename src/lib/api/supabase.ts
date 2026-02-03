import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface FundPrice {
  id: number
  fund_code: string
  date: string
  price_try: number
  created_at: string
}

export interface ExchangeRate {
  id: number
  date: string
  usd_try: number
  eur_try: number
  gold_try_gram: number
  gold_usd_oz: number
  created_at: string
}

export interface Fund {
  code: string
  name: string
  category: string
  manager: string
  inception_date: string
}

// Query functions
export async function getFundPrices(
  fundCode: string,
  startDate: string,
  endDate: string
): Promise<FundPrice[]> {
  const { data, error } = await supabase
    .from('fund_prices')
    .select('*')
    .eq('fund_code', fundCode)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getExchangeRates(
  startDate: string,
  endDate: string
): Promise<ExchangeRate[]> {
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAllFunds(): Promise<Fund[]> {
  const { data, error } = await supabase
    .from('funds')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}
