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
  directionsService;
  directionArray = [];

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
  markers = [];
  hiddenMarkers: Boolean = false;
  markerCluster: Object;
  velibs: Velib[];
  velib: Velib;

  loading: Boolean;

  _app: Element;

  autocompleteSearch: Object;
  _inputSearch: Element;
  _inputFrom: Element;
  _inputTo: Element;
  itinaryState: Boolean = false;

  constructor(private _velibService: VelibService) {

  }

  ngOnInit() {
    const app = this;
    this._app = document.getElementsByTagName('body')[0];

    this.map = new google.maps.Map(document.getElementById('map'), this.mapOption);

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
    } else if (target === 'itinary') {
      var autocompleteFrom = new google.maps.places.Autocomplete(this._inputFrom);
      var autocompleteTo = new google.maps.places.Autocomplete(this._inputTo);
    }
  }

  setMarkers() {
    let _this = this;
    let velibs = this.velibs;

    for (var key in velibs) {
      this.markers[key] = new google.maps.Marker({
        position: new google.maps.LatLng(velibs[key].position.lat, velibs[key].position.lng),
        map: _this.map,
        flat: true,
        id: velibs[key].number,
        title: velibs[key].name,
        draggable: false
      });

      google.maps.event.addListener(this.markers[key], 'click', function(event) {
        _this._velibDetail.getVelib(this.id);
      });
    }
    this.markerCluster = new MarkerClusterer(this.map, this.markers, this.mcOptions);
  }

  getVelibs(callback) {
    var _this = this;
    var key = 'velibs';
    var expirationMS = 10 * 60 * 1000;
    var verifDate = false;

    if (Modernizr.localstorage) {
      var localVelibs = localStorage.getItem(key);
      localVelibs = JSON.parse(localVelibs);
      verifDate = new Date().getTime() < localVelibs.timestamp;
    }

    if (localVelibs !== null && verifDate) {
      _this.velibs = JSON.parse(localVelibs.data);
      callback(_this.velibs);
    } else {
      this._velibService.getVelibs().subscribe(
        data => {
          if (Modernizr.localstorage) {
            var toSave = { data: JSON.stringify(data), timestamp: new Date().getTime() + expirationMS };
            localStorage.setItem(key, JSON.stringify(toSave));
          }

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
      this._app.className += ' loading';

      dest.push(e.target[0].value)
      dest.push(e.target[1].value)

      this.getWaypts(dest);
    });
  }

  itinary() {
    this._app.className += ' itinary';
    this._app.classList.remove('visible');
    this._app.classList.remove('preview');
    this.itinaryState = true;
    this.autoComplete('itinary');
    this.events();
    this.hideMarkers();
  }

  hideItinary() {
    this._app.classList.remove('itinary');
    this.itinaryState = false;
    this._inputFrom.value = "";
    this._inputTo.value = "";
    for (var k in this.directionArray) {
      this.directionArray[k].setMap(null);
    }
    this.showMarkers();
  }

  reverseItinary() {
    let from: String = this._inputFrom.value;
    let to: String = this._inputTo.value;
    this._inputFrom.value = to;
    this._inputTo.value = from;
  }

  calculateRoute(itinary) {
    this.directionsService = new google.maps.DirectionsService();
    var requestArray = [];
    var itinaryFull = [];
    var _this = this;
    var cur = 0;
    var start;
    var end;
    var travelMode;

    for (let i = 0; i < 3; i++) {
      if (i === 0) {
        console.log(itinary[0].direction.address, itinary[0].station.address);

        travelMode = google.maps.TravelMode.WALKING

        start = new google.maps.LatLng(
          itinary[0].direction.position.lat, itinary[0].direction.position.lng);
        end = new google.maps.LatLng(
          itinary[0].station.position.lat, itinary[0].station.position.lng);

      } else if (i === 1) {
        console.log(itinary[0].station.address, itinary[1].station.address);

        travelMode = google.maps.TravelMode.BICYCLING

        start = new google.maps.LatLng(
          itinary[0].station.position.lat, itinary[0].station.position.lng);
        end = new google.maps.LatLng(
          itinary[1].station.position.lat, itinary[1].station.position.lng);

      } else if (i === 2) {
        console.log(itinary[1].station.address, itinary[1].direction.address);

        travelMode = google.maps.TravelMode.WALKING

        start = new google.maps.LatLng(
          itinary[1].station.position.lat, itinary[1].station.position.lng);
        end = new google.maps.LatLng(
          itinary[1].direction.position.lat, itinary[1].direction.position.lng);
      }
      var request = {
        origin: start,
        destination: end,
        travelMode: travelMode
      };
      requestArray.push(request);
    }

    if (requestArray.length > 0) {
      _this.directionsService.route(requestArray[cur], directionResults);
    }

    function directionResults(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        _this.directionArray[cur] = new google.maps.DirectionsRenderer();
        _this.directionArray[cur].setMap(_this.map);
        _this.directionArray[cur].setDirections(result);
        itinaryFull.push(result);
      }
      cur++;
      if (cur < requestArray.length) {
        _this.directionsService.route(requestArray[cur], directionResults);
      }else{
        _this._app.classList.remove('loading');
        _this.setItinaryDom(itinaryFull);
      }
    }
  }

  setItinaryDom(data){
    var durationTotal = data[0].routes[0].legs[0].duration.value +
                        data[1].routes[0].legs[0].duration.value +
                        data[2].routes[0].legs[0].duration.value;

    var distanceTotal = data[0].routes[0].legs[0].distance.value +
                        data[1].routes[0].legs[0].distance.value +
                        data[2].routes[0].legs[0].distance.value;
    console.log('data', data);

  }

  getWaypts(dest) {
    this.getVelibAroundPoint(dest, (itinary) => {
      this.calculateRoute(itinary);
    });
  }

  getVelibAroundPoint(dest, callback) {
    //TODO: - verif station ouverte
    //      - verif velib restant

    var m: number = 0;
    var stations = [];
    var _this = this;

    function request() {
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

        var i: number = 0;
        var isWithinRectangle = false;

        while (!isWithinRectangle) {
          var that = _this.velibs[i];
          var cityCircle = new google.maps.Circle(circleParam);
          var point = new google.maps.LatLng(that.position.lat, that.position.lng);

          isWithinRectangle = cityCircle.getBounds().contains(point);
          if (isWithinRectangle) {
            stations.push({
              direction: {
                address: dest[m],
                position: center
              },
              station: that
            });
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

    if (this.geoLocMarker !== undefined) {
      this.geoLocMarker.setMap(null);
      this.geoLocMarker = new google.maps.Marker({ map: oThis.map, icon: image, optimize: false });
    } else {
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

  showMarkers() {
    this.markerCluster = new MarkerClusterer(this.map, this.markers, this.mcOptions);
  }

  hideMarkers() {
    this.markerCluster.clearMarkers();
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

  loadStart() {
    this._app.className += ' loading';
    this.loading = true;
  }

  loadEnd() {
    this._app.classList.remove('loading');
    this.loading = false;
  }

  hasClass(el, cls) {
    return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
  }

}
