////////////////////////////////////////////////////
// Initiate Map
// Create a map obj
let map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: [1495167.0768482448, 6894375.396669268],
    zoom: 7,
    // projection:"EPSG:3857"
  }),
});

///////////////////////////////////////////////////
//  Onclick event 
map.on('click', function (evt) {

  console.log(evt.coordinate);

  var features = [];
  map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
          return features.push(feature);
      });
      
      // Top most feature
      let feature = features[0];
      if(features[0]){
        console.log(feature.get('fields'));
      }
});

///////////////////////////////////////////////////////
// Load data to map
let vectorSource;
let vectorLayer;
let geojsonObject;

// Vector Style

// Polygon Style
const fill = new ol.style.Fill({
  color: "rgba(0,255,0,0.4)",
});

//  Line Style
const stroke = new ol.style.Stroke({
  color: "#333",
  width: 1.25,
});

/**
 * ol.style.Style({
 * image -> for points
 * stroke -> for lines
 * fill -> for ploygons
 * })
 */

const styles = [
  new ol.style.Style({
      image: new ol.style.Icon({
      // anchor: [0.5, 0.5],
      offset: [0, 0],
      // the real size of your icon
      size: [512, 512],
      // the scale factor
      scale: 0.07,
      src: '/static/image/marker.png',
    }),
    fill: fill,
    stroke: stroke,
  }),
];
let datasets = axios
  .get('/api/centers/')
  .then(function (response) {
    console.log(response.data)
    
    geojsonObject = GeoJSON.parse(response.data, {
      Point: ["fields.lat", "fields.lon"],
    }); //https://github.com/caseycesari/geojson.js

    console.log(geojsonObject);

    vectorSource = new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(geojsonObject),
    });

    vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: styles,
      title: "Datasets",
      zIndex: 999,
    });
    map.addLayer(vectorLayer);
  })
  .catch(function (error) {
    console.log(error);
  });



////////////////////////////////////////////////////////////////////////////////////////////////
// Add Form map

var form_vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    image: new ol.style.Icon({
      // anchor: [0.5, 0.5],
      offset: [0, 0],
      // the real size of your icon
      size: [512, 512],
      // the scale factor
      scale: 0.07,
      src: '/static/image/pin.png',
    }),
  }),
});

let mapLocation = new ol.Map({
  target: "location",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    form_vectorLayer,
  ],
  view: new ol.View({
    center: [1495167.0768482448, 6894375.396669268],
    zoom: 7,
    // projection:"EPSG:3857"
  }),
});

var geocoder = new Geocoder("nominatim", {
  provider: "osm",
  key: "",
  lang: "en-US", //en-US, fr-FR
  placeholder: "Search for ...",
  targetType: "text-input",
  limit: 5,
  keepOpen: true,
  autoComplete: true,
  autoCompleteMinLength: 2,
});

mapLocation.addControl(geocoder);

mapLocation.on("click", function (evt) {
  const location = new ol.Feature(new ol.geom.Point(evt.coordinate));
  form_vectorLayer.getSource().clear();
  form_vectorLayer.getSource().addFeature(location);
  var coord = evt.coordinate;
  var coordDegrees = ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326");
  document.getElementById("long").value = coord[0];
  document.getElementById("lat").value = coord[1];
  document.getElementById("longD").innerText = coordDegrees[0];
  document.getElementById("latD").innerText = coordDegrees[1];
});

////////////////////////////////////////////////////////////////////////////////////////////////
// Other
