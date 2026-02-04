/**
 * BES (Bireysel Emeklilik Sistemi) Fund Data
 * Individual Pension System providers and funds in Turkey
 */

export interface BESProvider {
  code: string
  name: string
  fullName: string
}

export interface BESFund {
  code: string
  name: string
  provider: string
  category: 'gold' | 'equity' | 'bond' | 'money' | 'mixed' | 'foreign' | 'participation'
  riskLevel: 1 | 2 | 3 | 4 | 5
}

export const BES_PROVIDERS: BESProvider[] = [
  { code: 'AHE', name: 'Anadolu Hayat', fullName: 'Anadolu Hayat Emeklilik A.Ş.' },
  { code: 'GRE', name: 'Garanti Emeklilik', fullName: 'Garanti BBVA Emeklilik ve Hayat A.Ş.' },
  { code: 'ALY', name: 'Allianz Yaşam', fullName: 'Allianz Yaşam ve Emeklilik A.Ş.' },
  { code: 'YKE', name: 'Yapı Kredi Emeklilik', fullName: 'Yapı Kredi Emeklilik A.Ş.' },
  { code: 'HHE', name: 'Halk Hayat', fullName: 'Halk Hayat ve Emeklilik A.Ş.' },
  { code: 'AEG', name: 'Aegon Emeklilik', fullName: 'Aegon Emeklilik ve Hayat A.Ş.' },
  { code: 'AXA', name: 'Axa Sigorta', fullName: 'Axa Hayat ve Emeklilik A.Ş.' },
  { code: 'MET', name: 'MetLife', fullName: 'MetLife Emeklilik ve Hayat A.Ş.' },
  { code: 'FBA', name: 'Fiba Emeklilik', fullName: 'Fiba Emeklilik ve Hayat A.Ş.' },
  { code: 'ZRE', name: 'Ziraat Hayat', fullName: 'Ziraat Hayat ve Emeklilik A.Ş.' },
]

