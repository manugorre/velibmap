import {Injectable}     from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Velib}          from '../classes/velib';

@Injectable()
export class VelibService {
  constructor (private http: Http) {}

	private _baseUrl = 'https://api.jcdecaux.com/vls/v1/stations?contract=paris&apiKey=5696ca55c90197b68722762cd8aa3a9e16184de2'
  private _velibUrl = '/';

  getVelibs () {
		let oThis = this;

    // On établit une promesse en retour
    var promise = new Promise( function (resolve, reject) {

      // On instancie un XMLHttpRequest
      var client = new XMLHttpRequest();
      var uri = oThis._baseUrl;

      client.open('GET', uri);
      client.send();

      client.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          // On utilise la fonction "resolve" lorsque this.status vaut 2xx
					let data = JSON.parse(this.response)
          resolve(data);
        } else {
          // On utilise la fonction "reject" lorsque this.status est différent de 2xx
          reject(this.statusText);
        }
      };
      client.onerror = function () {
        reject(this.statusText);
      };
    });

    // Return the promise
    return promise;
  }
  private handleError (error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
