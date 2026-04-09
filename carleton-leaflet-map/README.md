# Carleton College Leaflet Map

An interactive web map of Carleton College (Northfield, MN) built with Leaflet. The map displays campus buildings from a GeoJSON file and lets users open a lightbox to view 3D models (GLB) via the `model-viewer` web component.

## Repository layout

```
carleton-leaflet-map/
├── package.json                # npm scripts & deps (start -> live-server public)
├── public/                     # Static site served to the browser
│   ├── index.html              # App shell, loads Leaflet and model-viewer
│   ├── css/
│   │   └── styles.css          # Page styles and lightbox styles
│   └── js/
│       └── map.js              # Map initialization, GeoJSON fetch, popups
├── src/
│   ├── data/
│   │   └── buildings.geojson   # GeoJSON features for campus buildings
│   └── models/
│       ├── Burton.glb          # Example 3D model files (GLB)
│       ├── Burton.webp         # Thumbnails/poster images for models
│       ├── Watson.glb
│       ├── Watson.webp
│       ├── Willis.glb
│       └── Willis.webp
└── README.md                   # This file
```

Notes:
- `public/js/map.js` fetches `../src/data/buildings.geojson` at runtime and constructs model paths like `../src/models/<slug>.glb` unless a feature supplies its own `model` property.
- The project includes `model-viewer` (via CDN in `index.html`) to display GLB files inside a lightbox.

## Quick start (local)

Requirements: Node.js (for the convenience script). You only need a simple static server because the app fetches assets via HTTP.

1. Install dependencies:

```powershell
npm install
```

2. Start the local server (provided script uses live-server):

```powershell
npm start
```

3. Open the site

Visit the URL printed by the server (usually http://127.0.0.1:8080 or http://localhost:8080). The app's entry point is `public/index.html`.

Tip: Opening `public/index.html` directly with the `file://` protocol may fail because the browser blocks fetch requests and some web components when not served over HTTP; use the local server above.

## Adding or editing buildings and models

- GeoJSON: edit `src/data/buildings.geojson`. Each Feature should include a `properties.name` and either:
  - no `model` property — `map.js` will try `../src/models/<slug>.glb` (where `<slug>` is a lower-case, dash-separated version of the name), or
  - a `model` property with a relative path to the GLB (e.g. `../src/models/custom-model.glb`).

Example feature snippet:

```json
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [-93.1539, 44.4610] },
  "properties": {
    "name": "Burton Hall",
    "model": "../src/models/Burton.glb"
  }
}
```

- Models and thumbnails: place `.glb` files and optional `.webp` posters in `src/models/`. The code will look for a `.webp` thumbnail with the same base filename to use as a poster for `model-viewer`.

## Where behavior is implemented

- `public/js/map.js` — loads GeoJSON, binds popups, constructs model/thumb paths, and controls the lightbox.
- `public/index.html` — includes Leaflet and `model-viewer` CDN scripts and the lightbox container.

## Troubleshooting

- If buildings do not show up, check the browser console for errors loading `buildings.geojson` or the model files. Ensure paths are correct relative to `public/index.html` (the app expects `src/` to be a sibling of `public/`).
- If `model-viewer` doesn't render, ensure your browser supports Web Components and that the model file is reachable over HTTP.

## Technologies Used

- Leaflet.js for mapping
- HTML, CSS, and JavaScript for web development
- GeoJSON for building data representation
- Assistance from Github copilot using GPT-5 mini

## Contributing

Contributions welcome. Open issues or PRs for improvements. Small, focused PRs are easiest to review (example: add a new model and the corresponding GeoJSON feature).

## License

MIT — see `package.json` for license metadata.