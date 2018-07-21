import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Record } from './record';
import * as moment from 'moment'
import {Radar} from "./radar";
import {WeeklyRecord} from "./weekly-record";
import {MeasurementWeek} from "./measurement-week";


@Injectable()
export class RecordService {

  api = environment.api + 'record/';

  constructor(
    private http: HttpClient
  ) { }

  getRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(this.api);
  }

  getRecord(id: number): Observable<Record> {
    return this.http.get<Record>(this.api + id);
  }

  getRecordOfRadar(radarId: number): Observable<Record[]> {
    return this.http.get<Record[]>(this.api + `recordsOfRadar?radarId=${radarId}`);
  }

  getMeasurementWeeks(radarId: number, direction: number): Observable<MeasurementWeek[]> {
    return this.http.get<MeasurementWeek[]>(this.api + `measurementWeeks?radarId=${radarId}&direction=${direction}`);
  }

  addRecords(records: Record[]): Observable<any> { //TODO why not possible to choose returntype Record[]?!
    return this.http.post<Record[]>(this.api + 'addRecords', records);
  }

  getRecordsForDetailView(radar: Radar): Observable<WeeklyRecord[]> {
    return this.http.get<WeeklyRecord[]>(this.api + `getRecordForDetailView?radarId=${radar.id}`);
  }

  updateRecord(record: any): Observable<Record> {
    return this.http.patch<Record>(this.api + record.id, record); //TODO add input "record" But what about non existing ID?!?!
  }

  deleteRecord(record: any): Observable<Record> {
    return this.http.delete<Record>(this.api + record.id);
  }
  parseRecord(input: string, radarId: number): Record {
    const arr = input.split('\t');
    if (arr.length === 5) {
      const timeStamp = this.extractTime(arr[2], arr[1]);
      const weekday = this.extractWeekday(timeStamp);
      return {
        timestamp: timeStamp,
        kmh: Number(arr[0]),
        length: Number(arr[4]) ,
        weekday: weekday,
        direction: Number(arr[3]),
        radar: radarId
      } as Record
    }
    return null;
  }
  private extractTime(day: string, time: string): any {
    const fullday = [day.slice(0, 6), '20', day.slice(6)].join('');
    return  moment(fullday + " " + time, 'DD.MM.YYYY HH:mm:ss');
  }
  private extractWeekday(timeStamp: any): string {
    const day = moment(timeStamp).isoWeekday();
    const weekdays = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'];
    return weekdays[day-1];
  }
}
