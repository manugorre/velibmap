import {Component, OnInit, NgZone}	from 'angular2/core';

import {Velib}              from '../services/velib';
import {SplitNamePipe} from '../pipes/splitName.pipe';

@Component({
  selector: 'favorite',
  templateUrl: 'app/templates/favorite.html',
  pipes: [SplitNamePipe]
})

export class FavoriteComponent {
  favoris: Array<Object>;

  _app: Element;
  stateFavorite: Boolean;
  _favoriteVelibs: Element;

  constructor(private _zone: NgZone){

  }

  ngOnInit(){
    this.stateFavorite = true;
    this._app = document.getElementsByTagName('body')[0];
    this._favoriteVelibs = document.getElementsByClassName('js-favorite')[0];
    this.getFavorites();
  }

  getFavorites(callback) {
    var _this = this;
    var key = 'favorite';
    var expirationMS = 10 * 60 * 1000;
    var localFavoris = localStorage.getItem(key);
    var localVelibs = localStorage.getItem('velibs');
    var output = [];
    localFavoris = JSON.parse(localFavoris);
    localVelibs = JSON.parse(localVelibs);
    localVelibs = JSON.parse(localVelibs.data);

    for(var favori of localFavoris){
      var index = (localVelibs.findIndex( x => x.number === favori.number ) );
      output.push(localVelibs[index]);

    }
    //console.log(localVelibs);
    this.favoris = output;
  }

  deleteFavori(favori){
    let that = this;
    let favStorage = localStorage.getItem('favorite');
    var favoriteToSave = JSON.parse(favStorage) ? JSON.parse(favStorage) : [];

    console.log(favoriteToSave);
    console.log(favori);

    var index = favoriteToSave.findIndex( x => x.number === favori.number )

    favoriteToSave.splice(index,1);

    console.log(favoriteToSave);


    //console.log('after', favoriteToSave);
    localStorage.setItem('favorite', JSON.stringify(favoriteToSave));
    this.getFavorites();
  }

}
