import {Component, ViewChild} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {MapComponent} from './map.component';
import {FavoriteComponent} from './favorite.component';
import {VelibService}	from '../services/velib.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app/templates/app.html',
    directives: [MapComponent,FavoriteComponent]
})

export class AppComponent {
  @ViewChild(FavoriteComponent) _favorites : FavoriteComponent;

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

    console.log(this);
    console.log(this._favorites);
    this._favorites.getFavorites();
  }

  navClose(){
    this._nav.classList.remove('visible');
    this.stateNav = false;
  }

}
