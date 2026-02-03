"""
Göstergeç Data Scraper
Run this script to populate and update the database with fund prices and exchange rates.

Usage:
  python scraper.py --historical    # Fetch 10 years of historical data
  python scraper.py --daily         # Fetch today's data (run via cron)
  python scraper.py --live          # Update live rates (run every minute)
"""

import os
import sys
import argparse
from datetime import datetime, timedelta
from typing import Optional
import requests
from supabase import create_client, Client

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')  # Use service key for writes

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# --- TCMB (Turkish Central Bank) ---
def fetch_tcmb_rates(date: str) -> Optional[dict]:
    """
    Fetches USD/TRY and EUR/TRY from TCMB EVDS API
    Date format: YYYY-MM-DD
    """
    # TCMB EVDS API (free, requires registration for key)
    # https://evds2.tcmb.gov.tr/

    # For now, using frankfurter.app as fallback (free, no key)
    try:
        url = f"https://api.frankfurter.app/{date}?from=USD&to=TRY,EUR"
        response = requests.get(url, timeout=10)
        data = response.json()

        return {
            'date': date,
            'usd_try': data['rates']['TRY'],
            'eur_try': data['rates']['TRY'] / data['rates']['EUR'],
        }
    except Exception as e:
        print(f"Error fetching rates for {date}: {e}")
        return None


# --- TEFAS (Turkish Fund Platform) ---
def fetch_tefas_fund_price(fund_code: str, date: str) -> Optional[dict]:
    """
    Fetches fund price from TEFAS
    TEFAS API endpoint: https://www.tefas.gov.tr/api/DB/BindHistoryInfo
    """
    try:
        # TEFAS requires specific headers and session handling
        url = "https://www.tefas.gov.tr/api/DB/BindHistoryInfo"

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0',
        }

        # Convert date format
        date_obj = datetime.strptime(date, '%Y-%m-%d')
        formatted_date = date_obj.strftime('%d.%m.%Y')

        data = {
            'fontip': 'YAT',
            'fonkod': fund_code,
            'baession_date': formatted_date,
            'bession_date': formatted_date,
        }

        response = requests.post(url, headers=headers, data=data, timeout=10)
        result = response.json()

        if result and 'data' in result and len(result['data']) > 0:
            return {
                'fund_code': fund_code,
                'date': date,
                'price_try': float(result['data'][0]['BirimPayDegworri']),
            }
        return None

    except Exception as e:
        print(f"Error fetching {fund_code} for {date}: {e}")
        return None


# --- Gold Price ---
def fetch_gold_price(date: str) -> Optional[dict]:
    """
    Fetches gold price (XAU/USD and calculated TRY/gram)
    """
    try:
        # Using a free gold API or calculated from historical data
        # For production, consider: goldapi.io, metals.live, or TCMB gold prices

        # Placeholder - implement with actual API
        return {
            'gold_usd_oz': 2650.0,
            'gold_try_gram': 2850.0,
        }
    except Exception as e:
        print(f"Error fetching gold for {date}: {e}")
        return None


# --- Database Operations ---
def insert_exchange_rate(data: dict):
    """Insert or update exchange rate"""
    try:
        supabase.table('exchange_rates').upsert(data).execute()
        print(f"Inserted rate for {data['date']}")
    except Exception as e:
        print(f"Error inserting rate: {e}")


def insert_fund_price(data: dict):
    """Insert or update fund price"""
    try:
        supabase.table('fund_prices').upsert(
            data,
            on_conflict='fund_code,date'
        ).execute()
        print(f"Inserted {data['fund_code']} for {data['date']}")
    except Exception as e:
        print(f"Error inserting fund price: {e}")


def update_live_rates():
    """Update real-time rates cache"""
    try:
        rates = fetch_tcmb_rates(datetime.now().strftime('%Y-%m-%d'))
        gold = fetch_gold_price(datetime.now().strftime('%Y-%m-%d'))

        if rates and gold:
            supabase.table('live_rates').upsert({
                'id': 1,
                'usd_try': rates['usd_try'],
                'eur_try': rates['eur_try'],
                'gold_try_gram': gold['gold_try_gram'],
                'gold_usd_oz': gold['gold_usd_oz'],
                'updated_at': datetime.now().isoformat(),
            }).execute()
            print(f"Updated live rates at {datetime.now()}")
    except Exception as e:
        print(f"Error updating live rates: {e}")


# --- Main Functions ---
def fetch_historical_data(years: int = 10):
    """Fetch historical data for the past N years"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=years * 365)

    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime('%Y-%m-%d')

        # Skip weekends
        if current_date.weekday() < 5:
            # Fetch and store exchange rates
            rates = fetch_tcmb_rates(date_str)
            gold = fetch_gold_price(date_str)

            if rates and gold:
                insert_exchange_rate({
                    'date': date_str,
                    **rates,
                    **gold,
                })

            # Fetch fund prices (add your fund codes here)
            fund_codes = ['TYH', 'GAL', 'IPB', 'TTE', 'MAC', 'AFA', 'IST', 'AK1', 'YKP', 'GAE']
            for code in fund_codes:
                price = fetch_tefas_fund_price(code, date_str)
                if price:
                    insert_fund_price(price)

        current_date += timedelta(days=1)

    print("Historical data fetch complete!")


def fetch_daily_data():
    """Fetch today's data"""
    today = datetime.now().strftime('%Y-%m-%d')

    # Fetch exchange rates
    rates = fetch_tcmb_rates(today)
    gold = fetch_gold_price(today)

    if rates and gold:
        insert_exchange_rate({
            'date': today,
            **rates,
            **gold,
        })

    # Fetch fund prices
    fund_codes = ['TYH', 'GAL', 'IPB', 'TTE', 'MAC', 'AFA', 'IST', 'AK1', 'YKP', 'GAE']
    for code in fund_codes:
        price = fetch_tefas_fund_price(code, today)
        if price:
            insert_fund_price(price)

    print(f"Daily data fetch complete for {today}!")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Göstergeç Data Scraper')
    parser.add_argument('--historical', action='store_true', help='Fetch 10 years of data')
    parser.add_argument('--daily', action='store_true', help='Fetch today\'s data')
    parser.add_argument('--live', action='store_true', help='Update live rates')

    args = parser.parse_args()

    if args.historical:
        fetch_historical_data(years=10)
    elif args.daily:
        fetch_daily_data()
    elif args.live:
        update_live_rates()
    else:
        parser.print_help()
