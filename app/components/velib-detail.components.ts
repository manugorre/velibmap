import {Component, OnInit}	from 'angular2/core';
// import {RouteParams} from 'angular2/router';
//
import {Velib}	from '../services/velib';
// import {VelibService}	from '../services/velib.service';
//
// @Component({
//   selector: 'velib-detail',
//   templateUrl: 'app/templates/detailVelib.html'
// })

// export class VelibDetailComponent implements OnInit  {
// 	velib: Velib;
//   errorMessage: string;
//
// 	constructor(private _service:VelibService, private _routeParams: RouteParams){
//
// 	}
//
// 	ngOnInit() {}
//
// 	getVelib(id: number | string){
// 		 return this._service.getVelib(id)
// 											.subscribe(
// 												velib => this.velib = velib,
// 												error =>  this.errorMessage = <any>error);
// 	}
//
//
// };

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
}
