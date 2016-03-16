import {Injectable}     from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Velib} from './velib';

@Injectable()
export class VelibService {
  constructor(private http: Http) { }

  private _key = '&apiKey=5696ca55c90197b68722762cd8aa3a9e16184de2';
  private _contract = '?contract=paris';
  private _baseUrl = 'https://api.jcdecaux.com/vls/v1/stations';
  private _velibUrl = '/';

  getVelibs() {
    return this.http.get(this._baseUrl + this._contract + this._key)
      .map((responseData) => {
      return responseData.json();
    }).map((velibs: Array<any>) => {
      let result: Array<Velib> = [];
      if (velibs) {
        velibs.forEach((velib) => {
          result.push(new Velib(velib.id, velib.name));
        });
      }
    });//.subscribe(res => this.velibs = res);
  }

  getVelib (id: number | string) {
    return this.http.get(this._baseUrl + `/${id}` + this._contract + this._key)
      .map((responseData) => {
      return responseData.json();
    }).map((velibs: Array<any>) => {
      let result: Array<Velib> = [];
      if (velibs) {
        // console.log(velibs);
        velibs.forEach((velib) => {
          result.push(new Velib(velib.id, velib.name));
        });
      }
    });//.subscribe(res => this.velibs = res);
  }

  private handleError(error: Response) {
  // in a real world app, we may send the error to some remote logging infrastructure
  // instead of just logging it to the console
  console.error(error);
  return Observable.throw(error.json().error || 'Server error');
}

}

  // var VELIBS = [
  //   new Velib(1, 'Mr.'),
  //   new Velib(11, 'Mr. Nice'),
  //   new Velib(12, 'Narco'),
  //   new Velib(13, 'Bombasto'),
  //   new Velib(14, 'Celeritas'),
  //   new Velib(15, 'Magneta'),
  //   new Velib(16, 'RubberMan')
  // ];
  // var velibsPromise = Promise.resolve(VELIBS);
  // private handleError (error: Response) {
  //   // in a real world app, we may send the server to some remote logging infrastructure
  //   // instead of just logging it to the console
  //   console.error(error);
  //   return Observable.throw(error.json().error || 'Server error');
  // }
		// let oThis = this;
    //
    // // On établit une promesse en retour
    // var promise = new Promise( function (resolve, reject) {
    //
    //   // On instancie un XMLHttpRequest
    //   var client = new XMLHttpRequest();
    //   var uri = oThis._baseUrl;
    //
    //   client.open('GET', uri);
    //   client.send();
    //
    //   client.onload = function () {
    //     if (this.status >= 200 && this.status < 300) {
    //       // On utilise la fonction "resolve" lorsque this.status vaut 2xx
		// 			let data = JSON.parse(this.response)
    //       resolve(data);
    //     } else {
    //       // On utilise la fonction "reject" lorsque this.status est différent de 2xx
    //       reject(this.statusText);
    //     }
    //   };
    //   client.onerror = function () {
    //     reject(this.statusText);
    //   };
    // });
    //
    // // Return the promise
    // return promise;
