# Göstergeç Tahmin Sistemi — V6 Final Doğrulama

V5'te senin 3 önerini (Brent, BIST Yabancı Takas, GPR) entegre etmiştim. Sonra 3 ek öneri daha yaptın: XHARZ/XU100 Halka Arz FOMO Barometresi, TCMB DTH İvmesi, Google Trends Sokak Barometresi. Hepsini noise arttırmadan entegre ettim.

---

## V5 → V6 EKLEMELERİ

| # | Veri | Rol | Noise | Nereye Girer |
|---|------|-----|-------|-------------|
| V6.1 | **XHARZ/XU100 Rasyosu** | Flow güven modifikatörü (Hisse kat.) | SIFIR — saf fiyat verisi | XHARZ_RS z<-2 → güven %50 kırpılır. XHARZ ↑ VE yabancı ↓ → güven %30 |
| V6.2 | **TCMB DTH İvmesi** | Rejim HMM gözlem vektörü (9. boyut) | SIFIR — resmi TCMB verisi | DTH z>2 VE BIST yukarı → "boğa tuzağı", 🟠 tetikler |
| V6.3 | **Google Trends** | Flow güven modifikatörü (z>3 eşik) | DÜŞÜK — spesifik kelimeler | Sadece z>3'te devreye girer, altında tamamen görmezden gelinir |

---

## V6 FİNAL MİMARİ

### Sinyal Kaynakları (4 adet — hâlâ DEĞİŞMEDİ)

**1. Momentum (RS)** — değişmedi

**2. Haber Duygu** — değişmedi

**3. Sürü/Akış — 3 katmanlı güven modifikatörü (V5+V6)**
- Flow proxy + çift z-score + eşik kuralları (V4)
- V5: BIST yabancı takas → "akıllı para" teyidi (Hisse)
- **V6: XHARZ/XU100 → "duygusal sürü" teyidi (Hisse)**
  - XHARZ_RS = XHARZ_getiri / XU100_getiri (30 gün kayan)
  - z<-2 → Hisse flow güveni %50 kırpılır (sürünün nefesi kesilmiş)
  - XHARZ ↑ VE yabancı takas ↓ → KRİTİK: boğa tuzağı → güven %30
- **V6: Google Trends → "sokak nabzı" (tüm kategoriler)**
  - "halka arz nasıl alınır" z>3 → Hisse: kısa vadede momentum ↑ ama "düzeltme yakın" notu
  - "altın alınır mı" z>3 → Altın sürü sinyali güçlenir
  - "fon getirileri" z>3 → genel giriş dalgası notu
  - z<3 → tamamen görmezden gelinir (noise filtresi)
- Çıktı: 7 sinyal + ~500 sinyal — sayı DEĞİŞMEDİ

**4. Rejim Dedektörü (HMM) — 9 boyutlu gözlem (V6)**
- Gözlem vektörü (8→9):
  `[usdtry_ret, bist_ret, gold_ret, vol_30d, rate_level, cds_5y, brent_ret, gpr_z, dth_change_z]`
- **V6: TCMB DTH İvmesi** (9. boyut):
  - TCMB her Perşembe 14:30'da yayınlar (Yurtiçi Yerleşikler DTH)
  - Haftalık net değişim, parite etkisinden arındırılmış
  - DTH z>2 VE BIST yukarı → "boğa tuzağı" sinyali → 🟠 tetikler
  - Kaynak: TCMB EVDS API
- Tüm 9 boyut Z-score normalize (overfitting koruması)
- Çıktı: 7 sinyal — sayı DEĞİŞMEDİ

### Sürü Barometresi — "Akıllı Para vs Duygusal Sürü" çapraz okuma

