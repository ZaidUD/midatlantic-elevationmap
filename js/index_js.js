const mainMap = L.map('main-map', {zoomControl: false}).setView([39.2037, -78.5000], 6); // Center on Newark, DE

// Define tile layers with maxZoom capped at 18
const mainNormalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 6,
    maxZoom: 6,
    tileSize: 256,
    zoomOffset: 0,
    errorTileUrl: ''
}).on('tileerror', function(e) {
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('error-message').innerText = 'Error loading normal map tiles.';
});

// Add normal layer to main map by default
mainNormalLayer.addTo(mainMap);

// Define states of interest and their colors
const statesOfInterest = ['Virginia', 'Maryland', 'New Jersey', 'Delaware'];
const stateColors = {
    'Virginia': '#ff4444', // Red
    'Delaware': '#3388ff', // Blue
    'Maryland': '#44ff44', // Green
    'New Jersey': '#ffaa00' // Orange
};

// Fetch detailed GeoJSON data for US states
fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
    .then(response => response.json())
    .then(geojson => {
        // Filter for states of interest
        const filteredGeoJSON = {
            type: 'FeatureCollection',
            features: geojson.features.filter(feature => 
                statesOfInterest.includes(feature.properties.name)
            )
        };

        // Create GeoJSON layer with dynamic styling
        L.geoJSON(filteredGeoJSON, {
            style: function(feature) {
                const stateName = feature.properties.name;
                return {
                    color: stateColors[stateName] || '#3388ff', // Border color
                    weight: 2, // Border thickness
                    fillColor: stateColors[stateName] || '#3388ff', // Fill color
                    fillOpacity: 0.6 // Transparent fill
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.name);
            }
        }).addTo(mainMap);
    })
    .catch(error => {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').innerText = 'Error loading GeoJSON data: ' + error.message;
    });