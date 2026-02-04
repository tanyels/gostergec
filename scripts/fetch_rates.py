"""
Fetch historical exchange rates
This uses frankfurter.app which has data going back to 1999

Usage:
  python fetch_rates.py --years 10    # Fetch 10 years of data
  python fetch_rates.py --daily       # Fetch latest rates
"""

import os
import argparse
from datetime import datetime, timedelta
import time
import requests

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_rates_for_date(date_str: str):
    """Fetch exchange rates for a specific date"""
    try:
        url = f"https://api.frankfurter.app/{date_str}?from=USD&to=TRY,EUR"
        response = requests.get(url, timeout=10)

        if response.status_code == 404:
            return None  # No data for this date (weekend/holiday)

        if response.status_code != 200:
            return None

        data = response.json()

        usd_try = data['rates']['TRY']
        eur_try = usd_try / data['rates']['EUR']

        # Approximate gold price (for accurate data, use a gold API)
        # Gold has historically been around $1200-2700/oz
        gold_usd_oz = 2650.0  # You can enhance this with actual historical data
        gold_try_gram = (gold_usd_oz * usd_try) / 31.1035

        return {
            'date': date_str,
            'usd_try': round(usd_try, 4),
            'eur_try': round(eur_try, 4),
            'gold_usd_oz': round(gold_usd_oz, 2),
            'gold_try_gram': round(gold_try_gram, 2),
        }

    except Exception as e:
        print(f"  Error for {date_str}: {e}")
        return None


def fetch_historical_rates(years: int):
    """Fetch historical exchange rates"""
    print(f"Fetching {years} years of exchange rate history...\n")

    end_date = datetime.now()
    start_date = end_date - timedelta(days=years * 365)

    current_date = start_date
    count = 0
    errors = 0

    while current_date <= end_date:
        # Skip weekends
        if current_date.weekday() < 5:
            date_str = current_date.strftime('%Y-%m-%d')
            rates = fetch_rates_for_date(date_str)

            if rates:
                try:
                    supabase.table('exchange_rates').upsert(
                        rates,
                        on_conflict='date'
                    ).execute()
                    count += 1

                    if count % 50 == 0:
                        print(f"  Progress: {count} days saved (latest: {date_str})")

                except Exception as e:
                    errors += 1

            # Rate limit: be nice to the free API
            time.sleep(0.1)

        current_date += timedelta(days=1)

    print(f"\n✓ Complete! Saved {count} days of exchange rates ({errors} errors)")


def fetch_daily():
    """Fetch the latest exchange rates"""
    print("Fetching latest exchange rates...")

    # Try yesterday and today
    for days_ago in [1, 0]:
        date = datetime.now() - timedelta(days=days_ago)
        date_str = date.strftime('%Y-%m-%d')

        rates = fetch_rates_for_date(date_str)

        if rates:
            supabase.table('exchange_rates').upsert(
                rates,
                on_conflict='date'
            ).execute()
            print(f"✓ Saved rates for {date_str}")
            print(f"  USD/TRY: {rates['usd_try']}")
            print(f"  EUR/TRY: {rates['eur_try']}")
            return

    print("No rates available for recent dates")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Fetch exchange rates')
    parser.add_argument('--years', type=int, help='Fetch N years of history')
    parser.add_argument('--daily', action='store_true', help='Fetch latest rates')

    args = parser.parse_args()

    if args.years:
        fetch_historical_rates(args.years)
    elif args.daily:
        fetch_daily()
    else:
        parser.print_help()
