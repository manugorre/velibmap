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
      <div>
        <div class="favori" (click)="favori()">
          <i class="material-icons dp48">star</i>
        </div>
        <div class="js-scroll detail-content">
          <div class="js-slidder">
            <div class="item">
              <div class="chart_available_bike" style="width: 100%; height: 200px;"></div>
            </div>
            <div class="item">
              <div class="chart_available_bike" style="width: 100%; height: 200px;"></div>
            </div>
            <div class="item">
              <div class="chart_available_bike" style="width: 100%; height: 200px;"></div>
            </div>
            <div class="item">
              <div class="chart_available_bike" style="width: 100%; height: 200px;"></div>
            </div>
            <div class="item">
              <div class="chart_available_bike" style="width: 100%; height: 200px;"></div>
            </div>
            <div class="item">
              <div class="chart_available_bike" style="width: 100%; height: 200px;"></div>
            </div>
            <div class="item">
              <div class="chart_available_bike" style="width: 100%; height: 200px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  pipes: [SplitNamePipe]
})
export class VelibDetailComponent {
  velib: Velib;

  _app: Element;
  stateDetail: Boolean;
  stateDetailMore: Boolean;
  _detailVelib: Element;
  _detailMoreVelib: Element;
  scrollDetailMore: Object;



  constructor(private _velibService: VelibService, private _zone: NgZone) {
  }

  ngOnInit() {
    this.stateDetail = false;
    this.stateDetailMore = false;
    this._app = document.getElementsByTagName('body')[0];
    this._detailVelib = document.getElementsByClassName('js-detail-velib')[0];
  }

  getVelib(id: number | string, callback) {
    const app = this;
    this._velibService.getVelib(id).subscribe(
      data => {
        this._zone.run(() => {
          this.velib = data;
          this._app.classList.remove('visible');
          this.velibOpen();
          // console.log('Updated List: ', this.velib);
          let checkFav = this.checkFav(this.velib.number);

          this.setupDataChart();

          if (checkFav) {
            this._detailVelib.className += ' fav';
          } else {
            this._detailVelib.classList.remove('fav');
          }
        });
      },
      err => {
        console.error(err)
      }
      );
  }

  setupDataChart() {
    const rootRef = new Firebase('https://velibmap.firebaseio.com/data/Paris/12042');

    rootRef.once("value", (snap) => {
      let data = snap.val();
      let allDay = []
      // console.log(data)
      for (let day in data) {
        let oneDay = [['', 'Nbr']];
        for (let hour in data[day]) {
          let item = [hour, data[day][hour].available_bike_stands];
          oneDay.push(item);
        }
        allDay.push({ day: data[day], data: [oneDay] });
      }
      // console.log('allDay', allDay);
      this.setChart(allDay);
    });
  }

  setChart(data: Object) {
    google.charts.load('current', { 'packages': ['bar'] });
    google.charts.setOnLoadCallback(drawChart);
    var dataChart = [];
    var optionChart = [];
    var domChart = [];

    function drawChart() {
      var loadIteration = 0;
      for (let day in data) {
        // console.log('hello');
        dataChart[day] = google.visualization.arrayToDataTable([
          ['', 'Nbr'],
          ['00h', data[day].day[1].available_bikes],
          ['01h', data[day].day[2].available_bikes],
          ['02h', data[day].day[3].available_bikes],
          ['03h', data[day].day[4].available_bikes],
          ['04h', data[day].day[5].available_bikes],
          ['05h', data[day].day[6].available_bikes],
          ['06h', data[day].day[7].available_bikes],
          ['07h', data[day].day[8].available_bikes],
          ['08h', data[day].day[9].available_bikes],
          ['09h', data[day].day[10].available_bikes],
          ['10h', data[day].day[11].available_bikes],
          ['11h', data[day].day[12].available_bikes],
          ['12h', data[day].day[13].available_bikes],
          ['13h', data[day].day[14].available_bikes],
          ['14h', data[day].day[15].available_bikes],
          ['15h', data[day].day[16].available_bikes],
          ['16h', data[day].day[17].available_bikes],
          ['17h', data[day].day[18].available_bikes],
          ['18h', data[day].day[19].available_bikes],
          ['19h', data[day].day[20].available_bikes],
          ['20h', data[day].day[21].available_bikes],
          ['21h', data[day].day[22].available_bikes],
          ['22h', data[day].day[23].available_bikes],
          ['23h', data[day].day[24].available_bikes]
        ]);
        let dayString = "";
        switch (day) {
          case "0":
          dayString = "Lundi"
            break;
          case "1":
          dayString = "Mardi"
            break;
          case "2":
          dayString = "Mercredi"
            break;
          case "3":
          dayString = "Jeudi"
            break;
          case "4":
          dayString = "Vendredi"
            break;
          case "5":
          dayString = "Samedi"
            break;
          case "6":
          dayString = "Dimanche"
            break;
          default:
            dayString = "undefined"
        }

        optionChart[day] = {
          tooltip: { trigger: 'none' },
          legend: { position: "none" },
          width: 300,
          chart: {
            title: 'Velib disponible Moyen/h',
            subtitle: dayString
          }
        };
        domChart[day] = new google.charts.Bar(document.getElementsByClassName('chart_available_bike')[day]);
        domChart[day].draw(dataChart[day], optionChart[day]);
        google.visualization.events.addListener(domChart[day], 'ready', myReadyHandler);
      }
      function myReadyHandler() {
        loadIteration++;
        if (data.length === loadIteration) {
          $('.js-slidder').slick({ dots: true, arrows: false, infinite: false });
        }
      }
    }
    // setTimeout(() => {
    // this.scrollDetailMore = new IScroll('.js-scroll', {
    //   click: true,
    //   mouseWheel: true
    // });
    // }, 3000)

  }

  initSlider() {
    // .slick('');
  }

  velibOpen() {
    this._app.className += ' visible';
    this.stateDetail = true;
  }

  velibClose() {
    this._app.classList.remove('visible');
    this.stateDetail = false;
  }

  detailVelibToggle() {
    if (this.stateDetailMore) {
      this.expandClose()
    } else {
      this.expandOpen()
    }
  }

  expandOpen() {
    this._app.className += ' preview';
    this.stateDetailMore = true;
  }

  expandClose() {
    this._app.classList.remove('preview');
    this.stateDetailMore = false;
  }

  favori(e) {
    let that = this;
    let favStorage = localStorage.getItem('favorite');
    var favoriteToSave = JSON.parse(favStorage) ? JSON.parse(favStorage) : [];

    if (this.hasClass(this._detailVelib, 'fav')) {
      var result = favoriteToSave.findIndex(x => x.number === that.velib.number)

      if (favoriteToSave.length <= 1) {
        favoriteToSave.shift();
      } else {
        favoriteToSave.splice(result, 1);
      }

      this._detailVelib.classList.remove('fav');
    } else {
      let newFavorite = {
        'number': this.velib.number
      }

      favoriteToSave.push(newFavorite);

      this._detailVelib.classList += ' fav';
    }
    // console.log('after', favoriteToSave);
    localStorage.setItem('favorite', JSON.stringify(favoriteToSave));
    //favoris = favoriteToSave;
  }

  checkFav(id: number) {
    let favStorage = localStorage.getItem('favorite')

    if (favStorage !== null) {
      return favStorage.indexOf(id.toString()) > -1
    }
    return false
  }

  hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}
