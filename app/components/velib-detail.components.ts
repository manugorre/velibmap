import {Component, OnInit, NgZone}	from 'angular2/core';

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

  constructor(private _velibService: VelibService, private _zone: NgZone){

  }

	getVelib(id: number | string, callback){
    const app = this;
    this._velibService.getVelib(id).subscribe(
      data => {
        this._zone.run(() => {
          this.velib = data;
          console.log('Updated List: ', this.velib);
          // callback(data);
        });
      },
      err => {
        console.error(err)
      }
    );
	}
}
