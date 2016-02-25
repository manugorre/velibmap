import {Component, OnInit}	from 'angular2/core';

import {Velib, VelibService}	from '../services/velib.service';

@Component({
	template: `
		<h3>{{velib.id}}</h3>
	`,
})

export class VelibDetailComponent implements OnInit  {
	velib: Velib;

	constructor(private _service:VelibService){

	}

	ngOnInit() {
		let id = 1;
		this._service.getVelib(id).then(velib => this.velib = velib);
	}

};
