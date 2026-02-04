"""
Göstergeç Data Scraper
Fetches fund prices from TEFAS and exchange rates from TCMB/free APIs

Usage:
  python scraper.py --test           # Test with a few days of data
  python scraper.py --historical     # Fetch 10 years of historical data
  python scraper.py --daily          # Fetch today's data (run via cron)
"""

import os
import sys
import argparse
from datetime import datetime, timedelta
from typing import Optional, Dict, List
import requests
import time

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase credentials in .env")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fund codes to track
FUND_CODES = ['TYH', 'GAL', 'IPB', 'TTE', 'MAC', 'AFA', 'IST', 'AK1', 'YKP', 'GAE']


# ============== EXCHANGE RATES ==============

def fetch_exchange_rates_frankfurter(date: str) -> Optional[Dict]:
    """
    Fetches USD/TRY and EUR/TRY from frankfurter.app (free, no key)
    Date format: YYYY-MM-DD
    """
    try:
        url = f"https://api.frankfurter.app/{date}?from=USD&to=TRY,EUR"
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return None

        data = response.json()

        usd_try = data['rates']['TRY']
        # EUR/TRY = USD/TRY / USD/EUR
        eur_try = usd_try / data['rates']['EUR']

        return {
            'usd_try': round(usd_try, 4),
            'eur_try': round(eur_try, 4),
        }
    except Exception as e:
        print(f"  Error fetching forex for {date}: {e}")
        return None


def fetch_gold_price_approximate(date: str, usd_try: float) -> Dict:
    """
    Approximates gold price. For production, use a proper gold API.
    This uses a rough estimate based on recent gold prices.
    """
    # Gold has been around $2000-2700/oz in recent years
    # For historical accuracy, you'd want to use a proper gold price API
    # For now, we'll use a reasonable approximation

    # You can replace this with actual API calls to:
    # - goldapi.io (free tier available)
    # - metals.live
    # - Or scrape from TCMB gold prices

    gold_usd_oz = 2650.0  # Approximate current price
    gold_try_gram = (gold_usd_oz * usd_try) / 31.1035  # Convert oz to gram

    return {
        'gold_usd_oz': round(gold_usd_oz, 2),
        'gold_try_gram': round(gold_try_gram, 2),
    }


# ============== TEFAS FUND PRICES ==============

def fetch_tefas_fund_prices(fund_code: str, start_date: str, end_date: str) -> List[Dict]:
    """
    Fetches fund prices from TEFAS API
    Returns list of {date, price_try} dicts
    """
    try:
        url = "https://www.tefas.gov.tr/api/DB/BindHistoryInfo"

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'application/json',
            'Origin': 'https://www.tefas.gov.tr',
            'Referer': 'https://www.tefas.gov.tr/FonAnaliz.aspx',
        }

        # Convert date format from YYYY-MM-DD to DD.MM.YYYY
        start_obj = datetime.strptime(start_date, '%Y-%m-%d')
        end_obj = datetime.strptime(end_date, '%Y-%m-%d')

        data = {
            'fontip': 'YAT',
            'fonkod': fund_code,
            'baession_date': start_obj.strftime('%d.%m.%Y'),
            'bession_date': end_obj.strftime('%d.%m.%Y'),
        }

        response = requests.post(url, headers=headers, data=data, timeout=30)

        if response.status_code != 200:
            print(f"  TEFAS returned status {response.status_code} for {fund_code}")
            return []

        result = response.json()

        if not result or 'data' not in result:
            return []

        prices = []
        for item in result['data']:
            try:
                # Parse date from DD.MM.YYYY format
                date_str = item.get('Tarih', '')
                if not date_str:
                    continue

                date_obj = datetime.strptime(date_str, '%d.%m.%Y')
                price = float(item.get('BirimPayDegeri', 0))

                if price > 0:
                    prices.append({
                        'fund_code': fund_code,
                        'date': date_obj.strftime('%Y-%m-%d'),
                        'price_try': price,
                    })
            except (ValueError, KeyError) as e:
                continue

        return prices

    except Exception as e:
        print(f"  Error fetching TEFAS data for {fund_code}: {e}")
        return []


# ============== DATABASE OPERATIONS ==============

def insert_exchange_rate(data: Dict):
    """Insert or update exchange rate"""
    try:
        supabase.table('exchange_rates').upsert(
            data,
            on_conflict='date'
        ).execute()
    except Exception as e:
        print(f"  DB error (exchange_rates): {e}")


def insert_fund_prices(prices: List[Dict]):
    """Bulk insert fund prices"""
    if not prices:
        return
    try:
        # Upsert in batches of 100
        for i in range(0, len(prices), 100):
            batch = prices[i:i+100]
            supabase.table('fund_prices').upsert(
                batch,
                on_conflict='fund_code,date'
            ).execute()
    except Exception as e:
        print(f"  DB error (fund_prices): {e}")


# ============== MAIN FUNCTIONS ==============

