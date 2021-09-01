var map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 4,
  }),
});

var osm = new ol.layer.Tile({
  source: new ol.source.OSM()
})

var vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 2,
      fill: new ol.style.Fill({color: 'red'})
    })
  })
});

var mapLocation = new ol.Map({
  target: "location",
  layers: [ osm, vectorLayer ],
  view: new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 4,
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
  autoComplete : true,
  autoCompleteMinLength: 2,
});
mapLocation.addControl(geocoder);

mapLocation.on("click", function (evt) {
  const location = new ol.Feature(new ol.geom.Point(evt.coordinate));
  vectorLayer.getSource().clear()
  vectorLayer.getSource().addFeature(location)
  var coord = ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326")
  document.getElementById('long').value = coord[0]
  document.getElementById('lat').value = coord[1]
});