export const BES_FUNDS: BESFund[] = [
  // Anadolu Hayat Emeklilik
  { code: 'AHE001', name: 'Altın Emeklilik Fonu', provider: 'AHE', category: 'gold', riskLevel: 3 },
  { code: 'AHE002', name: 'Hisse Senedi Emeklilik Fonu', provider: 'AHE', category: 'equity', riskLevel: 5 },
  { code: 'AHE003', name: 'Kamu Borçlanma Araçları Fonu', provider: 'AHE', category: 'bond', riskLevel: 2 },
  { code: 'AHE004', name: 'Para Piyasası Emeklilik Fonu', provider: 'AHE', category: 'money', riskLevel: 1 },
  { code: 'AHE005', name: 'Dengeli Emeklilik Fonu', provider: 'AHE', category: 'mixed', riskLevel: 3 },
  { code: 'AHE006', name: 'Döviz Emeklilik Fonu', provider: 'AHE', category: 'foreign', riskLevel: 3 },

  // Garanti Emeklilik
  { code: 'GRE001', name: 'Altın Emeklilik Fonu', provider: 'GRE', category: 'gold', riskLevel: 3 },
  { code: 'GRE002', name: 'Hisse Senedi Emeklilik Fonu', provider: 'GRE', category: 'equity', riskLevel: 5 },
  { code: 'GRE003', name: 'Tahvil Bono Emeklilik Fonu', provider: 'GRE', category: 'bond', riskLevel: 2 },
  { code: 'GRE004', name: 'Likit Emeklilik Fonu', provider: 'GRE', category: 'money', riskLevel: 1 },
  { code: 'GRE005', name: 'Esnek Emeklilik Fonu', provider: 'GRE', category: 'mixed', riskLevel: 4 },
  { code: 'GRE006', name: 'Yabancı Para Emeklilik Fonu', provider: 'GRE', category: 'foreign', riskLevel: 3 },

  // Allianz Yaşam
  { code: 'ALY001', name: 'Altın Katılım Fonu', provider: 'ALY', category: 'gold', riskLevel: 3 },
  { code: 'ALY002', name: 'Hisse Emeklilik Fonu', provider: 'ALY', category: 'equity', riskLevel: 5 },
  { code: 'ALY003', name: 'Sabit Getirili Fon', provider: 'ALY', category: 'bond', riskLevel: 2 },
  { code: 'ALY004', name: 'Likidite Emeklilik Fonu', provider: 'ALY', category: 'money', riskLevel: 1 },
  { code: 'ALY005', name: 'Dengeli Değişken Fon', provider: 'ALY', category: 'mixed', riskLevel: 3 },

  // Yapı Kredi Emeklilik
  { code: 'YKE001', name: 'Altın Emeklilik Fonu', provider: 'YKE', category: 'gold', riskLevel: 3 },
  { code: 'YKE002', name: 'Hisse Senedi Fonu', provider: 'YKE', category: 'equity', riskLevel: 5 },
  { code: 'YKE003', name: 'Kamu Tahvil Fonu', provider: 'YKE', category: 'bond', riskLevel: 2 },
  { code: 'YKE004', name: 'Para Piyasası Fonu', provider: 'YKE', category: 'money', riskLevel: 1 },
  { code: 'YKE005', name: 'Katkı Emeklilik Fonu', provider: 'YKE', category: 'mixed', riskLevel: 3 },

  // Halk Hayat
  { code: 'HHE001', name: 'Altın Emeklilik Fonu', provider: 'HHE', category: 'gold', riskLevel: 3 },
  { code: 'HHE002', name: 'Hisse Emeklilik Fonu', provider: 'HHE', category: 'equity', riskLevel: 5 },
  { code: 'HHE003', name: 'Devlet Tahvili Fonu', provider: 'HHE', category: 'bond', riskLevel: 2 },
  { code: 'HHE004', name: 'Karma Emeklilik Fonu', provider: 'HHE', category: 'mixed', riskLevel: 3 },

  // Aegon Emeklilik
  { code: 'AEG001', name: 'Altın Fonu', provider: 'AEG', category: 'gold', riskLevel: 3 },
  { code: 'AEG002', name: 'Hisse Fonu', provider: 'AEG', category: 'equity', riskLevel: 5 },
  { code: 'AEG003', name: 'Dengeli Emeklilik Fonu', provider: 'AEG', category: 'mixed', riskLevel: 3 },

  // Axa Sigorta
  { code: 'AXA001', name: 'Altın Emeklilik Fonu', provider: 'AXA', category: 'gold', riskLevel: 3 },
  { code: 'AXA002', name: 'Hisse Emeklilik Fonu', provider: 'AXA', category: 'equity', riskLevel: 5 },
  { code: 'AXA003', name: 'Döviz Cinsinden Fon', provider: 'AXA', category: 'foreign', riskLevel: 3 },

  // MetLife
  { code: 'MET001', name: 'Altın Emeklilik Fonu', provider: 'MET', category: 'gold', riskLevel: 3 },
  { code: 'MET002', name: 'Esnek Emeklilik Fonu', provider: 'MET', category: 'mixed', riskLevel: 4 },

  // Fiba Emeklilik
  { code: 'FBA001', name: 'Altın Fonu', provider: 'FBA', category: 'gold', riskLevel: 3 },
  { code: 'FBA002', name: 'Karma Fon', provider: 'FBA', category: 'mixed', riskLevel: 3 },

  // Ziraat Hayat
  { code: 'ZRE001', name: 'Altın Emeklilik Fonu', provider: 'ZRE', category: 'gold', riskLevel: 3 },
  { code: 'ZRE002', name: 'Kamu Borç. Araçları Fonu', provider: 'ZRE', category: 'bond', riskLevel: 2 },
  { code: 'ZRE003', name: 'Katılım Emeklilik Fonu', provider: 'ZRE', category: 'participation', riskLevel: 3 },
]

export const BES_CATEGORIES = {
  gold: { name: 'Altın Fonları', nameEn: 'Gold Funds' },
  equity: { name: 'Hisse Senedi Fonları', nameEn: 'Equity Funds' },
  bond: { name: 'Tahvil/Bono Fonları', nameEn: 'Bond Funds' },
  money: { name: 'Para Piyasası Fonları', nameEn: 'Money Market Funds' },
  mixed: { name: 'Karma/Dengeli Fonlar', nameEn: 'Mixed/Balanced Funds' },
  foreign: { name: 'Döviz/Yabancı Fonlar', nameEn: 'Foreign Currency Funds' },
  participation: { name: 'Katılım Fonları', nameEn: 'Participation Funds' },
} as const
