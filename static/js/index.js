
// Creating Leaflet map object with maker clusters
var myMap = L.map("mapid", {
    center: [44.9778, -93.2650],
    zoom: 13
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

// Assemble API query URL
var url = "http://127.0.0.1:5500/api/v1.0"

// Grab the data with d3
d3.json(url).then(function(response) {

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.length; i++) {

    // Check for location property
    if (response[i].latitude, reponse[i].longitude) {

      // Add a new marker to the cluster group and bind a pop-up - NEED TO ADJUST POPUP
      markers.addLayer(L.marker([response[i].latitude, reponse[i].longitude])
        .bindPopup(response[i].date + response[i].problem + response[i].resistance + response[i].forceAction));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);
});

