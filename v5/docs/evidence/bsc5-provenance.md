# BSC5 faint-star catalogue: source, import and limits

## Original data and attribution

The faint-star layer uses **Hoffleit, D. & Warren, W. H. Jr. (1991), The Bright
Star Catalogue, 5th Revised Edition (Preliminary Version)**, distributed as
**CDS/VizieR catalogue V/50**. The retained source is the original CDS fixed-width
ASCII catalogue, not a visual approximation or a third-party star export.

- Catalogue: <https://cdsarc.cds.unistra.fr/viz-bin/ReadMe/V/50?format=html>
- Data: <https://cdsarc.cds.unistra.fr/ftp/V/50/catalog.gz>
- Format documentation: <https://cdsarc.cds.unistra.fr/ftp/V/50/ReadMe>
- VizieR service attribution: CDS/VizieR, Strasbourg, France;
  <https://doi.org/10.26093/cds/vizier>.

The unmodified downloaded sources are retained under `data/`:

| File | Bytes | SHA-256 |
|---|---:|---|
| bsc5-catalog.gz | 573,921 | `3dc44b1e90be8fbe5bcc7656032560f51275f985c7e3f783c9028e1838ec7bed` |
| bsc5-ReadMe.txt | 11,571 | `44fd9c73e2eecad0beb47bdfa3f01c60fd43f93d6964198e31fcd48732de5b33` |

The decompressed catalogue is 1,704,879 bytes, with SHA-256
`69797549cc1605aad7ff94e9325e29a1661f2a253917faaa056d9bf20b809afd`.
Records may omit trailing spaces; the importer uses the documented fixed byte
columns rather than splitting on spaces.

## Licence evidence and unresolved point

The V/50 ReadMe contains **no explicit dataset licence or public-domain
dedication**. Public availability alone does not establish either one.

