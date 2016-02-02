import {Component} from 'angular2/core';
import {MapComponent} from './map.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/templates/app.html',
    // providers: [VelibService],
    directives: [MapComponent]
})
export class AppComponent { }
