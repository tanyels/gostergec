"""
Seed the funds table with initial fund data
Run once before the main scraper
"""

import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

FUNDS = [
    {'code': 'TYH', 'name': 'Yapı Kredi Portföy Altın Fonu', 'category': 'Altın', 'manager': 'Yapı Kredi Portföy'},
    {'code': 'GAL', 'name': 'Garanti Portföy Altın Fonu', 'category': 'Altın', 'manager': 'Garanti Portföy'},
    {'code': 'IPB', 'name': 'İş Portföy BIST Banka Endeksi Fonu', 'category': 'Hisse', 'manager': 'İş Portföy'},
    {'code': 'TTE', 'name': 'TEB Portföy Hisse Senedi Fonu', 'category': 'Hisse', 'manager': 'TEB Portföy'},
    {'code': 'MAC', 'name': 'Ak Portföy Amerika Yabancı Hisse Fonu', 'category': 'Yabancı Hisse', 'manager': 'Ak Portföy'},
    {'code': 'AFA', 'name': 'Ak Portföy BIST 30 Fonu', 'category': 'Hisse', 'manager': 'Ak Portföy'},
    {'code': 'IST', 'name': 'İş Portföy Devlet Tahvili Fonu', 'category': 'Tahvil', 'manager': 'İş Portföy'},
    {'code': 'AK1', 'name': 'Ak Portföy Para Piyasası Fonu', 'category': 'Para Piyasası', 'manager': 'Ak Portföy'},
    {'code': 'YKP', 'name': 'Yapı Kredi Para Piyasası Fonu', 'category': 'Para Piyasası', 'manager': 'Yapı Kredi Portföy'},
    {'code': 'GAE', 'name': 'Garanti Portföy Euro Fonu', 'category': 'Döviz', 'manager': 'Garanti Portföy'},
]

def seed_funds():
    print("Seeding funds table...")
    for fund in FUNDS:
        try:
            supabase.table('funds').upsert(fund, on_conflict='code').execute()
            print(f"  ✓ {fund['code']}: {fund['name']}")
        except Exception as e:
            print(f"  ✗ {fund['code']}: {e}")
    print("Done!")

if __name__ == '__main__':
    seed_funds()
