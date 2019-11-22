
var query2015 = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2015-01-01&endtime=" +
"2015-12-31&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=5";
var query2016 = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2016-01-01&endtime=" +
"2016-12-31&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=5";
var query2017 = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2017-01-01&endtime=" +
"2017-12-31&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=5";
var query2018 = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-01-01&endtime=" +
"2018-12-31&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=5";


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-11-01&endtime=" +
  "2019-11-20&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=5";


function createFeatures(earthquakeData) {
  
  var earthquakes = L.geoJSON(earthquakeData, {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
   onEachFeature: function(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + 
      "</p>" +  "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>" +
      "</p>" +  "</h3><hr><p>" + "Location: " + feature.geometry.coordinates + "</p>" +
      "</p>" +  "</h3><hr><p>" + "Tsunami: " + feature.properties.tsunami + "</p>" 
      )},

    pointToLayer: function(feature, latlng){

        if (feature.properties.mag < 5.2) {
          colorMag = "yellow";
          radiusMag = (feature.properties.mag ) *20000;
        }
        else if (feature.properties.mag >= 5.2 && feature.properties.mag < 6.4) {
          colorMag = "orange";
          radiusMag = (feature.properties.mag ) *24000;
        }   
        else if (feature.properties.tsunami) {
          colorMag = "blue";
          radiusMag = (feature.properties.mag *1.4) *24000;
        }   
        else  {
          colorMag = "red";
          radiusMag = (feature.properties.mag *1.4) *24000;
        }

        function getColor(d) {
          return d >= 8 ? 'blue' :
                 d > 6.4  ? 'red' :
                 d > 5.2  ? 'orange' :
                 d > 4   ? 'yellow' :
                 d > 0   ? 'white' :
                            'blue';
      }

        var geojsonMarkerOptions = {
          radius: radiusMag,
          fillColor: colorMag,
          color: getColor(feature.properties.mag),
          weight: 3,
          opacity: 1,
          fillOpacity: 0.5
      };
        // return new L.circle(latlng, {
        //   // color: 'red',
        //   fillColor: '#f03',
        //   fillOpacity: 0.0,
        //   radius:  radiusMag,
        //   color: colorMag
        // })
        return L.circle(latlng, geojsonMarkerOptions )
      }
    })

  return earthquakes
}

function createFeatures2015(earthquakeData2015) {
  
  var earthquakes2015 = L.geoJSON(earthquakeData2015, {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
   onEachFeature: function(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + 
      "</p>" +  "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>" +
      "</p>" +  "</h3><hr><p>" + "Location: " + feature.geometry.coordinates + "</p>" +
      "</p>" +  "</h3><hr><p>" + "Tsunami: " + feature.properties.tsunami + "</p>" 
      )},

    pointToLayer: function(feature, latlng){

        if (feature.properties.mag < 5.2) {
          colorMag = "yellow";
          radiusMag = (feature.properties.mag ) *20000;
        }
        else if (feature.properties.mag >= 5.2 && feature.properties.mag < 6.4) {
          colorMag = "orange";
          radiusMag = (feature.properties.mag ) *24000;
        }   
        else if (feature.properties.tsunami) {
          colorMag = "blue";
          radiusMag = (feature.properties.mag *1.4) *24000;
        }   
        else  {
          colorMag = "red";
          radiusMag = (feature.properties.mag *1.4) *24000;
        }

        function getColor(d) {
          return d >= 8 ? 'blue' :
                 d > 6.4  ? 'red' :
                 d > 5.2  ? 'orange' :
                 d > 4   ? 'yellow' :
                 d > 0   ? 'white' :
                            'blue';
      }

        var geojsonMarkerOptions = {
          radius: radiusMag,
          fillColor: colorMag,
          color: getColor(feature.properties.mag),
          weight: 3,
          opacity: 1,
          fillOpacity: 0.5
      };

    
        // return new L.circle(latlng, {
        //   // color: 'red',
        //   fillColor: '#f03',
        //   fillOpacity: 0.0,
        //   radius:  radiusMag,
        //   color: colorMag
        // })
        return L.circle(latlng, geojsonMarkerOptions )
      }
    })

  return earthquakes2015
}


function createMap() {

    // Perform a GET request to the query URL
  d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    var earthquakes =  createFeatures(data.features);


  // Perform a GET request to the query URL
  d3.json(query2015, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    var earthquakes2015 = createFeatures2015(data.features);


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var link = "Leaflet-Step-1/data/PB2002_plates.json";
  d3.json(link, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    var plates = L.geoJson(data, {
  
      style: function(plates) {
        return {
          color:  "magenta", // chooseColor(feature.properties.PlateName), // "white", 
          opacity: .8,
          fillColor: "white", 
          fillOpacity: 0.0,
          weight: 1,
          // pointerEvents: 'none',
          // zIndex: 650
        };
      }
    }); // .addTo(myMap);
  // console.log(plates);



    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Plates: plates,
      Earthquakes: earthquakes,
      Earthquakes2015: earthquakes2015
      // Earthquakes2015: earthquakes2015, 
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      worldCopyJump: true,
      center: [
        37.09, -70.00
      ],
      zoom: 3,
      layers: [streetmap, plates, earthquakes, earthquakes2015]
    });

    L.control.layers(baseMaps, overlayMaps,  {
      collapsed: false
    }).addTo(myMap);


////////// LEGEND /////////////////////////////
    function getColor(d) {
      return d >= 8 ? 'blue' :
             d > 6.4  ? 'red' :
             d > 5.2  ? 'orange' :
             d > 4   ? 'yellow' :
             d > 0   ? 'white' :
                        'blue';
  }
  
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');
          grades = [0, 4, 5.2, 6.4, 'tsunami'],
          labels = [];
          div.innerHTML += "<h4>Magnitude</h4>";
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
  
    
  })
})
})

  };

createMap();