// Initialize maps
const mainMap = L.map('main-map').setView([39.0037, -75.7497], 9); // Center on Newark, DE

const normalMap = L.map('normal-map').setView([39.6837, -75.7497], 12);
const chmMap = L.map('chm-map').setView([39.6837, -75.7497], 12);
const satelliteMap = L.map('satellite-map').setView([39.6837, -75.7497], 12);

// Define tile layers with maxZoom capped at 18
const mainNormalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 7,
    maxZoom: 18,
    tileSize: 256,
    zoomOffset: 0,
    errorTileUrl: ''
}).on('tileerror', function(e) {
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('error-message').innerText = 'Error loading normal map tiles.';
});

const mainSatelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    // attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed',
    minZoom: 7,
    maxZoom: 18,
    tileSize: 256,
    zoomOffset: 0,
    errorTileUrl: ''
}).on('tileerror', function(e) {
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('error-message').innerText = 'Error loading satellite tiles.';
});

const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    // attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, GIS User Community',
    minZoom: 7,
    maxZoom: 18,
    tileSize: 256,
    zoomOffset: 0,
    errorTileUrl: ''
}).addTo(satelliteMap);

var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors', minZoom: 7, maxZoom: 18});
var lyr = L.tileLayer('http://128.4.12.153:8000/{z}/{x}/{y}.png', {tms: 1, opacity: 0.8, attribution: "", minZoom: 7, maxZoom: 18});
var lyr2 = L.tileLayer('http://128.4.12.153:8000/{z}/{x}/{y}.png', {tms: 1, opacity: 0.8, attribution: "", minZoom: 7, maxZoom: 18});

var basemaps = {}
var overlaymaps = {"CHM": lyr}
L.control.layers(basemaps, overlaymaps, {collapsed: false}).addTo(chmMap);

osm.addTo(chmMap);
lyr.addTo(chmMap);

const normalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 7,
    maxZoom: 18,
    tileSize: 256,
    zoomOffset: 0,
    errorTileUrl: ''
}).addTo(normalMap);

// Add normal layer to main map by default
mainNormalLayer.addTo(mainMap);

// Layer control for main map
const baseLayers = {
    "Normal Map": mainNormalLayer,
    "Satellite Imagery": mainSatelliteLayer
};
const overlays = {
    "CHM-1m": lyr2,
};
lyr2.addTo(mainMap)
L.control.layers(baseLayers, overlays, { position: 'topright', collapsed: false}).addTo(mainMap);

// Custom Opacity Slider Control (from your previous code)
L.Control.OpacitySlider = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-control-opacity');
        container.style.background = '#fff';
        container.style.padding = '5px';
        container.style.border = '2px solid rgba(0,0,0,0.2)';
        container.style.borderRadius = '5px';

        const slider = L.DomUtil.create('input', 'opacity-slider', container);
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.value = 80;
        slider.style.width = '100px';

        const label = L.DomUtil.create('div', '', container);
        label.innerHTML = 'CHM-1m Opacity: <span id="opacity-value">0.8</span>';
        label.style.marginTop = '5px';

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        slider.oninput = function() {
            const opacity = this.value / 100;
            overlays["CHM-1m"].setOpacity(opacity);
            document.getElementById('opacity-value').textContent = opacity.toFixed(2);
        };

        return container;
    }
});

// Add setOpacity method to L.LayerGroup
L.LayerGroup.include({
    setOpacity: function(opacity) {
        this.eachLayer(function(layer) {
            if (layer.setOpacity) {
                layer.setOpacity(opacity);
            }
        });
    }
});

// Add the opacity slider control to the map
const opacityControl = new L.Control.OpacitySlider();
opacityControl.addTo(mainMap);

// Variable to store the rectangle, point selection state, markers, and overlay
let currentRectangle = null;
let selectPointsMode = false;
let selectedPoints = [];
let markers = [];
let geotiffOverlay = null;

// Sync lower maps
function syncMaps(sourceMap, targetMap) {
    sourceMap.on('move', function() {
        targetMap.setView(sourceMap.getCenter(), sourceMap.getZoom(), { animate: false });
    });
}
syncMaps(satelliteMap, normalMap);
syncMaps(satelliteMap, chmMap);

syncMaps(chmMap, satelliteMap);
syncMaps(chmMap, normalMap);

syncMaps(normalMap, satelliteMap);
syncMaps(normalMap, chmMap);


// Apply bounds function
async function applyBounds(north, south, west, east) {
    const bounds = [[north, west], [south, east]];
    if (currentRectangle) {
        mainMap.removeLayer(currentRectangle);
    }
    // mainMap.fitBounds(bounds);

    // Fetch GEDTM30 as PNG for overlay
    try {
        const response = await fetch('http://128.4.12.153:8000/api/geotiff-png', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: 'https://s3.opengeohub.org/global/edtm/gedtm_rf_m_30m_s_20060101_20151231_go_epsg.4326.3855_v20250611.tif',
                minx: west,
                miny: south,
                maxx: east,
                maxy: north
            })
        });

        mainMap.addLayer(overlays["GEDTM30"]);

        if (!response.ok) {
            throw new Error('Failed to fetch GEDTM30 PNG.');
        }

        if (currentRectangle) {
            mainMap.removeLayer(currentRectangle);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Remove existing overlay
        if (geotiffOverlay) {
            mainMap.removeLayer(geotiffOverlay);
        }

        // Add new overlay
        geotiffOverlay = L.imageOverlay(imageUrl, bounds, {
            opacity: 1.0,
            interactive: true
        });
        overlays["GEDTM30"].clearLayers();
        overlays["GEDTM30"].addLayer(geotiffOverlay);
        geotiffOverlay.addTo(mainMap);
    } catch (err) {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').innerText = `Failed to load GEDTM30 overlay: ${err.message}`;
    }
}

