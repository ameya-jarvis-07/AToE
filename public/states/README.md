# State district-map data

The generated per-state GeoJSON files in `districts/` contain district boundaries derived from geoBoundaries' open India ADM2 boundary dataset (2021 boundary vintage), sourced from Pathways Data Pvt. Ltd. / LG Directory.

- Source: https://www.geoboundaries.org/
- Dataset: https://github.com/wmgeolab/geoBoundaries/tree/9469f09/releaseData/gbOpen/IND/ADM2
- License: Open Data Commons Open Database License 1.0 (ODbL)
- Attribution: geoBoundaries (Pathways Data Pvt. Ltd. / LG Directory)

`src/data/cities-by-district.json` links city records from `src/data/cities.json` to district IDs when their Local Government Directory names match uniquely. The city reference source is [India Local Government Directory](https://github.com/planemad/india-local-government-directory), released under the Government Open Data License – India. City records without a reliable district match are not guessed into a district.

Regenerate the local files with `node scripts/build-state-district-assets.mjs`.
