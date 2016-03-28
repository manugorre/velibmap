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
  itinaryState:Boolean = true;

  constructor(private _velibService: VelibService) {

  }

  ngOnInit() {
    const app = this;
    this._app = document.getElementsByTagName('body')[0];

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

      google.maps.event.addListener(markers[key], 'click', function(event) {
        app._velibDetail.getVelib(this.id);
      });
    }
    var markerCluster = new MarkerClusterer(app.map, markers, app.mcOptions);
  }

  getVelibs(callback) {
    var _this = this;
    var key = 'velibs';
    var expirationMS = 10 * 60 * 1000;
    var localVelibs = localStorage.getItem(key);
        localVelibs = JSON.parse(localVelibs);

    if (localVelibs !== null && new Date().getTime() < localVelibs.timestamp) {
      _this.velibs = JSON.parse(localVelibs.data);
      callback(_this.velibs);
    } else {
      this._velibService.getVelibs().subscribe(
        data => {
          var toSave = {data: JSON.stringify(data), timestamp: new Date().getTime() + expirationMS};
          localStorage.setItem(key, JSON.stringify(toSave));

		      _this.velibs = data;
          callback(data);
        },
        err => {
          console.error(err)
        }
      );
    }
  }

  events() {
    var form = document.getElementById('route');

    form.addEventListener('submit', (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      var dest = [];
      dest.push(e.target[0].value)
      dest.push(e.target[1].value)
      this.getWaypts(dest);
    });
  }

  itinary() {
    this._app.className += ' itinary';
    this._app.classList.remove('preview');
    this.itinaryState = true;
    this.autoComplete('itinary');
    this.events();
  }

  hideItinary(){
    this._app.classList.remove('itinary');
    this.itinaryState = true;
    this._inputFrom.value = "";
    this._inputTo.value = "";
  }

  reverseItinary(){
    let from:String = this._inputFrom.value;
    let to:String =  this._inputTo.value;
    this._inputFrom.value = to;
    this._inputTo.value = from;
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
    var waypts = [];

    this.getVelibAroundPoint(dest, (waypt) => {
      if (waypt.length === dest.length) {
        console.log('READYYYY MOTHER FOCKER');
        console.log(dest, waypt)
        // oThis.calculateRoute(dest, waypts);
      }
    });
  }

  getVelibAroundPoint(dest, callback) {
    //TODO: - verif station ouverte
    //      - verif velib restant

    var m:number = 0;
    var stations = [];
    var _this = this;

    function request(){
      var r = new XMLHttpRequest();
      r.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address='" + dest[m] + "'", true);
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
          map: _this.map,
          center: center,
          radius: 100
        };

        var i:number = 0;
        var isWithinRectangle = false;

        while (!isWithinRectangle) {
          var that = _this.velibs[i];
          var cityCircle = new google.maps.Circle(circleParam);
          var point = new google.maps.LatLng(that.position.lat, that.position.lng);

          isWithinRectangle = cityCircle.getBounds().contains(point);
          if (isWithinRectangle) {
            stations.push(that);
          } else if (_this.velibs[i + 1] != undefined) {
            i++;
          } else {
            i = 0;
            circleParam.radius += 20;
          }
        }

        if (stations.length === 2) {
          callback(stations);
        } else {
          m++;
          request();
        }
      };
      r.send();
    }
    request();
  }

  geolocate() {
    var oThis = this;
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
