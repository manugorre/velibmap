import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {MapComponent} from './map.component';
import {VelibService}	from '../services/velib.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app/templates/app.html',
    directives: [MapComponent]
})

export class AppComponent {

  constructor(){

  }

  // ngOnInit(private _service:VelibService){
  //   console.log(VelibDetailComponent.getVelib(6020));
  // }

}
