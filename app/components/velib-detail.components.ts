import {Component, OnInit, NgZone}	from 'angular2/core';

import {VelibService}       from '../services/velib.service';
import {Velib}              from '../services/velib';
import {SplitNamePipe} from '../pipes/splitName.pipe';

@Component({
  selector: 'velib-detail',
  template: `
    <div *ngIf="velib">
      <div (click)="detailVelibToggle()" class="detail-header {{ velib.status | lowercase }}">
        <div class="label">
          <h2 class="station-name">{{ velib.name | splitName:0 }}</h2>
          <h3 class="station-city">{{ velib.name | splitName:1 }}</h3>
        </div>
        <div class="info">
          <span><i class="material-icons dp48">directions_bike</i> : {{ velib.available_bikes }}</span>
          <span><i class="material-icons dp48">directions_walk</i> : {{ velib.available_bike_stands }}</span>
        </div>
        <i class="expand material-icons dp48">more_vert</i>
      </div>
      <div class="js-scroll detail-content">
        <ul>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
        </ul>
      </div>
    </div>
  `,
  pipes: [SplitNamePipe]
})
export class VelibDetailComponent {
  velib: Velib;

  stateDetail: Boolean;
  stateDetailMore: Boolean;
  _detailVelib: Element;
  _detailMoreVelib: Element;
  scrollDetailMore: Object;

  constructor(private _velibService: VelibService, private _zone: NgZone){

  }

  ngOnInit(){
    this.stateDetail = false;
    this.stateDetailMore = false;
    this._detailVelib = document.getElementsByClassName('js-detail-velib')[0];
  }

	getVelib(id: number | string, callback){
    const app = this;
    this._velibService.getVelib(id).subscribe(
      data => {
        this._zone.run(() => {
          this.velib = data;
          this._detailVelib.classList.remove('visible');
          this.velibOpen();
          console.log('Updated List: ', this.velib);
          // callback(data);
        });
      },
      err => {
        console.error(err)
      }
    );
	}

  velibOpen(){
    this._detailVelib.className += ' visible';
    this.stateDetail = true;
  }

  velibClose(){
    this._detailVelib.classList.remove('visible');
    this.stateDetail = false;
  }

  detailVelibToggle(){
    if (this.stateDetailMore) {
        this.expandClose()
    }else{
      this.expandOpen()
    }
  }

  expandOpen(){
    this._detailVelib.className += ' preview';
    this.stateDetailMore = true;
    this.scrollDetailMore = new IScroll('.js-scroll', {
      mouseWheel: true
    });
  }

  expandClose(){
    this._detailVelib.classList.remove('preview');
    this.stateDetailMore = false;
  }
}
