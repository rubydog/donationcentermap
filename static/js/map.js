////////////////////////////////////////////////////
// Initiate Map
// Create a map obj
let vectorSource;
let vectorLayer;
let geojsonObject;

//  Map
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

//////////////////////////////////////////////////////////
// Geolocation
const geolocation = new ol.Geolocation({
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: map.getView().getProjection(),
});

// ENABLE TRACKING
geolocation.setTracking(true);

// handle geolocation error.
geolocation.on("error", function (error) {
  alert(error.message);
});

const accuracyFeature = new ol.Feature();
geolocation.on("change:accuracyGeometry", function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

const positionFeature = new ol.Feature();
positionFeature.setStyle(
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 8,
      fill: new ol.style.Fill({
        color: "#3399CC",
      }),
      stroke: new ol.style.Stroke({
        color: "#fff",
        width: 2,
      }),
    }),
  })
);
geolocation.on("change:position", function () {
  const coordinates = geolocation.getPosition();
  positionFeature.setGeometry(
    coordinates ? new ol.geom.Point(coordinates) : null
  );
});

// Add the vector layer to map
geolocate_vector_layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [accuracyFeature, positionFeature],
  }),
  zIndex: 0,
});
map.addLayer(geolocate_vector_layer);

////////////////////////////////////////////////////////////
// Geolocate Fuction
// Geolocate State
let geolocateState = true;
function geolocateUser() {
  geolocation.setTracking(geolocateState);
  alert("Tracking "+geolocateState);
  geolocateState = !geolocateState;
  map.setView(
    new ol.View({
      center: geolocation.getPosition(),
      zoom: 17,
      projection: "EPSG:3857",
    })
  );
}

////// Events /////////////////////////////////////////////

// Map Onclick event
let selected = null;
let prevId = 0;

map.on("pointermove", function (evt) {
  // console.log(evt.coordinate);
  var features = [];
  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    return features.push(feature);
  });

  // Top most feature
  let feature = features[0];

  if (feature && feature.get("id")) {
    // Undo the previous feature
    if (selected !== null) {
      selected.setStyle(undefined);
      selected = null;
    }
    //  High Light Feature
    feature.setStyle(highLightStyle);
    selected = feature;
    active_card_id = feature.get("id");
    // HIGH LIGHT THE CARD Here.............
    // console.log("Feature ID: ");
    // console.log(feature.get("id"));

    if (prevId !== 0) {
      document.getElementById(prevId).classList.remove("activeCenter");
    }

    document.getElementById(active_card_id).classList.add("activeCenter");
    prevId = active_card_id;

    // /---------------
    var resultArea = document.getElementById("resultArea");
    var position = resultArea.scrollTop;
    var maxValue = resultArea.scrollHeight - resultArea.clientHeight;
    var divPosition = document.getElementById(active_card_id).offsetTop;
    if (divPosition < maxValue) {
      resultArea.scrollTop = divPosition;
    } else {
      resultArea.scrollTop = maxValue;
    }
    console.log(position, maxValue, divPosition);
  }
});

// Result Card Event
function resultCardOnHoverEvent() {
  // Result Hover
  resultsCards = document.querySelectorAll("#resultArea > a");

  // Add hover event Listernerner
  resultsCards.forEach(function (e) {
    e.addEventListener("mouseenter", function () {
      // console.log("Feature ID: ");
      let selectedfeatureID = this.id;
      // console.log(selectedfeatureID);

      // Deselect Previous Card
      if (prevId !== 0) {
        document.getElementById(prevId).classList.remove("activeCenter");
      }
      // High Light Points
      vectorLayer
        .getSource()
        .getFeatures()
        .map(function (feature) {
          if (feature.get("id") == selectedfeatureID) {
            // Undo the previous feature
            if (selected !== null) {
              selected.setStyle(undefined);
              selected = null;
            }
            //  High Light Feature
            feature.setStyle(highLightStyle);
            selected = feature;
          }
        });
    });
  });
}

// Load data to Result Area Event
function loadDataToResultArea(data = []) {
  resultArea = document.getElementById("resultArea");
  resultArea.innerHTML = "";

  result_html = "";
  data.forEach(function (element) {
    result_html += `<a class="resultCard" href="${document.URL}details/${element.slug}" id=${element.id}>`;

    if (element.partner == true) {
      result_html += `<div class="tag">Partner</div>`;
    }
    if (element.pickup == true) {
      result_html += `<div class="tagPickup">Pickup</div>`;
    }
    result_html += `<h5>${element.name}</h5>
                    <h6>${element.address}</h6>
                  </a>`;
  });
  resultArea.innerHTML = result_html;

  resultCardOnHoverEvent();
}

///////////////////////////////////////////////////////
// Load data to map

const styles = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 50],
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      // offset: [0, 0],
      // the real size of your icon
      // size: [512, 512],
      // the scale factor
      scale: 0.2,
      // displacement: [0, 200],
      // src: "/static/image/marker.png",
      src: "/static/image/marker.svg",
    }),
  }),
];
const highLightStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 46],
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      // the real size of your icon
      // size: [512, 512],
      // the scale factor
      scale: 0.25,
      // displacement: [0, 200],
      // src: "/static/image/marker.png",
      src: "/static/image/marker.svg",
    }),
  }),
];

//  Init Data
axios
  .get("/api/centers/")
  .then(function (response) {
    console.log(response.data);

    // Update Result Area
    loadDataToResultArea(response.data);

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
  let partneronly = $("#partneronly").prop("checked");

  console.log(items, type, pickuponly, partneronly);
  // Filter
  axios
    .get("/api/centers/filter", {
      params: {
        items: items,
        type: type,
        pickuponly: pickuponly,
        partneronly: partneronly,
      },
    })
    .then(function (response) {
      console.log(response.data);

      // Update Result Area
      loadDataToResultArea(response.data);
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
// updateMap();

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
