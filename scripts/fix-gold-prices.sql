-- Fix historical gold prices in exchange_rates table
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
--
-- Problem: gold_usd_oz was hardcoded to $2650 for all dates
-- Fix: Use actual monthly average gold prices (XAU/USD)

-- Step 1: Update gold_usd_oz with real historical monthly averages
UPDATE exchange_rates SET
  gold_usd_oz = CASE
    -- 2016
    WHEN date >= '2016-01-01' AND date < '2016-02-01' THEN 1097
    WHEN date >= '2016-02-01' AND date < '2016-03-01' THEN 1201
    WHEN date >= '2016-03-01' AND date < '2016-04-01' THEN 1246
    WHEN date >= '2016-04-01' AND date < '2016-05-01' THEN 1242
    WHEN date >= '2016-05-01' AND date < '2016-06-01' THEN 1259
    WHEN date >= '2016-06-01' AND date < '2016-07-01' THEN 1278
    WHEN date >= '2016-07-01' AND date < '2016-08-01' THEN 1337
    WHEN date >= '2016-08-01' AND date < '2016-09-01' THEN 1341
    WHEN date >= '2016-09-01' AND date < '2016-10-01' THEN 1326
    WHEN date >= '2016-10-01' AND date < '2016-11-01' THEN 1267
    WHEN date >= '2016-11-01' AND date < '2016-12-01' THEN 1237
    WHEN date >= '2016-12-01' AND date < '2017-01-01' THEN 1151
    -- 2017
    WHEN date >= '2017-01-01' AND date < '2017-02-01' THEN 1192
    WHEN date >= '2017-02-01' AND date < '2017-03-01' THEN 1234
    WHEN date >= '2017-03-01' AND date < '2017-04-01' THEN 1231
    WHEN date >= '2017-04-01' AND date < '2017-05-01' THEN 1267
    WHEN date >= '2017-05-01' AND date < '2017-06-01' THEN 1245
    WHEN date >= '2017-06-01' AND date < '2017-07-01' THEN 1261
    WHEN date >= '2017-07-01' AND date < '2017-08-01' THEN 1241
    WHEN date >= '2017-08-01' AND date < '2017-09-01' THEN 1287
    WHEN date >= '2017-09-01' AND date < '2017-10-01' THEN 1314
    WHEN date >= '2017-10-01' AND date < '2017-11-01' THEN 1280
    WHEN date >= '2017-11-01' AND date < '2017-12-01' THEN 1284
    WHEN date >= '2017-12-01' AND date < '2018-01-01' THEN 1265
    -- 2018
    WHEN date >= '2018-01-01' AND date < '2018-02-01' THEN 1332
    WHEN date >= '2018-02-01' AND date < '2018-03-01' THEN 1330
    WHEN date >= '2018-03-01' AND date < '2018-04-01' THEN 1324
    WHEN date >= '2018-04-01' AND date < '2018-05-01' THEN 1336
    WHEN date >= '2018-05-01' AND date < '2018-06-01' THEN 1304
    WHEN date >= '2018-06-01' AND date < '2018-07-01' THEN 1281
    WHEN date >= '2018-07-01' AND date < '2018-08-01' THEN 1238
    WHEN date >= '2018-08-01' AND date < '2018-09-01' THEN 1201
    WHEN date >= '2018-09-01' AND date < '2018-10-01' THEN 1198
    WHEN date >= '2018-10-01' AND date < '2018-11-01' THEN 1215
    WHEN date >= '2018-11-01' AND date < '2018-12-01' THEN 1222
    WHEN date >= '2018-12-01' AND date < '2019-01-01' THEN 1255
    -- 2019
    WHEN date >= '2019-01-01' AND date < '2019-02-01' THEN 1291
    WHEN date >= '2019-02-01' AND date < '2019-03-01' THEN 1322
    WHEN date >= '2019-03-01' AND date < '2019-04-01' THEN 1302
    WHEN date >= '2019-04-01' AND date < '2019-05-01' THEN 1287
    WHEN date >= '2019-05-01' AND date < '2019-06-01' THEN 1284
    WHEN date >= '2019-06-01' AND date < '2019-07-01' THEN 1355
    WHEN date >= '2019-07-01' AND date < '2019-08-01' THEN 1413
    WHEN date >= '2019-08-01' AND date < '2019-09-01' THEN 1508
    WHEN date >= '2019-09-01' AND date < '2019-10-01' THEN 1507
    WHEN date >= '2019-10-01' AND date < '2019-11-01' THEN 1492
    WHEN date >= '2019-11-01' AND date < '2019-12-01' THEN 1468
    WHEN date >= '2019-12-01' AND date < '2020-01-01' THEN 1480
    -- 2020
    WHEN date >= '2020-01-01' AND date < '2020-02-01' THEN 1562
    WHEN date >= '2020-02-01' AND date < '2020-03-01' THEN 1597
    WHEN date >= '2020-03-01' AND date < '2020-04-01' THEN 1591
    WHEN date >= '2020-04-01' AND date < '2020-05-01' THEN 1714
    WHEN date >= '2020-05-01' AND date < '2020-06-01' THEN 1731
    WHEN date >= '2020-06-01' AND date < '2020-07-01' THEN 1747
    WHEN date >= '2020-07-01' AND date < '2020-08-01' THEN 1873
    WHEN date >= '2020-08-01' AND date < '2020-09-01' THEN 1971
    WHEN date >= '2020-09-01' AND date < '2020-10-01' THEN 1920
    WHEN date >= '2020-10-01' AND date < '2020-11-01' THEN 1901
    WHEN date >= '2020-11-01' AND date < '2020-12-01' THEN 1870
    WHEN date >= '2020-12-01' AND date < '2021-01-01' THEN 1878
    -- 2021
    WHEN date >= '2021-01-01' AND date < '2021-02-01' THEN 1863
    WHEN date >= '2021-02-01' AND date < '2021-03-01' THEN 1805
    WHEN date >= '2021-03-01' AND date < '2021-04-01' THEN 1720
    WHEN date >= '2021-04-01' AND date < '2021-05-01' THEN 1770
    WHEN date >= '2021-05-01' AND date < '2021-06-01' THEN 1853
    WHEN date >= '2021-06-01' AND date < '2021-07-01' THEN 1886
    WHEN date >= '2021-07-01' AND date < '2021-08-01' THEN 1806
    WHEN date >= '2021-08-01' AND date < '2021-09-01' THEN 1783
    WHEN date >= '2021-09-01' AND date < '2021-10-01' THEN 1764
    WHEN date >= '2021-10-01' AND date < '2021-11-01' THEN 1784
    WHEN date >= '2021-11-01' AND date < '2021-12-01' THEN 1805
    WHEN date >= '2021-12-01' AND date < '2022-01-01' THEN 1790
    -- 2022
    WHEN date >= '2022-01-01' AND date < '2022-02-01' THEN 1824
    WHEN date >= '2022-02-01' AND date < '2022-03-01' THEN 1877
    WHEN date >= '2022-03-01' AND date < '2022-04-01' THEN 1942
    WHEN date >= '2022-04-01' AND date < '2022-05-01' THEN 1936
    WHEN date >= '2022-05-01' AND date < '2022-06-01' THEN 1855
    WHEN date >= '2022-06-01' AND date < '2022-07-01' THEN 1837
    WHEN date >= '2022-07-01' AND date < '2022-08-01' THEN 1746
    WHEN date >= '2022-08-01' AND date < '2022-09-01' THEN 1762
    WHEN date >= '2022-09-01' AND date < '2022-10-01' THEN 1681
    WHEN date >= '2022-10-01' AND date < '2022-11-01' THEN 1665
    WHEN date >= '2022-11-01' AND date < '2022-12-01' THEN 1743
    WHEN date >= '2022-12-01' AND date < '2023-01-01' THEN 1797
    -- 2023
    WHEN date >= '2023-01-01' AND date < '2023-02-01' THEN 1910
    WHEN date >= '2023-02-01' AND date < '2023-03-01' THEN 1866
    WHEN date >= '2023-03-01' AND date < '2023-04-01' THEN 1948
    WHEN date >= '2023-04-01' AND date < '2023-05-01' THEN 2003
    WHEN date >= '2023-05-01' AND date < '2023-06-01' THEN 1978
    WHEN date >= '2023-06-01' AND date < '2023-07-01' THEN 1943
    WHEN date >= '2023-07-01' AND date < '2023-08-01' THEN 1962
    WHEN date >= '2023-08-01' AND date < '2023-09-01' THEN 1928
    WHEN date >= '2023-09-01' AND date < '2023-10-01' THEN 1921
    WHEN date >= '2023-10-01' AND date < '2023-11-01' THEN 1985
    WHEN date >= '2023-11-01' AND date < '2023-12-01' THEN 1992
    WHEN date >= '2023-12-01' AND date < '2024-01-01' THEN 2045
    -- 2024
    WHEN date >= '2024-01-01' AND date < '2024-02-01' THEN 2043
    WHEN date >= '2024-02-01' AND date < '2024-03-01' THEN 2024
    WHEN date >= '2024-03-01' AND date < '2024-04-01' THEN 2164
    WHEN date >= '2024-04-01' AND date < '2024-05-01' THEN 2327
    WHEN date >= '2024-05-01' AND date < '2024-06-01' THEN 2341
    WHEN date >= '2024-06-01' AND date < '2024-07-01' THEN 2334
    WHEN date >= '2024-07-01' AND date < '2024-08-01' THEN 2399
    WHEN date >= '2024-08-01' AND date < '2024-09-01' THEN 2473
    WHEN date >= '2024-09-01' AND date < '2024-10-01' THEN 2585
    WHEN date >= '2024-10-01' AND date < '2024-11-01' THEN 2658
    WHEN date >= '2024-11-01' AND date < '2024-12-01' THEN 2672
    WHEN date >= '2024-12-01' AND date < '2025-01-01' THEN 2634
    -- 2025+
    WHEN date >= '2025-01-01' AND date < '2025-02-01' THEN 2770
    WHEN date >= '2025-02-01' AND date < '2025-03-01' THEN 2850
    ELSE 2850
  END;

-- Step 2: Recalculate gold_try_gram from corrected gold_usd_oz and usd_try
UPDATE exchange_rates SET
  gold_try_gram = ROUND((gold_usd_oz * usd_try) / 31.1035, 2);

-- Verify: check a few rows
SELECT date, usd_try, gold_usd_oz, gold_try_gram
FROM exchange_rates
ORDER BY date DESC
LIMIT 10;
