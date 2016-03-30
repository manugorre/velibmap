import {Pipe} from 'angular2/core';

@Pipe({name: 'toMin'})
export class ToMinPipe {
  transform(time:number) {

    time = time / 60;
    time = Math.round(time);

    return time;
  }
}
