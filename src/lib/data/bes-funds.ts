/**
 * BES (Bireysel Emeklilik Sistemi) Fund Data
 * Individual Pension System providers and funds in Turkey
 */

export type BESFundType = 'regular' | 'devlet_katkisi'

export type BESCategory = 'gold' | 'equity' | 'bond' | 'money' | 'mixed' | 'foreign' | 'participation' | 'standart'

export interface BESProvider {
  code: string
  name: string
  fullName: string
}

export interface BESFund {
  code: string
  name: string
  provider: string
  category: BESCategory
  riskLevel: 1 | 2 | 3 | 4 | 5
  fund_type: BESFundType
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
  // ===== REGULAR FUNDS (Ana Fon - Kişisel Katkı) =====

  // Anadolu Hayat Emeklilik
  { code: 'AHE001', name: 'Altın Emeklilik Fonu', provider: 'AHE', category: 'gold', riskLevel: 3, fund_type: 'regular' },
  { code: 'AHE002', name: 'Hisse Senedi Emeklilik Fonu', provider: 'AHE', category: 'equity', riskLevel: 5, fund_type: 'regular' },
  { code: 'AHE003', name: 'Kamu Borçlanma Araçları Fonu', provider: 'AHE', category: 'bond', riskLevel: 2, fund_type: 'regular' },
  { code: 'AHE004', name: 'Para Piyasası Emeklilik Fonu', provider: 'AHE', category: 'money', riskLevel: 1, fund_type: 'regular' },
  { code: 'AHE005', name: 'Dengeli Emeklilik Fonu', provider: 'AHE', category: 'mixed', riskLevel: 3, fund_type: 'regular' },
  { code: 'AHE006', name: 'Döviz Emeklilik Fonu', provider: 'AHE', category: 'foreign', riskLevel: 3, fund_type: 'regular' },

  // Garanti Emeklilik
  { code: 'GRE001', name: 'Altın Emeklilik Fonu', provider: 'GRE', category: 'gold', riskLevel: 3, fund_type: 'regular' },
  { code: 'GRE002', name: 'Hisse Senedi Emeklilik Fonu', provider: 'GRE', category: 'equity', riskLevel: 5, fund_type: 'regular' },
  { code: 'GRE003', name: 'Tahvil Bono Emeklilik Fonu', provider: 'GRE', category: 'bond', riskLevel: 2, fund_type: 'regular' },
  { code: 'GRE004', name: 'Likit Emeklilik Fonu', provider: 'GRE', category: 'money', riskLevel: 1, fund_type: 'regular' },
  { code: 'GRE005', name: 'Esnek Emeklilik Fonu', provider: 'GRE', category: 'mixed', riskLevel: 4, fund_type: 'regular' },
  { code: 'GRE006', name: 'Yabancı Para Emeklilik Fonu', provider: 'GRE', category: 'foreign', riskLevel: 3, fund_type: 'regular' },

  // Allianz Yaşam
  { code: 'ALY001', name: 'Altın Katılım Fonu', provider: 'ALY', category: 'gold', riskLevel: 3, fund_type: 'regular' },
  { code: 'ALY002', name: 'Hisse Emeklilik Fonu', provider: 'ALY', category: 'equity', riskLevel: 5, fund_type: 'regular' },
  { code: 'ALY003', name: 'Sabit Getirili Fon', provider: 'ALY', category: 'bond', riskLevel: 2, fund_type: 'regular' },
  { code: 'ALY004', name: 'Likidite Emeklilik Fonu', provider: 'ALY', category: 'money', riskLevel: 1, fund_type: 'regular' },
  { code: 'ALY005', name: 'Dengeli Değişken Fon', provider: 'ALY', category: 'mixed', riskLevel: 3, fund_type: 'regular' },

  // Yapı Kredi Emeklilik
  { code: 'YKE001', name: 'Altın Emeklilik Fonu', provider: 'YKE', category: 'gold', riskLevel: 3, fund_type: 'regular' },
  { code: 'YKE002', name: 'Hisse Senedi Fonu', provider: 'YKE', category: 'equity', riskLevel: 5, fund_type: 'regular' },
  { code: 'YKE003', name: 'Kamu Tahvil Fonu', provider: 'YKE', category: 'bond', riskLevel: 2, fund_type: 'regular' },
  { code: 'YKE004', name: 'Para Piyasası Fonu', provider: 'YKE', category: 'money', riskLevel: 1, fund_type: 'regular' },
  { code: 'YKE005', name: 'Katkı Emeklilik Fonu', provider: 'YKE', category: 'mixed', riskLevel: 3, fund_type: 'regular' },

