// Store the given API endpoint inside queryUrl
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Get request for data
d3.json(earthquakeURL, function(data) {
    createFeatures(data.features);
});
// Define function to run "onEach" feature 
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
              "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
          },

          pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: 1,
              color: "black",
              stroke: true,
              weight: .8
          })
        }
        });

    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define the map layers
  
        
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30rkku519fu1drmiimycohl/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1IjoibWZhdGloNzIiLCJhIjoiY2sycnMyaDVzMGJxbzNtbng0anYybnF0MSJ9.aIN8AYdT8vHnsKloyC-DDA");
    
      // Define base maps
    var baseMaps = {
        "LightMap": lightMap,
    };


    // Create overlay object to hold overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
    };

    // Create our map
    var myMap = L.map("map", {
        center: [40.7, -94.5],
        zoom: 5,
        layers: [lightMap, earthquakes]
    });


    //Add layer control to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create legend
    var legend = L.control({
        position: "bottomright"
    });
    function getColorGrades(grades) {
        if (grades < -10) {
            return 'yellow'
        } else if (grades < 10) {
            return 'yellowgreen'
        } else if (grades < 30) {
            return 'gold'
        } else if (grades < 50) {
            return 'darkorange'
        } else if (grades < 70) {
            return 'coral'
        } else {
            return 'red'
        }
    };
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [-10, 10, 30, 50, 70, 90]
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

    // Create legend
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColorGrades(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
        return div;
    };
    legend.addTo(myMap);
}

// Create color function
function getColor(magnitude) {
    if (magnitude < 1) {
        return 'yellow'
    } else if (magnitude < 2) {
        return 'yellowgreen'
    } else if (magnitude < 3) {
        return 'gold'
    } else if (magnitude < 4) {
        return 'darkorange'
    } else if (magnitude < 5) {
        return 'coral'
    } else {
        return 'red'
    }
};

//Create radius function
function getRadius(magnitude) {
    return magnitude * 20000;
};
