import {Injectable, Component} from 'angular2/core';

import {MapComponent} from './map.component';
import {ToMinPipe} from '../pipes/toMin.pipe';
import {ToKmPipe} from '../pipes/toKm.pipe';

@Component({
    selector: 'my-itinary',
    templateUrl: 'app/templates/itinary.html',
    pipes: [ToMinPipe,ToKmPipe]
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
