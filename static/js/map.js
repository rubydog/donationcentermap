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
let selected = null;
map.on("click", function (evt) {
  // console.log(evt.coordinate);
  var features = [];
  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    return features.push(feature);
  });

  // Top most feature
  let feature = features[0];
  if (feature) {
    // Undo the previous feature
    if (selected !== null) {
      selected.setStyle(undefined);
      selected = null;
    }
    //  High Light Feature
    feature.setStyle(highLightStyle);
    selected = feature;

    // HIGH LIGHT THE CARD Here.............
    console.log("Feature ID: ");
    console.log(feature.get("id"));
  }
});

// Result Card Event Listners
function resultCardOnHoverEvent() {
  // Result Hover
  resultsCards = document.querySelectorAll("#resultArea > a");

  // Add hover event Listernerner
  resultsCards.forEach(function (e) {
    e.addEventListener("mouseenter", function () {
      console.log("Feature ID: ");
      let selectedfeatureID = this.id;
      console.log(selectedfeatureID);

      // High Light Points
    });
  });
}
resultCardOnHoverEvent();

///////////////////////////////////////////////////////
// Load data to map
let vectorSource;
let vectorLayer;
let geojsonObject;

const styles = [
  new ol.style.Style({
    image: new ol.style.Icon({
      // anchor: [0.5, 0.5],
      offset: [0, 0],
      // the real size of your icon
      size: [512, 512],
      // the scale factor
      scale: 0.07,
      src: "/static/image/marker.png",
    }),
  }),
];
const highLightStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      // anchor: [0.5, 0.5],
      offset: [0, 0],
      // the real size of your icon
      size: [512, 512],
      // the scale factor
      scale: 0.09,
      src: "/static/image/marker.png",
    }),
  }),
];
let datasets = axios
  .get("/api/centers/")
  .then(function (response) {
    console.log(response.data);

    geojsonObject = GeoJSON.parse(response.data, {
      Point: ["lat", "lon"],
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
// Filter
function updateMap() {
  let items = $("#items-dropdown").val();
  let type = $("#type").val();
  let pickuponly = $("#pickuponly").prop("checked");

  console.log(items, type, pickuponly);
  // Filter
  axios
    .get("/api/centers/filter", {
      params: {
        items: items,
        type: type,
        pickuponly: pickuponly,
      },
    })
    .then(function (response) {
      console.log(response.data);

      // Update Result Area
      resultArea = document.getElementById("resultArea");
      resultArea.innerHTML = "";

      result_html = "";
      response.data.forEach(function (element) {
        result_html += `<a class="resultCard" href="${document.URL}details/${element.slug}" id=${element.id}>
      <div class="tag">Partner</div>
      <h5>${element.name}</h5>
      <h6>${element.address}</h6>
    </a>`;
      });
      resultArea.innerHTML = result_html;

      // Update map
      geojsonObject = GeoJSON.parse(response.data, { Point: ["lat", "lon"] }); //https://github.com/caseycesari/geojson.js

      // console.log(geojsonObject);

      vectorSource = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojsonObject),
      });
      // Set the new source to layer
      vectorLayer.setSource(vectorSource);

      // Add Hover Point Evemt
      resultCardOnHoverEvent();
    })
    .catch(function (error) {
      console.log(error);
    });
}

$("#filter_btn").on("click", function (evt) {
  updateMap();
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
      src: "/static/image/pin.png",
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
  var coordDegrees = ol.proj.transform(
    evt.coordinate,
    "EPSG:3857",
    "EPSG:4326"
  );
  document.getElementById("long").value = coord[0];
  document.getElementById("lat").value = coord[1];
  document.getElementById("longD").innerText = coordDegrees[0];
  document.getElementById("latD").innerText = coordDegrees[1];
});
