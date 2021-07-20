// Get data url
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Get marker color based on earthquake magnitude
function getColor(mag) {
    switch (true) {
        case mag > 5:
            return "#ea2c2c";
        case mag > 4:
            return "#eaa92c";
        case mag > 3:
            return "#d5ea2c";
        case mag > 2:
            return "#92ea2c";
        case mag > 1:
            return "#2ceabf";
        default:
            return "#2c99ea";
    }
}

// Declare function to create map features.
function createFeatures(earthquakeData) {
    // Create popup layers using earthquake title, type and magnitude
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>" + feature.properties.title + "</p>" +
            "<p>Type: " + feature.properties.type + "</p>" +
            "<p>Magnitude: " + feature.properties.mag + "</p>");
    }
    //Create circle markers for each earthquake in the data set.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            // Make circle radius dependent on the magnitude and get color based on the same feature
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillOpacity: 1,
                color: getColor(feature.properties.mag)
            })
        },
        // Append popups on each feature
        onEachFeature: onEachFeature
    });
    // Call create map function using the earthquakes data
    createMap(earthquakes);
};

// Declare function to create map
function createMap(earthquakes) {
    // Get initial light layer
    var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });
    // Declare map object and set it to the map element in the DOM
    var myMap = L.map("map", {
        center: [29.876019, -107.224121],
        zoom: 4.5,
        layers: [mapLayer, earthquakes]
    });
    // Create a legend for the map based on the earthquakes data and colors
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = ["rgb(183, 243, 77)", "rgb(226, 243, 77)", "rgb(243, 219, 77)", "rgb(243, 186, 77)", "rgb(240, 167, 107)", "rgb(240, 107, 107)"];

        // var colors = [
        //     "rgb(183, 243, 77)", 0
        //     "rgb(226, 243, 77)", 1
        //     "rgb(243, 219, 77)", 2
        //     "rgb(243, 186, 77)", 3
        //     "rgb(240, 167, 107)", 4
        //     "rgb(240, 107, 107)" 5
        // ];




        // loop thry the intervals of colors to put it in the label
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;

    };

    legend.addTo(myMap)

};

// Get earthquakes data
d3.json(url, function(data) {
    // Create features with the earthquakes data
    createFeatures(data.features)
});