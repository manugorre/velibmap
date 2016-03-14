import {Component} from 'angular2/core';
import {HTTP_PROVIDERS}    from 'angular2/http';
import {NgForm}    from 'angular2/common';

import {Velib}              from '../service/velib';
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

  errorMessage: string;
  velibs:Velib[];
  velib:Velib[];

  constructor(private _velibService: VelibService) {
    // this.events();

  }

  ngOnInit() {
    var app = this;
    this.getVelibs();
    this.getVelib(6020);
    // this.directionsService = new google.maps.DirectionsService;
    // this.directionsDisplay = new google.maps.DirectionsRenderer;

    // this.map = new google.maps.Map(document.getElementById('map'), this.mapOption);
    // this.directionsDisplay.setMap(this.map);

    // this.geoLoc();
    // this.autoComplete();
    // this.velibs = this._velibService.getVelibs();
    // this._velibService.getVelibs().subscribe(
    //   velibs => this.velibs = velibs);
    //
    // // this._velibService.getVelibs().then(velibs => this.velibs = velibs);
    //
    // this._velibService.getVelib(1).then(function(value){
    //   console.log(value);
    // }, function(raison) {
    //   // Rejet de la promesse
    //   console.log('fail', raison);
    // });

    // this._velibService.getVelib(1).then(function(value){
    //   console.log(value);
    // }, function(raison) {
    //   // Rejet de la promesse
    //   console.log('fail', raison);
    // });

  }

  getVelibs() {
    this._velibService.getVelibs()
                     .subscribe(
                       velibs => this.velibs = velibs,
                       error =>  this.errorMessage = <any>error);
  }

  getVelib(id: number | string){
     this._velibService.getVelib(id)
                      .subscribe(
                        velib => this.velib = velib,
                        error =>  this.errorMessage = <any>error);
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
      dest[0] = oThis.inputFrom.value;
      dest[1] = oThis.inputTo.value;
      oThis.getWaypts(dest);
    });

  }

  calculateRoute(dest, waypts){
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

    var station:Object;

    var r = new XMLHttpRequest();

    r.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address='" + dest + "'", true);

    r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return;

      var response = JSON.parse(r.responseText);

      var lat = response.results[0].geometry.location.lat;
      var lng = response.results[0].geometry.location.lng;
      var center = {lat: lat, lng: lng};

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

          if(isWithinRectangle){

            var waypt = {
              location: that.address,
              stopover: true
            };

            console.log('WAYPTS', waypt);

            station = waypt;
            test1 = true;
          }
        }
        if(test1 === false){
          circleParam.radius += 20;
          console.log('more distance');
        }else{
          isVelibNearMe = true;
          console.log('found');
        }

      }
      callback(station);
      console.log('_______________________');
    };
    r.send();

  }

  geoLoc() {
    var oThis = this;
    // Try HTML5 geolocation.
    var image = 'dist/images/geoloc.gif';
    // var marker = new google.maps.Marker({ map: oThis.map, icon: image, optimize: false });

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

}
