var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var streetbasicmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
 id:"mapbox.streets-basic",
  accessToken: API_KEY
});

var layers = {
  Good_AQI: new L.LayerGroup(),
  Moderate_AQI: new L.LayerGroup(),
  Unhealthy_for_sensitive_groups_AQI: new L.LayerGroup(),
  Unhealthy_AQI:new L.LayerGroup(),
  Very_Unhealthy_AQI:new L.LayerGroup(),
  Hazardous:new L.LayerGroup()
};

// Initialize all of the LayerGroups we'll be using
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 5,
  layers:[
    lightmap,
    layers.Good_AQI,
    layers.Moderate_AQI,
    layers.Unhealthy_for_sensitive_groups_AQI,
    layers.Unhealthy_AQI,
    layers.Very_Unhealthy_AQI,
    layers.Hazardous
  ]
});

var baseMaps = {
  Light: lightmap,
  Dark: dark,
  "Street Basic": streetbasicmap

}

var overlays = {
  "Good Air Quality": layers.Good_AQI,
  "Moderate Air Quality": layers.Moderate_AQI,
  "Unhealthy for sensitive groups": layers.Unhealthy_for_sensitive_groups_AQI,
  "Unhealthy Air Quality": layers.Unhealthy_AQI,
  "Very Unhealthy Air Quality": layers.Very_Unhealthy_AQI,
  "Hazardous Air Quality": layers.Hazardous
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(baseMaps, overlays).addTo(myMap);

var icons = {
  Good_AQI: L.ExtraMarkers.icon({
  icon: "ion-minus-circled",
  iconColor: "white",
  markerColor: "green",
  shape: "circle"
}),

Moderate_AQI: L.ExtraMarkers.icon({
  icon: "ion-minus-circled",
  iconColor: "white",
  markerColor: "yellow",
  shape: "circle"
}),

Unhealthy_for_sensitive_groups_AQI: L.ExtraMarkers.icon({
  icon: "ion-minus-circled",
  iconColor: "white",
  markerColor: "pink",
  shape: "circle"
}),

Unhealthy_AQI: L.ExtraMarkers.icon({
  icon: "ion-minus-circled",
  iconColor: "white",
  markerColor: "blue",
  shape: "circle"
}),

Very_Unhealthy_AQI: L.ExtraMarkers.icon({
  icon: "ion-minus-circled",
  iconColor: "white",
  markerColor: "purple",
  shape: "circle"
}),

Hazardous: L.ExtraMarkers.icon({
  icon: "ion-minus-circled",
  iconColor: "white",
  markerColor: "red",
  shape: "circle"
})


}

var url = "data/metadata.json";

d3.json(url, function(response){
  
  console.log(response)

  var data = response.metadata;  
  
    // initialize a filter which will be used to access the appropriate layers
  var filtered;

  for(var index = 0; index < data.length; index++){
    
    var aqiData  = data[index];
      
    var aqiStatus =  aqiData.aqi;
        console.log(aqiStatus)
    if(aqiStatus >=0 && aqiStatus <=50) {
      filtered = "Good_AQI";
    }
    
    else if(aqiStatus >=51 && aqiStatus <=100) {
      filtered = "Moderate_AQI";
    }
    
    else if(aqiStatus >=101 && aqiStatus <=150) {
      filtered = "Unhealthy_for_sensitive_groups_AQI";
    }
    
    else if(aqiStatus >=151 && aqiStatus <=200) {
      filtered = "Unhealthy_AQI";
    }
    
    else if(aqiStatus >=201 && aqiStatus <=300) {
      filtered = "Very_Unhealthy_AQI";
    }
    
    else{
      filtered = "Hazardous";
    }

    var newMarker = L.marker([aqiData.Latitude, aqiData.Longitude],{
      icon: icons[filtered]
    });

    newMarker.addTo(layers[filtered]);
    
    newMarker.bindPopup("<center>"+ "<b>" + "City: " + aqiData.names + "<hr>" + "Air Quality Index: " + aqiData.aqi + 
    "<hr>" + "Dominant Pollutant: " + aqiData.DominantPollutant + "</b>" + "</center>")
  }

})