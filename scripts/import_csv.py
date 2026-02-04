"""
Import fund prices from CSV files downloaded from TEFAS

How to get the data:
1. Go to https://www.tefas.gov.tr/FonAnaliz.aspx
2. Select a fund (e.g., TYH)
3. Set date range (up to 10 years)
4. Click "Excel'e Aktar" (Export to Excel)
5. Save the file and run this script

Usage:
  python import_csv.py <fund_code> <csv_file>
  python import_csv.py TYH ./data/TYH_history.csv
"""

import os
import sys
import csv
from datetime import datetime
from typing import List, Dict

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def parse_tefas_csv(filepath: str, fund_code: str) -> List[Dict]:
    """
    Parse TEFAS Excel/CSV export
    Expected columns: Tarih, Fon Kodu, Fon Adı, Birim Pay Değeri, ...
    """
    prices = []

    with open(filepath, 'r', encoding='utf-8-sig') as f:
        # Try to detect delimiter
        sample = f.read(1024)
        f.seek(0)

        delimiter = ';' if ';' in sample else ','
        reader = csv.DictReader(f, delimiter=delimiter)

        for row in reader:
            try:
                # TEFAS uses Turkish column names
                date_str = row.get('Tarih', row.get('Date', ''))
                price_str = row.get('Birim Pay Değeri', row.get('BirimPayDegeri', row.get('Price', '')))

                if not date_str or not price_str:
                    continue

                # Parse date (DD.MM.YYYY or YYYY-MM-DD)
                try:
                    date_obj = datetime.strptime(date_str.strip(), '%d.%m.%Y')
                except ValueError:
                    date_obj = datetime.strptime(date_str.strip(), '%Y-%m-%d')

                # Parse price (handle Turkish decimal format: 1.234,56)
                price_str = price_str.strip().replace('.', '').replace(',', '.')
                price = float(price_str)

                if price > 0:
                    prices.append({
                        'fund_code': fund_code,
                        'date': date_obj.strftime('%Y-%m-%d'),
                        'price_try': price,
                    })

            except (ValueError, KeyError) as e:
                continue

    return prices


def import_to_database(prices: List[Dict]):
    """Import prices to Supabase"""
    if not prices:
        print("No prices to import")
        return

    print(f"Importing {len(prices)} records...")

    # Upsert in batches
    batch_size = 100
    for i in range(0, len(prices), batch_size):
        batch = prices[i:i+batch_size]
        try:
            supabase.table('fund_prices').upsert(
                batch,
                on_conflict='fund_code,date'
            ).execute()
            print(f"  Batch {i//batch_size + 1}: {len(batch)} records")
        except Exception as e:
            print(f"  Error: {e}")

    print("Import complete!")


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        print("\nExample:")
        print("  python import_csv.py TYH ./data/TYH_history.csv")
        sys.exit(1)

    fund_code = sys.argv[1].upper()
    filepath = sys.argv[2]

    if not os.path.exists(filepath):
        print(f"Error: File not found: {filepath}")
        sys.exit(1)

    print(f"Parsing {filepath} for fund {fund_code}...")
    prices = parse_tefas_csv(filepath, fund_code)

    if prices:
        print(f"Found {len(prices)} price records")
        print(f"Date range: {prices[-1]['date']} to {prices[0]['date']}")
        print(f"Sample: {prices[0]}")

        confirm = input("\nImport to database? (y/n): ")
        if confirm.lower() == 'y':
            import_to_database(prices)
    else:
        print("No valid prices found in file")


if __name__ == '__main__':
    main()
