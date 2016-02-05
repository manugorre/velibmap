import {Component} from 'angular2/core';
import {HTTP_PROVIDERS}    from 'angular2/http';

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

  constructor(private _velibService: VelibService) {
    this.getVelibs();
  }

	ngOnInit() {
		this.map = new google.maps.Map(document.getElementById('map'), this.mapOption);
    this.geoLoc();
	}

  geoLoc(){
    var oThis = this;
    // Try HTML5 geolocation.
    var image = 'dist/images/geoloc.gif';
    var marker = new google.maps.Marker({map: oThis.map, icon: image, optimize: false});

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
  }

}
