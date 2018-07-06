import {ApplicationRef, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Radar} from "../../shared/radar";
import { Record } from "../../shared/record";
import {DataService} from "../../shared/data-service.service";
import { RecordService } from '../../shared/record.service';
declare const $: any;
import * as moment from 'moment';

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css']
})
export class MapDetailComponent implements OnInit {

  graphDataDir1: Record[];
  graphDataDir2: Record[];
  measurements: string[];
  selectedMeasurement: string;
  radar: Radar;
  groupBy: string = 'days';

  constructor(
    private dataService: DataService,
    private recordService: RecordService,
    private ref: ApplicationRef,
  ) { }

  ngOnInit() {
  }

  open(radar: Radar) {
    this.recordService.getRecordOfRadar(radar.id).subscribe(data => {
      this.radar = radar;
      this.radar.records = data;
      debugger;
      this.measurements = $.unique(radar.records.map(d => {
        return this.formatTimestampWeek(d.timestamp);
      }));
      this.selectMesaurement(this.measurements[0]);
      /*
      we need this because the action is called from leaflet.
      and leaflet has a bug that it'doesn't trigger update circle after changes
       */
      this.ref.tick();
      document.getElementById('map-detail').scrollIntoView();
    })
  }

  selectMesaurement(measurement: string) {
    this.selectedMeasurement = measurement;
    this.graphDataDir1 = this.radar.records.filter(d => {
      return this.formatTimestampWeek(d.timestamp) === measurement;
    });
    console.log(this);
  }

  private formatTimestampWeek(timestamp: string) {
    return moment(timestamp).format("YYYY-MM") + " Woche " + moment(timestamp).format('ww')
  }

  tick() {
    this.ref.tick();
  }
}
