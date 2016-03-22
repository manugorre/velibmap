import {Injectable}     from 'angular2/core';
import {Http, Response} from 'angular2/http';
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
                .map((res:Response) => res.json());
  }

  getVelib (id: number | string) {
    return this.http.get(this._baseUrl + `/${id}` + this._contract + this._key)
      .map((res:Response) => res.json());
  }

  private handleError(error: Response) {
  // in a real world app, we may send the error to some remote logging infrastructure
  // instead of just logging it to the console
  console.error(error);
  return Observable.throw(error.json().error || 'Server error');
}

}
