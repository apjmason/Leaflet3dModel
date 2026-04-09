const map = L.map('map').setView([44.4610, -93.1539], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

function slugify(name){
    return String(name || '')
      .trim()
      .toLowerCase()
      .replace(/['"]/g,'')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
}

// Track the element that had focus before opening the lightbox so we can
// restore focus when it closes. This prevents setting aria-hidden on an
// ancestor that still contains the focused element (which causes the
// accessibility error reported in the browser console).
let lastFocusedElement = null;

fetch('../src/data/buildings.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                const name = (feature.properties && feature.properties.name) || 'Building';
                const coords = (feature.geometry && feature.geometry.coordinates) || [];
                const lon = coords[0] || '';
                const lat = coords[1] || '';

                // choose model path: explicit property or derived from name
                const modelProp = feature.properties && feature.properties.model;
                const modelPath = modelProp ? modelProp : `../src/models/${slugify(name)}.glb`;

                // derive thumbnail path from model path (replace .glb -> .webp)
                const thumbPath = modelPath.replace(/\.glb$/i, '.webp');

                const popupContent = `
                    <h3>${escapeHtml(name)}</h3><br>                        
                    <div class="popup-content">
                        <a href="#" class="open-lightbox" data-name="${escapeHtml(name)}" data-lat="${lat}" data-lon="${lon}" data-model="${escapeHtml(modelPath)}" data-thumb="${escapeHtml(thumbPath)}">
                            <img class="popup-thumb" src="${escapeHtml(thumbPath)}" alt="${escapeHtml(name)} thumbnail" loading="lazy" />
                            <p>View 3D Model</p>
                        </a>
                    </div>`;

                layer.bindPopup(popupContent);
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading the GeoJSON data:', error));

// Lightbox / modal logic
function openLightbox({ name, lat, lon, model, thumb }) {
    const lb = document.getElementById('lightbox');
    const body = document.getElementById('lightbox-body');
    if (!lb || !body) return;

    // Remember what had focus so we can restore it when closing.
    lastFocusedElement = document.activeElement;

    // If model is present, embed model-viewer; otherwise show a fallback message
    // Use poster attribute to show the thumbnail while the model loads.
    const modelHtml = model ? `
      <div class="model-container">
        <model-viewer
          src="${escapeHtml(model)}"
          poster="${escapeHtml(thumb || '')}"
          alt="${escapeHtml(name)} 3D model"
          camera-controls
          auto-rotate
          ar
          ar-modes="webxr scene-viewer quick-look"
          shadow-intensity="1"
          style="width:100%; height:360px; display:block;"
        ></model-viewer>
      </div>
    ` : '<p>No 3D model available for this building.</p>';

    body.innerHTML = `
        <h2>${escapeHtml(name)}</h2>
        ${modelHtml}
        <p>Information about ${escapeHtml(name)}: </p>
        <p><a href="https://www.example.com" target="_blank" rel="noopener">Read more</a></p>
    `;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');

    // Move focus into the lightbox to the close button so keyboard users
    // aren't left focused on a control behind an un-hidden container.
    const closeBtn = lb.querySelector('.lightbox-close');
    if (closeBtn && typeof closeBtn.focus === 'function') {
        closeBtn.focus();
    }
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    // Before hiding the lightbox, restore focus to the previously focused
    // element (or fallback to the map). This prevents hiding an ancestor of
    // the currently focused control which would trigger the browser error.
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        try {
            lastFocusedElement.focus();
        } catch (e) {
            const mapEl = document.getElementById('map');
            if (mapEl && typeof mapEl.focus === 'function') mapEl.focus();
        }
    } else {
        const mapEl = document.getElementById('map');
        if (mapEl && typeof mapEl.focus === 'function') mapEl.focus();
    }

    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');

    // remove heavy viewer from DOM to stop GPU work
    const body = document.getElementById('lightbox-body');
    if (body) body.innerHTML = '';
}

// Delegate click for popup link
document.addEventListener('click', function (e) {
    const target = e.target.closest && e.target.closest('.open-lightbox');
    if (!target) return;
    e.preventDefault();
    const name = target.dataset.name || '';
    const lat = target.dataset.lat || '';
    const lon = target.dataset.lon || '';
    const model = target.dataset.model || '';
    const thumb = target.dataset.thumb || '';
    openLightbox({ name, lat, lon, model, thumb });
});

// Close handlers for lightbox
document.addEventListener('click', function (e) {
    if (e.target.matches('#lightbox') || e.target.matches('.lightbox-close')) {
        closeLightbox();
    }
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
});