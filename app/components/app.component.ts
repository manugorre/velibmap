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

  //nav
  stateNav: Boolean;
  scrollMenu: Object;
  _nav: Element;

  constructor(){

  }

  ngOnInit(){
    //nav
    this.stateNav = false;
    this._nav = document.getElementsByClassName('js-nav')[0];
  }

  navOpen(){
    this._nav.className += ' visible';
    this.stateNav = true;
    this.scrollMenu = new IScroll('.js-scroll-menu', {
      mouseWheel: true
    });
  }

  navClose(){
    this._nav.classList.remove('visible');
    this.stateNav = false;
  }

}
