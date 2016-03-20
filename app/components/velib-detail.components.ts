import {Component, OnInit}	from 'angular2/core';

import {VelibService}       from '../services/velib.service';
import {Velib}              from '../services/velib';

@Component({
  selector: 'velib-detail',
  template: `
    <div *ngIf="velib">
      <h2>{{velib.name}}</h2>
    </div>
  `
})
export class VelibDetailComponent {
  velib: Velib;

  constructor(private _velibService: VelibService){

  }

  ngOnInit(){
    var app = this;
    // this.getVelib(6020, function(data){
    //   console.log(data);
    //   this.velib = data
    // });
  }

	getVelib(id: number | string, callback){
    var app = this;
    this._velibService.getVelib(id).subscribe(
      data => {
        app.velib = data;
        callback(data);
      },
      err => {
        console.error(err)
      }
    );
	}
}
