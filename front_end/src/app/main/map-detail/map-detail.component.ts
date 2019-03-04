import { ApplicationRef, Component, OnInit } from '@angular/core';
import { Radar } from '../../shared/radar';
import { RecordService } from '../../shared/record.service';
import { WeeklyRecord } from '../../shared/weekly-record';
import { MeasurementWeek } from '../../shared/measurement-week';
import { DailyRecord } from '../../shared/daily-record';
import { ColorService } from '../../shared/color.service';
import * as moment from 'moment';
declare const $: any;

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css']
})
export class MapDetailComponent implements OnInit {

  graphData: WeeklyRecord[];
  measurements: MeasurementWeek[];
  selectedMeasurement: MeasurementWeek;
  radar: Radar;
  visible = false;
  loading = false;
  header = '';
  currentWeek: WeeklyRecord[];
  directionOne = true;
  measure = 'speedingQuote';
  currentDay: DailyRecord[];
  dailyHeader: string;

  constructor(
    private recordService: RecordService,
    private ref: ApplicationRef,
    private colorService: ColorService
  ) { }

  ngOnInit() {
  }

  open(radar: Radar) {
    this.directionOne = radar.count1 > 0;
    this.visible = true;
    this.header = radar.streetName;
    this.radar = radar;
    // document.getElementById('map-detail').scrollIntoView();
    // we need this because the action is called from leaflet.
    // and leaflet has a bug that it'doesn't trigger update circle after changes
    this.getMeasurementWeeks();
  }

  getMeasurementWeeks() {
    this.loading = true;
    let direction;
    (this.directionOne) ? direction = 1 : direction = 2;
    this.recordService.getMeasurementWeeks(this.radar.id, direction).subscribe(data => {
      this.measurements = data;
      this.selectMesaurement(this.measurements[0]);
      this.loading = false;
    });
  }

  selectMesaurement(measurement: MeasurementWeek) {
    this.currentDay = null;
    this.selectedMeasurement = measurement;
    this.getMeasurementsForWeek();
  }

  changeDirection() {
    this.currentDay = null;
    this.getMeasurementsForWeek();
  }

  getMeasurementsForWeek() {
    let direction;
    (this.directionOne) ? direction = 1 : direction = 2;
    this.recordService.getRecordsForWeeklyView(
      this.radar.id,
      direction,
      moment(this.selectedMeasurement.startDay).format('YYYY-MM-DD'),
      moment(this.selectedMeasurement.startDay).add(7, 'day').format('YYYY-MM-DD')
    ).subscribe(data => {
      this.currentWeek = data;
      this.ref.tick();
    });
  }

  openDailyView(weeklyRecord: WeeklyRecord) {
    this.dailyHeader = moment(weeklyRecord.date).format('dddd');
    this.dailyHeader += ' (' + moment(weeklyRecord.date).format('DD.MM.YYYY') + ')';
    let direction;
    (this.directionOne) ? direction = 1 : direction = 2;
    this.recordService.getRecordsForDailyView(
      this.radar.id,
      direction,
      moment(weeklyRecord.date).format('YYYY-MM-DD'),
      moment(weeklyRecord.date).add(1, 'day' ).format('YYYY-MM-DD')
    ).subscribe((data: DailyRecord[]) => {
      this.currentDay = data;
    });
  }

  perc2Color(perc: number): string {
    return this.colorService.perc2color(perc);
  }
}
