"""
Automated TEFAS scraper using Selenium
Downloads historical fund prices by automating the TEFAS website

Usage:
  python scrape_tefas.py --all          # Scrape all funds
  python scrape_tefas.py --fund TYH     # Scrape specific fund
  python scrape_tefas.py --test         # Test with one fund
"""

import os
import sys
import time
import argparse
import glob
from datetime import datetime, timedelta

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fund codes to scrape
FUND_CODES = ['TYH', 'GAL', 'IPB', 'TTE', 'MAC', 'AFA', 'IST', 'AK1', 'YKP', 'GAE']

# Download directory
DOWNLOAD_DIR = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def setup_driver():
    """Setup Chrome driver with download preferences"""
    chrome_options = Options()

    # Set download directory
    prefs = {
        'download.default_directory': DOWNLOAD_DIR,
        'download.prompt_for_download': False,
        'download.directory_upgrade': True,
    }
    chrome_options.add_experimental_option('prefs', prefs)

    # Run in non-headless mode so we can see what's happening
    # chrome_options.add_argument('--headless')  # Uncomment for headless mode

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.implicitly_wait(10)

    return driver


def scrape_fund(driver, fund_code: str, start_date: str = '01.01.2015'):
    """Scrape a single fund from TEFAS"""
    print(f"\n{'='*50}")
    print(f"Scraping {fund_code}...")
    print(f"{'='*50}")

    try:
        # Navigate to TEFAS
        driver.get('https://www.tefas.gov.tr/FonAnaliz.aspx')
        time.sleep(3)

        # Wait for page to load
        wait = WebDriverWait(driver, 20)

        # Find and click the fund search input
        search_input = wait.until(
            EC.presence_of_element_located((By.ID, 'MainContent_TextFonKodu'))
        )
        search_input.clear()
        search_input.send_keys(fund_code)
        time.sleep(1)

        # Wait for autocomplete and select the fund
        autocomplete = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '.ui-menu-item'))
        )
        autocomplete.click()
        time.sleep(2)

        # Set start date
        start_input = driver.find_element(By.ID, 'MainContent_TextBaslamamaTarih')
        start_input.clear()
        start_input.send_keys(start_date)

        # Set end date (today)
        end_date = datetime.now().strftime('%d.%m.%Y')
        end_input = driver.find_element(By.ID, 'MainContent_TextBitisTarih')
        end_input.clear()
        end_input.send_keys(end_date)

        # Click search/filter button
        search_btn = driver.find_element(By.ID, 'MainContent_ButtonSearchDates')
        search_btn.click()
        time.sleep(3)

        # Wait for data to load
        wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '#MainContent_GridViewFon'))
        )
        time.sleep(2)

        # Click Excel export button
        export_btn = driver.find_element(By.ID, 'MainContent_LinkButtonExcel')
        export_btn.click()

        print(f"  Export started for {fund_code}")

        # Wait for download to complete
        time.sleep(5)

        # Find the downloaded file
        downloaded_files = glob.glob(os.path.join(DOWNLOAD_DIR, '*.xls*'))
        if downloaded_files:
            latest_file = max(downloaded_files, key=os.path.getctime)
            new_name = os.path.join(DOWNLOAD_DIR, f'{fund_code}.xlsx')

            # Rename file
            if os.path.exists(new_name):
                os.remove(new_name)
            os.rename(latest_file, new_name)

            print(f"  ✓ Downloaded: {new_name}")
            return new_name
        else:
            print(f"  ✗ No file downloaded for {fund_code}")
            return None

    except Exception as e:
        print(f"  ✗ Error scraping {fund_code}: {e}")
        return None


def parse_and_import_excel(filepath: str, fund_code: str):
    """Parse Excel file and import to database"""
    try:
        import pandas as pd

        # Read Excel file
        df = pd.read_excel(filepath)

        # Find the relevant columns (TEFAS uses Turkish headers)
        # Common column names: Tarih, Birim Pay Değeri, Fon Toplam Değer

        date_col = None
        price_col = None

        for col in df.columns:
            col_lower = str(col).lower()
            if 'tarih' in col_lower or 'date' in col_lower:
                date_col = col
            if 'birim' in col_lower and 'pay' in col_lower:
                price_col = col

        if not date_col or not price_col:
            print(f"  Could not find required columns in {filepath}")
            print(f"  Available columns: {list(df.columns)}")
            return 0

        prices = []
        for _, row in df.iterrows():
            try:
                date_val = row[date_col]
                price_val = row[price_col]

                # Parse date
                if isinstance(date_val, str):
                    date_obj = datetime.strptime(date_val, '%d.%m.%Y')
                else:
                    date_obj = pd.to_datetime(date_val)

                # Parse price
                if isinstance(price_val, str):
                    price = float(price_val.replace('.', '').replace(',', '.'))
                else:
                    price = float(price_val)

                if price > 0:
                    prices.append({
                        'fund_code': fund_code,
                        'date': date_obj.strftime('%Y-%m-%d'),
                        'price_try': price,
                    })
            except Exception:
                continue

        # Import to database
        if prices:
            batch_size = 100
            for i in range(0, len(prices), batch_size):
                batch = prices[i:i+batch_size]
                supabase.table('fund_prices').upsert(
                    batch,
                    on_conflict='fund_code,date'
                ).execute()

            print(f"  ✓ Imported {len(prices)} prices for {fund_code}")
            return len(prices)

        return 0

    except Exception as e:
        print(f"  Error importing {filepath}: {e}")
        return 0


def main():
    parser = argparse.ArgumentParser(description='TEFAS Selenium Scraper')
    parser.add_argument('--all', action='store_true', help='Scrape all funds')
    parser.add_argument('--fund', type=str, help='Scrape specific fund code')
    parser.add_argument('--test', action='store_true', help='Test with one fund')
    parser.add_argument('--import-only', action='store_true', help='Import existing Excel files')

    args = parser.parse_args()

    if args.import_only:
        # Just import existing Excel files
        print("Importing existing Excel files...")
        for fund_code in FUND_CODES:
            filepath = os.path.join(DOWNLOAD_DIR, f'{fund_code}.xlsx')
            if os.path.exists(filepath):
                parse_and_import_excel(filepath, fund_code)
        return

    # Determine which funds to scrape
    if args.fund:
        funds = [args.fund.upper()]
    elif args.test:
        funds = ['TYH']  # Test with gold fund
    elif args.all:
        funds = FUND_CODES
    else:
        parser.print_help()
        return

    print(f"Will scrape {len(funds)} funds: {', '.join(funds)}")
    print(f"Download directory: {DOWNLOAD_DIR}")
    print("\nA Chrome browser window will open. Don't close it!\n")

    # Install pandas for Excel parsing
    try:
        import pandas
    except ImportError:
        print("Installing pandas for Excel support...")
        os.system(f"{sys.executable} -m pip install -q pandas openpyxl")

    driver = setup_driver()

    try:
        total_imported = 0

        for fund_code in funds:
            filepath = scrape_fund(driver, fund_code)

            if filepath:
                count = parse_and_import_excel(filepath, fund_code)
                total_imported += count

            # Wait between funds to avoid rate limiting
            time.sleep(2)

        print(f"\n{'='*50}")
        print(f"COMPLETE: Imported {total_imported} total price records")
        print(f"{'='*50}")

    finally:
        driver.quit()


if __name__ == '__main__':
    main()