The official CDS/VizieR
[rules of usage](https://cds.unistra.fr/vizier-org/licences_vizier.html)
permit scientific use with original author/publication attribution, and
describe commercial reuse as dependent on the data's origin. The CDS
[general terms](https://cds.unistra.fr/legals/) likewise require the applicable
dataset terms and source citation. They discuss several open licences without
identifying which one specifically applies to this historical catalogue.

The actual policy responses inspected are retained as
`data/bsc5-cds-licences.html` and `data/bsc5-cds-legals.html`, rather than
replacing the missing dataset licence with an invented `LICENSE` file.
Their respective SHA-256 hashes are
`f6bab16f7060f41c98958f0044fa3a526eeeeacdd23cb2fa7a529016d2b29e9f`
and `139d6a72f0aaad958110002a4fd3a173374b5126f6ede4a3ee2ece5c12b0bdc2`.
The exact commercial redistribution licence remains **unconfirmed**; obtain
the catalogue owner's clarification before representing it as cleared for a
commercial distribution. The local scientific design build retains explicit
attribution and makes no public-domain claim.

## Selection and coordinate conversion

The handoff's round-6 condition **4.5 < Vmag ≤ 6.0** supersedes the earlier
design document's magnitude limit. Source byte columns are:

| Field | One-indexed source bytes | Conversion |
|---|---|---|
| HR | 1–4 | Integer primary identifier |
| Original catalogue name | 5–14 | Retain internal spaces |
| J2000 RA hour/minute/second | 76–77 / 78–79 / 80–83 | `(h + m/60 + s/3600) × 15` degrees |
| J2000 Dec sign/degree/minute/second | 84 / 85–86 / 87–88 / 89–90 | `sign × (d + m/60 + s/3600)` |
| Vmag | 103–107 | Decimal visual magnitude |
| Vmag origin code | 108 | Retain blank, R, or H |

Coordinates are rounded to seven decimal degrees only after conversion,
well below the resolution of the original sexagesimal fields. All valid
stars satisfying the magnitude condition are retained over the **whole
sky**. No declination cutoff, precession, proper-motion correction, clipping,
or renderer-specific opacity is applied to the scientific source module.
Precess J2000 coordinates using the existing `precess()` before applying the
sky projection's date-dependent visibility and −42.8° cutoff.

## Import validation

```sh
# From v5/: offline, pinned-source rebuild and assertions
python3 -I tools/import-bsc5.py

# Optional: obtain the same official source again; changed hashes abort
python3 -I tools/import-bsc5.py --download
```

The recorded import reports:

| Check | Result |
|---|---:|
| Original records | 9,110 |
| Valid J2000 position + Vmag | 9,096 |
| Missing position/Vmag | 14 |
| Selected 4.5 < V ≤ 6.0 | **4,176** |
| Unique selected HR numbers | 4,176 |
| Unique selected coordinate pairs | 4,169 |
| Exact coordinate duplicate groups | 7 pairs |
| Selected stars with J2000 δ ≥ −43° | 3,390 |
| Selected stars with J2000 δ ≥ −42.8° | 3,384 |
| Selected RA range | 0.2687500°…359.8662500° |
| Selected Dec range | −88.9563889°…87.3075000° |
| Selected Vmag range | 4.51…6.00 |

The 14 missing HR records are 92, 95, 182, 1057, 1841, 2472, 2496, 3515,
3671, 6309, 6515, 7189, 7539, and 8296. Their blank fields are omitted
without synthesizing positions or magnitudes.

Exact duplicate position groups are HR **887/888, 2357/2358, 4968/4969,
5605/5606, 5977/5978, 6749/6750, and 7226/7227**. These are distinct
catalogue identifiers, not repeated HR rows. They remain in the data so a
renderer can deliberately combine or suppress coincident components without
losing source identities. A renderer that draws all components independently
will increase the brightness at these seven positions.

Known faint stars are checked against independent sexagesimal arithmetic
from the original records, with a 0.0000001° numeric tolerance:

| HR | Source name | Source J2000 RA | Source J2000 Dec | Vmag | Imported RA / Dec, degrees |
|---:|---|---|---|---:|---|
| 6116 | 21Eta UMi | 16h 17m 30.3s | +75° 45′ 19″ | 4.95 | 244.3762500 / 75.7552778 |
| 6554 | 24Nu 1Dra | 17h 32m 10.6s | +55° 11′ 03″ | 4.88 | 263.0441667 / 55.1841667 |
| 6555 | 25Nu 2Dra | 17h 32m 16.0s | +55° 10′ 23″ | 4.87 | 263.0666667 / 55.1730556 |

The importer asserts original and selected counts, source HR uniqueness,
coordinate ranges, selection limits, expected duplicate position count,
and these known-star values. Two offline imports generated identical
`stars-faint.js` bytes, SHA-256
`0efc1d2156a51208f38ac333204166fa99fc8c93cc1424dbab8fc25c04e9ccfe`.
Node assertions also checked every imported star and equality of browser
and CommonJS APIs.

## Integration API and verification boundary

`stars-faint.js` exports `root.KaliFaintStars` and `module.exports`:

- `stars`: 4,176 frozen objects with `hr`, `id` (`HR6116`), `name`, `raDeg`,
  `ra` in **hours** for existing sky helpers, `dec` in degrees, `mag`, and
  `magCode`.
- `byHR`: identifier lookup retaining the original catalogue identifiers.
- `metadata`: exact source URL, hash, epoch, selection and import statistics.

Before rendering, match this module to the existing hand-curated `stars.js`
catalogue to avoid drawing an already present faint constellation star twice.
Its hand-curated positions do not include HR numbers; use a documented small
angular match tolerance on the **J2000** coordinates. Preserve the two distinct
Nu Draconis components rather than merging nearby stars solely by name.

This deliverable verifies source ingestion and API output. The integrated
`precess()`, faint-star tone `#7C888E`, cache behavior, original 590 seeded
speck replacement, G1/G9 gate results and visual rendering are owned by the
round-6 integration. Their acceptance cannot be inferred from source import
success. Proper motion and time-dependent variability are not part of this
source module; its magnitudes are the historical catalogue values.
