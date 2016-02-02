import {Component} from 'angular2/core';

@Component({
    selector: 'map-app',
    templateUrl: 'app/templates/map.html'
})
export class MapComponent {

	map: Object;

  lat: number = 48.8598542; //DEFAULT PARIS LAT
  lng: number = 2.3465248; //DEFAULT PARIS LNG
  zoom: number = 12;

  constructor() {

  }

	ngOnInit(){
		this.map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: this.lat, lng: this.lng},
    	scrollwheel: false,
    	zoom: this.zoom
  	});
	}

}
