import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {MapComponent} from './map.component';
// import {MapMarkersComponent} from './map-markers.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/templates/app.html',
    directives: [MapComponent]
})
// @RouteConfig([
//   {path: '/markers', name: 'MapWithMarkers', component: MapMarkersComponent},
//   // {path: '/markers/:id', name: 'MarkerDetail', component: MarkerDetailComponent}
// ])

export class AppComponent {

  constructor(){

  }

}
