import {Component, OnInit}	from 'angular2/core';
import {NgZone} from 'angular2/angular2';

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
  zone:NgZone;

  velib: Velib;

  constructor(private _velibService: VelibService){

  }

  ngOnInit(){
    const app = this;
  }

	getVelib(id: number | string, callback){
    const app = this;
    this._velibService.getVelib(id).subscribe(
      data => {
        app.zone.run(() => {
          this.velib = data;
          console.log('Updated List: ', this.velib);
        });
        // callback(data);
      },
      err => {
        console.error(err)
      }
    );
	}
}