def fetch_test_data():
    """Fetch a few days of data to test the setup"""
    print("=== Testing scraper with recent data ===\n")

    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)

    # Test exchange rates
    print("1. Testing exchange rates...")
    test_date = (end_date - timedelta(days=1)).strftime('%Y-%m-%d')
    rates = fetch_exchange_rates_frankfurter(test_date)

    if rates:
        print(f"   ✓ USD/TRY: {rates['usd_try']}")
        print(f"   ✓ EUR/TRY: {rates['eur_try']}")

        gold = fetch_gold_price_approximate(test_date, rates['usd_try'])
        full_rate = {
            'date': test_date,
            **rates,
            **gold,
        }
        insert_exchange_rate(full_rate)
        print(f"   ✓ Saved to database")
    else:
        print("   ✗ Failed to fetch rates")

    # Test fund prices
    print("\n2. Testing fund prices from TEFAS...")
    test_fund = 'TYH'  # Yapı Kredi Altın Fonu

    prices = fetch_tefas_fund_prices(
        test_fund,
        start_date.strftime('%Y-%m-%d'),
        end_date.strftime('%Y-%m-%d')
    )

    if prices:
        print(f"   ✓ Found {len(prices)} price records for {test_fund}")
        for p in prices[:3]:
            print(f"     {p['date']}: {p['price_try']:.6f} TL")
        insert_fund_prices(prices)
        print(f"   ✓ Saved to database")
    else:
        print(f"   ✗ No prices found for {test_fund}")

    print("\n=== Test complete! Check your Supabase dashboard. ===")


def fetch_historical_data(years: int = 10):
    """Fetch historical data for the past N years"""
    print(f"=== Fetching {years} years of historical data ===\n")

    end_date = datetime.now()
    start_date = end_date - timedelta(days=years * 365)

    # Fetch exchange rates day by day
    print("1. Fetching exchange rates...")
    current_date = start_date
    rate_count = 0

    while current_date <= end_date:
        # Skip weekends
        if current_date.weekday() < 5:
            date_str = current_date.strftime('%Y-%m-%d')
            rates = fetch_exchange_rates_frankfurter(date_str)

            if rates:
                gold = fetch_gold_price_approximate(date_str, rates['usd_try'])
                full_rate = {
                    'date': date_str,
                    **rates,
                    **gold,
                }
                insert_exchange_rate(full_rate)
                rate_count += 1

                if rate_count % 100 == 0:
                    print(f"   Processed {rate_count} days...")

            # Rate limit: be nice to free APIs
            time.sleep(0.2)

        current_date += timedelta(days=1)

    print(f"   ✓ Saved {rate_count} exchange rate records")

    # Fetch fund prices
    print("\n2. Fetching fund prices from TEFAS...")

    for fund_code in FUND_CODES:
        print(f"   Fetching {fund_code}...")

        prices = fetch_tefas_fund_prices(
            fund_code,
            start_date.strftime('%Y-%m-%d'),
            end_date.strftime('%Y-%m-%d')
        )

        if prices:
            insert_fund_prices(prices)
            print(f"   ✓ {fund_code}: {len(prices)} records")
        else:
            print(f"   ✗ {fund_code}: no data")

        # Rate limit
        time.sleep(1)

    print("\n=== Historical data fetch complete! ===")


def fetch_daily_data():
    """Fetch today's data - run this daily via cron"""
    print(f"=== Daily update: {datetime.now().strftime('%Y-%m-%d')} ===\n")

    today = datetime.now()
    yesterday = today - timedelta(days=1)

    # Skip weekends
    if today.weekday() >= 5:
        print("Weekend - skipping")
        return

    date_str = yesterday.strftime('%Y-%m-%d')

    # Fetch exchange rates
    rates = fetch_exchange_rates_frankfurter(date_str)
    if rates:
        gold = fetch_gold_price_approximate(date_str, rates['usd_try'])
        full_rate = {
            'date': date_str,
            **rates,
            **gold,
        }
        insert_exchange_rate(full_rate)
        print(f"✓ Exchange rates for {date_str}")

    # Fetch fund prices
    for fund_code in FUND_CODES:
        prices = fetch_tefas_fund_prices(fund_code, date_str, date_str)
        if prices:
            insert_fund_prices(prices)
            print(f"✓ {fund_code}: {prices[0]['price_try']:.4f} TL")
        time.sleep(0.5)

    print("\n=== Daily update complete! ===")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Göstergeç Data Scraper')
    parser.add_argument('--test', action='store_true', help='Test with a few days of data')
    parser.add_argument('--historical', action='store_true', help='Fetch 10 years of data')
    parser.add_argument('--daily', action='store_true', help='Fetch today\'s data')
    parser.add_argument('--years', type=int, default=10, help='Years of historical data')

    args = parser.parse_args()

    if args.test:
        fetch_test_data()
    elif args.historical:
        fetch_historical_data(years=args.years)
    elif args.daily:
        fetch_daily_data()
    else:
        parser.print_help()
