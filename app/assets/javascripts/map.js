var map;


$(function () {

    var markers = [];
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var dayLocations;
    var allDayLocations;
    var id = $("#location_day_id").val();
    var routeVisible = false;

    var renderArray; 
    var requestArray;

    function initialize() {

        var mapOptions = {
            center: new google.maps.LatLng(40.783027, -73.965387),
            zoom: 13,
            streetViewControl: false,
            mapTypeControl: false,
            //Theme from http://snazzymaps.com/
            styles: [{
                "featureType": "administrative",
                    "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "poi",
                    "stylers": [{
                    "visibility": "simplified"
                }]
            }, {
                "featureType": "poi.park",
                    "elementType": "labels.icon",
                    "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "poi.attraction",
                    "elementType": "labels.icon",
                    "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "poi.business",
                    "elementType": "labels.icon",
                    "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "road",
                    "stylers": [{
                    "visibility": "simplified"
                }]
            }, {
                "featureType": "water",
                    "stylers": [{
                    "visibility": "simplified"
                }]
            }, {
                "featureType": "transit",
                    "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "transit.station",
                    "elementType": "labels.icon",
                    "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "transit.station.bus",
                    "elementType": "labels.icon",
                    "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "landscape",
                    "stylers": [{
                    "visibility": "simplified"
                }]
            }, {
                "featureType": "road.highway",
                    "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "road.local",
                    "stylers": [{
                    "visibility": "on" // simplified removes street names
                }]
            }, {
                "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "water",
                    "stylers": [{
                    "color": "#84afa3"
                }, {
                    "lightness": 52
                }]
            }, {
                "stylers": [{
                    "saturation": -77
                }]
            }, {
                "featureType": "road"
            }, {
                "elementType": "labels.icon", //this overwrites a ton of stuff
                "stylers": [{
                    "visibility": "off"
                }]
            }]
        };
        map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

        ////// event listener for user adding location by clicking on map /////
        google.maps.event.addListener(map, 'click', function (event) {

            console.log(event);
            // var latitude = event.latLng.k;
            // var longitude = event.latLng.A;
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();            
            var day_id = $('#location_day_id').val();
            
            addLocation(latitude, longitude, day_id, event);

        });

    } // end initialize

    google.maps.event.addDomListener(window, 'load', initialize);

    function placeMarker(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: "map-pin2.gif"
        });
        markers.push(marker);
    }

    ///////////// Add a Location/////////////
    function addLocation(latitude, longitude, day_id, event) {
        $.ajax({
            type: "POST",
            url: "/locations",
            data: {
                location: {
                    name: "no name",
                    latitude: latitude,
                    longitude: longitude,
                    day_id: day_id
                }
            },
            success: function () {
                placeMarker(event.latLng);
                requestDayLocations();
            },
            error: function (response) {
                // append to div with response.responseText
                console.log(response.responseText);
                // $('.alert-message').append("<p>" + response.responseText + "</p>");
                // $('.alert-message').css("visibility", "visible"); //or fade in?

            }
        });
    }

    /////////// Add a location manually through form /////////////
    $(".add_location").submit(function (e) {
        e.preventDefault();

        var name = $("#location_name").val();

        var request = {
            query: name
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);

        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var place = results[0];

                var name = $("#location_name").val();
                // var latitude = results[0].geometry.location.k;
                // var longitude = results[0].geometry.location.A;
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                var day_id = $('#location_day_id').val();

                //addLocation(latitude, longitude, day_id); //problem with 'event'

                $.ajax({
                    type: "POST",
                    url: "/locations",
                    data: {
                        location: {
                            name: name,
                            latitude: latitude,
                            longitude: longitude,
                            day_id: day_id
                        }
                    },
                    success: function () {
                        createMarker(results[0]);
                        requestDayLocations();
                    },
                    error: function (response) {
                        /////don't forget me!

                    }
                });
            }
        }

        function createMarker(place) {
            var placeLoc = place.geometry.location;

            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                icon: "map-pin2.gif"
                // animation: google.maps.Animation.DROP
            });
            markers.push(marker);
        }

        $("#location_name").val("");

    });

    ///////////// Calculate and Show Route /////////////////
    function calcRoute(locations) {
        var start = new google.maps.LatLng(locations[0][0], locations[0][1]);
        var end = new google.maps.LatLng(locations[locations.length - 1][0], locations[locations.length - 1][1]);
        var waypts = [];

        directionsDisplay = new google.maps.DirectionsRenderer({
            markerOptions: {
                icon: "blackdot.gif",
                visible: true
            },
            polylineOptions: {
                strokeColor: getRandomColor(),
                strokeOpacity: 1.0,
                strokeWeight: 3
            }
        });


        directionsDisplay.setMap(map);


        for (var i = 1; i < locations.length - 1; i++) {
            waypts.push({
                location: new google.maps.LatLng(locations[i][0], locations[i][1]),
                stopover: true
            });
        }

        var request = {
            origin: start,
            destination: end,
            waypoints: waypts,
            optimizeWaypoints: false,
            travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                routeVisible = true;
            }
        });
    }

    function calcAllRoutes() {
        var start, end, waypts;

        renderArray  = [];
        requestArray = [];

        removeMarkers();

        if (allDayLocations.length > 0) {
            for (var i = 0; i < allDayLocations.length; i++) {
                if (allDayLocations[i].length > 0){
                    start = new google.maps.LatLng(allDayLocations[i][0][0], allDayLocations[i][0][1]);
                    end = new google.maps.LatLng(allDayLocations[i][allDayLocations[i].length - 1][0], allDayLocations[i][allDayLocations[i].length - 1][1]);
                    waypts = [];

                    for (var j = 1; j < allDayLocations[i].length - 1; j++) {
                        waypts.push({
                            location: new google.maps.LatLng(allDayLocations[i][j][0], allDayLocations[i][j][1]),
                            stopover: true
                        });
                    }

                    var request = {
                        origin: start,
                        destination: end,
                        waypoints: waypts,
                        optimizeWaypoints: false,
                        travelMode: google.maps.TravelMode.WALKING
                    };
                    requestArray.push(request);
                }  
            }
        }

        
        submitRequests();
        function submitRequests() {
            for (var i = 0; i < requestArray.length; i++) {
                console.log("Submitting request");
                directionsService.route(requestArray[i], directionResults);
            }
        }

        var current = 0;
        function directionResults(result, status) {
            console.log("Receiving request for route");
            if (status == google.maps.DirectionsStatus.OK) {
                renderArray[current] = new google.maps.DirectionsRenderer({
                    markerOptions: {
                        icon: "blackdot.gif",
                        visible: true
                    },
                    polylineOptions: {
                        strokeColor: getRandomColor(),
                        strokeOpacity: 1.0,
                        strokeWeight: 3
                    }
                });
                renderArray[current].setMap(map);
                renderArray[current].setDirections(result);
                current++;
            }
        }

    }

    // call it remove or hide or clear?
    function removeAllRoutes(){
      if (renderArray != undefined){
        console.log("HI!")
        // simply setting renderArray = null doesn't work        
        for(var i = 0; i < renderArray.length; i++){
          renderArray[i].setDirections( { routes: [] } ); 
        }

        // probably not necessarry
        for(var i = 0; i < requestArray.length; i++){
          requestArray[i] = null;
        }
      }

    }

    // Random Color Generator
    function getRandomColor() {
        // var letters = '0123456789ABCDEF'.split('');
        // var color = '#';
        // for (var i = 0; i < 6; i++) {
        //     color += letters[Math.floor(Math.random() * 16)];
        // }
        // return color;
        var colors = ["#0066CC", "#00CC99", "#00CCFF", "#666699","#996699", "#CC6699", "#FF99CC", "#99CCFF","#CC6666","#663366"];
        var randColor = colors[Math.floor(Math.random() * colors.length)];
        return randColor;
    }

    ///// DRAW BUTTONS /////
    $(".animate").click(function (e) {
        e.preventDefault();

        //resist the urge to put requestDayLocations() here!
        resetRoute();
        removeAllRoutes();
        calcRoute(dayLocations);
        removeMarkers();
    });

    $(".animate_all").click(function (e) {
        e.preventDefault();

        removeAllRoutes();
        resetRoute();
        requestAllDayLocations();

    });

    $('.clear_route').click(function () {
        resetRoute();
        requestDayLocations();
    });

    function resetRoute() {
        if (directionsDisplay !== undefined) {
            directionsDisplay.setDirections({
                routes: []
            });
            routeVisible = false;
        }
    }

    /////////// Change day //////////////////
    $("#location_day_id").change(function () {
        console.log("you changed days");
        resetRoute();
        removeAllRoutes();
        removeMarkers();

        requestDayLocations();
    });

    function removeMarkers() {
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    ////// GET locations from current selected day //////
    function requestDayLocations() {
        var id = $("#location_day_id").val();

        $.ajax({
            type: "GET",
            url: "/days/show",
            data: {
                day: {
                    id: id
                }
            },
            success: function (response) {
                addDayLocations(response);
            }
        });
    }

    function requestAllDayLocations() {

        $.ajax({
            type: "GET",
            url: "/days",
            success: function (response) {
                // response = nested array of days and their locations
                addAllDayLocations(response);
            }
        });
    }

    //// adds list of locations as markers to the map
    function addDayLocations(locations, drawingAll) {
        dayLocations = [];
        var latitude, longitude;

        for (var i = 0; i < locations.length; i++) {
            latitude = locations[i].latitude;
            longitude = locations[i].longitude;
            dayLocations.push([latitude, longitude]);

            if (routeVisible === false) {
                placeMarker(new google.maps.LatLng(latitude, longitude));
            }
        }
    }

    function addAllDayLocations(days) {
        allDayLocations = [];
        var latitude, longitude, day;

        // thru days
        for (var i = 0; i < days.length; i++) {
            day = [];

            // thru locations
            for (var j = 0; j < days[i].length; j++) {
                latitude = days[i][j].latitude;
                longitude = days[i][j].longitude;
                day.push([latitude, longitude]);
            }
            allDayLocations.push(day);
        }
        calcAllRoutes();
    }

/////////////// Add a date ///////////////////
    $("#new_day").submit(function(e){
      e.preventDefault();
      $(".add_day").find(".error").text("")
      var day_id = $("#day_date").val();
     
      $.ajax({
        type: "POST",
        url: "/days",
        data: {day: {date: day_id}},
        success: function(response){
          var options = $("option");
          var unique  = true;

          for (var i = 1; i < options.length; i++){
            if ($(options[i]).val() == day_id){ unique = false; }
          }

          if (unique){
            var date = $("#day_date").val();
            $("#location_day_id").append("<option value=" + response.id + ">" + date + "</option>");
           
            var ddl = document.getElementById('location_day_id');
      
            for (var i=0; i<ddl.options.length; i++){
                if (i=(ddl.options.length-1)){
                    ddl.options[i].selected = true;
                    break;
                }
            }

            $("#day_date").val('');
            removeAllRoutes();

          }
        },
      error: function (request, status, error) {
        if (day_id !== "") {
          $(".add_day").append("<div class=\"error\">That day has already been added.</div>");
         } 
      }
      })
    });

    /////////Delete Day and its markers///////
    $(".delete_day").click(function (e) {
        e.preventDefault();

        function setAllMap(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }
        setAllMap(null);
        markers = [];

        var day_to_delete = $("#location_day_id option:selected");
        var day_value = day_to_delete.val();


        $.ajax({
            type: "DELETE",
            url: "/days/" + day_value,
            data: {
                day: {
                    date: day_value
                }
            },
            success: function (response) {
                day_to_delete.remove();
                resetRoute();
            }
        });
    });

    /////////Clear a Day's markers and delete all locations///////
    $(".clear_day").click(function (e) {
        e.preventDefault();

        function setAllMap(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }
        setAllMap(null);
        markers = [];

        var day = $("#location_day_id option:selected");
        var day_value = day.val();


        $.ajax({
            type: "POST",
            url: "/days/destroy_locations",
            data: {
                day: {
                    id: day_value
                }
            },
            success: function (response) {
                resetRoute();
            }
        });
    });

        /////////Delete All Days and markers///////
    $(".delete_all_days").click(function (e) {
        e.preventDefault();

        function setAllMap(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }
        setAllMap(null);
        markers = [];

        var options = document.getElementById('location_day_id').options;
      
        for (var i=1; i<options.length; i++ ){

        var day_value = document.getElementById('location_day_id').options[i].value

        console.log(day_value);

                $.ajax({
                    type: "DELETE",
                    url: "/days/" + day_value,
                    data: {
                        day: {
                            date: day_value
                        }
                    },
                    success: function (response) {
                        clearDropdown('location_day_id');
                        removeAllRoutes();
                        resetRoute();
                    }
                });    
            }
    });

   function clearDropdown(dropdownSelector){
        var select = document.getElementById(dropdownSelector);
        var length = select.options.length;
        for (i = 1; i < length; i++) {
          select.options[i] = null;
        }
   }

});