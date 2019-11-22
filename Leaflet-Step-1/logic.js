
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

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

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
          radiusMag = (feature.properties.mag ) *7000;
        }
        else if (feature.properties.mag >= 5.2 && feature.properties.mag < 6.4) {
          colorMag = "orange";
          radiusMag = (feature.properties.mag ) *10000;
        }   
        else if (feature.properties.tsunami) {
          colorMag = "blue";
          radiusMag = (feature.properties.mag *2) *10000;
        }   
        else  {
          colorMag = "red";
          radiusMag = (feature.properties.mag *2) *10000;
        }
        var geojsonMarkerOptions = {
          radius: radiusMag,
          fillColor: colorMag,
          color: colorMag,
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
  
  // // Create a GeoJSON layer containing the features array on the earthquakeData object
  // // Run the onEachFeature function once for each piece of data in the array
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature,
  //   pointToLayer: pointToLayer
  // });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  // console.log(earthquakes);
}


function createMap(earthquakes) {

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
      // Earthquakes2015: earthquakes2015, 
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      worldCopyJump: true,
      center: [
        37.09, -70.00
      ],
      zoom: 3,
      layers: [streetmap, plates, earthquakes]
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
  
  };


  // // Create overlay object to hold our overlay layer
  // var overlayMaps = {
  //   Earthquakes: earthquakes, 
  //   // Plates: plates
  // };

  // // Create our map, giving it the streetmap and earthquakes layers to display on load
  // var myMap = L.map("map", {
  //   center: [
  //     37.09, -25.71
  //   ],
  //   zoom: 3,
  //   layers: [streetmap, earthquakes]
  // });



  // function chooseColor(PlateName) {
  //   switch (PlateName) {
  //   // case "Africa":
  //   //   return "yellow";
  //   // case "Antarctica":
  //   //   return "red";
  //   // case "Eurasia":
  //   //   return "orange";
  //   // case "India":
  //   //   return "green";
  //   // case "Australia":
  //   //   return "purple";
  //   // case "North America":
  //   //   return "blue";
  //   // case "South America":
  //   //   return "white";
  //   // case "Pacific":
  //   //   return "pink";

  //   default:
  //     return "grey";
  //   }
  // }
  // var link = "data/PB2002_plates.json";
  // // var link = "data/nyc.geojson";
  // d3.json(link, function(data) {
  //   // Creating a geoJSON layer with the retrieved data
  //   L.geoJson(data, {
  //     style: function(feature) {
  //       return {
  //         color:  "white", // chooseColor(feature.properties.PlateName), // "white", 
  //         fillColor: "white", 
  //         fillOpacity: 0.0,
  //         weight: 1
  //       };
  //     }
  //   });  // .addTo(myMap);
  // });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps,  {
//     collapsed: false
//   }).addTo(myMap);
// }



  // function createFeatures(earthquakeCirclesData) {

  //   var geojsonMarkerOptions = {
  //     radius: 8,
  //     fillColor: "#ff7800",
  //     color: "#000",
  //     weight: 1,
  //     opacity: 1,
  //     fillOpacity: 0.8
  // };
  
  // var earthquakeCircles = L.geoJson(earthquakeCirclesData, {
  //   pointToLayer: function (feature, latlng) {
  //       return L.circleMarker(latlng, geojsonMarkerOptions);
        
  //   }
  // })
  // console.log(earthquakeCircles);
  // }
  