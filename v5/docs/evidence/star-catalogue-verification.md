# KaliStars verification

Date: 2026-10-25
File: `stars.js` (epoch J2000; ra in decimal hours, dec in degrees, V magnitude)
Method: every star below was looked up on its Wikipedia page (infobox "Observation data", J2000/ICRS) with WebFetch;
the Wikipedia *List of brightest stars* was used as a second magnitude source for the 94 stars down to V 2.50.
The h m s / d m s values were converted to decimals by `verify.js` and compared against the file.

Tolerances (from the brief): RA 0.05 h, Dec 0.5 deg, mag 0.3. "ok (note)" marks differences above 0.005 h / 0.05 deg / 0.15 mag that are still inside tolerance (all are variable-star or combined-vs-component magnitude choices).

## Summary

* Stars checked: **251** of 366 (all 16 first-magnitude stars, every star with V <= 3.0 that is a figure vertex, and 117 fainter figure-only stars down to V 4.96).
* Outside tolerance after corrections: **0**
* Inside tolerance but noted: 1
* No positional error larger than 0.007 h (25 s of RA) or 0.01 deg was found in the original draft. Corrections applied before this run:
  * RA: tau Boo 13.7811 -> 13.7877 h; nu UMa 11.3038 -> 11.3080 h; pi Peg -> pi2 Peg 22.1665 h / +33.1782.
  * Magnitudes aligned to the sources: Betelgeuse 0.42 -> 0.50, Antares 1.06 -> 0.96, Spica 0.98 -> 0.97, Regulus 1.36 -> 1.40,
    Mirfak 1.79 -> 1.82, Saiph 2.06 -> 2.09, Wezen 1.84 -> 1.82, Caph 2.27 -> 2.28, Rasalhague 2.08 -> 2.07, Shaula 1.62 -> 1.63,
    Sargas 1.86 -> 1.84, Acrab 2.56 -> 2.50 (combined), Mizar 2.23 -> 2.04 (combined), Almach 2.10 -> 2.27, Markab 2.49 -> 2.48,
    Alderamin 2.51 -> 2.46, Kornephoros 2.78 -> 2.81, Ankaa 2.40 -> 2.38, eta Cen 2.31 -> 2.35, Deneb Algedi 2.85 -> 2.81,
    delta Cep 4.07 -> 3.95 (mid-range), epsilon Lyr 4.60 -> 3.90 (combined double-double).
  * Designations: nu Dra -> nu1 Dra, pi Peg -> pi2 Peg, epsilon Lyr labelled (e1+e2).
* Deliberate choices kept (documented in `meta.notes`): combined magnitudes for naked-eye pairs (Acamar 2.88, Albireo 3.05, Castor 1.58, Meissa 3.39, xi UMa 3.79, nu Sco 4.00, rho Her 4.17); mid-range values for variables (Algol 2.12, gamma Cas 2.47, delta Sco 2.29, Mira 6.5).

## Node sanity check (`node check.js`)

```
--- KaliStars check ---
stars total            : 366
mag<=3.0 & dec>-45     : 137
mag<=1.5 (first-mag)   : 16 aCyg,aLyr,aAql,aBoo,aOri,bOri,aTau,bGem,aCMa,eCMa,aCMi,aAur,aPsA,aLeo,aVir,aSco
figure-only (mag>3.0)  : 229
figure stars mag>4.5   : hUMi,nDra,pi1Ori,chi2Ori,nAnd,dCrB,iCrB,gCnc,lCet,oCet,zEri
constellations w/ stars: 47
figures                : 33 constellations, 328 segments
milkyWay points        : 40  first= [17.76,-28.94]  NGP side sample= [21.2,48.33]
meta                   : {"epoch":"J2000","count":366,"brightCount":137,"magLimit":3,"verified":251}
RESULT: all checks passed
```

## Per-star table

Columns: catalogue value as written on Wikipedia; the same converted to decimal; the value in stars.js; difference (file - catalogue) in seconds of RA, arcminutes of Dec, magnitudes.