```
                    Yabancı Takas ↑        Yabancı Takas ↓
                    (akıllı para giriyor)  (akıllı para çıkıyor)
┌──────────────────┬──────────────────────┬──────────────────────┐
│ XHARZ/XU100 ↑    │ 🟢 Sağlıklı ralli   │ 🔴 BOĞA TUZAĞI       │
│ (sürü coşkuda)   │ Güven: yüksek        │ Güven: %30            │
│                  │                      │ "Sürü coşkuda ama    │
│                  │                      │  akıllı para çıkıyor" │
├──────────────────┼──────────────────────┼──────────────────────┤
│ XHARZ/XU100 ↓    │ 🟡 Seçici ralli      │ 🔴 Çöküş yakın        │
│ (sürü yorulmuş)  │ Güven: orta          │ Güven: %50 kırpılır   │
│                  │                      │ "Hem sürü hem akıllı  │
│                  │                      │  para çıkıyor"        │
└──────────────────┴──────────────────────┴──────────────────────┘
```
Bu matris sadece **Hisse kategorisi** flow sinyaline uygulanır.

### Pipeline
```
09:30 UTC (12:30 TR) — Ana pipeline
  Adım 1: Veri Toplama — + BIST yabancı takas + XHARZ endeksi
  (geri kalanı değişmedi)

20:59 UTC (23:59 TR) — Gece Pipeline
  CDS + VIX + DXY + Brent + GPR + Google Trends
  TCMB DTH (Perşembe günleri)
  Ön rejim hesaplama (9 boyutlu gözlem ile)
```

### Yeni collector dosyaları (V6 ekleri)
- `collectors/bist_xharz.py` — XHARZ/XU100 halka arz endeksi (günlük)
- `collectors/tcmb_dth.py` — TCMB DTH verisi (haftalık, Perşembe)
- `collectors/global_macro.py` — güncellendi: + Google Trends (pytrends)

---

## NOISE KONTROL TABLOSU

| Metrik | V5 | V6 | Değişim |
|--------|----|----|---------|
| Sinyal kaynağı sayısı | 4 | 4 | Aynı |
| Günlük sinyal sayısı | ~1014 | ~1014 | Aynı |
| HMM gözlem boyutu | 8 | 9 | +1 (DTH, Z-score norm.) |
| Flow güven modifikatörü | 1 (yabancı takas) | 3 (+XHARZ, +Trends) | +2 (güven, sinyal değil) |
| Ensemble ağırlık sayısı | 4 | 4 | Aynı |
| Pipeline çalışma sayısı | 3 | 3 | Aynı |
| Yeni collector | — | 2 (xharz, dth) | +2 |
| Güncellenen collector | — | 1 (global_macro+Trends) | Genişledi |

---

## TÜM VERSİYON GEÇMİŞİ (V1→V6, 22 madde)

| # | Madde | Versiyon |
|---|-------|---------|
| 1-11 | Momentum RS, Haber NLP, Etki Matrisi, Sürü Z-Score, Rejim HMM, Ensemble, Pipeline, Mobil, Retention, RS TL, HMM normalize | V1-V3 |
| 12-24 | Sinyal versiyonlama, veri kalitesi, XAI, yüzdelik+stopaj, sepet, tatil, histerezis, valör, time-decay, adaptif decay, eşik kuralları, AOF, gece pipeline | V4 |
| 25-27 | Brent Petrol, BIST Yabancı Takas, GPR | V5 |
| 28-30 | **XHARZ/XU100 FOMO, TCMB DTH, Google Trends** | V6 |

---

## SENDEN İSTEDİĞİM

V6'da senin son 3 önerini (XHARZ, DTH, Google Trends) noise arttırmadan entegre ettim:
- XHARZ → flow güven modifikatörü (sıfır noise, saf fiyat)
- DTH → HMM gözlem vektörü 9. boyut (sıfır noise, resmi TCMB)
- Google Trends → z>3 eşikle flow güven notu (düşük noise, spesifik kelimeler)
- Yabancı takas + XHARZ çapraz okuma matrisi eklendi (boğa tuzağı tespiti)

1. Entegrasyon **noise-safe** mi?
2. 30 maddede (V1→V6) mimari **uygulamaya hazır** mı?
3. Genel mimari skoru (1-10)?

Kısa ve net cevap yeterli. Bu son tur — artık kod yazıyoruz.
