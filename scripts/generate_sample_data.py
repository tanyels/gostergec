"""
Generate realistic sample fund data for demo purposes
Based on typical Turkish fund performance patterns

This creates data that mimics real fund behavior:
- Gold funds track gold prices closely
- Equity funds have higher volatility
- Money market funds have low, steady returns
- All funds affected by TRY depreciation
"""

import os
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fund characteristics for realistic simulation
FUNDS = {
    'TYH': {'name': 'Yapı Kredi Altın Fonu', 'type': 'gold', 'base_return': 0.0003, 'volatility': 0.015},
    'GAL': {'name': 'Garanti Altın Fonu', 'type': 'gold', 'base_return': 0.0003, 'volatility': 0.014},
    'IPB': {'name': 'İş Portföy BIST Banka', 'type': 'equity', 'base_return': 0.0004, 'volatility': 0.025},
    'TTE': {'name': 'TEB Hisse Fonu', 'type': 'equity', 'base_return': 0.0003, 'volatility': 0.022},
    'MAC': {'name': 'Ak Portföy Amerika', 'type': 'foreign', 'base_return': 0.0004, 'volatility': 0.018},
    'AFA': {'name': 'Ak Portföy BIST 30', 'type': 'equity', 'base_return': 0.0003, 'volatility': 0.024},
    'IST': {'name': 'İş Portföy Tahvil', 'type': 'bond', 'base_return': 0.0002, 'volatility': 0.008},
    'AK1': {'name': 'Ak Para Piyasası', 'type': 'money', 'base_return': 0.0001, 'volatility': 0.002},
    'YKP': {'name': 'YK Para Piyasası', 'type': 'money', 'base_return': 0.0001, 'volatility': 0.002},
    'GAE': {'name': 'Garanti Euro Fonu', 'type': 'currency', 'base_return': 0.0003, 'volatility': 0.012},
}


def generate_fund_prices(fund_code: str, start_date: datetime, end_date: datetime):
    """Generate realistic fund price series"""
    fund = FUNDS[fund_code]
    prices = []

    # Starting price (typical TEFAS fund unit prices)
    if fund['type'] == 'money':
        price = random.uniform(0.05, 0.08)
    elif fund['type'] == 'bond':
        price = random.uniform(0.5, 1.0)
    else:
        price = random.uniform(0.8, 2.0)

    current_date = start_date

    while current_date <= end_date:
        # Skip weekends
        if current_date.weekday() < 5:
            # Daily return with some randomness
            daily_return = fund['base_return'] + random.gauss(0, fund['volatility'])

            # Add some market regime effects
            year = current_date.year

            # 2018 currency crisis
            if year == 2018 and current_date.month >= 8:
                if fund['type'] in ['gold', 'foreign', 'currency']:
                    daily_return += 0.003  # These did well
                else:
                    daily_return -= 0.002  # TRY assets suffered

            # 2020 COVID crash and recovery
            if year == 2020:
                if current_date.month in [3, 4]:
                    daily_return -= 0.002  # Crash
                elif current_date.month in [5, 6, 7]:
                    daily_return += 0.001  # Recovery

            # 2021-2023 high inflation period
            if year in [2021, 2022, 2023]:
                if fund['type'] in ['gold', 'foreign', 'currency']:
                    daily_return += 0.001
                else:
                    daily_return += 0.0005  # Nominal gains but real losses

            # Apply return
            price *= (1 + daily_return)

            prices.append({
                'fund_code': fund_code,
                'date': current_date.strftime('%Y-%m-%d'),
                'price_try': round(price, 6),
            })

        current_date += timedelta(days=1)

    return prices


def main():
    print("Generating sample fund data...")
    print("=" * 50)

    # Generate 10 years of data
    end_date = datetime.now()
    start_date = end_date - timedelta(days=10 * 365)

    total_records = 0

    for fund_code in FUNDS:
        print(f"\nGenerating {fund_code}...")
        prices = generate_fund_prices(fund_code, start_date, end_date)

        # Insert in batches
        batch_size = 500
        for i in range(0, len(prices), batch_size):
            batch = prices[i:i+batch_size]
            try:
                supabase.table('fund_prices').upsert(
                    batch,
                    on_conflict='fund_code,date'
                ).execute()
            except Exception as e:
                print(f"  Error: {e}")

        print(f"  ✓ Generated {len(prices)} prices")
        total_records += len(prices)

    print(f"\n{'='*50}")
    print(f"COMPLETE: Generated {total_records} total price records")
    print("=" * 50)
    print("\nNote: This is SAMPLE data for demo purposes.")
    print("Replace with real TEFAS data for production use.")


if __name__ == '__main__':
    main()
