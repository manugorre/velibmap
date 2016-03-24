import {Component, ViewChild} from 'angular2/core';
import {HTTP_PROVIDERS}    from 'angular2/http';
import {NgForm}    from 'angular2/common';

import {VelibDetailComponent} from './velib-detail.components';
import {VelibService}       from '../services/velib.service';
import {Velib}              from '../services/velib';

@Component({
  selector: 'map-app',
  templateUrl: 'app/templates/map.html',
  directives: [VelibDetailComponent],
  providers: [
    HTTP_PROVIDERS,
    VelibService
  ]
})
export class MapComponent {
  @ViewChild(VelibDetailComponent)
  _velibDetail: VelibDetailComponent;

  map: Object;
  mc: Object;
  geoLocMarker: Object;
  directionsService: Object;
  directionsDisplay: Object;

  mapOption: any = {
    center: {
      lat: 48.8598542,
      lng: 2.3465248
    },
    scrollwheel: true,
    zoom: 12,
    zoomControl: false,
    streetViewControl: false,
    disableDefaultUI: true,
    mapTypeControl: false
  };

  mcOptions: any = {
    gridSize: 50, maxZoom: 15
  };

  errorMessage: string;
  velibs: Velib[];
  velib: Velib;

  loading: Boolean;

  _app: Element;

  autocompleteSearch: Object;
  _inputSearch: Element;
  _inputFrom: Element;
  _inputTo: Element;

  constructor(private _velibService: VelibService) {

  }

  ngOnInit() {
    const app = this;
    this._app = document.getElementsByTagName('my-app')[0];

    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;

    this.map = new google.maps.Map(document.getElementById('map'), this.mapOption);
    this.directionsDisplay.setMap(this.map);

    this._inputSearch = document.getElementById('pac-input-search');
    this._inputFrom = document.getElementById('pac-input-from');
    this._inputTo = document.getElementById('pac-input-to');

    this.autoComplete('search');
    this.getVelibs(function(data) {
      app.setMarkers();
    });
  }

  autoComplete(target: String) {
    var that = this;

    if (target === 'search') {
        this.autocompleteSearch = new google.maps.places.Autocomplete(this._inputSearch);
        this.autocompleteSearch.addListener('place_changed', function() {
          var place = that.autocompleteSearch.getPlace();
            if (!place.geometry) {
              window.alert("Autocomplete's returned place contains no geometry");
              return;
            }
            if (place.geometry.viewport) {
              that.map.fitBounds(place.geometry.viewport);
            } else {
              that.map.setCenter(place.geometry.location);
              that.map.setZoom(15);
            }
        });
    } else if (target === 'itinary'){
      var autocompleteFrom = new google.maps.places.Autocomplete(this._inputFrom);
      var autocompleteTo = new google.maps.places.Autocomplete(this._inputTo);
    }
  }

  events() {
    var form = document.getElementById('route');
    var dest = [];
    var oThis = this;

    form.addEventListener('submit', function(e) {
      dest[0] = oThis.inputFrom.value;
      dest[1] = oThis.inputTo.value;
      oThis.getWaypts(dest);
    });

  }

  setMarkers() {
    const app = this;
    let markers = [];
    let velibs = this.velibs;

    for (var key in velibs) {
      markers[key] = new google.maps.Marker({
        position: new google.maps.LatLng(velibs[key].position.lat, velibs[key].position.lng),
        map: app.map,
        flat: true,
        id: velibs[key].number,
        title: velibs[key].name,
        draggable: false
      });
      // var iconFile = 'http://maps.google.com/mapfiles/ms/icons/'+marker_color+'-dot.png';
      // markers[key].setIcon(iconFile);

      google.maps.event.addListener(markers[key], 'click', function(event) {
        app._velibDetail.getVelib(this.id);
      });
    }
    var markerCluster = new MarkerClusterer(app.map, markers, app.mcOptions);
  }

  getVelibs(callback) {
    var app = this;
    this._velibService.getVelibs().subscribe(
      data => {
        app.velibs = data;
        callback(data);
      },
      err => {
        console.error(err)
      }
      );
  }

  calculateRoute(dest, waypts) {
    var oThis = this;

    oThis.directionsService.route({
      origin: dest[0],
      destination: dest[1],
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          oThis.directionsDisplay.setDirections(response);
          var route = response.routes[0];
          console.log(route);
          // var summaryPanel = document.getElementById('directions-panel');
          // summaryPanel.innerHTML = '';
          // // For each route, display summary information.
          // for (var i = 0; i < route.legs.length; i++) {
          //   var routeSegment = i + 1;
          //   summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
          //   summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          //   summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          //   summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
          // }
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
  }

  getWaypts(dest) {

    var oThis = this;
    var waypts = [];

    for (let i = 0; i < dest.length; i++) {
      this.getVelibAroundPoint(dest[i], function(waypt) {

        waypts.push(waypt);

        if (waypts.length === dest.length) {
          console.log('READYYYY MOTHER FOCKER');
          oThis.calculateRoute(dest, waypts);
        }
      });
    }


  }

  getVelibAroundPoint(dest, callback) {
    var oThis = this;

    var station: Object;

    var r = new XMLHttpRequest();

    r.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address='" + dest + "'", true);

    r.onreadystatechange = function() {
      if (r.readyState != 4 || r.status != 200) return;

      var response = JSON.parse(r.responseText);

      var lat = response.results[0].geometry.location.lat;
      var lng = response.results[0].geometry.location.lng;
      var center = { lat: lat, lng: lng };

      var circleParam = {
        strokeColor: '#FF0000',
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0,
        map: oThis.map,
        center: center,
        radius: 100
      };

      var isVelibNearMe = false;
      var test1 = false;

      console.log('FOUND station FOR', dest);

      while (!isVelibNearMe) {

        var cityCircle = new google.maps.Circle(circleParam);

        for (let i = 0; i < oThis.velibs._result.length; i++) {
          var that = oThis.velibs._result[i];

          var point = new google.maps.LatLng(that.position.lat, that.position.lng);

          var isWithinRectangle = cityCircle.getBounds().contains(point);

          if (isWithinRectangle) {

            var waypt = {
              location: that.address,
              stopover: true
            };

            console.log('WAYPTS', waypt);

            station = waypt;
            test1 = true;
          }
        }
        if (test1 === false) {
          circleParam.radius += 20;
          console.log('more distance');
        } else {
          isVelibNearMe = true;
          console.log('found');
        }

      }
      callback(station);
      console.log('_______________________');
    };
    r.send();

  }

  geolocate() {
    console.log('geoloc')
    var oThis = this;
    // Try HTML5 geolocation.
    var image = 'dist/images/geoloc.png';

    if(this.geoLocMarker !== undefined){
      this.geoLocMarker.setMap(null);
      this.geoLocMarker = new google.maps.Marker({ map: oThis.map, icon: image, optimize: false });
    }else{
      this.geoLocMarker = new google.maps.Marker({ map: oThis.map, icon: image, optimize: false });
    }

    if (navigator.geolocation) {
      oThis.loadStart()
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var changed = true;

        oThis.geoLocMarker.setPosition(pos);
        oThis.map.panTo(pos);

        oThis.map.addListener('idle', function() {
          if (changed) {
            oThis.map.setZoom(15);
            changed = false;
          }
        });
        oThis.loadEnd()
      });
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, oThis.geoLocMarker, oThis.map.getCenter());
    }
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

  loadStart(){
    this._app.className += ' loading';
    this.loading = true;
  }

  loadEnd(){
    this._app.classList.remove('loading');
    this.loading = false;
  }

  hasClass(el, cls) {
    return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
  }

}
