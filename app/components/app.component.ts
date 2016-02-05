import {Component} from 'angular2/core';
import {MapComponent} from './map.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/templates/app.html',
    directives: [MapComponent]
})
export class AppComponent {

  constructor(){

  }

}