  // Halk Hayat
  { code: 'HHE001', name: 'Altın Emeklilik Fonu', provider: 'HHE', category: 'gold', riskLevel: 3, fund_type: 'regular' },
  { code: 'HHE002', name: 'Hisse Emeklilik Fonu', provider: 'HHE', category: 'equity', riskLevel: 5, fund_type: 'regular' },
  { code: 'HHE003', name: 'Devlet Tahvili Fonu', provider: 'HHE', category: 'bond', riskLevel: 2, fund_type: 'regular' },
  { code: 'HHE004', name: 'Karma Emeklilik Fonu', provider: 'HHE', category: 'mixed', riskLevel: 3, fund_type: 'regular' },

  // Aegon Emeklilik
  { code: 'AEG001', name: 'Altın Fonu', provider: 'AEG', category: 'gold', riskLevel: 3, fund_type: 'regular' },
  { code: 'AEG002', name: 'Hisse Fonu', provider: 'AEG', category: 'equity', riskLevel: 5, fund_type: 'regular' },
  { code: 'AEG003', name: 'Dengeli Emeklilik Fonu', provider: 'AEG', category: 'mixed', riskLevel: 3, fund_type: 'regular' },

  // Axa Sigorta
  { code: 'AXA001', name: 'Altın Emeklilik Fonu', provider: 'AXA', category: 'gold', riskLevel: 3, fund_type: 'regular' },
  { code: 'AXA002', name: 'Hisse Emeklilik Fonu', provider: 'AXA', category: 'equity', riskLevel: 5, fund_type: 'regular' },
  { code: 'AXA003', name: 'Döviz Cinsinden Fon', provider: 'AXA', category: 'foreign', riskLevel: 3, fund_type: 'regular' },

  // MetLife
  { code: 'MET001', name: 'Altın Emeklilik Fonu', provider: 'MET', category: 'gold', riskLevel: 3, fund_type: 'regular' },
  { code: 'MET002', name: 'Esnek Emeklilik Fonu', provider: 'MET', category: 'mixed', riskLevel: 4, fund_type: 'regular' },

  // Fiba Emeklilik
  { code: 'FBA001', name: 'Altın Fonu', provider: 'FBA', category: 'gold', riskLevel: 3, fund_type: 'regular' },
  { code: 'FBA002', name: 'Karma Fon', provider: 'FBA', category: 'mixed', riskLevel: 3, fund_type: 'regular' },

  // Ziraat Hayat
  { code: 'ZRE001', name: 'Altın Emeklilik Fonu', provider: 'ZRE', category: 'gold', riskLevel: 3, fund_type: 'regular' },
  { code: 'ZRE002', name: 'Kamu Borç. Araçları Fonu', provider: 'ZRE', category: 'bond', riskLevel: 2, fund_type: 'regular' },
  { code: 'ZRE003', name: 'Katılım Emeklilik Fonu', provider: 'ZRE', category: 'participation', riskLevel: 3, fund_type: 'regular' },

  // ===== DEVLET KATKISI FUNDS =====

  // Anadolu Hayat Emeklilik
  { code: 'AHE-DK1', name: 'Standart Devlet Katkısı Fonu', provider: 'AHE', category: 'standart', riskLevel: 2, fund_type: 'devlet_katkisi' },
  { code: 'AHE-DK2', name: 'Katkı Payı Fonu (Karma)', provider: 'AHE', category: 'mixed', riskLevel: 3, fund_type: 'devlet_katkisi' },

  // Garanti Emeklilik
  { code: 'GRE-DK1', name: 'Standart Devlet Katkısı Fonu', provider: 'GRE', category: 'standart', riskLevel: 2, fund_type: 'devlet_katkisi' },
  { code: 'GRE-DK2', name: 'Katkı Payı Fonu (Tahvil)', provider: 'GRE', category: 'bond', riskLevel: 2, fund_type: 'devlet_katkisi' },

  // Allianz Yaşam
  { code: 'ALY-DK1', name: 'Standart Devlet Katkısı Fonu', provider: 'ALY', category: 'standart', riskLevel: 2, fund_type: 'devlet_katkisi' },
  { code: 'ALY-DK2', name: 'Katkı Payı Fonu (Para Piyasası)', provider: 'ALY', category: 'money', riskLevel: 1, fund_type: 'devlet_katkisi' },

  // Yapı Kredi Emeklilik
  { code: 'YKE-DK1', name: 'Standart Devlet Katkısı Fonu', provider: 'YKE', category: 'standart', riskLevel: 2, fund_type: 'devlet_katkisi' },
  { code: 'YKE-DK2', name: 'Katkı Payı Fonu (Karma)', provider: 'YKE', category: 'mixed', riskLevel: 3, fund_type: 'devlet_katkisi' },

