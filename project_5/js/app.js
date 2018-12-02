//global variables
var map, infoWindow, bounds;

//initialize google maps api
function initMap() {
    var atlanta = {
        lat: 33.77147,
        lng: -84.389805
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: atlanta,
        mapTypeControl: false
    });

    infoWindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    ko.applyBindings(new viewModel());
}

//error handling for google maps
function googleMapsError() {
    alert('An error occurred with Google Maps!');
}
 
var locationMarker = function(data) {
    var self = this;
    this.title = data.title;
    this.position = data.location;
    this.street = '',
    this.city = '',
    this.phone = '';
    this.visible = ko.observable(true);

    //change the colors of the default markers
    var defaultIcon = makeMarkerIcon('008000');
    var highlightedIcon = makeMarkerIcon('800080');

    var clientID = '4V4NYUOVJRLRTJ4AIGPWOWA50R1NCRCSRPG1GDGTULJLDCLJ';
    var clientSecret = 'RDAXYQIBUJR2UMNC1RDX5BVWWV1JXBCWUH12LUTO0GFQHMDL';

    //call foursquare
    var reqURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + 
        this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180323' + '&query=' + this.title;

    $.getJSON(reqURL).done(function(data) {
		var results = data.response.venues[0];
        self.street = results.location.formattedAddress[0] ? results.location.formattedAddress[0]: 'N/A';
        self.city = results.location.formattedAddress[1] ? results.location.formattedAddress[1]: 'N/A';
    }).fail(function() {
        alert('Something went wrong with foursquare');
    });

    //create a marker at each location, and store in array
    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon
    });    

    self.filterMarkers = ko.computed(function () {
        //set marker and extend bounds
        if(self.visible() === true) {
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            map.fitBounds(bounds);
        } else {
            self.marker.setMap(null);
        }
    });
    
    //onClick event to open an infoWindow at each marker
    this.marker.addListener('click', function() {
        populateInfoWindow(this, self.street, self.city, self.phone, infoWindow);
        bouncer(this);
        map.panTo(this.getPosition());
    });

    //event listeners for mouseover and mouseout to change the colors back and forth.
    this.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });
    this.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });

    //display information for the selected location marker
    this.show = function(location) {
        google.maps.event.trigger(self.marker, 'click');
    };
};

var viewModel = function() {
    var self = this;
    this.searchItem = ko.observable('');
    this.mapList = ko.observableArray([]);

    //add location markers for each location
    locations.forEach(function(location) {
        self.mapList.push( new locationMarker(location) );
    });

    //locations viewed on map
    this.locationList = ko.computed(function() {
        var searchFilter = self.searchItem().toLowerCase();
        if (searchFilter) {
            return ko.utils.arrayFilter(self.mapList(), function(location) {
                var str = location.title.toLowerCase();
                var result = str.includes(searchFilter);
                location.visible(result);
				return result;
			});
        }
        self.mapList().forEach(function(location) {
            location.visible(true);
        });
        return self.mapList();
    }, self);
};

//populate the infowindow when the marker is clicked.
function populateInfoWindow(marker, street, city, phone, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        var windowContent = '<h4>' + marker.title + '</h4>' + 
            '<p>' + street + "<br>" + city + '<br>' + phone + "</p>";

        //on success, compute the position of the streetview image, calculate the heading, then get a panorama from that and set the options
        var getStreetView = function (data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent(windowContent + '<div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 20
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent(windowContent + '<div style="color: red">No Street View Found</div>');
            }
        };
        //use streetview service to get the closest streetview image within 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        infowindow.open(map, marker);
    }
}

function bouncer(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
          marker.setAnimation(null);
      }, 1400);
    }
  }

//create marker icon
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}