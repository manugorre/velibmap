import {Injectable, Component} from 'angular2/core';

import {MapComponent} from './map.component';

@Component({
    selector: 'my-itinary',
    templateUrl: 'app/templates/itinary.html'
})

export class ItinaryComponent {

	itinary = {};

  constructor(){

  }

  ngOnInit(){

  }

	showItinary(data){
		console.log('itinary', data);
		this.itinary = data;
	}
}