  // Halk Hayat
  { code: 'HHE-DK1', name: 'Standart Devlet Katkısı Fonu', provider: 'HHE', category: 'standart', riskLevel: 2, fund_type: 'devlet_katkisi' },

  // Aegon Emeklilik
  { code: 'AEG-DK1', name: 'Standart Devlet Katkısı Fonu', provider: 'AEG', category: 'standart', riskLevel: 2, fund_type: 'devlet_katkisi' },

  // Axa Sigorta
  { code: 'AXA-DK1', name: 'Standart Devlet Katkısı Fonu', provider: 'AXA', category: 'standart', riskLevel: 2, fund_type: 'devlet_katkisi' },
  { code: 'AXA-DK2', name: 'Katkı Payı Fonu (Tahvil)', provider: 'AXA', category: 'bond', riskLevel: 2, fund_type: 'devlet_katkisi' },

  // MetLife
  { code: 'MET-DK1', name: 'Standart Devlet Katkısı Fonu', provider: 'MET', category: 'standart', riskLevel: 2, fund_type: 'devlet_katkisi' },

  // Fiba Emeklilik
  { code: 'FBA-DK1', name: 'Standart Devlet Katkısı Fonu', provider: 'FBA', category: 'standart', riskLevel: 2, fund_type: 'devlet_katkisi' },

  // Ziraat Hayat
  { code: 'ZRE-DK1', name: 'Standart Devlet Katkısı Fonu', provider: 'ZRE', category: 'standart', riskLevel: 2, fund_type: 'devlet_katkisi' },
  { code: 'ZRE-DK2', name: 'Katkı Payı Fonu (Katılım)', provider: 'ZRE', category: 'participation', riskLevel: 3, fund_type: 'devlet_katkisi' },
]

export const BES_CATEGORIES = {
  gold: { name: 'Altın Fonları', nameEn: 'Gold Funds' },
  equity: { name: 'Hisse Senedi Fonları', nameEn: 'Equity Funds' },
  bond: { name: 'Tahvil/Bono Fonları', nameEn: 'Bond Funds' },
  money: { name: 'Para Piyasası Fonları', nameEn: 'Money Market Funds' },
  mixed: { name: 'Karma/Dengeli Fonlar', nameEn: 'Mixed/Balanced Funds' },
  foreign: { name: 'Döviz/Yabancı Fonlar', nameEn: 'Foreign Currency Funds' },
  participation: { name: 'Katılım Fonları', nameEn: 'Participation Funds' },
  standart: { name: 'Standart Fonlar', nameEn: 'Standard Funds' },
} as const

export const BES_CATEGORY_RETURNS: Record<BESCategory, { annualTL: number; label: string }> = {
  gold:          { annualTL: 0.55, label: 'Altın ~%55 TL/yıl' },
  equity:        { annualTL: 0.45, label: 'Hisse ~%45 TL/yıl' },
  bond:          { annualTL: 0.35, label: 'Tahvil ~%35 TL/yıl' },
  money:         { annualTL: 0.30, label: 'Para Piyasası ~%30 TL/yıl' },
  mixed:         { annualTL: 0.38, label: 'Karma ~%38 TL/yıl' },
  foreign:       { annualTL: 0.50, label: 'Döviz ~%50 TL/yıl' },
  participation: { annualTL: 0.32, label: 'Katılım ~%32 TL/yıl' },
  standart:      { annualTL: 0.25, label: 'Standart ~%25 TL/yıl' },
}

export const TL_ANNUAL_DEPRECIATION_VS_USD = 0.30

// Helper functions
export function getRegularFunds(providerCode?: string): BESFund[] {
  const funds = BES_FUNDS.filter(f => f.fund_type === 'regular')
  return providerCode ? funds.filter(f => f.provider === providerCode) : funds
}

export function getDevletKatkisiFunds(providerCode?: string): BESFund[] {
  const funds = BES_FUNDS.filter(f => f.fund_type === 'devlet_katkisi')
  return providerCode ? funds.filter(f => f.provider === providerCode) : funds
}

export function getEstimatedReturn(category: BESCategory, months: number): number {
  const annual = BES_CATEGORY_RETURNS[category].annualTL
  return Math.pow(1 + annual, months / 12) - 1
}

export function getEstimatedUSDReturn(category: BESCategory, months: number): number {
  const tlReturn = getEstimatedReturn(category, months)
  const depreciation = Math.pow(1 - TL_ANNUAL_DEPRECIATION_VS_USD, months / 12)
  return (1 + tlReturn) * depreciation - 1
}
