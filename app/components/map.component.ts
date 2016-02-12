import {Component} from 'angular2/core';
import {HTTP_PROVIDERS}    from 'angular2/http';
import {NgForm}    from 'angular2/common';

import {Velib}              from '../classes/velib';
// import {VelibListComponent} from './velib-list.component';
import {VelibService}       from '../services/velib.service';

@Component({
 selector: 'map-app',
 templateUrl: 'app/templates/map.html',
 // directives:[VelibListComponent],
 providers: [
  HTTP_PROVIDERS,
  VelibService,
 ]
})
export class MapComponent {

	map: Object;
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
  mapTypeControl: false
 };

 inputFrom: Object;
 inputTo: Object;

 constructor(private _velibService: VelibService) {
  this.getVelibs();
  this.events();
 }

	ngOnInit() {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;

		this.map = new google.maps.Map(document.getElementById('map'), this.mapOption);
    directionsDisplay.setMap(this.map);

    this.geoLoc();
    this.autoComplete();
	}

 autoComplete() {
  this.inputFrom = document.getElementById('pac-input-from');
  this.inputTo = document.getElementById('pac-input-to');

  var autocompleteFrom = new google.maps.places.Autocomplete(this.inputFrom);
  var autocompleteTo = new google.maps.places.Autocomplete(this.inputTo);
  // autocomplete.bindTo('bounds', this.map);
 }

 events() {
  var form = document.getElementById('route');
  var dest = [];
  var oThis = this;

  form.addEventListener('submit', function(e) {
   console.log(oThis.inputTo.value);
   dest[0] = oThis.inputFrom.value;
   dest[1] = oThis.inputTo.value;
   oThis.calculateRoute(dest);
  });
 }

 calculateRoute(dest) {
  var waypts = [];

  // var path = this.getVelibAroundPoint(dest);

  // console.log(path);

  directionsService.route({
    origin: dest[0],
    destination: dest[1],
    //  waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.BICYCLING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
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

 getVelibAroundPoint(dest) {

  console.log(dest);

  // console.log(path);
  // return path;
 }

 geoLoc() {
  var oThis = this;
  // Try HTML5 geolocation.
  var image = 'dist/images/geoloc.gif';
  var marker = new google.maps.Marker({ map: oThis.map, icon: image, optimize: false });

  if (navigator.geolocation) {
   navigator.geolocation.watchPosition(function(position) {
    var pos = {
     lat: position.coords.latitude,
     lng: position.coords.longitude
    };

    marker.setPosition(pos);
    oThis.map.setCenter(pos);
   }, function() {
     this.handleLocationError(true, marker, oThis.map.getCenter());
    });
  } else {
   // Browser doesn't support Geolocation
   this.handleLocationError(false, marker, oThis.map.getCenter());
  }
 }

 handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
   'Error: The Geolocation service failed.' :
   'Error: Your browser doesn\'t support geolocation.');
 }

 getVelibs() {
  let toto = this._velibService.getVelibs();
  console.log(toto);
 }

}