| id | star | source | catalogue RA / Dec / V (as written) | catalogue (decimal) | stars.js ra / dec / mag | diff | status |
|---|---|---|---|---|---|---|---|
| aUMi | Polaris | [wiki](https://en.wikipedia.org/wiki/Polaris) | 02 31 49.09 / +89 15 50.8 / 1.98 | 2.5303 / 89.264 / 1.98 | 2.5303 / 89.264 / 1.98 | -0s / -0.0' / +0.00 | OK |
| dUMi | Yildun | [wiki](https://en.wikipedia.org/wiki/Delta_Ursae_Minoris) | 17 32 12.99 / +86 35 11.3 / 4.36 | 17.5369 / 86.586 / 4.36 | 17.5369 / 86.586 / 4.36 | -0s / -0.0' / +0.00 | OK |
| hUMi | eta UMi | [wiki](https://en.wikipedia.org/wiki/Eta_Ursae_Minoris) | 16 17 30.27 / +75 45 19.2 / 4.95 | 16.2917 / 75.755 / 4.95 | 16.2918 / 75.755 / 4.95 | 0s / -0.0' / +0.00 | OK |
| 23UMa | h UMa (23 UMa) | [wiki](https://en.wikipedia.org/wiki/23_Ursae_Majoris) | 09 31 31.71 / +63 03 42.7 / 3.65 | 9.5255 / 63.062 / 3.65 | 9.5261 / 63.062 / 3.67 | 2s / -0.0' / +0.02 | OK |
| oCet | Mira | [wiki](https://en.wikipedia.org/wiki/Mira) | 02 19 20.79 / -02 58 39.5 / 2.0-10.1 | 2.3224 / -2.978 / 6.05 | 2.3225 / -2.978 / 6.00 | 0s / 0.0' / -0.05 | OK |
| t3Eri | tau3 Eri | [wiki](https://en.wikipedia.org/wiki/Tau3_Eridani) | 03 02 23.50 / -23 37 28.1 / 4.10 | 3.0399 / -23.624 / 4.10 | 3.0399 / -23.625 / 4.09 | 0s / -0.0' / -0.01 | OK |
| iCrB | iota CrB | [wiki](https://en.wikipedia.org/wiki/Iota_Coronae_Borealis) | 16 01 26.56 / +29 51 03.8 / 4.96 | 16.0240 / 29.851 / 4.96 | 16.0244 / 29.851 / 4.99 | 1s / 0.0' / +0.03 | OK |
| gCnc | Asellus Borealis | [wiki](https://en.wikipedia.org/wiki/Gamma_Cancri) | 08 43 17.15 / +21 28 06.6 / 4.67 | 8.7214 / 21.468 / 4.67 | 8.7215 / 21.468 / 4.66 | 0s / 0.0' / -0.01 | OK |
| 109Vir | 109 Vir | [wiki](https://en.wikipedia.org/wiki/109_Virginis) | 14 46 14.92 / +01 53 34.4 / 3.72 | 14.7708 / 1.893 / 3.72 | 14.7723 / 1.893 / 3.72 | 5s / -0.0' / +0.00 | OK |
| pi6Ori | pi6 Ori | [wiki](https://en.wikipedia.org/wiki/Pi6_Orionis) | 04 58 32.90 / +01 42 50.5 / 4.47 | 4.9758 / 1.714 / 4.47 | 4.9742 / 1.714 / 4.47 | -6s / -0.0' / +0.00 | OK |
| bTri | beta Tri | [wiki](https://en.wikipedia.org/wiki/Beta_Trianguli) | 02 09 32.63 / +34 59 14.3 / 3.00 | 2.1591 / 34.987 / 3.00 | 2.1588 / 34.987 / 3.00 | -1s / -0.0' / +0.00 | OK |
| aCMa | Sirius | [wiki](https://en.wikipedia.org/wiki/Sirius) | 06 45 08.92 / -16 42 58.0 / -1.46 | 6.7525 / -16.716 / -1.46 | 6.7525 / -16.716 / -1.46 | 0s / 0.0' / +0.00 | OK |
| aBoo | Arcturus | [wiki](https://en.wikipedia.org/wiki/Arcturus) | 14 15 39.7 / +19 10 56 / -0.05 | 14.2610 / 19.182 / -0.05 | 14.2612 / 19.182 / -0.05 | 1s / 0.0' / +0.00 | OK |
| aLyr | Vega | [wiki](https://en.wikipedia.org/wiki/Vega) | 18 36 56.34 / +38 47 01.3 / 0.03 | 18.6157 / 38.784 / 0.03 | 18.6156 / 38.784 / 0.03 | -0s / 0.0' / +0.00 | OK |
| aAur | Capella | [wiki](https://en.wikipedia.org/wiki/Capella) | 05 16 41.36 / +45 59 52.8 / 0.08 | 5.2782 / 45.998 / 0.08 | 5.2782 / 45.998 / 0.08 | 0s / 0.0' / +0.00 | OK |
| bOri | Rigel | [wiki](https://en.wikipedia.org/wiki/Rigel) | 05 14 32.27 / -08 12 05.9 / 0.13 | 5.2423 / -8.202 / 0.13 | 5.2423 / -8.202 / 0.13 | 0s / 0.0' / +0.00 | OK |
| aCMi | Procyon | [wiki](https://en.wikipedia.org/wiki/Procyon) | 07 39 18.12 / +05 13 30.0 / 0.34 | 7.6550 / 5.225 / 0.34 | 7.6550 / 5.225 / 0.34 | -0s / -0.0' / +0.00 | OK |
| aOri | Betelgeuse | [wiki](https://en.wikipedia.org/wiki/Betelgeuse) | 05 55 10.31 / +07 24 25.4 / 0.50 | 5.9195 / 7.407 / 0.50 | 5.9195 / 7.407 / 0.50 | -0s / 0.0' / +0.00 | OK |
| aAql | Altair | [wiki](https://en.wikipedia.org/wiki/Altair) | 19 50 47.00 / +08 52 06.0 / 0.76 | 19.8464 / 8.868 / 0.76 | 19.8464 / 8.868 / 0.76 | 0s / -0.0' / +0.00 | OK |
| aTau | Aldebaran | [wiki](https://en.wikipedia.org/wiki/Aldebaran) | 04 35 55.24 / +16 30 33.5 / 0.75-0.95 | 4.5987 / 16.509 / 0.85 | 4.5987 / 16.509 / 0.86 | 0s / -0.0' / +0.01 | OK |
| aSco | Antares | [wiki](https://en.wikipedia.org/wiki/Antares) | 16 29 24.46 / -26 25 55.2 / 0.6-1.6 | 16.4901 / -26.432 / 1.10 | 16.4901 / -26.432 / 0.96 | -0s / 0.0' / -0.14 | OK |
| aVir | Spica | [wiki](https://en.wikipedia.org/wiki/Spica) | 13 25 11.58 / -11 09 40.8 / 0.97 | 13.4199 / -11.161 / 0.97 | 13.4199 / -11.161 / 0.97 | 0s / 0.0' / +0.00 | OK |
| aPsA | Fomalhaut | [wiki](https://en.wikipedia.org/wiki/Fomalhaut) | 22 57 39.05 / -29 37 20.1 / 1.16 | 22.9608 / -29.622 / 1.16 | 22.9608 / -29.622 / 1.16 | -0s / 0.0' / +0.00 | OK |
| aCyg | Deneb | [wiki](https://en.wikipedia.org/wiki/Deneb) | 20 41 25.9 / +45 16 49 / 1.25 | 20.6905 / 45.280 / 1.25 | 20.6905 / 45.280 / 1.25 | -0s / 0.0' / +0.00 | OK |
| aLeo | Regulus | [wiki](https://en.wikipedia.org/wiki/Regulus) | 10 08 22.31 / +11 58 02.0 / 1.40 | 10.1395 / 11.967 / 1.40 | 10.1395 / 11.967 / 1.40 | -0s / -0.0' / +0.00 | OK |
| eCMa | Adhara | [wiki](https://en.wikipedia.org/wiki/Adhara) | 06 58 37.55 / -28 58 19.5 / 1.50 | 6.9771 / -28.972 / 1.50 | 6.9771 / -28.972 / 1.50 | 0s / -0.0' / +0.00 | OK |
| bGem | Pollux | [wiki](https://en.wikipedia.org/wiki/Pollux_(star)) | 07 45 18.95 / +28 01 34.3 / 1.14 | 7.7553 / 28.026 / 1.14 | 7.7553 / 28.026 / 1.14 | 0s / 0.0' / +0.00 | OK |
| aUMa | Dubhe | [wiki](https://en.wikipedia.org/wiki/Dubhe) | 11 03 43.67 / +61 45 03.7 / 1.79 | 11.0621 / 61.751 / 1.79 | 11.0621 / 61.751 / 1.79 | -0s / -0.0' / +0.00 | OK |
| hUMa | Alkaid | [wiki](https://en.wikipedia.org/wiki/Alkaid) | 13 47 32.44 / +49 18 47.8 / 1.86 | 13.7923 / 49.313 / 1.86 | 13.7923 / 49.313 / 1.86 | -0s / 0.0' / +0.00 | OK |
| aAnd | Alpheratz | [wiki](https://en.wikipedia.org/wiki/Alpheratz) | 00 08 23.26 / +29 05 25.6 / 2.06 | 0.1398 / 29.090 / 2.06 | 0.1398 / 29.090 / 2.06 | 0s / -0.0' / +0.00 | OK |
| aPer | Mirfak | [wiki](https://en.wikipedia.org/wiki/Mirfak) | 03 24 19.37 / +49 51 40.2 / 1.82 | 3.4054 / 49.861 / 1.82 | 3.4054 / 49.861 / 1.82 | 0s / 0.0' / +0.00 | OK |
| aCet | Menkar | [wiki](https://en.wikipedia.org/wiki/Menkar) | 03 02 16.77 / +04 05 23.1 / 2.53 | 3.0380 / 4.090 / 2.53 | 3.0380 / 4.090 / 2.53 | 0s / -0.0' / +0.00 | OK |
| bCet | Diphda | [wiki](https://en.wikipedia.org/wiki/Beta_Ceti) | 00 43 35.37 / -17 59 11.8 / 2.02 | 0.7265 / -17.987 / 2.02 | 0.7265 / -17.987 / 2.02 | 0s / 0.0' / +0.00 | OK |
| bCas | Caph | [wiki](https://en.wikipedia.org/wiki/Beta_Cassiopeiae) | 00 09 10.69 / +59 08 59.2 / 2.28 | 0.1530 / 59.150 / 2.28 | 0.1530 / 59.150 / 2.28 | 0s / 0.0' / +0.00 | OK |
| gDra | Eltanin | [wiki](https://en.wikipedia.org/wiki/Gamma_Draconis) | 17 56 36.37 / +51 29 20.0 / 2.23 | 17.9434 / 51.489 / 2.23 | 17.9434 / 51.489 / 2.23 | -0s / 0.0' / +0.00 | OK |
| aOph | Rasalhague | [wiki](https://en.wikipedia.org/wiki/Rasalhague) | 17 34 56.07 / +12 33 36.1 / 2.07 | 17.5822 / 12.560 / 2.07 | 17.5822 / 12.560 / 2.07 | -0s / -0.0' / +0.00 | OK |
| lSco | Shaula | [wiki](https://en.wikipedia.org/wiki/Lambda_Scorpii) | 17 33 36.52 / -37 06 13.8 / 1.63 | 17.5601 / -37.104 / 1.63 | 17.5601 / -37.104 / 1.63 | -0s / 0.0' / +0.00 | OK |
| eSgr | Kaus Australis | [wiki](https://en.wikipedia.org/wiki/Epsilon_Sagittarii) | 18 24 10.32 / -34 23 04.6 / 1.85 | 18.4029 / -34.385 / 1.85 | 18.4029 / -34.385 / 1.85 | 0s / 0.0' / +0.00 | OK |
| thCen | Menkent | [wiki](https://en.wikipedia.org/wiki/Theta_Centauri) | 14 06 40.95 / -36 22 11.8 / 2.06 | 14.1114 / -36.370 / 2.06 | 14.1114 / -36.370 / 2.06 | 0s / -0.0' / +0.00 | OK |
| lVel | Suhail | [wiki](https://en.wikipedia.org/wiki/Lambda_Velorum) | 09 07 59.76 / -43 25 57.3 / 2.21 | 9.1333 / -43.433 / 2.21 | 9.1333 / -43.433 / 2.21 | 0s / -0.0' / +0.00 | OK |
| zPup | Naos | [wiki](https://en.wikipedia.org/wiki/Zeta_Puppis) | 08 03 35.05 / -40 00 11.3 / 2.25 | 8.0597 / -40.003 / 2.25 | 8.0597 / -40.003 / 2.25 | -0s / -0.0' / +0.00 | OK |
| aPhe | Ankaa | [wiki](https://en.wikipedia.org/wiki/Alpha_Phoenicis) | 00 26 17.06 / -42 18 21.8 / 2.38 | 0.4381 / -42.306 / 2.38 | 0.4381 / -42.306 / 2.38 | 0s / -0.0' / +0.00 | OK |
| gHya | gamma Hya | [wiki](https://en.wikipedia.org/wiki/Gamma_Hydrae) | 13 18 55.30 / -23 10 17.5 / 2.99 | 13.3154 / -23.172 / 2.99 | 13.3151 / -23.172 / 3.00 | -1s / -0.0' / +0.01 | OK |
| aCVn | Cor Caroli | [wiki](https://en.wikipedia.org/wiki/Cor_Caroli) | 12 56 01.67 / +38 19 06.2 / 2.84-2.98 | 12.9338 / 38.318 / 2.91 | 12.9338 / 38.318 / 2.90 | 0s / -0.0' / -0.01 | OK |
| aHer | Rasalgethi | [wiki](https://en.wikipedia.org/wiki/Alpha_Herculis) | 17 14 38.85 / +14 23 25.3 / 2.7-4.0 | 17.2441 / 14.390 / 3.35 | 17.2441 / 14.390 / 3.35 | -0s / -0.0' / +0.00 | OK |
| aGem | Castor | [wiki](https://en.wikipedia.org/wiki/Castor_(star)) | 07 34 35.86 / +31 53 17.8 / 1.93 (A; combined 1.58) | 7.5766 / 31.888 / 1.58 | 7.5767 / 31.888 / 1.58 | 0s / 0.0' / +0.00 | OK |
| aHya | Alphard | [wiki](https://en.wikipedia.org/wiki/Alphard) | 09 27 35.24 / -08 39 31.0 / 2.00 | 9.4598 / -8.659 / 2.00 | 9.4598 / -8.659 / 1.98 | 0s / 0.0' / -0.02 | OK |
| ePeg | Enif | [wiki](https://en.wikipedia.org/wiki/Enif) | 21 44 11.16 / +09 52 30.0 / 2.37-2.45 | 21.7364 / 9.875 / 2.41 | 21.7364 / 9.875 / 2.39 | -0s / 0.0' / -0.02 | OK |
| aAri | Hamal | [wiki](https://en.wikipedia.org/wiki/Hamal) | 02 07 10.41 / +23 27 44.7 / 2.00 | 2.1196 / 23.462 / 2.00 | 2.1196 / 23.462 / 2.00 | 0s / -0.0' / +0.00 | OK |
| bPer | Algol | [wiki](https://en.wikipedia.org/wiki/Algol) | 03 08 10.13 / +40 57 20.3 / 2.12 | 3.1361 / 40.956 / 2.12 | 3.1361 / 40.956 / 2.12 | -0s / -0.0' / +0.00 | OK |
| aCep | Alderamin | [wiki](https://en.wikipedia.org/wiki/Alderamin) | 21 18 34.77 / +62 35 08.1 / 2.46 | 21.3097 / 62.586 / 2.46 | 21.3097 / 62.586 / 2.46 | 0s / 0.0' / +0.00 | OK |
| bUMi | Kochab | [wiki](https://en.wikipedia.org/wiki/Beta_Ursae_Minoris) | 14 50 42.33 / +74 09 19.8 / 2.08 | 14.8451 / 74.156 / 2.08 | 14.8451 / 74.156 / 2.08 | 0s / 0.0' / +0.00 | OK |
| zUMa | Mizar | [wiki](https://en.wikipedia.org/wiki/Mizar) | 13 23 55.54 / +54 55 31.3 / 2.04 | 13.3988 / 54.925 / 2.04 | 13.3988 / 54.925 / 2.04 | 0s / 0.0' / +0.00 | OK |
| thSco | Sargas | [wiki](https://en.wikipedia.org/wiki/Theta_Scorpii) | 17 37 19.13 / -42 59 52.2 / 1.84 | 17.6220 / -42.998 / 1.84 | 17.6219 / -42.998 / 1.84 | -0s / 0.0' / +0.00 | OK |
| thEri | Acamar | [wiki](https://en.wikipedia.org/wiki/Theta_Eridani) | 02 58 15.68 / -40 18 16.8 / 3.18 (theta1 alone; theta1+theta2 combined 2.88) | 2.9710 / -40.305 / 2.88 | 2.9711 / -40.305 / 2.88 | 0s / -0.0' / +0.00 | OK |
| sSgr | Nunki | [wiki](https://en.wikipedia.org/wiki/Sigma_Sagittarii) | 18 55 15.93 / -26 17 48.2 / 2.05 | 18.9211 / -26.297 / 2.05 | 18.9211 / -26.297 / 2.05 | 0s / 0.0' / +0.00 | OK |
| bCyg | Albireo | [wiki](https://en.wikipedia.org/wiki/Albireo) | 19 30 43.29 / +27 57 34.8 / 3.21 (Aa; A+B combined 3.05) | 19.5120 / 27.960 / 3.05 | 19.5120 / 27.960 / 3.05 | -0s / 0.0' / +0.00 | OK |
| aPeg | Markab | [wiki](https://en.wikipedia.org/wiki/Alpha_Pegasi) | 23 04 45.65 / +15 12 19.0 / 2.48 | 23.0793 / 15.205 / 2.48 | 23.0793 / 15.205 / 2.48 | -0s / 0.0' / +0.00 | OK |
| nDra | Kuma | [wiki](https://en.wikipedia.org/wiki/Nu_Draconis) | 17 32 10.57 / +55 11 03.3 / 4.88 | 17.5363 / 55.184 / 4.88 | 17.5362 / 55.184 / 4.88 | -0s / -0.0' / +0.00 | OK |
| kCyg | kappa Cyg | [wiki](https://en.wikipedia.org/wiki/Kappa_Cygni) | 19 17 06.17 / +53 22 06.5 / 3.81 | 19.2850 / 53.368 / 3.81 | 19.2851 / 53.368 / 3.80 | 0s / 0.0' / -0.01 | OK |
| phAnd | phi And | [wiki](https://en.wikipedia.org/wiki/Phi_Andromedae) | 01 09 30.13 / +47 14 30.5 / 4.25 | 1.1584 / 47.242 / 4.25 | 1.1583 / 47.242 / 4.25 | -0s / -0.0' / +0.00 | OK |
| mVir | mu Vir | [wiki](https://en.wikipedia.org/wiki/Mu_Virginis) | 14 43 03.62 / -05 39 29.5 / 3.88 | 14.7177 / -5.658 / 3.88 | 14.7177 / -5.658 / 3.88 | 0s / -0.0' / +0.00 | OK |
| lTau | lambda Tau | [wiki](https://en.wikipedia.org/wiki/Lambda_Tauri) | 04 00 40.82 / +12 29 25.2 / 3.37-3.91 | 4.0113 / 12.490 / 3.64 | 4.0113 / 12.490 / 3.47 | -0s / -0.0' / -0.17 | ok (note) |
| oHer | omicron Her | [wiki](https://en.wikipedia.org/wiki/Omicron_Herculis) | 18 07 32.55 / +28 45 45.0 / 3.83-3.85 | 18.1257 / 28.762 / 3.84 | 18.1256 / 28.762 / 3.83 | -0s / 0.0' / -0.01 | OK |
| tLib | tau Lib | [wiki](https://en.wikipedia.org/wiki/Tau_Librae) | 15 38 39.37 / -29 46 39.9 / 3.68 | 15.6443 / -29.778 / 3.68 | 15.6446 / -29.778 / 3.66 | 1s / 0.0' / -0.02 | OK |
| nOph | nu Oph | [wiki](https://en.wikipedia.org/wiki/Nu_Ophiuchi) | 17 59 01.59 / -09 46 25.1 / 3.33 | 17.9838 / -9.774 / 3.33 | 17.9838 / -9.774 / 3.34 | 0s / 0.0' / +0.01 | OK |
| t6Eri | tau6 Eri | [wiki](https://en.wikipedia.org/wiki/Tau6_Eridani) | 03 46 50.89 / -23 14 59.0 / 4.22 | 3.7808 / -23.250 / 4.22 | 3.7805 / -23.249 / 4.23 | -1s / 0.1' / +0.01 | OK |
| lEri | lambda Eri | [wiki](https://en.wikipedia.org/wiki/Lambda_Eridani) | 05 09 08.78 / -08 45 14.7 / 4.27 | 5.1524 / -8.754 / 4.27 | 5.1526 / -8.754 / 4.27 | 1s / -0.0' / +0.00 | OK |
| chi2Ori | chi2 Ori | [wiki](https://en.wikipedia.org/wiki/Chi2_Orionis) | 06 03 55.18 / +20 08 18.4 / 4.63 | 6.0653 / 20.138 / 4.63 | 6.0658 / 20.138 / 4.63 | 2s / -0.0' / +0.00 | OK |
| sCMa | sigma CMa | [wiki](https://en.wikipedia.org/wiki/Sigma_Canis_Majoris) | 07 01 43.15 / -27 56 05.4 / 3.43-3.51 | 7.0287 / -27.935 / 3.47 | 7.0286 / -27.935 / 3.47 | -0s / 0.0' / +0.00 | OK |
| thBoo | theta Boo | [wiki](https://en.wikipedia.org/wiki/Theta_Bo%C3%B6tis) | 14 25 11.80 / +51 51 02.7 / 4.05 | 14.4199 / 51.851 / 4.05 | 14.4211 / 51.851 / 4.05 | 4s / 0.0' / +0.00 | OK |
| upUMa | upsilon UMa | [wiki](https://en.wikipedia.org/wiki/Upsilon_Ursae_Majoris) | 09 50 59.36 / +59 02 19.4 / 3.68-3.86 | 9.8498 / 59.039 / 3.77 | 9.8500 / 59.039 / 3.80 | 1s / -0.0' / +0.03 | OK |
| kDra | kappa Dra | [wiki](https://en.wikipedia.org/wiki/Kappa_Draconis) | 12 33 28.94 / +69 47 17.6 / 3.82 | 12.5580 / 69.788 / 3.82 | 12.5581 / 69.788 / 3.87 | 0s / -0.0' / +0.05 | OK |
| iCep | iota Cep | [wiki](https://en.wikipedia.org/wiki/Iota_Cephei) | 22 49 40.82 / +66 12 01.5 / 3.51 | 22.8280 / 66.200 / 3.51 | 22.8280 / 66.201 / 3.52 | -0s / 0.0' / +0.01 | OK |
| eLyr | epsilon Lyr (e1+e2) | [wiki](https://en.wikipedia.org/wiki/Epsilon_Lyrae) | 18 44 20.35 / +39 40 12.5 / 4.66+4.59 (combined 3.9) | 18.7390 / 39.670 / 3.90 | 18.7392 / 39.670 / 3.90 | 1s / 0.0' / +0.00 | OK |
| dLyr | delta2 Lyr | [wiki](https://en.wikipedia.org/wiki/Delta2_Lyrae) | 18 54 30.28 / +36 53 55.0 / 4.22-4.33 | 18.9084 / 36.899 / 4.28 | 18.9084 / 36.899 / 4.22 | -0s / -0.0' / -0.06 | OK |
| nAnd | nu And | [wiki](https://en.wikipedia.org/wiki/Nu_Andromedae) | 00 49 48.85 / +41 04 44.1 / 4.52 | 0.8302 / 41.079 / 4.52 | 0.8302 / 41.079 / 4.53 | -0s / -0.0' / +0.01 | OK |
| phHer | phi Her | [wiki](https://en.wikipedia.org/wiki/Phi_Herculis) | 16 08 46.18 / +44 56 05.7 / 4.24 | 16.1462 / 44.935 / 4.24 | 16.1456 / 44.935 / 4.23 | -2s / 0.0' / -0.01 | OK |
| tGem | tau Gem | [wiki](https://en.wikipedia.org/wiki/Tau_Geminorum) | 07 11 08.37 / +30 14 42.6 / 4.42 | 7.1857 / 30.245 / 4.42 | 7.1857 / 30.245 / 4.41 | 0s / 0.0' / -0.01 | OK |
| upGem | upsilon Gem | [wiki](https://en.wikipedia.org/wiki/Upsilon_Geminorum) | 07 35 55.35 / +26 53 44.7 / 4.04 | 7.5987 / 26.896 / 4.04 | 7.5986 / 26.896 / 4.06 | -0s / 0.0' / +0.02 | OK |
| zCep | zeta Cep | [wiki](https://en.wikipedia.org/wiki/Zeta_Cephei) | 22 10 51.28 / +58 12 04.5 / 3.35 | 22.1809 / 58.201 / 3.35 | 22.1809 / 58.201 / 3.35 | -0s / -0.0' / +0.00 | OK |
| xDra | Grumium | [wiki](https://en.wikipedia.org/wiki/Xi_Draconis) | 17 53 31.73 / +56 52 21.5 / 3.75 | 17.8921 / 56.873 / 3.75 | 17.8921 / 56.873 / 3.75 | -0s / -0.0' / +0.00 | OK |
| zDra | Aldhibah | [wiki](https://en.wikipedia.org/wiki/Zeta_Draconis) | 17 08 47.20 / +65 42 52.9 / 3.17 | 17.1464 / 65.715 / 3.17 | 17.1465 / 65.715 / 3.17 | 0s / -0.0' / +0.00 | OK |
| pPeg | pi2 Peg | [wiki](https://en.wikipedia.org/wiki/Pi2_Pegasi) | 22 09 59.24 / +33 10 41.6 / 4.28 | 22.1665 / 33.178 / 4.28 | 22.1665 / 33.178 / 4.28 | 0s / -0.0' / +0.00 | OK |
| mBoo | Alkalurops | [wiki](https://en.wikipedia.org/wiki/Mu1_Bo%C3%B6tis) | 15 24 29.43 / +37 22 37.8 / 4.31 | 15.4082 / 37.377 / 4.31 | 15.4083 / 37.377 / 4.31 | 0s / -0.0' / +0.00 | OK |
| tBoo | tau Boo | [wiki](https://en.wikipedia.org/wiki/Tau_Bo%C3%B6tis) | 13 47 15.74 / +17 27 24.8 / 4.50 | 13.7877 / 17.457 / 4.50 | 13.7877 / 17.457 / 4.50 | -0s / 0.0' / +0.00 | OK |
| zBoo | zeta Boo | [wiki](https://en.wikipedia.org/wiki/Zeta_Bo%C3%B6tis) | 14 41 08.95 / +13 43 41.9 / 3.78 | 14.6858 / 13.728 / 3.78 | 14.6854 / 13.728 / 3.78 | -2s / -0.0' / +0.00 | OK |
| lBoo | lambda Boo | [wiki](https://en.wikipedia.org/wiki/Lambda_Bo%C3%B6tis) | 14 16 23.02 / +46 05 17.9 / 4.18 | 14.2731 / 46.088 / 4.18 | 14.2729 / 46.088 / 4.18 | -1s / -0.0' / +0.00 | OK |
| rBoo | rho Boo | [wiki](https://en.wikipedia.org/wiki/Rho_Bo%C3%B6tis) | 14 31 49.79 / +30 22 17.2 / 3.59 | 14.5305 / 30.371 / 3.59 | 14.5311 / 30.371 / 3.58 | 2s / -0.0' / -0.01 | OK |
| thHer | theta Her | [wiki](https://en.wikipedia.org/wiki/Theta_Herculis) | 17 56 15.18 / +37 15 01.9 / 3.85 | 17.9376 / 37.251 / 3.85 | 17.9375 / 37.251 / 3.86 | -0s / -0.0' / +0.01 | OK |
| rHer | rho Her | [wiki](https://en.wikipedia.org/wiki/Rho_Herculis) | 17 23 40.97 / +37 08 45.3 / 4.51+5.40 (combined 4.1) | 17.3947 / 37.146 / 4.10 | 17.3947 / 37.146 / 4.17 | -0s / -0.0' / +0.07 | OK |
| sHer | sigma Her | [wiki](https://en.wikipedia.org/wiki/Sigma_Herculis) | 16 34 06.18 / +42 26 13.3 / 4.18 | 16.5684 / 42.437 / 4.18 | 16.5680 / 42.437 / 4.20 | -1s / -0.0' / +0.02 | OK |
| tHer | tau Her | [wiki](https://en.wikipedia.org/wiki/Tau_Herculis) | 16 19 44.44 / +46 18 48.1 / 3.91 | 16.3290 / 46.313 / 3.91 | 16.3291 / 46.313 / 3.89 | 0s / -0.0' / -0.02 | OK |
| iHer | iota Her | [wiki](https://en.wikipedia.org/wiki/Iota_Herculis) | 17 39 27.89 / +46 00 22.8 / 3.80 | 17.6577 / 46.006 / 3.80 | 17.6577 / 46.006 / 3.80 | -0s / -0.0' / +0.00 | OK |
| lHer | Maasym | [wiki](https://en.wikipedia.org/wiki/Lambda_Herculis) | 17 30 44.31 / +26 06 38.3 / 4.41 | 17.5123 / 26.111 / 4.41 | 17.5125 / 26.111 / 4.41 | 1s / -0.0' / +0.00 | OK |
| xHer | xi Her | [wiki](https://en.wikipedia.org/wiki/Xi_Herculis) | 17 57 45.89 / +29 14 52.4 / 3.70 | 17.9627 / 29.248 / 3.70 | 17.9622 / 29.248 / 3.70 | -2s / 0.0' / +0.00 | OK |
| kPeg | kappa Peg | [wiki](https://en.wikipedia.org/wiki/Kappa_Pegasi) | 21 44 38.73 / +25 38 42.1 / 4.16 | 21.7441 / 25.645 / 4.16 | 21.7442 / 25.645 / 4.13 | 0s / -0.0' / -0.03 | OK |
| lPeg | lambda Peg | [wiki](https://en.wikipedia.org/wiki/Lambda_Pegasi) | 22 46 31.88 / +23 33 56.4 / 3.93 | 22.7755 / 23.566 / 3.93 | 22.7753 / 23.566 / 3.95 | -1s / 0.0' / +0.02 | OK |
| iPeg | iota Peg | [wiki](https://en.wikipedia.org/wiki/Iota_Pegasi) | 22 07 00.66 / +25 20 42.4 / 3.77 | 22.1168 / 25.345 / 3.77 | 22.1168 / 25.345 / 3.76 | -0s / -0.0' / -0.01 | OK |
| mPeg | Sadalbari | [wiki](https://en.wikipedia.org/wiki/Mu_Pegasi) | 22 50 00.19 / +24 36 05.7 / 3.51 | 22.8334 / 24.602 / 3.51 | 22.8333 / 24.602 / 3.48 | -0s / 0.0' / -0.03 | OK |
| thPeg | Biham | [wiki](https://en.wikipedia.org/wiki/Theta_Pegasi) | 22 10 11.99 / +06 11 52.3 / 3.52 | 22.1700 / 6.198 / 3.52 | 22.1700 / 6.198 / 3.53 | 0s / 0.0' / +0.01 | OK |
| zPeg | Homam | [wiki](https://en.wikipedia.org/wiki/Zeta_Pegasi) | 22 41 27.72 / +10 49 52.9 / 3.41 | 22.6910 / 10.831 / 3.41 | 22.6911 / 10.831 / 3.40 | 0s / 0.0' / -0.01 | OK |
| hCep | eta Cep | [wiki](https://en.wikipedia.org/wiki/Eta_Cephei) | 20 45 17.38 / +61 50 19.6 / 3.43 | 20.7548 / 61.839 / 3.43 | 20.7543 / 61.839 / 3.43 | -2s / 0.0' / +0.00 | OK |
| dCep | delta Cep | [wiki](https://en.wikipedia.org/wiki/Delta_Cephei) | 22 29 10.27 / +58 24 54.7 / 3.48-4.37 | 22.4862 / 58.415 / 3.92 | 22.4863 / 58.415 / 3.95 | 0s / 0.0' / +0.03 | OK |
| eCep | epsilon Cep | [wiki](https://en.wikipedia.org/wiki/Epsilon_Cephei) | 22 15 02.20 / +57 02 36.9 / 4.15-4.21 | 22.2506 / 57.044 / 4.18 | 22.2504 / 57.043 / 4.19 | -1s / -0.0' / +0.01 | OK |
| t1Eri | tau1 Eri | [wiki](https://en.wikipedia.org/wiki/Tau1_Eridani) | 02 45 06.19 / -18 34 21.2 / 4.46 | 2.7517 / -18.573 / 4.46 | 2.7516 / -18.573 / 4.47 | -0s / -0.0' / +0.01 | OK |
| t5Eri | tau5 Eri | [wiki](https://en.wikipedia.org/wiki/Tau5_Eridani) | 03 33 47.28 / -21 37 58.4 / 4.26 | 3.5631 / -21.633 / 4.26 | 3.5634 / -21.633 / 4.27 | 1s / 0.0' / +0.01 | OK |
| t4Eri | tau4 Eri | [wiki](https://en.wikipedia.org/wiki/Tau4_Eridani) | 03 19 31.00 / -21 45 28.3 / 3.57-3.72 | 3.3253 / -21.758 / 3.65 | 3.3253 / -21.758 / 3.69 | 0s / -0.0' / +0.04 | OK |
| pEri | pi Eri | [wiki](https://en.wikipedia.org/wiki/Pi_Eridani) | 03 46 08.54 / -12 06 05.7 / 4.40 | 3.7690 / -12.102 / 4.40 | 3.7689 / -12.101 / 4.42 | -1s / 0.0' / +0.02 | OK |
| o1Eri | Beid | [wiki](https://en.wikipedia.org/wiki/Omicron1_Eridani) | 04 11 51.94 / -06 50 15.3 / 4.00-4.05 | 4.1978 / -6.838 / 4.03 | 4.1976 / -6.838 / 4.04 | -1s / 0.0' / +0.01 | OK |
| nEri | nu Eri | [wiki](https://en.wikipedia.org/wiki/Nu_Eridani) | 04 36 19.14 / -03 21 08.9 / 3.93 | 4.6053 / -3.352 / 3.93 | 4.6064 / -3.353 / 3.93 | 4s / -0.0' / +0.00 | OK |
| mEri | mu Eri | [wiki](https://en.wikipedia.org/wiki/Mu_Eridani) | 04 45 30.15 / -03 15 16.8 / 4.00 | 4.7584 / -3.255 / 4.00 | 4.7584 / -3.255 / 4.02 | 0s / 0.0' / +0.02 | OK |
| zEri | zeta Eri | [wiki](https://en.wikipedia.org/wiki/Zeta_Eridani) | 03 15 50.03 / -08 49 11.0 / 4.80 | 3.2639 / -8.820 / 4.80 | 3.2638 / -8.820 / 4.80 | -0s / 0.0' / +0.00 | OK |
| hEri | Azha | [wiki](https://en.wikipedia.org/wiki/Eta_Eridani) | 02 56 25.65 / -08 53 53.3 / 3.87 | 2.9405 / -8.898 / 3.87 | 2.9403 / -8.898 / 3.89 | -1s / -0.0' / +0.02 | OK |
| dEri | Rana | [wiki](https://en.wikipedia.org/wiki/Delta_Eridani) | 03 43 14.90 / -09 45 48.2 / 3.53 | 3.7208 / -9.763 / 3.53 | 3.7208 / -9.763 / 3.54 | -0s / 0.0' / +0.01 | OK |
| psUMa | psi UMa | [wiki](https://en.wikipedia.org/wiki/Psi_Ursae_Majoris) | 11 09 39.81 / +44 29 54.6 / 3.01 | 11.1611 / 44.498 / 3.01 | 11.1613 / 44.498 / 3.01 | 1s / 0.0' / +0.00 | OK |
| chUMa | chi UMa | [wiki](https://en.wikipedia.org/wiki/Chi_Ursae_Majoris) | 11 46 03.01 / +47 46 45.9 / 3.72 | 11.7675 / 47.779 / 3.72 | 11.7675 / 47.779 / 3.71 | -0s / -0.0' / -0.01 | OK |
| nUMa | Alula Borealis | [wiki](https://en.wikipedia.org/wiki/Nu_Ursae_Majoris) | 11 18 28.74 / +33 05 39.5 / 3.49 | 11.3080 / 33.094 / 3.49 | 11.3080 / 33.094 / 3.49 | 0s / -0.0' / +0.00 | OK |
| xUMa | Alula Australis | [wiki](https://en.wikipedia.org/wiki/Xi_Ursae_Majoris) | 11 18 10.90 / +31 31 45.0 / 4.26+4.73 (combined 3.79) | 11.3030 / 31.529 / 3.79 | 11.3034 / 31.529 / 3.79 | 1s / 0.0' / +0.00 | OK |
| iLeo | iota Leo | [wiki](https://en.wikipedia.org/wiki/Iota_Leonis) | 11 23 55.45 / +10 31 46.2 / 4.00 | 11.3987 / 10.530 / 4.00 | 11.3985 / 10.530 / 3.94 | -1s / 0.0' / -0.06 | OK |
| sLeo | sigma Leo | [wiki](https://en.wikipedia.org/wiki/Sigma_Leonis) | 11 21 08.19 / +06 01 45.6 / 4.05 | 11.3523 / 6.029 / 4.05 | 11.3523 / 6.029 / 4.05 | 0s / 0.0' / +0.00 | OK |
| rLeo | rho Leo | [wiki](https://en.wikipedia.org/wiki/Rho_Leonis) | 10 32 48.67 / +09 18 23.7 / 3.83-3.90 | 10.5469 / 9.307 / 3.87 | 10.5469 / 9.307 / 3.85 | 0s / 0.0' / -0.02 | OK |
| oLeo | Subra | [wiki](https://en.wikipedia.org/wiki/Omicron_Leonis) | 09 41 09.03 / +09 53 32.3 / 3.52 | 9.6858 / 9.892 / 3.52 | 9.6858 / 9.892 / 3.52 | -0s / 0.0' / +0.00 | OK |
| nVir | nu Vir | [wiki](https://en.wikipedia.org/wiki/Nu_Virginis) | 11 45 51.56 / +06 31 45.7 / 4.04 | 11.7643 / 6.529 / 4.04 | 11.7643 / 6.529 / 4.03 | -0s / -0.0' / -0.01 | OK |
| tVir | tau Vir | [wiki](https://en.wikipedia.org/wiki/Tau_Virginis) | 14 01 38.79 / +01 32 40.3 / 4.28 | 14.0274 / 1.545 / 4.28 | 14.0273 / 1.544 / 4.26 | -1s / -0.0' / -0.02 | OK |
| thVir | theta Vir | [wiki](https://en.wikipedia.org/wiki/Theta_Virginis) | 13 09 56.99 / -05 32 20.4 / 4.37 | 13.1658 / -5.539 / 4.37 | 13.1657 / -5.539 / 4.38 | -0s / 0.0' / +0.01 | OK |
| iVir | Syrma | [wiki](https://en.wikipedia.org/wiki/Iota_Virginis) | 14 16 00.87 / -06 00 02.0 / 4.08 | 14.2669 / -6.001 / 4.08 | 14.2669 / -6.000 / 4.08 | -0s / 0.0' / +0.00 | OK |
| lOph | Marfik | [wiki](https://en.wikipedia.org/wiki/Lambda_Ophiuchi) | 16 30 54.82 / +01 59 02.1 / 3.82 | 16.5152 / 1.984 / 3.82 | 16.5153 / 1.984 / 3.82 | 0s / -0.0' / +0.00 | OK |
| kOph | kappa Oph | [wiki](https://en.wikipedia.org/wiki/Kappa_Ophiuchi) | 16 57 40.10 / +09 22 30.1 / 3.20 | 16.9611 / 9.375 / 3.20 | 16.9611 / 9.375 / 3.20 | -0s / -0.0' / +0.00 | OK |
| gOph | gamma Oph | [wiki](https://en.wikipedia.org/wiki/Gamma_Ophiuchi) | 17 47 53.56 / +02 42 26.2 / 3.75 | 17.7982 / 2.707 / 3.75 | 17.7982 / 2.707 / 3.75 | -0s / 0.0' / +0.00 | OK |
| lCet | lambda Cet | [wiki](https://en.wikipedia.org/wiki/Lambda_Ceti) | 02 59 42.89 / +08 54 26.6 / 4.71 | 2.9952 / 8.907 / 4.71 | 2.9952 / 8.907 / 4.70 | -0s / 0.0' / -0.01 | OK |
| mCet | mu Cet | [wiki](https://en.wikipedia.org/wiki/Mu_Ceti) | 02 44 56.54 / +10 06 50.9 / 4.27 | 2.7490 / 10.114 / 4.27 | 2.7490 / 10.114 / 4.27 | -0s / 0.0' / +0.00 | OK |
| xi2Cet | xi2 Cet | [wiki](https://en.wikipedia.org/wiki/Xi2_Ceti) | 02 28 09.56 / +08 27 36.2 / 4.28 | 2.4693 / 8.460 / 4.28 | 2.4698 / 8.460 / 4.28 | 2s / 0.0' / +0.00 | OK |
| dCet | delta Cet | [wiki](https://en.wikipedia.org/wiki/Delta_Ceti) | 02 39 28.96 / +00 19 42.6 / 4.06 | 2.6580 / 0.329 / 4.06 | 2.6583 / 0.329 / 4.07 | 1s / 0.0' / +0.01 | OK |
| thCet | theta Cet | [wiki](https://en.wikipedia.org/wiki/Theta_Ceti) | 01 24 01.40 / -08 10 59.7 / 3.60 | 1.4004 / -8.183 / 3.60 | 1.4000 / -8.183 / 3.60 | -1s / 0.0' / +0.00 | OK |
| iCet | iota Cet | [wiki](https://en.wikipedia.org/wiki/Iota_Ceti) | 00 19 25.67 / -08 49 26.1 / 3.56 | 0.3238 / -8.824 / 3.56 | 0.3239 / -8.824 / 3.56 | 0s / 0.0' / +0.00 | OK |
| zAnd | zeta And | [wiki](https://en.wikipedia.org/wiki/Zeta_Andromedae) | 00 47 20.33 / +24 16 01.8 / 3.92-4.14 | 0.7890 / 24.267 / 4.03 | 0.7892 / 24.267 / 4.06 | 1s / 0.0' / +0.03 | OK |
| hAnd | eta And | [wiki](https://en.wikipedia.org/wiki/Eta_Andromedae) | 00 57 12.40 / +23 25 03.5 / 4.40 | 0.9534 / 23.418 / 4.40 | 0.9535 / 23.418 / 4.40 | 0s / -0.0' / +0.00 | OK |
| eAnd | epsilon And | [wiki](https://en.wikipedia.org/wiki/Epsilon_Andromedae) | 00 38 33.35 / +29 18 42.3 / 4.36 | 0.6426 / 29.312 / 4.36 | 0.6428 / 29.313 / 4.37 | 1s / 0.0' / +0.01 | OK |
| mAnd | mu And | [wiki](https://en.wikipedia.org/wiki/Mu_Andromedae) | 00 56 45.21 / +38 29 57.6 / 3.87 | 0.9459 / 38.499 / 3.87 | 0.9458 / 38.499 / 3.87 | -0s / 0.0' / +0.00 | OK |
| 51And | Nembus | [wiki](https://en.wikipedia.org/wiki/51_Andromedae) | 01 37 59.56 / +48 37 41.6 / 3.57 | 1.6332 / 48.628 / 3.57 | 1.6332 / 48.628 / 3.57 | -0s / 0.0' / +0.00 | OK |
| aCrv | Alchiba | [wiki](https://en.wikipedia.org/wiki/Alpha_Corvi) | 12 08 24.82 / -24 43 44.0 / 4.03 | 12.1402 / -24.729 / 4.03 | 12.1402 / -24.729 / 4.02 | -0s / 0.0' / -0.01 | OK |
| xSgr | xi2 Sgr | [wiki](https://en.wikipedia.org/wiki/Xi2_Sagittarii) | 18 57 43.80 / -21 06 24.0 / 3.51 | 18.9622 / -21.107 / 3.51 | 18.9622 / -21.107 / 3.51 | 0s / -0.0' / +0.00 | OK |
| tSgr | tau Sgr | [wiki](https://en.wikipedia.org/wiki/Tau_Sagittarii) | 19 06 56.41 / -27 40 13.5 / 3.33 | 19.1157 / -27.670 / 3.33 | 19.1157 / -27.670 / 3.32 | 0s / 0.0' / -0.01 | OK |
| phSgr | phi Sgr | [wiki](https://en.wikipedia.org/wiki/Phi_Sagittarii) | 18 45 39.39 / -26 59 26.8 / 3.17 | 18.7609 / -26.991 / 3.17 | 18.7607 / -26.991 / 3.17 | -1s / -0.0' / +0.00 | OK |
| hSgr | eta Sgr | [wiki](https://en.wikipedia.org/wiki/Eta_Sagittarii) | 18 17 37.64 / -36 45 42.1 / 3.11 | 18.2938 / -36.762 / 3.11 | 18.2939 / -36.762 / 3.11 | 0s / -0.0' / +0.00 | OK |
| hSco | eta Sco | [wiki](https://en.wikipedia.org/wiki/Eta_Scorpii) | 17 12 09.20 / -43 14 21.1 / 3.33 | 17.2026 / -43.239 / 3.33 | 17.2026 / -43.239 / 3.33 | 0s / -0.0' / +0.00 | OK |
| iSco | iota1 Sco | [wiki](https://en.wikipedia.org/wiki/Iota1_Scorpii) | 17 47 35.08 / -40 07 37.2 / 3.03 | 17.7931 / -40.127 / 3.03 | 17.7926 / -40.127 / 3.03 | -2s / 0.0' / +0.00 | OK |
| mSco | mu1 Sco | [wiki](https://en.wikipedia.org/wiki/Mu1_Scorpii) | 16 51 52.23 / -38 02 50.6 / 2.94-3.22 | 16.8645 / -38.047 / 3.08 | 16.8645 / -38.047 / 3.00 | -0s / -0.0' / -0.08 | OK |
| nSco | Jabbah | [wiki](https://en.wikipedia.org/wiki/Nu_Scorpii) | 16 11 59.74 / -19 27 38.3 / 4.35 (A; A+B+C+D combined 4.0) | 16.1999 / -19.461 / 4.00 | 16.1997 / -19.460 / 4.00 | -1s / 0.0' / +0.00 | OK |
| sLib | Brachium | [wiki](https://en.wikipedia.org/wiki/Sigma_Librae) | 15 04 04.21 / -25 16 55.1 / 3.20-3.46 | 15.0678 / -25.282 / 3.33 | 15.0678 / -25.282 / 3.29 | -0s / 0.0' / -0.04 | OK |
| upLib | upsilon Lib | [wiki](https://en.wikipedia.org/wiki/Upsilon_Librae) | 15 37 01.45 / -28 08 06.3 / 3.63 | 15.6171 / -28.135 / 3.63 | 15.6168 / -28.135 / 3.58 | -1s / -0.0' / -0.05 | OK |
| gLib | Zubenelhakrabi | [wiki](https://en.wikipedia.org/wiki/Gamma_Librae) | 15 35 31.58 / -14 47 22.3 / 3.91 | 15.5921 / -14.790 / 3.91 | 15.5920 / -14.790 / 3.91 | -0s / 0.0' / +0.00 | OK |
| zSco | zeta2 Sco | [wiki](https://en.wikipedia.org/wiki/Zeta2_Scorpii) | 16 54 35.01 / -42 21 40.7 / 3.59-3.65 | 16.9097 / -42.361 / 3.62 | 16.9097 / -42.361 / 3.62 | -0s / -0.0' / +0.00 | OK |
| dOri | Mintaka | [wiki](https://en.wikipedia.org/wiki/Mintaka) | 05 32 00.40 / -00 17 56.7 / 2.23 | 5.5334 / -0.299 / 2.23 | 5.5334 / -0.299 / 2.23 | -0s / -0.0' / +0.00 | OK |
| eOri | Alnilam | [wiki](https://en.wikipedia.org/wiki/Alnilam) | 05 36 12.81 / -01 12 06.9 / 1.69 | 5.6036 / -1.202 / 1.69 | 5.6036 / -1.202 / 1.69 | 0s / 0.0' / +0.00 | OK |
| zOri | Alnitak | [wiki](https://en.wikipedia.org/wiki/Alnitak) | 05 40 45.53 / -01 56 34.3 / 1.77 | 5.6793 / -1.943 / 1.77 | 5.6793 / -1.943 / 1.77 | -0s / 0.0' / +0.00 | OK |
| gOri | Bellatrix | [wiki](https://en.wikipedia.org/wiki/Bellatrix) | 05 25 07.86 / +06 20 58.9 / 1.64 | 5.4188 / 6.350 / 1.64 | 5.4189 / 6.350 / 1.64 | 0s / 0.0' / +0.00 | OK |
| kOri | Saiph | [wiki](https://en.wikipedia.org/wiki/Saiph) | 05 47 45.39 / -09 40 10.6 / 2.09 | 5.7959 / -9.670 / 2.09 | 5.7959 / -9.670 / 2.09 | -0s / 0.0' / +0.00 | OK |
| lOri | Meissa | [wiki](https://en.wikipedia.org/wiki/Meissa) | 05 35 08.28 / +09 56 03.0 / 3.7 (A; A+B combined ~3.4) | 5.5856 / 9.934 / 3.40 | 5.5856 / 9.934 / 3.39 | -0s / 0.0' / -0.01 | OK |
| bTau | Elnath | [wiki](https://en.wikipedia.org/wiki/Elnath) | 05 26 17.51 / +28 36 26.8 / 1.65 | 5.4382 / 28.607 / 1.65 | 5.4382 / 28.608 / 1.65 | 0s / 0.0' / +0.00 | OK |
| etaTau | Alcyone | [wiki](https://en.wikipedia.org/wiki/Alcyone_(star)) | 03 47 29.08 / +24 06 18.5 / 2.87 | 3.7914 / 24.105 / 2.87 | 3.7914 / 24.105 / 2.87 | -0s / -0.0' / +0.00 | OK |
| zTau | Tianguan | [wiki](https://en.wikipedia.org/wiki/Zeta_Tauri) | 05 37 38.69 / +21 08 33.2 / 3.01 | 5.6274 / 21.143 / 3.01 | 5.6274 / 21.142 / 3.00 | -0s / -0.0' / -0.01 | OK |
| gGem | Alhena | [wiki](https://en.wikipedia.org/wiki/Alhena) | 06 37 42.71 / +16 23 57.4 / 1.92 | 6.6285 / 16.399 / 1.92 | 6.6285 / 16.399 / 1.93 | -0s / 0.0' / +0.01 | OK |
| mGem | Tejat | [wiki](https://en.wikipedia.org/wiki/Tejat) | 06 22 57.63 / +22 30 48.9 / 2.75-3.02 | 6.3827 / 22.514 / 2.88 | 6.3827 / 22.514 / 2.87 | 0s / 0.0' / -0.01 | OK |
| eGem | Mebsuta | [wiki](https://en.wikipedia.org/wiki/Mebsuta) | 06 43 55.93 / +25 07 52.1 / 3.06 | 6.7322 / 25.131 / 3.06 | 6.7322 / 25.131 / 3.06 | -0s / -0.0' / +0.00 | OK |
| dCMa | Wezen | [wiki](https://en.wikipedia.org/wiki/Wezen) | 07 08 23.49 / -26 23 35.5 / 1.82 | 7.1399 / -26.393 / 1.82 | 7.1399 / -26.393 / 1.82 | 0s / -0.0' / +0.00 | OK |
| bCMa | Mirzam | [wiki](https://en.wikipedia.org/wiki/Mirzam) | 06 22 41.99 / -17 57 21.3 / 1.98 | 6.3783 / -17.956 / 1.98 | 6.3783 / -17.956 / 1.98 | -0s / 0.0' / +0.00 | OK |
| hCMa | Aludra | [wiki](https://en.wikipedia.org/wiki/Aludra) | 07 24 05.70 / -29 18 11.2 / 2.38-2.48 | 7.4016 / -29.303 / 2.43 | 7.4016 / -29.303 / 2.45 | 0s / 0.0' / +0.02 | OK |
| bCMi | Gomeisa | [wiki](https://en.wikipedia.org/wiki/Gomeisa) | 07 27 09.04 / +08 17 21.5 / 2.84-2.92 | 7.4525 / 8.289 / 2.88 | 7.4525 / 8.289 / 2.89 | -0s / -0.0' / +0.01 | OK |
| bAur | Menkalinan | [wiki](https://en.wikipedia.org/wiki/Menkalinan) | 05 59 31.72 / +44 56 50.8 / 1.89-1.98 | 5.9921 / 44.947 / 1.94 | 5.9921 / 44.947 / 1.90 | -0s / -0.0' / -0.04 | OK |
| thAur | Mahasim | [wiki](https://en.wikipedia.org/wiki/Theta_Aurigae) | 05 59 43.27 / +37 12 45.3 / 2.62-2.70 | 5.9954 / 37.213 / 2.66 | 5.9953 / 37.212 / 2.62 | -0s / -0.0' / -0.04 | OK |
| iAur | Hassaleh | [wiki](https://en.wikipedia.org/wiki/Iota_Aurigae) | 04 56 59.62 / +33 09 57.9 / 2.69 | 4.9499 / 33.166 / 2.69 | 4.9499 / 33.166 / 2.69 | 0s / 0.0' / +0.00 | OK |
| eAur | Almaaz | [wiki](https://en.wikipedia.org/wiki/Epsilon_Aurigae) | 05 01 58.13 / +43 49 23.9 / 2.92-3.83 (normal 2.92; 3.8 only during the 2-year eclipse every 27 yr) | 5.0328 / 43.823 / 2.92 | 5.0328 / 43.823 / 2.99 | -0s / -0.0' / +0.07 | OK |
| zPer | zeta Per | [wiki](https://en.wikipedia.org/wiki/Zeta_Persei) | 03 54 07.92 / +31 53 01.1 / 2.86 | 3.9022 / 31.884 / 2.86 | 3.9022 / 31.884 / 2.85 | 0s / -0.0' / -0.01 | OK |
| ePer | epsilon Per | [wiki](https://en.wikipedia.org/wiki/Epsilon_Persei) | 03 57 51.23 / +40 00 36.8 / 2.88 | 3.9642 / 40.010 / 2.88 | 3.9642 / 40.010 / 2.89 | -0s / 0.0' / +0.01 | OK |
| gPer | gamma Per | [wiki](https://en.wikipedia.org/wiki/Gamma_Persei) | 03 04 47.82 / +53 30 23.3 / 2.93 | 3.0800 / 53.506 / 2.93 | 3.0799 / 53.506 / 2.93 | -0s / -0.0' / +0.00 | OK |
| dPer | delta Per | [wiki](https://en.wikipedia.org/wiki/Delta_Persei) | 03 42 55.50 / +47 47 15.2 / 3.01 | 3.7154 / 47.788 / 3.01 | 3.7154 / 47.788 / 3.01 | -0s / -0.0' / +0.00 | OK |
| bAnd | Mirach | [wiki](https://en.wikipedia.org/wiki/Mirach) | 01 09 43.91 / +35 37 13.8 / 2.01-2.10 | 1.1622 / 35.620 / 2.05 | 1.1622 / 35.621 / 2.05 | 0s / 0.0' / -0.00 | OK |
| gAnd | Almach | [wiki](https://en.wikipedia.org/wiki/Almach) | 02 03 53.95 / +42 19 47.0 / 2.27 | 2.0650 / 42.330 / 2.27 | 2.0650 / 42.330 / 2.27 | 0s / -0.0' / +0.00 | OK |
| bPeg | Scheat | [wiki](https://en.wikipedia.org/wiki/Scheat) | 23 03 46.46 / +28 04 58.0 / 2.31-2.74 | 23.0629 / 28.083 / 2.53 | 23.0629 / 28.083 / 2.42 | -0s / 0.0' / -0.11 | OK |
| gPeg | Algenib | [wiki](https://en.wikipedia.org/wiki/Algenib) | 00 13 14.15 / +15 11 00.9 / 2.78-2.89 | 0.2206 / 15.184 / 2.83 | 0.2206 / 15.184 / 2.83 | 0s / 0.0' / -0.00 | OK |
| bAri | Sheratan | [wiki](https://en.wikipedia.org/wiki/Sheratan) | 01 54 38.41 / +20 48 28.9 / 2.66 | 1.9107 / 20.808 / 2.66 | 1.9107 / 20.808 / 2.64 | 0s / 0.0' / -0.02 | OK |
| eCas | Segin | [wiki](https://en.wikipedia.org/wiki/Epsilon_Cassiopeiae) | 01 54 23.73 / +63 40 12.4 / 3.37 | 1.9066 / 63.670 / 3.37 | 1.9066 / 63.670 / 3.37 | 0s / -0.0' / +0.00 | OK |
| gUMa | Phecda | [wiki](https://en.wikipedia.org/wiki/Phecda) | 11 53 49.85 / +53 41 41.1 / 2.44 | 11.8972 / 53.695 / 2.44 | 11.8972 / 53.695 / 2.44 | 0s / 0.0' / +0.00 | OK |
| eUMa | Alioth | [wiki](https://en.wikipedia.org/wiki/Alioth) | 12 54 01.75 / +55 57 35.4 / 1.77 | 12.9005 / 55.960 / 1.77 | 12.9005 / 55.960 / 1.77 | 0s / -0.0' / +0.00 | OK |
| dUMa | Megrez | [wiki](https://en.wikipedia.org/wiki/Megrez) | 12 15 25.56 / +57 01 57.4 / 3.31 | 12.2571 / 57.033 / 3.31 | 12.2571 / 57.033 / 3.31 | 0s / -0.0' / +0.00 | OK |
| eCyg | Aljanah | [wiki](https://en.wikipedia.org/wiki/Epsilon_Cygni) | 20 46 12.68 / +33 58 12.9 / 2.48 | 20.7702 / 33.970 / 2.48 | 20.7702 / 33.970 / 2.48 | 0s / 0.0' / +0.00 | OK |
| dCyg | Fawaris | [wiki](https://en.wikipedia.org/wiki/Delta_Cygni) | 19 44 58.48 / +45 07 50.9 / 2.87 | 19.7496 / 45.131 / 2.87 | 19.7496 / 45.131 / 2.87 | 0s / -0.0' / +0.00 | OK |
| gAql | Tarazed | [wiki](https://en.wikipedia.org/wiki/Tarazed) | 19 46 15.58 / +10 36 47.7 / 2.71 | 19.7710 / 10.613 / 2.71 | 19.7710 / 10.613 / 2.72 | 0s / 0.0' / +0.01 | OK |
| zAql | Okab | [wiki](https://en.wikipedia.org/wiki/Zeta_Aquilae) | 19 05 24.61 / +13 51 48.5 / 2.98 | 19.0902 / 13.863 / 2.98 | 19.0902 / 13.863 / 2.99 | 0s / -0.0' / +0.01 | OK |
| hPeg | Matar | [wiki](https://en.wikipedia.org/wiki/Eta_Pegasi) | 22 43 00.14 / +30 13 16.5 / 2.95 | 22.7167 / 30.221 / 2.95 | 22.7167 / 30.221 / 2.94 | -0s / 0.0' / -0.01 | OK |
| aCas | Schedar | [wiki](https://en.wikipedia.org/wiki/Alpha_Cassiopeiae) | 00 40 30.44 / +56 32 14.4 / 2.24 | 0.6751 / 56.537 / 2.24 | 0.6751 / 56.537 / 2.24 | -0s / -0.0' / +0.00 | OK |
| gCas | Tsih | [wiki](https://en.wikipedia.org/wiki/Gamma_Cassiopeiae) | 00 56 42.50 / +60 43 00.3 / 2.39 | 0.9451 / 60.717 / 2.39 | 0.9451 / 60.717 / 2.47 | -0s / -0.0' / +0.08 | OK |
| dCas | Ruchbah | [wiki](https://en.wikipedia.org/wiki/Delta_Cassiopeiae) | 01 25 48.95 / +60 14 07.0 / 2.68 | 1.4303 / 60.235 / 2.68 | 1.4302 / 60.235 / 2.68 | -0s / 0.0' / +0.00 | OK |
| bUMa | Merak | [wiki](https://en.wikipedia.org/wiki/Beta_Ursae_Majoris) | 11 01 50.48 / +56 22 56.7 / 2.37 | 11.0307 / 56.382 / 2.37 | 11.0307 / 56.382 / 2.37 | 0s / -0.0' / +0.00 | OK |
| gCyg | Sadr | [wiki](https://en.wikipedia.org/wiki/Gamma_Cygni) | 20 22 13.70 / +40 15 24.0 / 2.23 | 20.3705 / 40.257 / 2.23 | 20.3705 / 40.257 / 2.23 | 0s / 0.0' / +0.00 | OK |
| aCrB | Alphecca | [wiki](https://en.wikipedia.org/wiki/Alpha_Coronae_Borealis) | 15 34 41.27 / +26 42 52.9 / 2.24 | 15.5781 / 26.715 / 2.24 | 15.5781 / 26.715 / 2.23 | -0s / 0.0' / -0.01 | OK |
| bHer | Kornephoros | [wiki](https://en.wikipedia.org/wiki/Beta_Herculis) | 16 30 13.20 / +21 29 22.6 / 2.81 | 16.5037 / 21.490 / 2.81 | 16.5037 / 21.490 / 2.81 | 0s / 0.0' / +0.00 | OK |
| zHer | zeta Her | [wiki](https://en.wikipedia.org/wiki/Zeta_Herculis) | 16 41 17.16 / +31 36 09.8 / 2.81 | 16.6881 / 31.603 / 2.81 | 16.6882 / 31.603 / 2.81 | 0s / 0.0' / +0.00 | OK |
| zOph | zeta Oph | [wiki](https://en.wikipedia.org/wiki/Zeta_Ophiuchi) | 16 37 09.54 / -10 34 01.5 / 2.56-2.58 | 16.6193 / -10.567 / 2.57 | 16.6193 / -10.567 / 2.56 | -0s / -0.0' / -0.01 | OK |
| dOph | Yed Prior | [wiki](https://en.wikipedia.org/wiki/Delta_Ophiuchi) | 16 14 20.74 / -03 41 39.6 / 2.75 | 16.2391 / -3.694 / 2.75 | 16.2393 / -3.694 / 2.74 | 1s / -0.0' / -0.01 | OK |
| bOph | Cebalrai | [wiki](https://en.wikipedia.org/wiki/Beta_Ophiuchi) | 17 43 28.35 / +04 34 02.3 / 2.75 | 17.7245 / 4.567 / 2.75 | 17.7244 / 4.567 / 2.77 | -1s / -0.0' / +0.02 | OK |
| gCrv | Gienah | [wiki](https://en.wikipedia.org/wiki/Gamma_Corvi) | 12 15 48.37 / -17 32 30.9 / 2.59 | 12.2634 / -17.542 / 2.59 | 12.2634 / -17.542 / 2.59 | -0s / 0.0' / +0.00 | OK |
| dCrv | Algorab | [wiki](https://en.wikipedia.org/wiki/Delta_Corvi) | 12 29 51.86 / -16 30 55.6 / 2.96 | 12.4977 / -16.515 / 2.96 | 12.4977 / -16.515 / 2.95 | -0s / -0.0' / -0.01 | OK |
| eCrv | epsilon Crv | [wiki](https://en.wikipedia.org/wiki/Epsilon_Corvi) | 12 10 07.48 / -22 37 11.2 / 3.02 | 12.1687 / -22.620 / 3.02 | 12.1680 / -22.620 / 3.02 | -3s / 0.0' / +0.00 | OK |
| bLib | Zubeneschamali | [wiki](https://en.wikipedia.org/wiki/Beta_Librae) | 15 17 00.41 / -09 22 58.5 / 2.61 | 15.2834 / -9.383 / 2.61 | 15.2834 / -9.383 / 2.61 | -0s / 0.0' / +0.00 | OK |
| aLib | Zubenelgenubi | [wiki](https://en.wikipedia.org/wiki/Alpha_Librae) | 14 50 52.71 / -16 02 30.4 / 2.74 | 14.8480 / -16.042 / 2.74 | 14.8479 / -16.042 / 2.75 | -0s / -0.0' / +0.01 | OK |
| dSco | Dschubba | [wiki](https://en.wikipedia.org/wiki/Delta_Scorpii) | 16 00 20.01 / -22 37 18.1 / 1.59-2.32 | 16.0056 / -22.622 / 1.96 | 16.0056 / -22.622 / 2.00 | 0s / -0.0' / +0.04 | OK |
| eSco | Larawag | [wiki](https://en.wikipedia.org/wiki/Epsilon_Scorpii) | 16 50 09.8 / -34 17 36 / 2.24-2.35 | 16.8361 / -34.293 / 2.29 | 16.8361 / -34.293 / 2.29 | 0s / 0.0' / -0.00 | OK |
| kSco | kappa Sco | [wiki](https://en.wikipedia.org/wiki/Kappa_Scorpii) | 17 42 29.28 / -39 01 47.9 / 2.41 | 17.7081 / -39.030 / 2.41 | 17.7081 / -39.030 / 2.39 | -0s / -0.0' / -0.02 | OK |
| bSco | Acrab | [wiki](https://en.wikipedia.org/wiki/Beta_Scorpii) | 16 05 26.23 / -19 48 19.6 / 2.62 (beta1; beta1+beta2 combined 2.50) | 16.0906 / -19.805 / 2.50 | 16.0906 / -19.805 / 2.50 | -0s / 0.0' / +0.00 | OK |
| upSco | Lesath | [wiki](https://en.wikipedia.org/wiki/Upsilon_Scorpii) | 17 30 45.84 / -37 17 44.9 / 2.70 | 17.5127 / -37.296 / 2.70 | 17.5128 / -37.296 / 2.70 | 0s / 0.0' / +0.00 | OK |
| tSco | tau Sco | [wiki](https://en.wikipedia.org/wiki/Tau_Scorpii) | 16 35 52.95 / -28 12 57.7 / 2.82 | 16.5980 / -28.216 / 2.82 | 16.5980 / -28.216 / 2.82 | -0s / 0.0' / +0.00 | OK |
| pSco | pi Sco | [wiki](https://en.wikipedia.org/wiki/Pi_Scorpii) | 15 58 51.11 / -26 06 50.8 / 2.89 | 15.9809 / -26.114 / 2.89 | 15.9809 / -26.114 / 2.89 | 0s / 0.0' / +0.00 | OK |
| sSco | Alniyat | [wiki](https://en.wikipedia.org/wiki/Sigma_Scorpii) | 16 21 11.32 / -25 35 34.1 / 2.88 | 16.3531 / -25.593 / 2.88 | 16.3531 / -25.593 / 2.88 | -0s / 0.0' / +0.00 | OK |
| dSgr | Kaus Media | [wiki](https://en.wikipedia.org/wiki/Delta_Sagittarii) | 18 20 59.64 / -29 49 41.2 / 2.70 | 18.3499 / -29.828 / 2.70 | 18.3499 / -29.828 / 2.70 | 0s / 0.0' / +0.00 | OK |
| lSgr | Kaus Borealis | [wiki](https://en.wikipedia.org/wiki/Lambda_Sagittarii) | 18 27 58.24 / -25 25 18.1 / 2.81 | 18.4662 / -25.422 / 2.81 | 18.4662 / -25.422 / 2.82 | 0s / -0.0' / +0.01 | OK |
| zSgr | Ascella | [wiki](https://en.wikipedia.org/wiki/Zeta_Sagittarii) | 19 02 36.73 / -29 52 48.2 / 2.59 | 19.0435 / -29.880 / 2.59 | 19.0435 / -29.880 / 2.60 | -0s / -0.0' / +0.01 | OK |
| pSgr | Albaldah | [wiki](https://en.wikipedia.org/wiki/Pi_Sagittarii) | 19 09 45.83 / -21 01 25.0 / 2.89 | 19.1627 / -21.024 / 2.89 | 19.1627 / -21.024 / 2.88 | -0s / 0.0' / -0.01 | OK |
| gSgr | Alnasl | [wiki](https://en.wikipedia.org/wiki/Gamma2_Sagittarii) | 18 05 48.48 / -30 25 26.5 / 2.96 | 18.0968 / -30.424 / 2.96 | 18.0968 / -30.424 / 2.98 | 0s / 0.0' / +0.02 | OK |
| gVir | Porrima | [wiki](https://en.wikipedia.org/wiki/Gamma_Virginis) | 12 41 39.64 / -01 26 57.7 / 2.74 | 12.6943 / -1.449 / 2.74 | 12.6943 / -1.449 / 2.74 | -0s / -0.0' / +0.00 | OK |
| eBoo | Izar | [wiki](https://en.wikipedia.org/wiki/Epsilon_Bo%C3%B6tis) | 14 44 59.22 / +27 04 27.2 / 2.45 (A; combined 2.37) | 14.7498 / 27.074 / 2.37 | 14.7498 / 27.074 / 2.37 | 0s / -0.0' / +0.00 | OK |
| hBoo | Muphrid | [wiki](https://en.wikipedia.org/wiki/Eta_Bo%C3%B6tis) | 13 54 41.08 / +18 23 51.8 / 2.68 | 13.9114 / 18.398 / 2.68 | 13.9115 / 18.398 / 2.68 | 0s / -0.0' / +0.00 | OK |
| gLeo | Algieba | [wiki](https://en.wikipedia.org/wiki/Gamma_Leonis) | 10 19 58.35 / +19 50 29.3 / 2.08 | 10.3329 / 19.841 / 2.08 | 10.3329 / 19.841 / 2.08 | 0s / 0.0' / +0.00 | OK |
| bLeo | Denebola | [wiki](https://en.wikipedia.org/wiki/Denebola) | 11 49 03.58 / +14 34 19.4 / 2.14 | 11.8177 / 14.572 / 2.14 | 11.8177 / 14.572 / 2.14 | 0s / -0.0' / +0.00 | OK |
| eLeo | Algenubi | [wiki](https://en.wikipedia.org/wiki/Epsilon_Leonis) | 09 45 51.07 / +23 46 27.3 / 2.98 | 9.7642 / 23.774 / 2.98 | 9.7641 / 23.774 / 2.98 | -0s / -0.0' / +0.00 | OK |
| aLep | Arneb | [wiki](https://en.wikipedia.org/wiki/Arneb) | 05 32 43.82 / -17 49 20.2 / 2.59 | 5.5455 / -17.822 / 2.59 | 5.5455 / -17.822 / 2.58 | -0s / -0.0' / -0.01 | OK |
| bLep | Nihal | [wiki](https://en.wikipedia.org/wiki/Beta_Leporis) | 05 28 14.72 / -20 45 34.0 / 2.84 | 5.4708 / -20.759 / 2.84 | 5.4707 / -20.759 / 2.84 | -0s / 0.0' / +0.00 | OK |
| pPup | pi Pup | [wiki](https://en.wikipedia.org/wiki/Pi_Puppis) | 07 17 08.56 / -37 05 50.9 / 2.69-2.76 | 7.2857 / -37.097 / 2.72 | 7.2857 / -37.097 / 2.71 | -0s / -0.0' / -0.01 | OK |
| rPup | Tureis | [wiki](https://en.wikipedia.org/wiki/Rho_Puppis) | 08 07 32.65 / -24 18 15.6 / 2.68-2.87 | 8.1257 / -24.304 / 2.78 | 8.1256 / -24.304 / 2.81 | -0s / 0.0' / +0.03 | OK |
| iCen | iota Cen | [wiki](https://en.wikipedia.org/wiki/Iota_Centauri) | 13 20 35.82 / -36 42 44.2 / 2.73 | 13.3433 / -36.712 / 2.73 | 13.3433 / -36.712 / 2.75 | 0s / -0.0' / +0.02 | OK |
| bLup | beta Lup | [wiki](https://en.wikipedia.org/wiki/Beta_Lupi) | 14 58 31.93 / -43 08 02.3 / 2.68 | 14.9755 / -43.134 / 2.68 | 14.9755 / -43.134 / 2.68 | -0s / 0.0' / +0.00 | OK |
| bAqr | Sadalsuud | [wiki](https://en.wikipedia.org/wiki/Beta_Aquarii) | 21 31 33.53 / -05 34 16.2 / 2.87 | 21.5260 / -5.571 / 2.87 | 21.5260 / -5.571 / 2.87 | 0s / -0.0' / +0.00 | OK |
| aAqr | Sadalmelik | [wiki](https://en.wikipedia.org/wiki/Alpha_Aquarii) | 22 05 47.04 / -00 19 11.5 / 2.94 | 22.0964 / -0.320 / 2.94 | 22.0964 / -0.320 / 2.94 | 0s / -0.0' / +0.00 | OK |
| bEri | Cursa | [wiki](https://en.wikipedia.org/wiki/Beta_Eridani) | 05 07 50.99 / -05 05 11.2 / 2.80 | 5.1308 / -5.086 / 2.80 | 5.1308 / -5.086 / 2.79 | -0s / 0.0' / -0.01 | OK |
| gEri | Zaurak | [wiki](https://en.wikipedia.org/wiki/Gamma_Eridani) | 03 58 01.77 / -13 30 30.7 / 2.88-2.96 | 3.9672 / -13.509 / 2.92 | 3.9672 / -13.508 / 2.95 | 0s / 0.0' / +0.03 | OK |
| bDra | Rastaban | [wiki](https://en.wikipedia.org/wiki/Beta_Draconis) | 17 30 25.96 / +52 18 05.0 / 2.79 | 17.5072 / 52.301 / 2.79 | 17.5072 / 52.301 / 2.79 | -0s / 0.0' / +0.00 | OK |
| hDra | Athebyne | [wiki](https://en.wikipedia.org/wiki/Eta_Draconis) | 16 23 59.49 / +61 30 51.2 / 2.73 | 16.3999 / 61.514 / 2.73 | 16.3999 / 61.514 / 2.74 | 0s / -0.0' / +0.01 | OK |
| bCep | Alfirk | [wiki](https://en.wikipedia.org/wiki/Beta_Cephei) | 21 28 39.60 / +70 33 38.6 / 3.16-3.27 | 21.4777 / 70.561 / 3.21 | 21.4777 / 70.561 / 3.23 | 0s / -0.0' / +0.02 | OK |
| bCrv | Kraz | [wiki](https://en.wikipedia.org/wiki/Beta_Corvi) | 12 34 23.23 / -23 23 48.3 / 2.65 | 12.5731 / -23.397 / 2.65 | 12.5731 / -23.397 / 2.65 | -0s / -0.0' / +0.00 | OK |
| eVir | Vindemiatrix | [wiki](https://en.wikipedia.org/wiki/Epsilon_Virginis) | 13 02 10.60 / +10 57 32.9 / 2.83 | 13.0363 / 10.959 / 2.83 | 13.0363 / 10.959 / 2.83 | 0s / 0.0' / +0.00 | OK |
| gBoo | Seginus | [wiki](https://en.wikipedia.org/wiki/Gamma_Bo%C3%B6tis) | 14 32 04.67 / +38 18 29.7 / 3.03 | 14.5346 / 38.308 / 3.03 | 14.5346 / 38.308 / 3.03 | -0s / 0.0' / +0.00 | OK |
| dLeo | Zosma | [wiki](https://en.wikipedia.org/wiki/Delta_Leonis) | 11 14 06.50 / +20 31 25.4 / 2.56 | 11.2351 / 20.524 / 2.56 | 11.2351 / 20.524 / 2.56 | -0s / -0.0' / +0.00 | OK |
| aCol | Phact | [wiki](https://en.wikipedia.org/wiki/Alpha_Columbae) | 05 39 38.94 / -34 04 26.8 / 2.65 | 5.6608 / -34.074 / 2.65 | 5.6606 / -34.074 / 2.65 | -1s / -0.0' / +0.00 | OK |
| hCen | eta Cen | [wiki](https://en.wikipedia.org/wiki/Eta_Centauri) | 14 35 30.42 / -42 09 28.2 / 2.35 | 14.5918 / -42.158 / 2.35 | 14.5918 / -42.158 / 2.35 | 0s / 0.0' / +0.00 | OK |
| gLup | gamma Lup | [wiki](https://en.wikipedia.org/wiki/Gamma_Lupi) | 15 35 08.45 / -41 10 00.3 / 2.77 | 15.5857 / -41.167 / 2.77 | 15.5857 / -41.167 / 2.78 | 0s / 0.0' / +0.01 | OK |
| dCap | Deneb Algedi | [wiki](https://en.wikipedia.org/wiki/Delta_Capricorni) | 21 47 02.44 / -16 07 38.2 / 2.81 | 21.7840 / -16.127 / 2.81 | 21.7840 / -16.127 / 2.81 | -0s / -0.0' / +0.00 | OK |
| gUMi | Pherkad | [wiki](https://en.wikipedia.org/wiki/Gamma_Ursae_Minoris) | 15 20 43.72 / +71 50 02.5 / 3.05 | 15.3455 / 71.834 / 3.05 | 15.3455 / 71.834 / 3.05 | 0s / -0.0' / +0.00 | OK |
| dDra | Altais | [wiki](https://en.wikipedia.org/wiki/Delta_Draconis) | 19 12 33.30 / +67 39 41.5 / 3.07 | 19.2093 / 67.662 / 3.07 | 19.2093 / 67.662 / 3.07 | 0s / -0.0' / +0.00 | OK |
| gCep | Errai | [wiki](https://en.wikipedia.org/wiki/Gamma_Cephei) | 23 39 20.91 / +77 37 56.5 / 3.21 | 23.6558 / 77.632 / 3.21 | 23.6558 / 77.632 / 3.21 | -0s / -0.0' / +0.00 | OK |
