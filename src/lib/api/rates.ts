export interface LiveRates {
  usdTry: number
  eurTry: number
  goldTry: number  // per gram in TRY
  goldUsd: number  // XAU/USD per ounce
  timestamp: Date
}

/**
 * Fetches live exchange rates from free APIs
 * Updates every minute for real-time display
 */
export async function fetchLiveRates(): Promise<LiveRates> {
  try {
    // Fetch exchange rates and gold price in parallel
    const [forexResponse, goldResponse] = await Promise.all([
      fetch('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR'),
      fetch('https://api.gold-api.com/price/XAU'),
    ])

    const forexData = await forexResponse.json()

    // Parse gold price with fallback
    let goldUsd = 2650 // Last-resort fallback
    if (goldResponse.ok) {
      const goldData = await goldResponse.json()
      if (goldData.price && goldData.price > 0) {
        goldUsd = goldData.price
      }
    }

    const usdTry = forexData.rates.TRY
    const goldTry = goldUsd * usdTry / 31.1035 // Convert oz to gram

    return {
      usdTry,
      eurTry: usdTry / forexData.rates.EUR,
      goldTry,
      goldUsd,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('Failed to fetch live rates:', error)
    // Return fallback values
    return {
      usdTry: 34.5,
      eurTry: 37.2,
      goldTry: 2850,
      goldUsd: 2650,
      timestamp: new Date(),
    }
  }
}

/**
 * Fetches historical rates from TCMB or our Supabase cache
 */
export async function fetchHistoricalRates(
  startDate: string,
  endDate: string
): Promise<Array<{ date: string; usdTry: number; eurTry: number; goldTry: number }>> {
  // This will query our Supabase database
  // For now, return placeholder
  return []
}
