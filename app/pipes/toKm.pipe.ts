import {Pipe} from 'angular2/core';

@Pipe({name: 'toKm'})
export class ToKmPipe {
  transform(distance:number) {

    distance = distance / 1000;
    distance = +distance.toFixed(1);

    return distance;
  }
}
