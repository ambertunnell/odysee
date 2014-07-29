//40.735690,
//-73.99034

handler = Gmaps.build('Google');
handler.buildMap({
    provider: {
      disableDefaultUI: false
      // pass in other Google Maps API options here
    },
    internal: {
      id: 'map'
    }
  },
  function(){
    markers = handler.addMarkers([
      {
        "lat": 40.735690,
        "lng": -73.99034,
        "picture": {
          "url": "https://addons.cdn.mozilla.net/img/uploads/addon_icons/13/13028-64.png",
          "width":  36,
          "height": 36
        },
        "infowindow": "hello!"
      }
    ]);
    handler.bounds.extendWith(markers);
    handler.fitMapToBounds();
  }
);