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


def fetch_live_gold_price() -> Optional[float]:
    """Fetch live gold price (USD/oz) from gold-api.com"""
    try:
        response = requests.get('https://api.gold-api.com/price/XAU', timeout=10)
        if response.status_code == 200:
            data = response.json()
            price = data.get('price')
            if price and price > 0:
                return float(price)
    except Exception as e:
        print(f"  Warning: gold-api.com failed: {e}")
    return None


def fetch_gold_price(date: str, usd_try: float) -> Dict:
    """
    Returns gold price for a given date.
    For recent dates (2025+): tries live API first, falls back to historical table.
    For older dates: uses historical monthly averages (XAU/USD).
    """
    # Monthly average gold prices (USD/oz) — source: World Gold Council / Kitco
    GOLD_MONTHLY = {
        (2016,1):1097,(2016,2):1201,(2016,3):1246,(2016,4):1242,(2016,5):1259,(2016,6):1278,
        (2016,7):1337,(2016,8):1341,(2016,9):1326,(2016,10):1267,(2016,11):1237,(2016,12):1151,
        (2017,1):1192,(2017,2):1234,(2017,3):1231,(2017,4):1267,(2017,5):1245,(2017,6):1261,
        (2017,7):1241,(2017,8):1287,(2017,9):1314,(2017,10):1280,(2017,11):1284,(2017,12):1265,
        (2018,1):1332,(2018,2):1330,(2018,3):1324,(2018,4):1336,(2018,5):1304,(2018,6):1281,
        (2018,7):1238,(2018,8):1201,(2018,9):1198,(2018,10):1215,(2018,11):1222,(2018,12):1255,
        (2019,1):1291,(2019,2):1322,(2019,3):1302,(2019,4):1287,(2019,5):1284,(2019,6):1355,
        (2019,7):1413,(2019,8):1508,(2019,9):1507,(2019,10):1492,(2019,11):1468,(2019,12):1480,
        (2020,1):1562,(2020,2):1597,(2020,3):1591,(2020,4):1714,(2020,5):1731,(2020,6):1747,
        (2020,7):1873,(2020,8):1971,(2020,9):1920,(2020,10):1901,(2020,11):1870,(2020,12):1878,
        (2021,1):1863,(2021,2):1805,(2021,3):1720,(2021,4):1770,(2021,5):1853,(2021,6):1886,
        (2021,7):1806,(2021,8):1783,(2021,9):1764,(2021,10):1784,(2021,11):1805,(2021,12):1790,
        (2022,1):1824,(2022,2):1877,(2022,3):1942,(2022,4):1936,(2022,5):1855,(2022,6):1837,
        (2022,7):1746,(2022,8):1762,(2022,9):1681,(2022,10):1665,(2022,11):1743,(2022,12):1797,
        (2023,1):1910,(2023,2):1866,(2023,3):1948,(2023,4):2003,(2023,5):1978,(2023,6):1943,
        (2023,7):1962,(2023,8):1928,(2023,9):1921,(2023,10):1985,(2023,11):1992,(2023,12):2045,
        (2024,1):2043,(2024,2):2024,(2024,3):2164,(2024,4):2327,(2024,5):2341,(2024,6):2334,
        (2024,7):2399,(2024,8):2473,(2024,9):2585,(2024,10):2658,(2024,11):2672,(2024,12):2634,
        (2025,1):2770,(2025,2):2850,
    }

    date_obj = datetime.strptime(date, '%Y-%m-%d')
    y, m = date_obj.year, date_obj.month
    key = (y, m)

    gold_usd_oz = None

    # For recent dates, try live API first
    if (y, m) >= (2025, 2):
        gold_usd_oz = fetch_live_gold_price()
        if gold_usd_oz:
            print(f"  Gold price from API: ${gold_usd_oz:.2f}/oz")

    # Fall back to historical table
    if gold_usd_oz is None:
        if key in GOLD_MONTHLY:
            gold_usd_oz = GOLD_MONTHLY[key]
        else:
            all_keys = sorted(GOLD_MONTHLY.keys())
            if (y, m) <= all_keys[0]:
                gold_usd_oz = GOLD_MONTHLY[all_keys[0]]
            elif (y, m) >= all_keys[-1]:
                gold_usd_oz = GOLD_MONTHLY[all_keys[-1]]
            else:
                gold_usd_oz = 2650

    gold_try_gram = (gold_usd_oz * usd_try) / 31.1035  # oz to gram

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

        gold = fetch_gold_price(test_date, rates['usd_try'])
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
                gold = fetch_gold_price(date_str, rates['usd_try'])
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
        gold = fetch_gold_price(date_str, rates['usd_try'])
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