// Clear markers function
function clearMarkers() {
    markers.forEach(marker => mainMap.removeLayer(marker));
    markers = [];
}

// Apply bounds button
document.getElementById('apply-btn').addEventListener('click', async function() {
    const tlLat = parseFloat(document.getElementById('tl-lat').value);
    const tlLon = parseFloat(document.getElementById('tl-lon').value);
    const brLat = parseFloat(document.getElementById('br-lat').value);
    const brLon = parseFloat(document.getElementById('br-lon').value);

    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';

    if (isNaN(tlLat) || isNaN(tlLon) || isNaN(brLat) || isNaN(brLon)) {
        errorDiv.style.display = 'block';
        errorDiv.innerText = 'Please enter valid coordinates.';
        return;
    }

    const north = Math.max(tlLat, brLat);
    const south = Math.min(tlLat, brLat);
    const west = Math.min(tlLon, brLon);
    const east = Math.max(tlLon, brLon);

    await applyBounds(north, south, west, east);
});

// Select points on map button
const selectPointsBtn = document.getElementById('select-points-btn');
selectPointsBtn.addEventListener('click', function() {
    selectPointsMode = !selectPointsMode;
    selectedPoints = [];
    clearMarkers();
    selectPointsBtn.classList.toggle('active');
    selectPointsBtn.innerText = selectPointsMode ? 'Cancel Point Selection' : 'Select Points on Map';

    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'block';
    errorDiv.innerText = selectPointsMode ? 'Click two points on the map to set bounds.' : '';

    if (!selectPointsMode && currentRectangle) {
        mainMap.removeLayer(currentRectangle);
        currentRectangle = null;
        if (geotiffOverlay) {
            mainMap.removeLayer(geotiffOverlay);
            overlays["GEDTM30"].clearLayers();
            geotiffOverlay = null;
        }
    }
});

// Map click handler for point selection with markers
mainMap.on('click', async function(e) {
    if (!selectPointsMode) return;

    selectedPoints.push(e.latlng);
    const errorDiv = document.getElementById('error-message');

    // Add marker for the clicked point
    const marker = L.marker(e.latlng, {
        icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        })
    }).addTo(mainMap);
    markers.push(marker);

    if (selectedPoints.length === 1) {
        errorDiv.innerText = 'First point selected. Click a second point.';
    } else if (selectedPoints.length === 2) {
        const [p1, p2] = selectedPoints;
        const north = Math.max(p1.lat, p2.lat);
        const south = Math.min(p1.lat, p2.lat);
        const west = Math.min(p1.lng, p2.lng);
        const east = Math.max(p1.lng, p2.lng);

        // Update input fields
        document.getElementById('tl-lat').value = north.toFixed(4);
        document.getElementById('tl-lon').value = west.toFixed(4);
        document.getElementById('br-lat').value = south.toFixed(4);
        document.getElementById('br-lon').value = east.toFixed(4);

        // Apply bounds and overlay
        // await applyBounds(north, south, west, east);

        // Clear markers and reset selection mode
        clearMarkers();
        selectPointsMode = false;
        selectPointsBtn.classList.remove('active');
        selectPointsBtn.innerText = 'Select Points on Map';
        errorDiv.style.display = 'none';
        selectedPoints = [];

        // Draw square
        // const bounds = ;
        currentRectangle = L.rectangle([[north, west], [south, east]], {
            color: '#007bff',
            fillColor: '#007bff',
            fillOpacity: 0.3,
            weight: 2
        }).addTo(mainMap);
    }
});

// Download GEDTM30 button
document.getElementById('download-btn').addEventListener('click', async function() {
    const tlLat = parseFloat(document.getElementById('tl-lat').value);
    const tlLon = parseFloat(document.getElementById('tl-lon').value);
    const brLat = parseFloat(document.getElementById('br-lat').value);
    const brLon = parseFloat(document.getElementById('br-lon').value);

    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';

    if (isNaN(tlLat) || isNaN(tlLon) || isNaN(brLat) || isNaN(brLon)) {
        errorDiv.style.display = 'block';
        errorDiv.innerText = 'Please enter valid coordinates before downloading.';
        return;
    }

    const north = Math.max(tlLat, brLat);
    const south = Math.min(tlLat, brLat);
    const west = Math.min(tlLon, brLon);
    const east = Math.max(tlLon, brLon);

    try {
        const response = await fetch('http://128.4.12.153:8000/api/geotiff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: 'https://s3.opengeohub.org/global/edtm/gedtm_rf_m_30m_s_20060101_20151231_go_epsg.4326.3855_v20250611.tif',
                minx: west,
                miny: south,
                maxx: east,
                maxy: north
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch GEDTM30 subset.');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'geotiff_subset.tif';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (err) {
        errorDiv.style.display = 'block';
        errorDiv.innerText = `Download failed: ${err.message}`;
    }
});

// Default values for Newark, DE
document.getElementById('tl-lat').value = 39.9235;
document.getElementById('tl-lon').value = -75.8308;
document.getElementById('br-lat').value = 38.4332;
document.getElementById('br-lon').value = -75.0070;